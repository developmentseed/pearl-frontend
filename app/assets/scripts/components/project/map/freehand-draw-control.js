import L from 'leaflet';
import 'leaflet-freehandshapes';

class FreehandDrawControl {
  constructor(map, events) {
    this._map = map;

    this._group = new L.LayerGroup();

    this._group.addTo(this._map);

    this.onUpdate = events.onUpdate;
    this.addLayer = this.addLayer.bind(this);
    this.manualMode = false;
  }

  /* Clear geometry from layer */
  clearLayers() {
    this._group.eachLayer(function (layer) {
      layer.clearLayers();
    });
  }

  clearLayer(category) {
    this._group.eachLayer(function (layer) {
      if (layer.category === category) {
        layer.clearLayers();
      }
    });
  }

  /*
   * Create free hand shapes for each layer
   * Layers are only added if they do not currently exist in polygon draw
   */
  setLayers(layers) {
    const currentLayers = new Set();
    this._group.eachLayer((l) => currentLayers.add(l.category));

    Object.entries(layers).forEach(([name, layer]) => {
      if (!currentLayers.has(name)) {
        this.addLayer(layer);
      }
    });
  }

  addLayer(layer) {
    const { name, color } = layer;
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
    drawer.on('layeradd', () => {
      const polygons = this.getLayerAsGeoJSON(drawer);
      if (!this.manualMode) {
        this.onUpdate(name, polygons);
      }
    });
    drawer.on('layerremove', () => {
      // should not update history when merging
      const polygons = this.getLayerAsGeoJSON(drawer);
      if (!this.manualMode && drawer.mode === 'subtract') {
        this.onUpdate(name, polygons);
      }
    });
    drawer.on('layersubtract', (data) => {
      // should not update history when merging
      const polygons = this.getLayerAsGeoJSON(data.target);

      if (!this.manualMode) {
        this.onUpdate(name, polygons);
      }
    });

    /*
     * Override default functionality of freehand shapes
     * Default functionality dictates that polygonClick only fires a remove event when in delete mode.
     * Here it it firest the event only when in subtract mode so as to allow draw erase and click delete
     * without changing tools
     */
    drawer.polygonClick = (polygon) => {
      if (drawer.mode === 'subtract') {
        drawer.removeLayer(polygon);
      }
    };

    this._group.addLayer(drawer);
  }

  enableAdd(layerName) {
    let present;
    this._group.eachLayer(function (layer) {
      if (layer.category === layerName) {
        // enable drawing tool for type
        layer.setMode('add');
        present = true;
      } else {
        // disables other freehand instances
        layer.setMode('view');
      }
    });
    if (!present) {
      throw new Error(`${layerName} not present in FreehandDraw Group.`);
    }
  }

  enableSubtract() {
    this._group.eachLayer(function (layer) {
      layer.setMode('subtract');
    });
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

export default FreehandDrawControl;
