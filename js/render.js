class Render {
  renderingContext;

  /**
   *
   * @param {CanvasRenderingContext2D} renderingContext
   */
  constructor(renderingContext) {
    this.renderingContext = renderingContext;
  }

  get renderingContext() {
    return this.renderingContext;
  }

  clear(x, y, w, h) {
    this.renderingContext.clearRect(x, y, w, h);
  }

  save() {
    this.renderingContext.save();
  }

  restore() {
    this.renderingContext.restore();
  }

  drawTrapezium(x1, y1, w1, x2, y2, w2, color = 'green') {
    this.drawPolygon(color,
      x1 - w1, y1,
      x1 + w1, y1,
      x2 + y2, y2,
      x2 - w2, y2);
  }

  drawPolygon(color, ...coords) {
    if (coords.length > 1) {
      const { renderingContext } = this;
      renderingContext.save();
      renderingContext.fillStyle = color;
      renderingContext.beginPath();
      renderingContext.moveTo(coords[0], coords[1]);
      for (let i = 2; i < coords.length; i += 2) {
        renderingContext.lineTo(coords[i], coords[(i + 1) % coords.length]);
      }
      renderingContext.closePath();
      renderingContext.fill();
      renderingContext.restore();
    }
  }
}
