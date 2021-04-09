import React, { useEffect, useState } from 'react';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import App from '../common/app';
import config from '../../config';
import { useRestApiClient } from '../../context/auth';

const { restApiEndpoint, tileUrlTemplate } = config;

function AoiMap() {
  const { projectId, aoiId } = useParams();
  const [mapRef, setMapRef] = useState(null);
  const tileLayer = `${restApiEndpoint}/api/project/${projectId}/aoi/${aoiId}/tiles/{z}/{x}/{y}`;
  const { restApiClient } = useRestApiClient();

  useEffect(async () => {
    if (!mapRef) return;
    const tileJSON = await restApiClient.getTileJSON(projectId, aoiId);
    const bounds = [
      [tileJSON.bounds[3], tileJSON.bounds[0]],
      [tileJSON.bounds[1], tileJSON.bounds[2]],
    ];
    mapRef.fitBounds(bounds);
  }, [projectId, aoiId, mapRef]);
  const layer = 'naip.latest';

  return (
    <App pageTitle='AOI Map'>
      <PageHeader />
      <PageBody role='main'>
        <MapContainer
          style={{ height: '100%' }}
          whenCreated={(m) => {
            setMapRef(m);
          }}
        >
          <TileLayer url={tileUrlTemplate.replace('{LAYER_NAME}', layer)} />
          <TileLayer attribution='Attribution placeholder' url={tileLayer} />
        </MapContainer>
      </PageBody>
    </App>
  );
}

export default AoiMap;
