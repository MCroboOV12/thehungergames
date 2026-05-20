class GameClient {
  constructor() {
    this.ws = null;
    this.playerId = null;
    this.listeners = {};
    this.connected = false;
  }

  connect(url) {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(url);
      this.ws.onopen = () => {
        this.connected = true;
        resolve();
      };
      this.ws.onerror = () => { reject(new Error('Connection failed')); };
      this.ws.onmessage = (e) => {
        let msg;
        try { msg = JSON.parse(e.data); } catch { return; }
        if (msg.type === 'joined' || msg.type === 'game_created') {
          this.playerId = msg.playerId;
        }
        const fns = this.listeners[msg.type];
        if (fns) fns.forEach(fn => fn(msg));
      };
      this.ws.onclose = () => {
        this.connected = false;
        const fns = this.listeners['close'];
        if (fns) fns.forEach(fn => fn());
      };
    });
  }

  on(type, fn) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(fn);
  }

  off(type, fn) {
    const fns = this.listeners[type];
    if (!fns) return;
    this.listeners[type] = fns.filter(f => f !== fn);
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.connected = false;
    this.playerId = null;
    this.listeners = {};
  }
}
