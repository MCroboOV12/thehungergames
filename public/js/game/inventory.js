class Inventory {
  constructor(slotCount = 3) {
    this.slots = new Array(slotCount).fill(null);
    this.selected = 0;
    this.slotCount = slotCount;
  }

  select(index) {
    if (index >= 0 && index < this.slotCount) {
      this.selected = index;
    }
  }

  scroll(direction) {
    this.selected = (this.selected + direction + this.slotCount) % this.slotCount;
  }

  update(input) {
    if (input.justPressed('Digit1')) this.select(0);
    if (input.justPressed('Digit2')) this.select(1);
    if (input.justPressed('Digit3')) this.select(2);
    if (input.wheel !== 0) {
      this.scroll(input.wheel > 0 ? 1 : -1);
      input.wheel = 0;
    }
  }

  render(ctx, cw, ch) {
    const s = 56;
    const h = 72;
    const gap = 8;
    const total = this.slotCount * s + (this.slotCount - 1) * gap;
    const sx = (cw - total) / 2;
    const sy = ch - 96;

    for (let i = 0; i < this.slotCount; i++) {
      const x = sx + i * (s + gap);

      ctx.fillStyle = 'rgba(0,0,0,0.55)';
      ctx.fillRect(x, sy, s, h);

      ctx.strokeStyle = i === this.selected ? '#ffd700' : 'rgba(255,255,255,0.35)';
      ctx.lineWidth = i === this.selected ? 3 : 1.5;
      ctx.strokeRect(x, sy, s, h);

      const item = this.slots[i];
      if (item) {
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(x + s / 2, sy + 20, 14, 0, Math.PI * 2);
        ctx.fill();
        drawItemIcon(ctx, x + s / 2, sy + 20, 16, item.name, item.color);

        ctx.fillStyle = '#fff';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(item.name, x + s / 2, sy + 40);
      }
    }
  }
}
