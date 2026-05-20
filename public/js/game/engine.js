class GameEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.scenes = {};
    this.currentScene = null;
    this.lastTime = 0;
    this.running = false;
    this.boundLoop = this.loop.bind(this);
  }

  addScene(name, scene) {
    scene.engine = this;
    this.scenes[name] = scene;
  }

  start(name) {
    if (this.running) return;
    const scene = this.scenes[name];
    if (!scene) return;
    this.currentScene = scene;
    this.lastTime = performance.now();
    this.running = true;
    scene.enter();
    requestAnimationFrame(this.boundLoop);
  }

  stop() {
    if (this.currentScene) this.currentScene.exit();
    this.running = false;
    this.currentScene = null;
  }

  loop(time) {
    const dt = Math.min((time - this.lastTime) / 1000, 0.05);
    this.lastTime = time;
    if (this.currentScene) {
      this.currentScene.update(dt);
      this.ctx.save();
      this.currentScene.render(this.ctx);
      this.ctx.restore();
    }
    if (this.running) requestAnimationFrame(this.boundLoop);
  }
}
