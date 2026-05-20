class Bot extends Entity {
  constructor(x, y) {
    super(x, y, 32, 48);
    this.color = '#8d6e63';
    this.hp = 100;
    this.maxHp = 100;
    this.hurtTimer = 0;
  }

  takeDamage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    this.hurtTimer = 0.15;
  }

  update(dt) {
    if (this.hurtTimer > 0) this.hurtTimer -= dt;
  }

  render(ctx) {
    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    const armLen = 22;
    const armAngle = 0.3;

    const lArmEndX = cx - 16 - Math.cos(armAngle) * armLen;
    const lArmEndY = cy - 4 + Math.sin(armAngle) * armLen;
    const rArmEndX = cx + 16 + Math.cos(armAngle) * armLen;
    const rArmEndY = cy - 4 + Math.sin(armAngle) * armLen;

    ctx.strokeStyle = '#6d4c41';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - 4);
    ctx.lineTo(lArmEndX, lArmEndY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 16, cy - 4);
    ctx.lineTo(rArmEndX, rArmEndY);
    ctx.stroke();

    const bodyColor = this.hurtTimer > 0 ? '#fff' : this.color;
    ctx.fillStyle = bodyColor;
    ctx.fillRect(this.x, this.y, this.width, this.height);

    const eyeY = this.y + 14;
    const eyeSpacing = 10;

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing, eyeY, 5, 0, Math.PI * 2);
    ctx.fill();

    const pupilColor = this.hurtTimer > 0 ? '#e94560' : '#222';
    ctx.fillStyle = pupilColor;
    ctx.beginPath();
    ctx.arc(cx - eyeSpacing - 1, eyeY + 1, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + eyeSpacing - 1, eyeY + 1, 2.5, 0, Math.PI * 2);
    ctx.fill();

    const barW = 36;
    const barH = 5;
    const barX = cx - barW / 2;
    const barY = this.y - 12;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = this.hp / this.maxHp > 0.3 ? '#4caf50' : '#ef5350';
    ctx.fillRect(barX, barY, barW * (this.hp / this.maxHp), barH);
  }
}
