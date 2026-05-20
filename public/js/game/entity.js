class Entity {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.vx = 0;
    this.vy = 0;
    this.active = true;
  }

  update(dt) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  render(ctx) {}

  getBounds() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }

  collidesWith(other) {
    const a = this.getBounds();
    const b = other.getBounds();
    return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
  }
}
