import { useMapEvent } from 'react-leaflet';
export default function ModalMapEvents(props) {
  const { events }  = props;

  Object.entries(events).forEach(([event, func]) => {
    const map = useMapEvent(event, func);
  });
  return null;
}
