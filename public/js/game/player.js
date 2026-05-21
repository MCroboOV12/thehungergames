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

    const armLen = 24;
    const armAngle = 0.5 + Math.sin(this.time * 6) * this.currentSwing;

    const lArmEndX = cx - 14 - Math.cos(armAngle) * armLen;
    const lArmEndY = cy + 2 + Math.sin(armAngle) * armLen;
    const rArmEndX = cx + 14 + Math.cos(armAngle) * armLen;
    const rArmEndY = cy + 2 + Math.sin(armAngle) * armLen;

    const skin = '#d4a574';
    const hairColor = '#5d4037';

    ctx.strokeStyle = skin;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';

    ctx.beginPath();
    ctx.moveTo(cx - 14, cy + 2);
    ctx.lineTo(lArmEndX, lArmEndY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cx + 14, cy + 2);
    ctx.lineTo(rArmEndX, rArmEndY);
    ctx.stroke();

    const headR = 9;
    const headY = this.y + 11;
    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(cx, headY, headR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = hairColor;
    ctx.beginPath();
    ctx.arc(cx, headY - 2, headR, Math.PI * 1.15, Math.PI * 1.85);
    ctx.fill();
    ctx.fillRect(cx - headR, headY - headR, headR * 2, headR * 0.3);
    ctx.beginPath();
    ctx.arc(cx - headR * 0.4, headY - headR + 2, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + headR * 0.4, headY - headR + 2, 3, 0, Math.PI * 2);
    ctx.fill();

    const bodyX = this.x + 4;
    const bodyW = this.width - 8;
    const bodyTop = headY + headR;
    const bodyBot = this.y + this.height - 4;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(bodyX + bodyW * 0.2, bodyTop);
    ctx.lineTo(bodyX, bodyBot);
    ctx.lineTo(bodyX + bodyW, bodyBot);
    ctx.lineTo(bodyX + bodyW * 0.8, bodyTop);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    const eyeY = headY - 1;
    const eyeSpacing = 5;
    const eyeR = 4;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#3e2723';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing + 1, eyeY + 1, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing + 1, eyeY + 1, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = skin;
    ctx.beginPath();
    ctx.arc(lArmEndX, lArmEndY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(rArmEndX, rArmEndY, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
}
