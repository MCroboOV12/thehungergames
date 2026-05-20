class Camera {
  constructor(width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
  }

  follow(entity, canvasWidth, canvasHeight) {
    this.x = entity.x - canvasWidth / 2 + entity.width / 2;
    this.y = entity.y - canvasHeight / 2 + entity.height / 2;
  }
}
