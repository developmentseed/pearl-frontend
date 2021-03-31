import { useMap, useEffect } from 'react-leaflet';
import * as L from 'leaflet';

function VectorLayer(props) {
  const { url } = props
  const map = useMap();

  useEffect(() => {
    L.vectorGrid.protobuf(url)
       .addTo(map)
  },[])

}
