import L from 'leaflet';

const startNodeIcon = new L.DivIcon({
  iconSize: new L.Point(10, 10),
  className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move',
});
class PolygonDrawControl {
  constructor({ map, onDrawFinish }) {
    this._map = map;
    this._onDrawFinish = onDrawFinish;
    this._nodes = [];
    this._ignoreNextClickEvent = false;
  }

  setCheckpoint(checkpoint) {
    this._checkpoint = checkpoint;
  }

  _addStartNode(coords) {
    // Create marker
    this._starterMarker = new L.Marker(coords, {
      icon: startNodeIcon,
      zIndexOffset: 10,
      bubblingMouseEvents: false,
    });

    // Add click event
    this._starterMarker
      .on('mousedown', this._closePolygon, this)
      .addTo(this._map);
  }

  _getEventLatLng(event) {
    const {
      latlng: { lng, lat },
    } = event;
    return [lat, lng];
  }

  _onMouseDown(e) {
    // _onMouseDown is called to _map and _starter makers, so it will be called
    // unnecessarily after _closePolygon
    if (this._ignoreNextClickEvent) {
      this._ignoreNextClickEvent = false;
      return;
    }

    // Transform x/y to lat/lon
    const coords = this._getEventLatLng(e);

    // Add node to polygon
    this._nodes = this._nodes.concat([coords]);

    // Add start/close marker on first click
    if (this._nodes.length === 1) {
      this._addStartNode(coords, 'start');
    } else {
      // Add node to existing shape or create one
      if (this._shape) {
        this._shape.setLatLngs(this._nodes);
      } else {
        this._shape = L.polyline(this._nodes, {
          weight: 4,
          fillOpacity: 0.4,
        }).addTo(this._map);
      }
    }
  }

  _closePolygon() {
    this._ignoreNextClickEvent = true;

    // Make it a close polygon
    this._nodes = this._nodes.concat([this._nodes[0]]);

    // Get active class
    const { activeItem } = this._checkpoint;
    const activeClass = this._checkpoint.classes[activeItem];

    // Add polygon to class and update checkpoint
    this._onDrawFinish({
      ...this._checkpoint,
      classes: {
        ...this._checkpoint.classes,
        [activeItem]: {
          polygons: activeClass.polygons.concat({
            type: 'Polygon',
            coordinates: [this._nodes.map(([lat, lon]) => [lon, lat])],
          }),
        },
      },
    });

    this._clear();
  }

  _clear() {
    if (this._starterMarker) {
      this._starterMarker.remove();
      this._starterMarker = null;
    }
    if (this._shape) {
      this._shape.remove();
      this._shape = null;
    }

    this._nodes = [];
  }

  enable() {
    this._map.on('mousedown', this._onMouseDown, this);
  }

  disable() {
    // Clear drawn polygon
    this._clear();

    // Remove click events
    this._map.off('mousedown');
  }
}

export default PolygonDrawControl;
