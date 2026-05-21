const canvas = document.getElementById('gameCanvas');
const engine = new GameEngine(canvas);
const input = new Input();

const ARENA_CX = 1000;
const ARENA_CY = 1000;
const ARENA_RADIUS = 2000;
const CULL_MARGIN = 100;
const GROUND_COLOR = '#5a8f4a';
const BORDER_COLOR = '#4a7c3f';
const GRASS_COLOR = '#6a9a5a';
const GRASS_HIGHLIGHT = '#7aaa6a';
const INNER_RING_COLOR = '#4a7c3f';
const BOT_COUNT = 8;
const PEDESTAL_RADIUS = 200;
const COUNTDOWN_DURATION = 5;
const STORM_DURATION = 300;
const STORM_END_RADIUS = 100;

const BOT_COLORS = ['#e53935', '#43a047', '#1e88e5', '#fb8c00', '#8e24aa', '#00acc1', '#f4511e', '#3949ab'];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function randomInArena() {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.sqrt(Math.random()) * (ARENA_RADIUS - 40);
  return { x: ARENA_CX + Math.cos(angle) * r, y: ARENA_CY + Math.sin(angle) * r };
}

function randomOutsideArena() {
  const angle = Math.random() * Math.PI * 2;
  const r = ARENA_RADIUS + 60 + Math.random() * 2000;
  return { x: ARENA_CX + Math.cos(angle) * r, y: ARENA_CY + Math.sin(angle) * r };
}

function randomNearCenter() {
  const angle = Math.random() * Math.PI * 2;
  const r = Math.pow(Math.random(), 1.5) * (ARENA_RADIUS - 80);
  return { x: ARENA_CX + Math.cos(angle) * r, y: ARENA_CY + Math.sin(angle) * r };
}

function randomPedestalPos(index, total) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: ARENA_CX + Math.cos(angle) * PEDESTAL_RADIUS - 16,
    y: ARENA_CY + Math.sin(angle) * PEDESTAL_RADIUS - 24,
  };
}

const ITEM_TYPES = [
  { name: 'Sword', color: '#ccc' },
  { name: 'Axe', color: '#a1887f' },
  { name: 'Bow', color: '#8bc34a' },
  { name: 'Heal', color: '#4fc3f7' },
  { name: 'Knife', color: '#ef5350' },
];

function drawItemIcon(ctx, x, y, s, name, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (name) {
    case 'Sword': {
      const hw = s * 0.12;
      const bl = s * 0.65;
      ctx.strokeStyle = '#ddd';
      ctx.fillStyle = '#bbb';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-hw, -bl);
      ctx.lineTo(0, -bl - s * 0.1);
      ctx.lineTo(hw, -bl);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#999';
      ctx.fillRect(-hw * 0.5, -bl - s * 0.1, hw, s * 0.1);
      ctx.fillStyle = color;
      ctx.fillRect(-s * 0.3, -bl + s * 0.05, s * 0.6, s * 0.1);
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-s * 0.15, -bl + s * 0.15, s * 0.3, s * 0.5);
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(-s * 0.15, -bl + s * 0.15, s * 0.3, s * 0.5);
      break;
    }
    case 'Axe': {
      ctx.fillStyle = '#8d6e63';
      ctx.fillRect(-s * 0.08, -s * 0.2, s * 0.16, s * 0.7);
      ctx.strokeStyle = '#6d4c41';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(-s * 0.08, -s * 0.2, s * 0.16, s * 0.7);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-s * 0.55, -s * 0.05);
      ctx.lineTo(0, -s * 0.6);
      ctx.lineTo(s * 0.55, -s * 0.05);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#888';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.fillStyle = '#aaa';
      ctx.beginPath();
      ctx.moveTo(-s * 0.35, -s * 0.1);
      ctx.lineTo(0, -s * 0.45);
      ctx.lineTo(s * 0.35, -s * 0.1);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'Bow': {
      ctx.strokeStyle = '#8d6e63';
      ctx.lineWidth = s * 0.13;
      ctx.beginPath();
      ctx.arc(0, s * 0.1, s * 0.55, -Math.PI * 0.55, Math.PI * 0.55);
      ctx.stroke();
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.55 + s * 0.1);
      ctx.lineTo(0, s * 0.55 + s * 0.1);
      ctx.stroke();
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-s * 0.05, -s * 0.55, s * 0.1, s * 0.08);
      ctx.fillRect(-s * 0.05, s * 0.55 - s * 0.1, s * 0.1, s * 0.08);
      break;
    }
    case 'Heal': {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.fillStyle = color;
      const bw = s * 0.15;
      const bh = s * 0.5;
      ctx.fillRect(-bw, -bh, bw * 2, bh * 2);
      ctx.fillRect(-bh, -bw, bh * 2, bw * 2);
      break;
    }
    case 'Knife': {
      ctx.fillStyle = '#ddd';
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.55);
      ctx.lineTo(-s * 0.35, s * 0.15);
      ctx.lineTo(s * 0.35, s * 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.fillRect(-s * 0.3, s * 0.15, s * 0.6, s * 0.1);
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(-s * 0.2, s * 0.25, s * 0.4, s * 0.3);
      ctx.strokeStyle = '#555';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(-s * 0.2, s * 0.25, s * 0.4, s * 0.3);
      break;
    }
    case 'Arrow': {
      ctx.fillStyle = '#ddd';
      ctx.beginPath();
      ctx.moveTo(-s * 0.25, -s * 0.3);
      ctx.lineTo(0, -s * 0.55);
      ctx.lineTo(s * 0.25, -s * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.strokeStyle = '#8d6e63';
      ctx.lineWidth = s * 0.1;
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.25);
      ctx.lineTo(0, s * 0.5);
      ctx.stroke();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-s * 0.25, s * 0.4);
      ctx.lineTo(0, s * 0.55);
      ctx.lineTo(s * 0.25, s * 0.4);
      ctx.closePath();
      ctx.fill();
      break;
    }
  }

  ctx.restore();
}

