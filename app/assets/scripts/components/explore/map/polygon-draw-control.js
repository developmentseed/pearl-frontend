import L from 'leaflet';
import 'leaflet-freehandshapes';

class PolygonDrawControl {
  constructor(map, events) {
    this._map = map;

    this._group = new L.LayerGroup();

    this._group.addTo(this._map);

    this.onUpdate = events.onUpdate;
  }

  clearLayers() {
    this._group.eachLayer(function (layer) {
      layer.clearLayers();
    });
  }

  setLayers(layers) {
    Object.values(layers).forEach(({ name, color }) => {
      const drawer = new L.FreeHandShapes({
        polygon: {
          color: color,
          fillColor: color,
          fillOpacity: 0.5,
          weight: 3,
          smoothFactor: 1,
        },
        simplify_tolerance: 0.000001,
        polyline: {
          color: color,
          smoothFactor: 0,
        },
      });

      drawer.category = name;

      // Handle added polygon
      drawer.on('layeradd', (data) => {
        const polygons = this.getLayerAsGeoJSON(data.target);
        this.onUpdate(name, polygons)
      });
      drawer.on('layerremove', (data) => {
        const polygons = this.getLayerAsGeoJSON(data.target);
        this.onUpdate(name, polygons)
      });
      this._group.addLayer(drawer);
    });
  }

  enableMode(mode, layerName) {
    this._group.eachLayer(function (layer) {
      if (layer.category === layerName) {
        // enable drawing tool for type
        layer.setMode(mode);
      } else {
        // disables other freehand instances
        layer.setMode('view');
      }
    });
  }

  enableAdd(layerName) {
    this.enableMode('add', layerName);
  }

  enableDelete(layerName) {
    this.enableMode('delete', layerName);
  }

  disable() {
    this._group.eachLayer((layer) => layer.setMode('view'));
  }

  getLayerAsGeoJSON(layer) {
    let polygons = layer.getLayers();
    return polygons.map(function (poly) {
      return poly.toGeoJSON();
    });
  }
}

export default PolygonDrawControl;
