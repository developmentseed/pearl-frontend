import L from 'leaflet';
import tBbox from '@turf/bbox';
import getFeatureArea from '@turf/area';
import { isRectangle } from '../../../utils/is-rectangle';
class AoiDrawControl {
  constructor(map, geometry, apiLimits, events) {
    this._map = map;
    this.onDrawEnd = events.onDrawEnd;
    this.onDrawChange = events.onDrawChange;
    this.onDrawStart = events.onDrawStart;
    this.onInitialize = events.onInitialize;
    if (geometry) {
      this.initialize(geometry);
    }
    this._apiLimits = apiLimits;
  }

  clear() {
    if (this._shape) {
      this._map.removeLayer(this._shape);
      this._shape = null;
    }
  }

  // Draw control is initialized with a shape. This is where all AOIs are added
  // to the map, which is not ideal. This class should only be responsible for
  // controlling the drawing new AOIs and needs a refactor to separate logic of
  // loading existing AOIs. (TODO)
  initialize(geometry) {
    if (isRectangle(geometry)) {
      const [lonMin, latMin, lonMax, latMax] = tBbox(geometry);
      const bounds = [
        [latMin, lonMin],
        [latMax, lonMax],
      ];
      this._shape = L.rectangle(bounds, { interactive: false }).addTo(
        this._map
      );
    } else {
      this._shape = new L.GeoJSON(geometry).addTo(this._map);
    }
    this._shape.setStyle({ fillOpacity: 0 });
    this.onInitialize({
      aoiRef: this._shape,
      aoiArea: getFeatureArea(geometry),
    });
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
        this._shape = L.rectangle([this._start, this._end], {
          weight: 4,
          fillOpacity: 0.4,
          interactive: false,
        }).addTo(this._map);
        this.onDrawStart(this._shape);
      } else {
        this._shape.setBounds([this._start, this._end]);
      }

      this.onDrawChange(this.getBbox());
    }

    // Listen to mouseUp: if the user has drawn a bbox, call drawEnd,
    // else if it's just a click, reset user state to before mouseDown.
    function onMouseUp() {
      // Turn off the mousemove handler in all cases
      // on the mouseUp action
      this._shape.setStyle({ fillOpacity: 0 });
      this._map.off('mousemove', onMouseMove, this);

      // We need to enable dragging to get the
      // cursor to remain consistent
      this._map.dragging.enable();

      // User has done a mouseUp action without actually drawing a bbox,
      // In this case, we re-enable the mouseDown event to let the user
      // draw again, keeping the user in AOI-drawing mode
      if (!this._shape) {
        this._map.on('mousedown', this._onMouseDown, this);
        return;
      }

      this._map.off('mouseup', onMouseUp, this);
      this.onDrawEnd(this.getBbox(), this._shape);
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
