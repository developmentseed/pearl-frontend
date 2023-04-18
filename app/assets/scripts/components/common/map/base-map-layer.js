import React from 'react';
import { TileLayer } from 'react-leaflet';
import config from '../../../config';

export const MAX_BASE_MAP_ZOOM_LEVEL = 19;

const { mapboxAccessToken } = config;

export const BaseMapLayer = () => (
  <TileLayer
    attribution='<a href="https://www.mapbox.com/about/maps/" target="_blank" title="Mapbox" aria-label="Mapbox" role="listitem">© Mapbox</a> <a href="https://www.openstreetmap.org/about/" target="_blank" title="OpenStreetMap" aria-label="OpenStreetMap" role="listitem">© OpenStreetMap</a> <a class="mapbox-improve-map" href="https://www.mapbox.com/feedback/?owner=derilinx&amp;id=ckpwsqr6b3icr18qifl1h2e1d&amp;access_token=pk.eyJ1IjoiZGVyaWxpbngiLCJhIjoiY2szeTlzbWo2MDV6eDNlcDMxM3dzZXBieiJ9.zPf1iiFilYYwyx6ETNj_8w" target="_blank" title="Improve this map" aria-label="Improve this map" role="listitem">Improve this map</a>'
    url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
    maxZoom={MAX_BASE_MAP_ZOOM_LEVEL}
  />
);
