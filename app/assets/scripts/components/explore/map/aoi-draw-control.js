import L from 'leaflet';

class AoiDrawControl {
  constructor(map, events) {
    this._map = map;
    this.onDrawEnd = events.onDrawEnd;
    this.onDrawChange = events.onDrawChange;
  }

  getEventLatLng(event) {
    const {
      latlng: { lng, lat },
    } = event;
    return [lat, lng];
  }

  /**
   * Returns bbox as minX, minY, maxX, maxY
   */
  getBbox() {
    const { _southWest, _northEast } = this._shape.getBounds();
    return [_southWest.lng, _southWest.lat, _northEast.lng, _northEast.lat];
  }

  _onMouseDown(event) {
    this._map.dragging.disable();
    this._map.off('mousedown', this._onMouseDown, this);
    this._start = this.getEventLatLng(event);

    // Update rectangle on mouse move
    function onMouseMove(event) {
      this._end = this.getEventLatLng(event);

      if (!this._shape) {
        this._shape = L.rectangle([this._start, this._end]).addTo(this._map);
      } else {
        this._shape.setBounds([this._start, this._end]);
      }

      this.onDrawChange(this.getBbox());
    }

    // Listen to draw end
    function onMouseUp() {
      this._map.dragging.enable();
      this._map.off('mousemove', onMouseMove, this);
      this._map.off('mouseup', onMouseUp, this);
      this.onDrawEnd(this._shape);
    }

    // Add draw events after mouse down
    this._map.on('mousemove', onMouseMove, this);
    this._map.on('mouseup', onMouseUp, this);
  }

  enable() {
    this._map.on('mousedown', this._onMouseDown, this);
  }

  disable() {
    this._map.off('mousedown', this._onMouseDown, this);
  }
}

export default AoiDrawControl;
