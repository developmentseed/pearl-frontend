import leafletFreehand from 'leaflet-freehandshapes';

class PolygonDrawControl {
  constructor(map) {
    this._map = map;

    this._group = new L.LayerGroup();

    this._group.addTo(this._map);
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
        polyline: {
          color: color,
          smoothFactor: 0,
        },
      });

      // const drawer = new L.FreeHandShapes();

      drawer.category = name;

      drawer.on('layeradd', function (data) {
        console.log('layeradd', data);
      });
      this._group.addLayer(drawer);
    });
  }

  enable(layerName) {
    this._group.eachLayer(function (layer) {
      if (layer.category === layerName) {
        // enable drawing tool for type
        layer.setMode('add');
      } else {
        // disables other freehand instances
        layer.setMode('view');
      }
    });
  }
}

export default PolygonDrawControl;
