// Schreibfläche für Stift, Finger oder Maus.
// Speichert die Striche als Punktlisten {x, y, t} in CSS-Pixeln.

export class WritingPad {
  constructor(canvas, { penOnly = 'auto', onChange } = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.penOnly = penOnly; // 'auto' | 'on' | 'off'
    this.onChange = onChange || (() => {});
    this.strokes = [];
    this.current = null;
    this.activePointer = null;
    this.lastPointerType = 'touch';
    this.guide = '';
    this.disabled = false;

    this._down = this._down.bind(this);
    this._move = this._move.bind(this);
    this._up = this._up.bind(this);
    canvas.addEventListener('pointerdown', this._down);
    canvas.addEventListener('pointermove', this._move);
    canvas.addEventListener('pointerup', this._up);
    canvas.addEventListener('pointercancel', this._up);
    canvas.addEventListener('pointerleave', this._up);
    // iOS: Scrollen/Lupe beim Schreiben verhindern
    canvas.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });

    this._ro = new ResizeObserver(() => this.resize());
    this._ro.observe(canvas);
    this.resize();
  }

  destroy() {
    this._ro.disconnect();
  }

  get width() { return this.canvas.clientWidth; }
  get height() { return this.canvas.clientHeight; }

  resize() {
    const dpr = window.devicePixelRatio || 1;
    const w = this.canvas.clientWidth;
    const h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.redraw();
  }

  // Wort, das hell zum Nachschreiben angezeigt wird ('' = keins)
  setGuide(text) {
    this.guide = text || '';
    this.redraw();
  }

  _accepts(e) {
    if (e.pointerType === 'pen') {
      PenState.seen = true;
      return true;
    }
    if (e.pointerType === 'touch') {
      if (this.penOnly === 'on') return false;
      // Handballen-Schutz: sobald einmal ein Stift benutzt wurde, Finger ignorieren
      if (this.penOnly === 'auto' && PenState.seen) return false;
    }
    return true;
  }

  _point(e) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, t: e.timeStamp };
  }

  _down(e) {
    if (this.disabled || this.activePointer !== null || !this._accepts(e)) return;
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    e.preventDefault();
    this.canvas.setPointerCapture?.(e.pointerId);
    this.activePointer = e.pointerId;
    this.lastPointerType = e.pointerType;
    this.current = [this._point(e)];
    this.strokes.push(this.current);
    this.redraw();
  }

  _move(e) {
    if (e.pointerId !== this.activePointer || !this.current) return;
    e.preventDefault();
    const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    for (const ev of events.length ? events : [e]) this.current.push(this._point(ev));
    this.redraw();
  }

  _up(e) {
    if (e.pointerId !== this.activePointer) return;
    this.activePointer = null;
    this.current = null;
    this.onChange();
  }

  undo() {
    this.strokes.pop();
    this.redraw();
    this.onChange();
  }

  clear() {
    this.strokes = [];
    this.current = null;
    this.activePointer = null;
    this.redraw();
    this.onChange();
  }

  isEmpty() {
    return this.strokes.length === 0;
  }

  redraw() {
    const { ctx } = this;
    const w = this.width;
    const h = this.height;
    const css = getComputedStyle(this.canvas);
    ctx.clearRect(0, 0, w, h);

    // Schreiblinien: Grundlinie und gestrichelte Mittellinie
    const base = h * 0.68;
    const mid = h * 0.42;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = css.getPropertyValue('--pad-line').trim() || '#c7d2fe';
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.moveTo(16, base);
    ctx.lineTo(w - 16, base);
    ctx.stroke();
    ctx.setLineDash([6, 8]);
    ctx.beginPath();
    ctx.moveTo(16, mid);
    ctx.lineTo(w - 16, mid);
    ctx.stroke();
    ctx.setLineDash([]);

    if (this.guide) {
      let size = h * 0.42;
      ctx.font = `${size}px "Comic Sans MS", "Segoe Print", "Chalkboard SE", system-ui, sans-serif`;
      const tw = ctx.measureText(this.guide).width;
      if (tw > w - 40) {
        size *= (w - 40) / tw;
        ctx.font = `${size}px "Comic Sans MS", "Segoe Print", "Chalkboard SE", system-ui, sans-serif`;
      }
      ctx.fillStyle = css.getPropertyValue('--pad-guide').trim() || 'rgba(79,70,229,.18)';
      ctx.textBaseline = 'alphabetic';
      ctx.fillText(this.guide, 20, base);
    }

    ctx.strokeStyle = css.getPropertyValue('--pad-ink').trim() || '#1e1b4b';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(3, h / 70);
    for (const s of this.strokes) {
      ctx.beginPath();
      ctx.moveTo(s[0].x, s[0].y);
      if (s.length === 1) ctx.lineTo(s[0].x + 0.1, s[0].y + 0.1);
      for (let i = 1; i < s.length; i++) ctx.lineTo(s[i].x, s[i].y);
      ctx.stroke();
    }
  }
}

// Merkt sich für die ganze Sitzung, ob ein Stift benutzt wurde.
export const PenState = { seen: false };
