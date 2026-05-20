class Player extends Entity {
  constructor(x, y) {
    super(x, y, 32, 48);
    this.speed = 200;
    this.color = '#e94560';
    this.time = 0;
    this.currentSwing = 0;
    this.hp = 100;
    this.maxHp = 100;
  }

  update(dt, input) {
    this.time += dt;
    this.vx = 0;
    this.vy = 0;
    if (input.isDown('ArrowLeft') || input.isDown('KeyA')) this.vx = -this.speed;
    if (input.isDown('ArrowRight') || input.isDown('KeyD')) this.vx = this.speed;
    if (input.isDown('ArrowUp') || input.isDown('KeyW')) this.vy = -this.speed;
    if (input.isDown('ArrowDown') || input.isDown('KeyS')) this.vy = this.speed;
    super.update(dt);

    const moving = this.vx !== 0 || this.vy !== 0;
    const target = moving ? 0.35 : 0;
    this.currentSwing += (target - this.currentSwing) * Math.min(1, 8 * dt);
  }

  getRightHandPos() {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;
    const armAngle = 0.5 + Math.sin(this.time * 6) * this.currentSwing;
    return {
      x: cx + 16 + Math.cos(armAngle) * 26,
      y: cy - 6 + Math.sin(armAngle) * 26,
    };
  }

  render(ctx) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    const armLen = 26;
    const armAngle = 0.5 + Math.sin(this.time * 6) * this.currentSwing;

    const lArmEndX = cx - 16 - Math.cos(armAngle) * armLen;
    const lArmEndY = cy - 6 + Math.sin(armAngle) * armLen;
    const rArmEndX = cx + 16 + Math.cos(armAngle) * armLen;
    const rArmEndY = cy - 6 + Math.sin(armAngle) * armLen;

    ctx.strokeStyle = '#c42e47';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - 6);
    ctx.lineTo(lArmEndX, lArmEndY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 16, cy - 6);
    ctx.lineTo(rArmEndX, rArmEndY);
    ctx.stroke();

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    const eyeY = this.y + 14;
    const eyeSpacing = 10;
    const eyeR = 6;

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#222';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing + 1, eyeY + 1, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing + 1, eyeY + 1, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b02a3e';
    ctx.beginPath();
    ctx.arc(lArmEndX, lArmEndY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rArmEndX, rArmEndY, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}