const gameScene = new (class extends Scene {
  startMultiplayer(client, spawnIndex) {
    this.multiplayerMode = true;
    this.multiplayerClient = client;
    this.multiplayerSpawnIndex = spawnIndex !== undefined ? spawnIndex : 0;
    this.remotePlayers = {};
    client.on('player_update', (msg) => {
      if (msg.id === client.playerId) return;
      this.remotePlayers[msg.id] = msg;
    });
    client.on('take_damage', (msg) => {
      this.player.hp = Math.max(0, this.player.hp - msg.amount);
      this.hurtTimer = 0.15;
      this._sendPlayerUpdate();
    });
    client.on('player_left', (msg) => {
      delete this.remotePlayers[msg.playerId];
    });
    client.on('close', () => {
      this._disconnected = true;
    });
  }

  enter() {
    this.phase = 'countdown';
    this.time = 0;
    this.countdownTimer = COUNTDOWN_DURATION;
    this.stormRadius = ARENA_RADIUS;
    this.camera = new Camera(canvas.width, canvas.height);
    this.remotePlayers = this.remotePlayers || {};
    this._lastPlayerUpdate = 0;
    this.hurtTimer = 0;
    this._disconnected = false;
    this.multiplayerMode = !!this.multiplayerMode;

    const totalSpawns = BOT_COUNT + 1;
    const spawnIdx = this.multiplayerMode ? this.multiplayerSpawnIndex : 0;
    const pPos = randomPedestalPos(spawnIdx, totalSpawns);
    this.player = new Player(pPos.x, pPos.y);
    this.camera.x = ARENA_CX - canvas.width / 2;
    this.camera.y = ARENA_CY - canvas.height / 2;

    this.bots = [];
    if (!this.multiplayerMode) {
      for (let i = 0; i < BOT_COUNT; i++) {
        const pos = randomPedestalPos(i + 1, BOT_COUNT + 1);
        const bot = new Bot(pos.x, pos.y, i);
        this.bots.push(bot);
      }
    }

    this.grassTufts = [];
    this.bushes = [];

    for (let i = 0; i < 2500; i++) {
      const pos = randomInArena();
      const bladeCount = 3 + Math.floor(Math.random() * 3);
      const blades = [];
      for (let j = 0; j < bladeCount; j++) {
        blades.push({
          ox: (Math.random() - 0.5) * 12,
          height: 10 + Math.random() * 12,
          thickness: 1.5 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
        });
      }
      this.grassTufts.push({ x: pos.x, y: pos.y, blades, phase: Math.random() * Math.PI * 2 });
    }

    for (let i = 0; i < 200; i++) {
      const pos = randomInArena();
      this.bushes.push(pos);
    }

    this.stars = [];
    for (let i = 0; i < 600; i++) {
      const pos = randomOutsideArena();
      this.stars.push({ x: pos.x, y: pos.y, size: 0.5 + Math.random() * 2, phase: Math.random() * Math.PI * 2 });
    }

    this.darkPatches = [];
    for (let i = 0; i < 80; i++) {
      const pos = randomOutsideArena();
      this.darkPatches.push({ x: pos.x, y: pos.y, rx: 8 + Math.random() * 30, ry: 6 + Math.random() * 20, alpha: 0.08 + Math.random() * 0.12 });
    }

    this.inventory = new Inventory(3);
    this.attackCooldown = 0;
    this.slashEffect = null;
    this.projectiles = [];
    this.bowCharging = false;
    this.bowChargeStart = 0;
    this._prevSelectedSlot = 0;
    this._prevRightClicked = false;
    this.playerAlive = true;
    this._nearbyItem = null;

    this.items = [];
    for (let i = 0; i < 60; i++) {
      const pos = randomInArena();
      this.items.push({
        x: pos.x, y: pos.y,
        ...ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)],
        collected: false,
      });
    }
    for (let i = 0; i < 30; i++) {
      const pos = randomNearCenter();
      this.items.push({
        x: pos.x, y: pos.y,
        ...ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)],
        collected: false,
      });
    }

    this.rocks = [];
    for (let i = 0; i < 20; i++) {
      const pos = randomInArena();
      const radius = 20 + Math.random() * 30;
      this.rocks.push({ x: pos.x, y: pos.y, radius });
    }

    this.killFeed = [];
    this.killFeedTimer = 0;
    this.supplyDrops = [];
    this.supplyDropTimer = 25 + Math.random() * 20;
    this.gameEnded = false;
    this.victory = false;
    this.victoryTriggered = false;
    this._prevAttackAnim = false;
    this.playerHurtTimer = 0;

    this._buildBackgroundCache();
  }

  _buildBackgroundCache() {
    const size = ARENA_RADIUS * 2 + 40;
    this.bgCanvas = document.createElement('canvas');
    this.bgCanvas.width = size;
    this.bgCanvas.height = size;
    const bgCtx = this.bgCanvas.getContext('2d');
    const ox = ARENA_CX - ARENA_RADIUS - 20;
    const oy = ARENA_CY - ARENA_RADIUS - 20;

    bgCtx.beginPath();
    bgCtx.arc(ARENA_CX - ox, ARENA_CY - oy, ARENA_RADIUS, 0, Math.PI * 2);
    bgCtx.fillStyle = GROUND_COLOR;
    bgCtx.fill();

    bgCtx.strokeStyle = BORDER_COLOR;
    bgCtx.lineWidth = 8;
    bgCtx.stroke();

    bgCtx.beginPath();
    bgCtx.arc(ARENA_CX - ox, ARENA_CY - oy, ARENA_RADIUS - 20, 0, Math.PI * 2);
    bgCtx.strokeStyle = INNER_RING_COLOR;
    bgCtx.lineWidth = 2;
    bgCtx.stroke();

    this.bgOffsetX = ox;
    this.bgOffsetY = oy;
  }

  _isVisible(x, y, margin) {
    const m = margin || CULL_MARGIN;
    return x + m > this.camera.x && x - m < this.camera.x + canvas.width &&
           y + m > this.camera.y && y - m < this.camera.y + canvas.height;
  }

  update(dt) {
    this.time += dt;

    if (this.gameEnded) {
      input.clearFrame();
      return;
    }

    if (this.phase === 'countdown') {
      this._updateCountdown(dt);
    } else if (this.phase === 'playing') {
      this._updatePlaying(dt);
    }

    if (this.multiplayerMode && this.multiplayerClient && this.phase === 'playing') {
      this._lastPlayerUpdate += dt;
      if (this._lastPlayerUpdate > 0.05) {
        this._lastPlayerUpdate = 0;
        this._sendPlayerUpdate();
      }
      this._prevAttackAnim = false;
    }

    if (this.killFeed.length > 0) {
      this.killFeedTimer += dt;
      if (this.killFeedTimer > 5) {
        this.killFeed.shift();
        this.killFeedTimer = 0;
      }
    }

    if (this.hurtTimer > 0) this.hurtTimer -= dt;

    input.clearFrame();
  }

  _sendPlayerUpdate() {
    if (!this.multiplayerClient) return;
    const item = this.inventory.slots[this.inventory.selected];
    this.multiplayerClient.send({
      type: 'player_update',
      x: this.player.x,
      y: this.player.y,
      hp: this.player.hp,
      maxHp: this.player.maxHp,
      alive: this.playerAlive,
      selectedItem: item ? item.name : null,
      attackAnim: this._prevAttackAnim || false,
    });
  }

  _updateCountdown(dt) {
    this.countdownTimer -= dt;
    this.camera.x = ARENA_CX - canvas.width / 2;
    this.camera.y = ARENA_CY - canvas.height / 2;
    if (this.countdownTimer <= 0) {
      this.phase = 'playing';
      this.countdownTimer = 0;
    }
  }

  _updatePlaying(dt) {
    const stormProgress = Math.min(this.time / STORM_DURATION, 1);
    this.stormRadius = Math.max(ARENA_RADIUS + (STORM_END_RADIUS - ARENA_RADIUS) * stormProgress, STORM_END_RADIUS);

    for (const bot of this.bots) {
      bot.stormRadius = this.stormRadius;
    }

    if (this.playerAlive) {
      this.player.update(dt, input);
      this._constrainPlayer();
      if (!this.playerAlive) return;
      this._checkStormDamage(dt);
      this.camera.follow(this.player, canvas.width, canvas.height);
      this.inventory.update(input);
      this._checkPickup(input);
      this._checkDrop(input);
      this._checkAttack(input);
      this._checkSelfDamage(input);

      if (this.bowCharging) {
        this._aimX = input.mouse.x + this.camera.x;
        this._aimY = input.mouse.y + this.camera.y;
        const item = this.inventory.slots[this.inventory.selected];
        if (!item || item.name !== 'Bow') {
          this.bowCharging = false;
        } else if (this._prevRightClicked && !input.mouse.rightClicked) {
          this._fireArrow();
        }
      }
    }

    this._prevRightClicked = input.mouse.rightClicked;
    this._prevSelectedSlot = this.inventory.selected;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.slashEffect) {
      this.slashEffect.timer -= dt;
      if (this.slashEffect.timer <= 0) this.slashEffect = null;
    }

    for (const bot of this.bots) {
      if (!bot.alive) continue;
      bot.update(dt, this.player, this.items, this.projectiles, this.bots);
    }

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.dist += Math.sqrt(p.vx * p.vx + p.vy * p.vy) * dt;

      let hitRock = false;
      for (const rock of this.rocks) {
        const rdx = rock.x - p.x;
        const rdy = rock.y - p.y;
        if (rdx * rdx + rdy * rdy < rock.radius * rock.radius) {
          hitRock = true;
          break;
        }
      }
      if (hitRock) { this.projectiles.splice(i, 1); continue; }

      if (p.owner === 'player') {
        for (const bot of this.bots) {
          if (!bot.alive) continue;
          const bx = bot.x + bot.width / 2;
          const by = bot.y + bot.height / 2;
          const pdx = bx - p.x;
          const pdy = by - p.y;
          if (pdx * pdx + pdy * pdy < 20 * 20) {
            bot.takeDamage(p.damage, 'player');
            this.projectiles.splice(i, 1);
            break;
          }
        }
        if (this.projectiles[i] && this.multiplayerMode) {
          for (const id in this.remotePlayers) {
            const rp = this.remotePlayers[id];
            if (!rp.alive) continue;
            const rdx = rp.x + 16 - p.x;
            const rdy = rp.y + 24 - p.y;
            if (rdx * rdx + rdy * rdy < 20 * 20) {
              this.multiplayerClient.send({ type: 'apply_damage', targetId: Number(id), amount: p.damage });
              this.projectiles.splice(i, 1);
              break;
            }
          }
        }
        continue;
      } else if (p.owner === 'bot') {
        const px = this.player.x + this.player.width / 2;
        const py = this.player.y + this.player.height / 2;
        const pdx = px - p.x;
        const pdy = py - p.y;
        if (pdx * pdx + pdy * pdy < 20 * 20) {
          this.player.hp = Math.max(0, this.player.hp - p.damage);
          this.projectiles.splice(i, 1);
          continue;
        }
        for (const bot of this.bots) {
          if (!bot.alive || bot.index === p.ownerIndex) continue;
          const bx = bot.x + bot.width / 2;
          const by = bot.y + bot.height / 2;
          const pdx = bx - p.x;
          const pdy = by - p.y;
          if (pdx * pdx + pdy * pdy < 20 * 20) {
            bot.takeDamage(p.damage, p.ownerIndex);
            this.projectiles.splice(i, 1);
            break;
          }
        }
        continue;
      }

      if (p.dist >= p.maxRange) {
        this.projectiles.splice(i, 1);
      }
    }

    if (this.player.hp <= 0 && this.playerAlive) {
      this.playerAlive = false;
      this.playerDeathTime = this.time;
      if (this.multiplayerMode) {
        let remoteAlive = 0;
        for (const id in this.remotePlayers) if (this.remotePlayers[id].alive) remoteAlive++;
        if (remoteAlive === 0) {
          this._endGame(true);
        } else {
          this._addKillFeed('You were eliminated');
        }
      } else {
        const aliveBots = this.bots.filter(b => b.alive).length;
        if (aliveBots === 0) {
          this._endGame(true);
        } else {
          this._addKillFeed('You were eliminated');
        }
      }
    }

    if (!this.playerAlive && !this.gameEnded && this.time - this.playerDeathTime > 2) {
      this._endGame(false);
    }

    for (const bot of this.bots) {
      if (bot.hp <= 0 && bot.alive) {
        bot.alive = false;
        bot.vx = 0;
        bot.vy = 0;
        bot._dropItems(this.items);
        let msg;
        if (bot.lastDamagedBy === 'player') {
          msg = `You eliminated Tributo ${bot.index + 1}`;
        } else if (bot.lastDamagedBy === 'storm') {
          msg = `Tributo ${bot.index + 1} was killed by the storm`;
        } else if (typeof bot.lastDamagedBy === 'number' && this.bots[bot.lastDamagedBy]) {
          msg = `Tributo ${this.bots[bot.lastDamagedBy].index + 1} eliminated Tributo ${bot.index + 1}`;
        } else {
          msg = `Tributo ${bot.index + 1} was eliminated`;
        }
        this._addKillFeed(msg);
      }
    }

    if (this.playerAlive && !this.gameEnded) {
      let aliveCount;
      if (this.multiplayerMode) {
        let remoteAlive = 0;
        for (const id in this.remotePlayers) {
          if (this.remotePlayers[id].alive) remoteAlive++;
        }
        aliveCount = remoteAlive;
      } else {
        aliveCount = this.bots.filter(b => b.alive).length;
      }
      if (aliveCount === 0) {
        if (!this.victoryTriggered) {
          this.victoryTriggered = true;
          this.victoryTime = this.time;
        }
        if (this.time - this.victoryTime > 1) {
          this._endGame(true);
        }
      }
    }

    this._updateSupplyDrops(dt);
  }

  _addKillFeed(msg) {
    this.killFeed.push(msg);
    if (this.killFeed.length > 5) this.killFeed.shift();
    this.killFeedTimer = 0;
  }

  _endGame(victory) {
    this.gameEnded = true;
    this.victory = victory;
    this.player.vx = 0;
    this.player.vy = 0;
    if (this.multiplayerClient) {
      this.multiplayerClient.send({
        type: 'player_update',
        x: this.player.x,
        y: this.player.y,
        hp: 0,
        maxHp: this.player.maxHp,
        alive: false,
        selectedItem: null,
      });
    }
    engine.stop();
    document.getElementById('endgame-overlay').classList.add('active');
    const title = document.getElementById('endgame-title');
    title.textContent = victory ? 'VICTORY!' : 'GAME OVER';
  }

  _checkStormDamage(dt) {
    const px = this.player.x + this.player.width / 2;
    const py = this.player.y + this.player.height / 2;
    const dx = px - ARENA_CX;
    const dy = py - ARENA_CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > this.stormRadius && this.playerAlive) {
      this.player.hp = Math.max(0, this.player.hp - 10 * dt);
    }
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      const bx = bot.x + bot.width / 2;
      const by = bot.y + bot.height / 2;
      const bdx = bx - ARENA_CX;
      const bdy = by - ARENA_CY;
      const bDist = Math.sqrt(bdx * bdx + bdy * bdy);
      if (bDist > this.stormRadius) {
        bot.takeDamage(10 * dt, 'storm');
      }
    }
  }

  _updateSupplyDrops(dt) {
    this.supplyDropTimer -= dt;
    if (this.supplyDropTimer <= 0) {
      this.supplyDropTimer = 25 + Math.random() * 20;
      const pos = randomInArena();
      const type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
      this.supplyDrops.push({
        x: pos.x, y: pos.y,
        vy: -120,
        name: type.name,
        color: type.color,
        collected: false,
        landing: false,
      });
    }

    for (let i = this.supplyDrops.length - 1; i >= 0; i--) {
      const drop = this.supplyDrops[i];
      if (drop.collected) {
        this.supplyDrops.splice(i, 1);
        continue;
      }
      if (drop.vy < 0) {
        drop.vy += 200 * dt;
        drop.y += drop.vy * dt;
        if (drop.vy >= 0) {
          drop.vy = 0;
          drop.landing = true;
          this.items.push({
            x: drop.x, y: drop.y,
            name: drop.name, color: drop.color,
            collected: false,
          });
        }
      }
    }
  }

  _checkPickup(input) {
    const px = this.player.x + this.player.width / 2;
    const py = this.player.y + this.player.height / 2;
    this._nearbyItem = null;
    for (const item of this.items) {
      if (item.collected) continue;
      const dx = px - item.x;
      const dy = py - item.y;
      const dist2 = dx * dx + dy * dy;
      if (dist2 < 30 * 30) {
        this._nearbyItem = item;
        if (input.justPressed('KeyE') || input.justPressed('Space')) {
          const empty = this.inventory.slots.findIndex(s => s === null);
          if (empty !== -1) {
            this.inventory.slots[empty] = { name: item.name, color: item.color };
            item.collected = true;
            this._nearbyItem = null;
          }
        }
        break;
      }
    }
  }

  _checkDrop(input) {
    if (input.justPressed('KeyQ')) {
      const item = this.inventory.slots[this.inventory.selected];
      if (item) {
        this.inventory.slots[this.inventory.selected] = null;
        this.items.push({
          x: this.player.x + this.player.width / 2 + (Math.random() - 0.5) * 20,
          y: this.player.y + this.player.height / 2 + (Math.random() - 0.5) * 20,
          name: item.name,
          color: item.color,
          collected: false,
        });
      }
    }
  }

  _checkAttack(input) {
    const item = this.inventory.slots[this.inventory.selected];
    if (!item) return;
    if (!this.playerAlive) return;

    if (item.name === 'Knife' && input.mouse.rightJustClicked) {
      this.inventory.slots[this.inventory.selected] = null;
      const px = this.player.x + this.player.width / 2;
      const py = this.player.y + this.player.height / 2;
      const mx = input.mouse.x + this.camera.x;
      const my = input.mouse.y + this.camera.y;
      const angle = Math.atan2(my - py, mx - px);
      this.projectiles.push({
        x: px, y: py,
        vx: Math.cos(angle) * 400,
        vy: Math.sin(angle) * 400,
        dist: 0, maxRange: 250,
        damage: 50, icon: 'Knife', color: '#ef5350', owner: 'player', angle,
      });
      return;
    }

    if (item.name === 'Bow' && input.mouse.rightJustClicked) {
      this._aimX = input.mouse.x + this.camera.x;
      this._aimY = input.mouse.y + this.camera.y;
      this.bowCharging = true;
      this.bowChargeStart = this.time;
      return;
    }

    if (item.name === 'Heal' && input.mouse.rightJustClicked) {
      if (this.player.hp < this.player.maxHp) {
        this.player.hp = this.player.maxHp;
        this.inventory.slots[this.inventory.selected] = null;
        this._sendPlayerUpdate();
      }
      return;
    }

    if (this.attackCooldown > 0) return;
    if (!input.mouse.justClicked) return;

    const px = this.player.x + this.player.width / 2;
    const py = this.player.y + this.player.height / 2;
    const mx = input.mouse.x + this.camera.x;
    const my = input.mouse.y + this.camera.y;
    const angle = Math.atan2(my - py, mx - px);

    const range = 60;
    const cone = Math.PI / 4;
    let damage = 0;
    if (item.name === 'Sword') { damage = 30; this.attackCooldown = 0.4; }
    else if (item.name === 'Axe') { damage = 50; this.attackCooldown = 0.7; }
    else if (item.name === 'Knife') { damage = 15; this.attackCooldown = 0.3; }
    else { return; }

    for (const bot of this.bots) {
      if (!bot.alive) continue;
      const bx = bot.x + bot.width / 2;
      const by = bot.y + bot.height / 2;
      const bdx = bx - px;
      const bdy = by - py;
      const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
      if (bdist > range) continue;

      const bang = Math.atan2(bdy, bdx);
      let diff = bang - angle;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      if (Math.abs(diff) > cone) continue;

      bot.takeDamage(damage, 'player');
      this.slashEffect = { x: bx, y: by, timer: 0.2, angle };
      this._prevAttackAnim = true;
      return;
    }

    if (this.multiplayerMode) {
      for (const id in this.remotePlayers) {
        const rp = this.remotePlayers[id];
        if (!rp.alive) continue;
        const rx = rp.x + 16;
        const ry = rp.y + 24;
        const rdx = rx - px;
        const rdy = ry - py;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);
        if (rdist > range) continue;
        const rang = Math.atan2(rdy, rdx);
        let diff = rang - angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) > cone) continue;
        this.multiplayerClient.send({ type: 'apply_damage', targetId: Number(id), amount: damage });
        this.slashEffect = { x: rx, y: ry, timer: 0.2, angle };
        this._prevAttackAnim = true;
        return;
      }
    }
  }

  _checkSelfDamage(input) {
    if (input.justPressed('KeyG')) {
      this.player.hp = Math.max(0, this.player.hp - 20);
    }
  }

  _fireArrow() {
    this.bowCharging = false;
    const charge = Math.min(this.time - this.bowChargeStart, 2);
    const t = charge / 2;
    const speed = 300 + t * 300;
    const maxRange = 200 + t * 300;
    const damage = Math.round(10 + t * 50);

    const px = this.player.x + this.player.width / 2;
    const py = this.player.y + this.player.height / 2;
    const mx = this._aimX !== undefined ? this._aimX : px;
    const my = this._aimY !== undefined ? this._aimY : py;
    const angle = Math.atan2(my - py, mx - px);

    this.projectiles.push({
      x: px, y: py,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      dist: 0, maxRange,
      damage, icon: 'Arrow', color: '#8bc34a', owner: 'player', angle,
    });
  }

  _constrainPlayer() {
    const p = this.player;
    if (!this.playerAlive) return;
    const cx = p.x + p.width / 2;
    const cy = p.y + p.height / 2;
    const dx = cx - ARENA_CX;
    const dy = cy - ARENA_CY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = this.stormRadius - Math.max(p.width, p.height) / 2;
    if (dist > maxDist && maxDist > 0) {
      const ratio = maxDist / dist;
      p.x = ARENA_CX + dx * ratio - p.width / 2;
      p.y = ARENA_CY + dy * ratio - p.height / 2;
    }
  }

  render(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);

    for (const s of this.stars) {
      if (!this._isVisible(s.x, s.y, 5)) continue;
      const twinkle = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(this.time * 1.5 + s.phase));
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.drawImage(this.bgCanvas, this.bgOffsetX, this.bgOffsetY);

    for (const d of this.darkPatches) {
      if (!this._isVisible(d.x, d.y, Math.max(d.rx, d.ry))) continue;
      ctx.fillStyle = `rgba(30,35,25,${d.alpha})`;
      ctx.beginPath();
      ctx.ellipse(d.x, d.y, d.rx, d.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    if (this.phase !== 'countdown') {
      ctx.save();
      ctx.beginPath();
      ctx.arc(ARENA_CX, ARENA_CY, this.stormRadius, 0, Math.PI * 2);
      ctx.clip();
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.arc(ARENA_CX, ARENA_CY, ARENA_RADIUS, 0, Math.PI * 2);
      ctx.clip();
    }

    for (const g of this.grassTufts) {
      if (!this._isVisible(g.x, g.y)) continue;
      for (const blade of g.blades) {
        const baseX = g.x + blade.ox * 0.3;
        const topX = g.x + blade.ox;
        const topY = g.y - blade.height;

        ctx.strokeStyle = GRASS_COLOR;
        ctx.lineWidth = blade.thickness;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(baseX, g.y);
        ctx.lineTo(topX, topY);
        ctx.stroke();

        ctx.strokeStyle = GRASS_HIGHLIGHT;
        ctx.lineWidth = blade.thickness * 0.5;
        ctx.beginPath();
        ctx.moveTo(baseX, g.y - 2);
        ctx.lineTo(topX, topY);
        ctx.stroke();
      }
    }

    for (const b of this.bushes) {
      if (!this._isVisible(b.x, b.y)) continue;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 14, 0, Math.PI * 2);
      ctx.fillStyle = '#4a7c3f';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(b.x + 6, b.y - 5, 9, 0, Math.PI * 2);
      ctx.fillStyle = '#5a8f4a';
      ctx.fill();
      ctx.beginPath();
      ctx.arc(b.x - 4, b.y - 2, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#6a9a5a';
      ctx.fill();
    }

    for (const rock of this.rocks) {
      if (!this._isVisible(rock.x, rock.y, rock.radius + 10)) continue;
      ctx.fillStyle = '#5d4e37';
      ctx.beginPath();
      ctx.arc(rock.x, rock.y, rock.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6d5e47';
      ctx.beginPath();
      ctx.arc(rock.x - rock.radius * 0.2, rock.y - rock.radius * 0.2, rock.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#4a3d2a';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    this._renderCornucopia(ctx);

    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const item of this.items) {
      if (item.collected || !this._isVisible(item.x, item.y, 20)) continue;
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.arc(item.x, item.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      drawItemIcon(ctx, item.x, item.y, 12, item.name, item.color);
    }

    for (const drop of this.supplyDrops) {
      if (drop.collected) continue;
      if (!this._isVisible(drop.x - 10, drop.y - 30, 20)) continue;
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y - 30);
      ctx.lineTo(drop.x - 8, drop.y - 16);
      ctx.lineTo(drop.x + 8, drop.y - 16);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(drop.x, drop.y - 30);
      ctx.lineTo(drop.x, drop.y - 16);
      ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.arc(drop.x, drop.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      drawItemIcon(ctx, drop.x, drop.y, 12, drop.name, drop.color);
    }

    if (this.slashEffect) {
      ctx.strokeStyle = `rgba(255,255,255,${this.slashEffect.timer / 0.2})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      const a = this.slashEffect.angle;
      ctx.arc(this.slashEffect.x, this.slashEffect.y, 30, a - 0.8, a + 0.8);
      ctx.stroke();
    }

    for (const p of this.projectiles) {
      if (!this._isVisible(p.x, p.y, 20)) continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      if (p.angle !== undefined) ctx.rotate(p.angle + Math.PI / 2);
      drawItemIcon(ctx, 0, 0, 14, p.icon, p.color);
      ctx.restore();
    }

    if (this.phase === 'countdown') {
      this._renderPedestals(ctx);
    }

    if (this.multiplayerMode) {
      const colors = BOT_COLORS;
      let colorIdx = 0;
      for (const id in this.remotePlayers) {
        const rp = this.remotePlayers[id];
        if (!rp.alive) continue;
        const c = colors[colorIdx % colors.length];
        colorIdx++;

        if (rp._armTime === undefined) rp._armTime = 0;
        if (rp._prevX === undefined) { rp._prevX = rp.x; rp._prevY = rp.y; }

        const moving = Math.abs(rp.x - rp._prevX) > 1 || Math.abs(rp.y - rp._prevY) > 1;
        rp._prevX = rp.x;
        rp._prevY = rp.y;
        rp._armTime += (moving ? 0.1 : 0.001);

        const cx = rp.x + 16;
        const cy = rp.y + 24;

        const armSwing = moving ? 0.35 : 0;
        if (rp._currentSwing === undefined) rp._currentSwing = 0;
        rp._currentSwing += (armSwing - rp._currentSwing) * 0.3;

        const skin = '#d4a574';
        const armLen = 24;
        const armAngle = 0.5 + Math.sin(rp._armTime * 6) * rp._currentSwing;

        const lArmEndX = cx - 14 - Math.cos(armAngle) * armLen;
        const lArmEndY = cy + 2 + Math.sin(armAngle) * armLen;
        const rArmEndX = cx + 14 + Math.cos(armAngle) * armLen;
        const rArmEndY = cy + 2 + Math.sin(armAngle) * armLen;

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
        const headY = rp.y + 11;
        ctx.fillStyle = skin;
        ctx.beginPath();
        ctx.arc(cx, headY, headR, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5d4037';
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

        const bodyX = rp.x + 4;
        const bodyW = 24;
        const bodyTop = headY + headR;
        const bodyBot = rp.y + 44;
        ctx.fillStyle = c;
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

        if (rp.selectedItem) {
          drawItemIcon(ctx, rArmEndX, rArmEndY - 12, 22, rp.selectedItem, '#ccc');
        }

        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText(rp.name || 'Player', cx, rp.y - 4);
      }
    }

    for (const bot of this.bots) {
      bot.render(ctx);
    }

    if (this.playerAlive) {
      this.player.render(ctx);
    }

    const heldItem = this.inventory.slots[this.inventory.selected];
    if (heldItem && this.playerAlive) {
      const hand = this.player.getRightHandPos();
      drawItemIcon(ctx, hand.x, hand.y, 24, heldItem.name, heldItem.color);
    }

    if (this._nearbyItem && this.playerAlive) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(this._nearbyItem.x - 14, this._nearbyItem.y - 34, 28, 20);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(this._nearbyItem.x - 14, this._nearbyItem.y - 34, 28, 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('E', this._nearbyItem.x, this._nearbyItem.y - 24);
    }

    ctx.restore();
    ctx.restore();

    if (this.phase !== 'countdown') {
      this._renderStormOverlay(ctx);
    }

    this.inventory.render(ctx, canvas.width, canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    let aliveCount;
    if (this.multiplayerMode) {
      let remoteAlive = 0;
      for (const id in this.remotePlayers) if (this.remotePlayers[id].alive) remoteAlive++;
      aliveCount = remoteAlive + (this.playerAlive ? 1 : 0);
    } else {
      aliveCount = this.bots.filter(b => b.alive).length + (this.playerAlive ? 1 : 0);
    }
    ctx.fillText(`HP: ${Math.ceil(this.player.hp)}/${this.player.maxHp} | Alive: ${aliveCount}`, 12, 12);

    if (this.phase === 'countdown') {
      const secs = Math.ceil(this.countdownTimer);
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.strokeRect(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 48px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(secs > 0 ? secs : 'GO!', canvas.width / 2, canvas.height / 2);
    }

    if (this.bowCharging) {
      const charge = Math.min((this.time - this.bowChargeStart) / 2, 1);
      const barW = 100;
      const barH = 10;
      const bx = (canvas.width - barW) / 2;
      const by = canvas.height - 30;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(bx, by, barW, barH);
      ctx.fillStyle = '#8bc34a';
      ctx.fillRect(bx, by, barW * charge, barH);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.strokeRect(bx, by, barW, barH);
    }

    if (this.killFeed.length > 0) {
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      for (let i = 0; i < this.killFeed.length; i++) {
        const alpha = 1 - i * 0.15;
        ctx.fillStyle = `rgba(255,200,100,${Math.max(0, alpha)})`;
        ctx.font = 'bold 13px sans-serif';
        ctx.fillText(this.killFeed[i], canvas.width - 12, 12 + i * 20);
      }
    }

    if (this.hurtTimer > 0) {
      ctx.fillStyle = `rgba(255,0,0,${this.hurtTimer * 2})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (this._disconnected) {
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Connection lost', canvas.width / 2, canvas.height / 2);
    }
  }

  _renderCornucopia(ctx) {
    ctx.save();
    const x = ARENA_CX;
    const y = ARENA_CY;
    const w = 80;
    const h = 50;

    ctx.fillStyle = '#d4a437';
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y);
    ctx.lineTo(x, y - h);
    ctx.lineTo(x + w / 2, y);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#c49a2a';
    ctx.fillRect(x - w / 2, y, w, 12);
    ctx.strokeStyle = '#b8860b';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - w / 2, y, w, 12);

    ctx.fillStyle = '#b8860b';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('C', x, y - h / 2);

    ctx.restore();
  }

  _renderPedestals(ctx) {
    const count = BOT_COUNT + 1;
    for (let i = 0; i < count; i++) {
      const pos = randomPedestalPos(i, count);
      ctx.fillStyle = 'rgba(100,100,100,0.6)';
      ctx.fillRect(pos.x - 16, pos.y + 48, 64, 12);
      ctx.fillStyle = 'rgba(80,80,80,0.8)';
      ctx.fillRect(pos.x - 16, pos.y + 48, 64, 3);
    }

    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.arc(ARENA_CX, ARENA_CY, 250, 0, Math.PI * 2);
    ctx.fill();
  }

  _renderStormOverlay(ctx) {
    const sx = ARENA_CX - this.camera.x;
    const sy = ARENA_CY - this.camera.y;

    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.arc(sx, sy, this.stormRadius, 0, Math.PI * 2, true);
    ctx.fillStyle = 'rgba(200,50,0,0.25)';
    ctx.fill();

    const borderIntensity = Math.min(1, (ARENA_RADIUS - this.stormRadius) / (ARENA_RADIUS - STORM_END_RADIUS));
    ctx.strokeStyle = `rgba(255,100,0,${0.3 + borderIntensity * 0.7})`;
    ctx.lineWidth = 6 + borderIntensity * 8;
    ctx.beginPath();
    ctx.arc(sx, sy, this.stormRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }
})();

engine.addScene('game', gameScene);

function startGame() {
  const screens = ['welcome', 'quiz-screen', 'favspot-screen', 'summary-screen'];
  screens.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  document.getElementById('endgame-overlay').classList.remove('active');
  canvas.style.display = 'block';
  resizeCanvas();
  engine.start('game');
}

function stopGame() {
  engine.stop();
  canvas.style.display = 'none';
}

window.addEventListener('resize', () => {
  if (canvas.style.display !== 'none') resizeCanvas();
});
