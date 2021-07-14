import L from 'leaflet';

const startNodeIcon = new L.DivIcon({
  iconSize: new L.Point(10, 10),
  className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move',
});
class PolygonDrawControl {
  constructor(map) {
    this._map = map;
    this._nodes = [];
  }

  _initMarkers() {
    if (!this._markerGroup) {
      this._markerGroup = new L.LayerGroup();
    }
  }

  _addStartNode(coords) {
    // Create marker
    const marker = new L.Marker(coords, {
      icon: startNodeIcon,
      zIndexOffset: 10,
    });

    // Add click event
    marker.on('mousedown', this._closePolygon, this);

    // Add to map
    this._markerGroup.addLayer(marker);

    return marker;
  }

  _getEventLatLng(event) {
    const {
      latlng: { lng, lat },
    } = event;
    return [lat, lng];
  }

  _onMouseDown(e) {
    // Transform x/y to lat/lon
    const coords = this._getEventLatLng(e);

    // Add node to polygon
    this._nodes.push(coords);

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

  _closePolygon(e) {
    // Replace polyline by a polygon
    this._shape.remove();
    this._shape = L.polygon(this._nodes, {
      weight: 4,
      fillOpacity: 0.4,
    }).addTo(this._map);

    // Remove nodes
    this._markerGroup.remove();

    // Disable this controller
    this.disable();

    // Avoid firing other click events
    e.stopPropagation();
  }

  enable() {
    // Init markers layer
    if (!this._markerGroup) {
      this._initMarkers();
      this._map.addLayer(this._markerGroup);
    }

    // Start capturing clicks on the map
    this._map.on('mousedown', this._onMouseDown, this);
  }

  disable() {
    // Remove click events
    this._map.off('mousedown', this._onMouseDown, this);
  }
}

export default PolygonDrawControl;
