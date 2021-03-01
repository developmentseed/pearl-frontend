import L from 'leaflet';

const icons = {
  moveIcon: new L.DivIcon({
    iconSize: new L.Point(8, 8),
    className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move',
  }),
  resizeIcon: new L.DivIcon({
    iconSize: new L.Point(8, 8),
    className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-resize',
  }),
};

class AoiEditControl {
  constructor(map, { onBoundsChange, onBoundsChangeEnd }) {
    this._map = map;
    this.onBoundsChangeEnd = () => onBoundsChangeEnd(this._getBbox());
    this.onBoundsChange = () => onBoundsChange(this._getBbox());
  }

  enable(shape) {
    this._shape = shape;
    this.addHooks();
  }

  disable() {
    this.removeHooks();
  }

  _getBbox() {
    const bounds = this._shape.getBounds();
    const { _southWest, _northEast } = bounds;

    // Pass bounds as minX, minY, maxX, maxY
    return [_southWest.lng, _southWest.lat, _northEast.lng, _northEast.lat];
  }

  _createMoveMarker() {
    var bounds = this._shape.getBounds(),
      center = bounds.getCenter();

    this._moveMarker = this._createMarker(center, icons.moveIcon);
  }

  _createMarker(latlng, icon) {
    var marker = new L.Marker(latlng, {
      draggable: true,
      icon,
    });

    this._bindMarker(marker);

    this._markerGroup.addLayer(marker);

    return marker;
  }

  _bindMarker(marker) {
    marker
      .on('dragstart', this._onMarkerDragStart, this)
      .on('drag', this._onMarkerDrag, this)
      .on('dragend', this._onMarkerDragEnd, this);
  }

  _unbindMarker(marker) {
    marker
      .off('dragstart', this._onMarkerDragStart, this)
      .off('drag', this._onMarkerDrag, this)
      .off('dragend', this._onMarkerDragEnd, this);
  }

  _onMarkerDragStart(e) {
    // Save a reference to the opposite point
    var corners = this._getCorners(),
      marker = e.target,
      currentCornerIndex = marker._cornerIndex;

    this._oppositeCorner = corners[(currentCornerIndex + 2) % 4];

    this._toggleCornerMarkers(0, currentCornerIndex);
  }

  _onMarkerDragEnd(e) {
    var marker = e.target,
      bounds,
      center;

    // Reset move marker position to the center
    if (marker === this._moveMarker) {
      bounds = this._shape.getBounds();
      center = bounds.getCenter();

      marker.setLatLng(center);
    }

    this._toggleCornerMarkers(1);

    this._repositionCornerMarkers();

    marker.setOpacity(1);

    this.onBoundsChangeEnd();
  }

  _onMarkerDrag(e) {
    var marker = e.target,
      latlng = marker.getLatLng();

    if (marker === this._moveMarker) {
      this._move(latlng);
    } else {
      this._resize(latlng);
    }

    this._shape.redraw();
  }

  _resize(latlng) {
    var bounds;

    // Update the shape based on the current position of this corner and the opposite point
    this._shape.setBounds(L.latLngBounds(latlng, this._oppositeCorner));

    // Reposition the move marker
    bounds = this._shape.getBounds();
    this._moveMarker.setLatLng(bounds.getCenter());

    this.onBoundsChange();
  }

  _move(newCenter) {
    var latlngs = this._shape._defaultShape
        ? this._shape._defaultShape()
        : this._shape.getLatLngs(),
      bounds = this._shape.getBounds(),
      center = bounds.getCenter(),
      offset,
      newLatLngs = [];

    // Offset the latlngs to the new center
    for (var i = 0, l = latlngs.length; i < l; i++) {
      offset = [latlngs[i].lat - center.lat, latlngs[i].lng - center.lng];
      newLatLngs.push([newCenter.lat + offset[0], newCenter.lng + offset[1]]);
    }

    this._shape.setLatLngs(newLatLngs);

    this._repositionCornerMarkers();

    this.onBoundsChange();
  }

  _getCorners() {
    const bounds = this._shape.getBounds();
    const nw = bounds.getNorthWest();
    const ne = bounds.getNorthEast();
    const se = bounds.getSouthEast();
    const sw = bounds.getSouthWest();
    return [nw, ne, se, sw];
  }

  _createResizeMarkers() {
    const corners = this._getCorners();

    this._resizeMarkers = [];

    for (var i = 0, l = corners.length; i < l; i++) {
      this._resizeMarkers.push(
        this._createMarker(corners[i], icons.resizeIcon)
      );
      // Monkey in the corner index as we will need to know this for dragging
      this._resizeMarkers[i]._cornerIndex = i;
    }
  }

  _toggleCornerMarkers(opacity) {
    for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
      this._resizeMarkers[i].setOpacity(opacity);
    }
  }

  _repositionCornerMarkers() {
    var corners = this._getCorners();

    for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
      this._resizeMarkers[i].setLatLng(corners[i]);
    }
  }

  _initMarkers() {
    if (!this._markerGroup) {
      this._markerGroup = new L.LayerGroup();
    }

    // Create center marker
    this._createMoveMarker();

    // Create edge marker
    this._createResizeMarkers();
  }

  addHooks() {
    var shape = this._shape;
    if (shape && shape._map) {
      this._map = shape._map;

      if (shape._map) {
        this._map = shape._map;
        if (!this._markerGroup) {
          this._initMarkers();
        }
        this._map.addLayer(this._markerGroup);
      }
    }
  }

  removeHooks() {
    var shape = this._shape;

    shape.setStyle(shape.options.original);

    if (shape._map) {
      this._unbindMarker(this._moveMarker);

      for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
        this._unbindMarker(this._resizeMarkers[i]);
      }
      this._resizeMarkers = null;

      this._map.removeLayer(this._markerGroup);
      delete this._markerGroup;
    }

    this._map = null;
  }
}

export default AoiEditControl;
