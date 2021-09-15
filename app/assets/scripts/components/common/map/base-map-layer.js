import React from 'react';
import { TileLayer } from 'react-leaflet';

export const MAX_BASE_MAP_ZOOM_LEVEL = 19;

export const BaseMapLayer = () => (
  <TileLayer
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    maxZoom={MAX_BASE_MAP_ZOOM_LEVEL}
  />
);
