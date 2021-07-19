import DefaultPointMarker, { Line, Rect, Circle, Text } from 'peaks.js/src/default-point-marker.js'

export class PointMarker extends DefaultPointMarker {
  init (group) {
    super.init(group)

    this._line.strokeWidth(this._options.point.lineWidth || 1)

    console.log(this._options.view, this)
    if (this._options.view === 'zoomview' && this._handle) {
      const layerHeight = this._options.layer.getHeight()

      this._handle.width(20)
      this._handle.x(-10 - 4 + 0.5) // half a side - side rotation + half pixel
      this._handle.y(layerHeight - this._handle.height() + 9.5 + 0.5)
      this._handle.cornerRadius([20, 0, 20, 20])
      this._handle.rotate(-45)
    }
  }
}
