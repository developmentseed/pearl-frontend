import { useMapEvent } from 'react-leaflet';
export default function ModalMapEvent(props) {
  const { event, func } = props;
  useMapEvent(event, func);
  return null;
}
