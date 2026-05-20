class Input {
  constructor() {
    this.keys = {};
    this.keysJustPressed = {};
    this.mouse = { x: 0, y: 0, clicked: false, justClicked: false, rightClicked: false, rightJustClicked: false };
    this._boundKeydown = this._onKeyDown.bind(this);
    this._boundKeyup = this._onKeyUp.bind(this);
    this._boundMousemove = this._onMouseMove.bind(this);
    this.wheel = 0;
    this._boundMousedown = this._onMouseDown.bind(this);
    this._boundMouseup = this._onMouseUp.bind(this);
    this._boundWheel = this._onWheel.bind(this);
    window.addEventListener('keydown', this._boundKeydown);
    window.addEventListener('keyup', this._boundKeyup);
    window.addEventListener('mousemove', this._boundMousemove);
    window.addEventListener('mousedown', this._boundMousedown);
    window.addEventListener('mouseup', this._boundMouseup);
    window.addEventListener('contextmenu', e => e.preventDefault());
    window.addEventListener('wheel', this._boundWheel, { passive: true });
  }

  _onKeyDown(e) {
    if (!this.keys[e.code]) this.keysJustPressed[e.code] = true;
    this.keys[e.code] = true;
  }

  _onKeyUp(e) {
    this.keys[e.code] = false;
  }

  _onMouseMove(e) {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
  }

  _onMouseDown(e) {
    if (e.button === 0) {
      this.mouse.clicked = true;
      this.mouse.justClicked = true;
    } else if (e.button === 2) {
      this.mouse.rightClicked = true;
      this.mouse.rightJustClicked = true;
    }
  }

  _onMouseUp(e) {
    if (e.button === 2) {
      this.mouse.rightClicked = false;
    }
  }

  _onWheel(e) {
    this.wheel += Math.sign(e.deltaY);
  }

  isDown(code) {
    return !!this.keys[code];
  }

  justPressed(code) {
    return !!this.keysJustPressed[code];
  }

  clearFrame() {
    this.keysJustPressed = {};
    this.mouse.justClicked = false;
    this.mouse.rightJustClicked = false;
  }

  destroy() {
    window.removeEventListener('keydown', this._boundKeydown);
    window.removeEventListener('keyup', this._boundKeyup);
    window.removeEventListener('mousemove', this._boundMousemove);
    window.removeEventListener('mousedown', this._boundMousedown);
    window.removeEventListener('mouseup', this._boundMouseup);
    window.removeEventListener('wheel', this._boundWheel);
  }
}
