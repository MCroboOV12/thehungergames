class Bot extends Entity {
  constructor(x, y) {
    super(x, y, 32, 48);
    this.color = '#8d6e63';
    this.hp = 100;
    this.maxHp = 100;
    this.hurtTimer = 0;
    this.speed = 120;
    this.detectionRange = 250;
    this.attackRange = 60;
    this.state = 'wander';
    this.stateTimer = 0;
    this.wanderTarget = null;
    this.attackCooldown = 0;
    this.inventory = [null, null, null];
    this.selectedSlot = 0;
    this.retreatThreshold = 0.3;
    this.alive = true;
    this.respawnTimer = 0;
  }

  takeDamage(amount, items) {
    this.hp = Math.max(0, this.hp - amount);
    this.hurtTimer = 0.15;
    if (this.hp <= 0) {
      this.alive = false;
      this.respawnTimer = 5;
      this.vx = 0;
      this.vy = 0;
      if (items) this._dropItems(items);
    }
  }

  _dropItems(items) {
    for (const slot of this.inventory) {
      if (slot) {
        items.push({
          x: this.x + this.width / 2 + (Math.random() - 0.5) * 30,
          y: this.y + this.height / 2 + (Math.random() - 0.5) * 30,
          name: slot.name,
          color: slot.color,
          collected: false,
        });
      }
    }
    this.inventory = [null, null, null];
  }

  respawn() {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 500 + 100;
    this.x = ARENA_CX + Math.cos(angle) * r - this.width / 2;
    this.y = ARENA_CY + Math.sin(angle) * r - this.height / 2;
    this.hp = this.maxHp;
    this.hurtTimer = 0;
    this.alive = true;
    this.state = 'wander';
    this.stateTimer = 0;
    this.wanderTarget = null;
    this.attackCooldown = 0;
    this.inventory = [null, null, null];
  }

  update(dt, player, items, projectiles) {
    if (!this.alive) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) this.respawn();
      return;
    }

    if (this.hurtTimer > 0) this.hurtTimer -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    const bx = this.x + this.width / 2;
    const by = this.y + this.height / 2;
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;
    const dist = Math.sqrt((px - bx) ** 2 + (py - by) ** 2);

    this._decide(dt, player, items, projectiles, dist, bx, by, px, py);
    super.update(dt);
  }

  _decide(dt, player, items, projectiles, dist, bx, by, px, py) {
    if (this.hp / this.maxHp < this.retreatThreshold) {
      this.state = 'retreat';
    } else if (dist < this.detectionRange) {
      if (dist < this.attackRange && this._hasWeapon()) {
        this.state = 'attack';
      } else {
        this.state = 'chase';
      }
    } else {
      const nearbyItem = this._findNearestItem(items, bx, by);
      if (nearbyItem && this._hasEmptySlot()) {
        this.state = 'pickup';
        this.pickupTarget = nearbyItem;
      } else {
        this.state = 'wander';
      }
    }

    this._executeState(dt, player, items, projectiles, dist, bx, by, px, py);
  }

  _executeState(dt, player, items, projectiles, dist, bx, by, px, py) {
    switch (this.state) {
      case 'wander':
        this._doWander(dt);
        break;
      case 'chase':
        this._doChase(px, py);
        break;
      case 'attack':
        this._doAttack(player, projectiles, dist, px, py, bx, by);
        break;
      case 'retreat':
        this._doRetreat(px, py, bx, by);
        break;
      case 'pickup':
        this._doPickup(items, bx, by);
        break;
    }
  }

  _doWander(dt) {
    this.stateTimer -= dt;
    if (this.stateTimer <= 0 || !this.wanderTarget) {
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * 200;
      this.wanderTarget = { x: ARENA_CX + Math.cos(angle) * r, y: ARENA_CY + Math.sin(angle) * r };
      this.stateTimer = 2 + Math.random() * 3;
    }
    this._moveToward(this.wanderTarget.x, this.wanderTarget.y);
  }

  _doChase(px, py) {
    this._moveToward(px, py);
  }

  _doAttack(player, projectiles, dist, px, py, bx, by) {
    if (this.attackCooldown > 0) return;
    const item = this.inventory[this.selectedSlot];
    if (!item) { this.state = 'chase'; return; }

    if (item.name === 'Heal' && this.hp < this.maxHp) {
      this.hp = this.maxHp;
      this.inventory[this.selectedSlot] = null;
      this.attackCooldown = 0.5;
      this._equipBest();
      return;
    }

    if (item.name === 'Sword' || item.name === 'Axe') {
      if (dist > this.attackRange) { this.state = 'chase'; return; }
      const dmg = item.name === 'Sword' ? 30 : 50;
      this.attackCooldown = item.name === 'Sword' ? 0.4 : 0.7;
      player.hp = Math.max(0, player.hp - dmg);
    }

    if (item.name === 'Knife') {
      if (dist > this.attackRange) {
        this._shootProjectile(projectiles, px, py, bx, by, 'Knife', 400, 250, 50);
        this.inventory[this.selectedSlot] = null;
        this.attackCooldown = 0.5;
      } else {
        this.attackCooldown = 0.3;
        player.hp = Math.max(0, player.hp - 15);
      }
    }

    if (item.name === 'Bow') {
      const charge = 0.5 + Math.random() * 1.5;
      const t = charge / 2;
      const speed = 300 + t * 300;
      const range = 200 + t * 300;
      const dmg = Math.round(10 + t * 50);
      this._shootProjectile(projectiles, px, py, bx, by, 'Arrow', speed, range, dmg);
      this.attackCooldown = 1 + Math.random();
    }

    this._equipBest();
  }

  _shootProjectile(projectiles, px, py, bx, by, icon, speed, maxRange, damage) {
    const angle = Math.atan2(py - by, px - bx);
    projectiles.push({
      x: bx, y: by,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      dist: 0, maxRange,
      damage, icon, color: icon === 'Arrow' ? '#8bc34a' : '#ef5350', owner: 'bot',
    });
  }

  _doRetreat(px, py, bx, by) {
    const dx = bx - ARENA_CX;
    const dy = by - ARENA_CY;
    const distToCenter = Math.sqrt(dx * dx + dy * dy);
    const borderDist = ARENA_RADIUS - 60 - distToCenter;

    let tx, ty;
    if (borderDist < 50) {
      const angle = Math.atan2(dy, dx) + (Math.random() > 0.5 ? 1 : -1) * Math.PI / 2;
      tx = bx + Math.cos(angle) * 100;
      ty = by + Math.sin(angle) * 100;
    } else {
      tx = this.x - (px - this.x);
      ty = this.y - (py - this.y);
    }

    this._moveToward(tx, ty);

    const healSlot = this.inventory.findIndex(i => i && i.name === 'Heal');
    if (healSlot !== -1) {
      this.hp = this.maxHp;
      this.inventory[healSlot] = null;
      this._equipBest();
    }

    if (this.hp / this.maxHp > 0.5) {
      this.state = 'wander';
    }
  }

  _doPickup(items, bx, by) {
    if (!this.pickupTarget || this.pickupTarget.collected) {
      this.state = 'wander';
      return;
    }
    const dx = this.pickupTarget.x - bx;
    const dy = this.pickupTarget.y - by;
    if (dx * dx + dy * dy < 25 * 25) {
      const empty = this.inventory.findIndex(i => i === null);
      if (empty !== -1) {
        this.inventory[empty] = { name: this.pickupTarget.name, color: this.pickupTarget.color };
        this.pickupTarget.collected = true;
        this._equipBest();
      }
      this.state = 'wander';
    } else {
      this._moveToward(this.pickupTarget.x, this.pickupTarget.y);
    }
  }

  _moveToward(tx, ty) {
    const bx = this.x + this.width / 2;
    const by = this.y + this.height / 2;
    const dx = tx - bx;
    const dy = ty - by;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 5) { this.vx = 0; this.vy = 0; return; }
    this.vx = (dx / dist) * this.speed;
    this.vy = (dy / dist) * this.speed;
  }

  _findNearestItem(items, bx, by) {
    let best = null;
    let bestDist = Infinity;
    for (const item of items) {
      if (item.collected) continue;
      const dx = item.x - bx;
      const dy = item.y - by;
      const d = dx * dx + dy * dy;
      if (d < bestDist) {
        bestDist = d;
        best = item;
      }
    }
    return best;
  }

  _hasWeapon() {
    return this.inventory.some(i => i && ['Sword', 'Axe', 'Knife', 'Bow'].includes(i.name));
  }

  _hasEmptySlot() {
    return this.inventory.includes(null);
  }

  _equipBest() {
    const order = ['Sword', 'Axe', 'Knife', 'Bow', 'Heal'];
    for (const name of order) {
      const idx = this.inventory.findIndex(i => i && i.name === name);
      if (idx !== -1) {
        this.selectedSlot = idx;
        return;
      }
    }
    this.selectedSlot = 0;
  }

  render(ctx) {
    if (!this.alive) return;

    const cx = this.x + this.width / 2;
    const cy = this.y + this.height / 2;

    const heldItem = this.inventory[this.selectedSlot];
    if (heldItem) {
      drawItemIcon(ctx, cx + 20, cy - 10, 18, heldItem.name, heldItem.color);
    }

    const armLen = 22;
    const armAngle = 0.3;

    const lArmEndX = cx - 16 - Math.cos(armAngle) * armLen;
    const lArmEndY = cy - 4 + Math.sin(armAngle) * armLen;

    ctx.strokeStyle = '#6d4c41';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx - 16, cy - 4);
    ctx.lineTo(lArmEndX, lArmEndY);
    ctx.stroke();

    const rArmEndX = cx + 16 + Math.cos(armAngle) * armLen;
    const rArmEndY = cy - 4 + Math.sin(armAngle) * armLen;
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
