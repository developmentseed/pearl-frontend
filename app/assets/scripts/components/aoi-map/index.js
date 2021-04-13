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
  const [tileUrl, setTileUrl] = useState(null);
  const tileLayer = `${restApiEndpoint}/api/project/${projectId}/aoi/${aoiId}/tiles/{z}/{x}/{y}`;
  const { restApiClient } = useRestApiClient();

  useEffect(async () => {
    if (!mapRef) return;
    const tileJSON = await restApiClient.getTileJSON(projectId, aoiId);
    setTileUrl(`${restApiEndpoint}${tileJSON.tiles[0]}`);
    const bounds = [
      [tileJSON.bounds[3], tileJSON.bounds[0]],
      [tileJSON.bounds[1], tileJSON.bounds[2]],
    ];
    mapRef.fitBounds(bounds);
  }, [projectId, aoiId, mapRef, tileUrl]);
  const layer = 'naip.latest';

  let leafletLayer;
  if (tileUrl) {
    leafletLayer = <TileLayer url={tileUrl} />
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
          <TileLayer attribution='Microsoft Planetary Computer LULC' url={tileLayer} />
        </MapContainer>
      </PageBody>
    </App>
  );
}

export default AoiMap;
