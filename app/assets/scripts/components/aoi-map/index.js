import React, { useEffect, useState } from 'react';
import PageHeader from '../common/page-header';
import toasts from '../common/toasts';
import { PageBody } from '../../styles/page';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import App from '../common/app';
import config from '../../config';
import { useAuth } from '../../context/auth';

const { restApiEndpoint } = config;

function AoiMap() {
  const { projectId, aoiId } = useParams();
  const [mapRef, setMapRef] = useState(null);
  const { restApiClient } = useAuth();
  const [tileUrl, setTileUrl] = useState(null);

  useEffect(async () => {
    if (!mapRef) return;
    try {
      const tileJSON = await restApiClient.getTileJSON(projectId, aoiId);
      setTileUrl(`${restApiEndpoint}${tileJSON.tiles[0]}`);
      const bounds = [
        [tileJSON.bounds[3], tileJSON.bounds[0]],
        [tileJSON.bounds[1], tileJSON.bounds[2]],
      ];
      mapRef.fitBounds(bounds);
    } catch (error) {
      toasts.error('Could not load AOI map');
    }
  }, [projectId, aoiId, mapRef, tileUrl]);

  let leafletLayer;
  if (tileUrl) {
    leafletLayer = <TileLayer url={tileUrl} />;
  } else {
    leafletLayer = null;
  }

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
          {leafletLayer}
        </MapContainer>
      </PageBody>
    </App>
  );
}

export default AoiMap;
