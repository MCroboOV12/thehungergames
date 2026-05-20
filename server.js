const http = require('http');
const path = require('path');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json());

app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', game: 'The Hunger Games' });
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });
const games = {};
let nextPlayerId = 1;
let nextSpawnIndex = 0;
const MAX_PLAYERS = 8;

setInterval(() => {
  wss.clients.forEach(ws => {
    if (ws.readyState === WebSocket.OPEN) ws.ping();
  });
}, 10000);

function broadcast(game, msg, excludeWs = null) {
  const data = JSON.stringify(msg);
  for (const p of game.players) {
    if (p.ws !== excludeWs && p.ws.readyState === WebSocket.OPEN) {
      p.ws.send(data);
    }
  }
}

wss.on('connection', (ws) => {
  let currentPlayer = null;
  let currentGame = null;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'create_game': {
        const { gameName, code } = msg;
        if (games[code]) {
          ws.send(JSON.stringify({ type: 'error', message: 'Code already exists' }));
          return;
        }
        const game = { name: gameName, code, admin: ws, players: [], started: false };
        games[code] = game;
        currentGame = game;
        const id = nextPlayerId++;
        const spawnIndex = nextSpawnIndex++;
        currentPlayer = { id, name: 'Admin', ws, spawnIndex };
        game.players.push(currentPlayer);
        ws.send(JSON.stringify({ type: 'game_created', code, playerId: id }));
        break;
      }
      case 'join_game': {
        const game = games[msg.code];
        if (!game) {
          ws.send(JSON.stringify({ type: 'join_failed', reason: 'not_found' }));
          return;
        }
        if (game.started) {
          ws.send(JSON.stringify({ type: 'join_failed', reason: 'started' }));
          return;
        }
        if (game.players.length >= MAX_PLAYERS) {
          ws.send(JSON.stringify({ type: 'join_failed', reason: 'full' }));
          return;
        }
        const id = nextPlayerId++;
        const spawnIndex = nextSpawnIndex++;
        currentPlayer = { id, name: msg.playerName || `Player ${id}`, ws, spawnIndex };
        game.players.push(currentPlayer);
        currentGame = game;
        ws.send(JSON.stringify({ type: 'joined', playerId: id, gameName: game.name }));
        broadcast(game, {
          type: 'player_joined',
          players: game.players.map(p => ({ id: p.id, name: p.name })),
        }, ws);
        break;
      }
      case 'start_game': {
        if (!currentGame || currentGame.admin !== ws) return;
        currentGame.started = true;
        const spawns = {};
        for (const p of currentGame.players) spawns[p.id] = p.spawnIndex;
        broadcast(currentGame, { type: 'game_started', spawns });
        break;
      }
      case 'player_update': {
        if (!currentGame || !currentPlayer) return;
        broadcast(currentGame, {
          type: 'player_update',
          id: currentPlayer.id,
          name: currentPlayer.name,
          x: msg.x, y: msg.y,
          hp: msg.hp,
          maxHp: msg.maxHp,
          alive: msg.alive,
          selectedItem: msg.selectedItem,
          attackAnim: msg.attackAnim,
        }, ws);
        break;
      }
      case 'apply_damage': {
        if (!currentGame || !currentPlayer) return;
        const target = currentGame.players.find(p => p.id === msg.targetId);
        if (target && target.ws.readyState === WebSocket.OPEN) {
          target.ws.send(JSON.stringify({
            type: 'take_damage',
            amount: msg.amount,
            attackerId: currentPlayer.id,
          }));
        }
        break;
      }
      case 'chat_message': {
        if (!currentGame || !currentPlayer) return;
        broadcast(currentGame, {
          type: 'chat_message',
          playerId: currentPlayer.id,
          name: currentPlayer.name,
          text: msg.text,
        });
        break;
      }
    }
  });

  ws.on('close', () => {
    if (currentGame) {
      const idx = currentGame.players.findIndex(p => p.ws === ws);
      if (idx !== -1) {
        const removed = currentGame.players.splice(idx, 1)[0];
        broadcast(currentGame, { type: 'player_left', playerId: removed.id, players: currentGame.players.map(p => ({ id: p.id, name: p.name })) });
      }
      if (currentGame.admin === ws) {
        broadcast(currentGame, { type: 'game_closed' });
        delete games[currentGame.code];
      } else if (currentGame.players.length === 0) {
        delete games[currentGame.code];
      } else if (currentGame.admin === ws) {
        delete games[currentGame.code];
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
