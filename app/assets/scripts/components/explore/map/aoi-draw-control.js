import L from 'leaflet';

// import { themeVal } from '@devseed-ui/theme-provider';
import theme from '../../../styles/theme';
import { convertArea } from '@turf/helpers';
import tArea from '@turf/area';
import tBboxPolygon from '@turf/bbox-polygon';

/**
 * Get area from bbox
 *
 * @param {array} bbox extent in minX, minY, maxX, maxY order
 */
function areaFromBounds(bbox) {
  const poly = tBboxPolygon(bbox);
  return convertArea(tArea(poly), 'meters', 'kilometers');
}

class AoiDrawControl {
  constructor(map, initializationShape, apiLimits, events) {
    this._map = map;
    this.onDrawEnd = events.onDrawEnd;
    this.onDrawChange = events.onDrawChange;
    this.onInitialize = events.onInitialize;
    if (initializationShape) {
      this.initialize(initializationShape);
    }
    this._apiLimits = apiLimits;
  }

  clear() {
    if (this._shape) {
      this._map.removeLayer(this._shape);
      this._shape = null;
    }
  }

  // Draw control is initialized with a shape
  initialize(bounds) {
    //this._start = L.LatLng(bounds[0][0], bounds[0][1])
    //this._end= L.LatLng(bounds[1][0], bounds[1][1])

    this._shape = L.rectangle(bounds).addTo(this._map);
    this.onInitialize(this.getBbox(), this._shape);
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
      let color = theme.main.color.info;
      if (!this._shape) {
        this._shape = L.rectangle([this._start, this._end], {
          color: color,
          weight: '1',
        }).addTo(this._map);
      } else {
        this._shape.setBounds([this._start, this._end]);
      }

      this.onDrawChange(this.getBbox());
      if (areaFromBounds(this.getBbox()) > this._apiLimits.max_inference) {
        color = theme.main.color.danger;
      } else if (
        areaFromBounds(this.getBbox()) > this._apiLimits.live_inference
      ) {
        color = theme.main.color.warning;
      } else {
        color = theme.main.color.info;
      }
      console.log(color);
    }

    // Listen to mouseUp: if the user has drawn a bbox, call drawEnd,
    // else if it's just a click, reset user state to before mouseDown.
    function onMouseUp() {
      // Turn off the mousemove handler in all cases
      // on the mouseUp action
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
