class World {
  constructor(tileSize) {
    this.tileSize = tileSize || 32;
    this.width = 0;
    this.height = 0;
    this.tiles = [];
  }

  loadMap(data) {
    this.height = data.length;
    this.width = data[0] ? data[0].length : 0;
    this.tiles = data;
  }

  getTile(col, row) {
    if (row < 0 || row >= this.height || col < 0 || col >= this.width) return 1;
    return this.tiles[row][col];
  }

  isSolid(col, row) {
    return this.getTile(col, row) === 1;
  }

  render(ctx, camera) {
    const startCol = Math.floor(camera.x / this.tileSize);
    const endCol = Math.ceil((camera.x + camera.width) / this.tileSize);
    const startRow = Math.floor(camera.y / this.tileSize);
    const endRow = Math.ceil((camera.y + camera.height) / this.tileSize);

    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        if (row < 0 || row >= this.height || col < 0 || col >= this.width) continue;
        const tile = this.tiles[row][col];
        const x = col * this.tileSize;
        const y = row * this.tileSize;

        if (tile === 1) {
          ctx.fillStyle = '#2a2a4a';
          ctx.fillRect(x, y, this.tileSize, this.tileSize);
          ctx.strokeStyle = '#1a1a3a';
          ctx.strokeRect(x, y, this.tileSize, this.tileSize);
        } else if (tile === 2) {
          ctx.fillStyle = '#3a5a2a';
          ctx.fillRect(x, y, this.tileSize, this.tileSize);
        } else {
          ctx.fillStyle = '#1a1a2e';
          ctx.fillRect(x, y, this.tileSize, this.tileSize);
        }
      }
    }
  }
}
