import L from 'leaflet';
import 'leaflet-freehandshapes';

class PolygonDrawControl {
  constructor(map, events) {
    this._map = map;

    this._group = new L.LayerGroup();

    this._group.addTo(this._map);

    this.onUpdate = events.onUpdate;
    this.addLayer = this.addLayer.bind(this);
    this.setLayerPolygons = this.setLayerPolygons.bind(this);
    this.manualMode = false;
  }

  /* Clear geometry from layer */
  clearLayers() {
    this._group.eachLayer(function (layer) {
      console.log(layer)
      layer.clearLayers();
    });
  }

  /*
   * Create free hand shapes for each layer
   * Remove all existing layers from the map first
   */
  setLayers(layers) {
    console.log('set layers');

    console.log(this._group)

    //this._group.clearLayers()
    this._group.eachLayer(function (layer) {
      console.log(layer)
      layer.clearLayers();
    })

    Object.values(layers).forEach(this.addLayer);
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
      console.log('layeradd');
      console.log(drawer);
      const polygons = this.getLayerAsGeoJSON(drawer);
      if (!this.manualMode) {
        this.onUpdate(name, polygons);
      }
    });
    drawer.on('layerremove', () => {
      console.log('layerremove');
      // should not update history when merging
      const polygons = this.getLayerAsGeoJSON(drawer);
      if (!this.manualMode && drawer.mode === 'subtract') {
        this.onUpdate(name, polygons);
      }
    });
    drawer.on('layersubtract', (data) => {
      console.log('layersubtract');
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

  /*
   * Function to add polygons to layers without user input
   * used when restoring from history using UNDO
   */
  setLayerPolygons(layerPolygons) {
    const idMap = Object.entries(this._group._layers).reduce(
      (accum, [id, { category }]) => ({
        ...accum,
        [category]: id,
      }),
      {}
    );
    Object.entries(layerPolygons).forEach(([layerName, { polygons }]) => {
      const layer = this._group.getLayer(idMap[layerName]);
      this.manualMode = true;

      layer.clearLayers();
      polygons.forEach((poly) => {
        const latlngs = [poly.coordinates[0].map(([lon, lat]) => [lat, lon])];
        layer.addPolygon(latlngs, true, true, true);
      });
      this.manualMode = false;
    });
  }

  enableMode(mode, layerName) {
    let present;
    this._group.eachLayer(function (layer) {
      if (layer.category === layerName) {
        // enable drawing tool for type
        layer.setMode(mode);
        present = true;
      } else {
        // disables other freehand instances
        layer.setMode('view');
      }
    });
    if (!present) {
      throw new Error(`${layerName} not present in PolygonDraw Group.`);
    }
  }

  enableAdd(layerName) {
    this.enableMode('add', layerName);
  }

  enableSubtract(layerName) {
    this.enableMode('subtract', layerName);
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
