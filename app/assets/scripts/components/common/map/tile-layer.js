import { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

async function fetchImage(url, callback, headers, abort) {
  let _headers = {};
  if (headers) {
    headers.forEach((h) => {
      _headers[h.header] = h.value;
    });
  }
  const controller = new AbortController();
  const signal = controller.signal;
  if (abort) {
    abort.subscribe(() => {
      controller.abort();
    });
  }
  const f = await fetch(url, {
    method: 'GET',
    headers: _headers,
    mode: 'cors',
    signal: signal,
  });

  if (f.status === 200) {
    const blob = await f.blob();
    callback(blob);
  }
}

L.TileLayerWithHeaders = L.TileLayer.extend({
  initialize: function (url, options, headers, abort) {
    L.TileLayer.prototype.initialize.call(this, url, options);
    this.headers = headers;
    this.abort = abort;
  },
  createTile(coords, done) {
    const url = this.getTileUrl(coords);
    const img = document.createElement('img');
    img.setAttribute('role', 'presentation');

    fetchImage(
      url,
      (resp) => {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result;
        };
        reader.readAsDataURL(resp);
        done(null, img);
      },
      this.headers,
      this.abort
    );
    return img;
  },
});

L.tileLayer = function (url, options, headers, abort) {
  return new L.TileLayerWithHeaders(url, options, headers, abort);
};

function TileLayerWithHeaders({ url, headers, options, eventHandlers }) {
  const map = useMap();

  const [layer, setLayer] = useState(null);
  useEffect(() => {
    if (layer) {
      layer.remove();
    }
    const l = L.tileLayer(url, options, headers);

    Object.entries(eventHandlers).forEach(([event, func]) => {
      l.on(event, func);
    })

    l.on('add', () => {
      setLayer(l);
    });

    l.addTo(map);

    return () => {
      l.remove();
    };
  }, [url]);

  return null;
}

export default TileLayerWithHeaders;
