import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import {} from 'leaflet.vectorgrid';
import config from '../../../config';
const { osmQaPbfTilesUrl } = config;

function OsmQaLayer() {
  const map = useMap();
  // const [layer, setLayer] = useState(null);

  useEffect(() => {
    const l = L.vectorGrid
      .protobuf(osmQaPbfTilesUrl, {
        interactive: true,
        vectorTileLayerStyles: {
          osm: (props) => {
            if (props['area'] === 'yes') {
              return {
                weight: 1,
                fillColor: '#9bc2c4',
                fillOpacity: 1,
                fill: true,
              };
            }

            return {
              weight: 0,
              // visibility: 'none',
              fillColor: 'red',
            };
          },
        },
      })
      .on('click', function (e) {
        console.log(e);
        L.DomEvent.stop(e);
      });

    l.on('add', () => {
      // setLayer(l);
    });

    l.addTo(map);

    return () => {
      l.remove();
    };
  }, []);

  return null;
}

export default OsmQaLayer;
