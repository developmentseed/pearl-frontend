import React from 'react';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  ImageOverlay,
  Circle,
} from 'react-leaflet';
import { useParams } from 'react-router-dom';
import App from '../common/app';
import config from '../../config';

const { restApiEndpoint } = config;


function AoiMap() {
  const { projectId, aoiId } = useParams();
  const tileLayer = `${restApiEndpoint}/api/project/${projectId}/aoi/${aoiId}/tiles/{z}/{x}/{y}`;
  const center = [38.83428180092151, -79.37724530696869];
  return (
    <App pageTitle='AOI Map'>
      <PageHeader />
      <PageBody role='main'>
        <MapContainer center={center} zoom={18}>
          <TileLayer
            attribution='Attribution placeholder'
            url={tileLayer}
          />
        </MapContainer>
      </PageBody>
    </App>
  );
}

export default AoiMap;