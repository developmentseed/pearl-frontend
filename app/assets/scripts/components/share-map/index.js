import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import PageHeader from '../common/page-header';
import toasts from '../common/toasts';
import { PageBody } from '../../styles/page';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import GlobalContext from '../../context/global';

import { useParams } from 'react-router-dom';
import App from '../common/app';
import {
  MAX_BASE_MAP_ZOOM_LEVEL,
  BaseMapLayer,
} from '../common/map/base-map-layer';
import config from '../../config';
import { useAuth } from '../../context/auth';
import logger from '../../utils/logger';
import { panelSkin } from '../../styles/skins';
import {
  ClassList,
  Class,
  Thumbnail as ClassThumbnail,
  ClassHeading,
} from '../explore/prime-panel/tabs/retrain-refine-styles';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Subheading } from '../../styles/type/heading';
import { DownloadAoiButton } from '../profile/project/batch-list';
import LayersPanel from './layers-control';
import GenericControl from '../common/map/generic-control';

const { restApiEndpoint, tileUrlTemplate } = config;

const DownloadMap = styled.div`
  ${panelSkin};
  position: absolute;
  top: ${glsp(5)};
  right: ${glsp(2)};
  padding: ${glsp(0.75)};
  grid-gap: ${glsp()};
  z-index: 99997;
  overflow: hidden;
`;

const ClassLegend = styled(ClassList)`
  ${panelSkin};
  position: absolute;
  bottom: ${glsp(2)};
  right: ${glsp(2)};
  padding: ${glsp(1.5)};
  grid-gap: ${glsp()};
  z-index: 99997;
  width: 16rem;
  overflow: hidden;

  > ${Heading} {
    padding: 0;
    margin: 0;
  }
  ${Class} {
    grid-template-columns: 1rem minmax(10px, 1fr);
    padding: 0;
    min-height: 0;
  }
  ${ClassHeading} {
    white-space: normal;
  }
  ${ClassThumbnail} {
    width: ${glsp()};
    height: ${glsp()};
    border: 1px solid ${themeVal('color.baseAlphaD')};
  }
`;

const INITIAL_MAP_LAYERS = {
  mosaic: {
    id: 'mosaic',
    name: 'naip.latest',
    opacity: 1,
    visible: true,
    active: true,
  },
  predictions: {
    id: 'predictions',
    name: 'Prediction Results',
    opacity: 1,
    visible: true,
    active: true,
  },
};

function ShareMap() {
  const { uuid } = useParams();
  const [mapRef, setMapRef] = useState(null);
  const { restApiClient } = useAuth();
  const [tileUrl, setTileUrl] = useState(null);
  const [mapLayers, setMapLayers] = useState(INITIAL_MAP_LAYERS);
  const [showLayersControl, setShowLayersControl] = useState(false);
  const [classes, setClasses] = useState([]);
  const [aoiInfo, setAoiInfo] = useState({ id: null, projectId: null });
  const { mosaicList } = useContext(GlobalContext);
  const mosaics = mosaicList.isReady() ? mosaicList.getData().mosaics : null;
  const mosaic = mosaics && mosaics.length > 0 ? mosaics[0] : null;

  useEffect(() => {
    async function fetchData() {
      if (!mapRef) return;
      try {
        const tileJSON = await restApiClient.getTileJSONFromUUID(uuid);
        setTileUrl(`${restApiEndpoint}${tileJSON.tiles[0]}`);
        const bounds = [
          [tileJSON.bounds[3], tileJSON.bounds[0]],
          [tileJSON.bounds[1], tileJSON.bounds[2]],
        ];
        mapRef.fitBounds(bounds);
        const aoiData = await restApiClient.getAOIFromUUID(uuid);
        setClasses(aoiData.classes);
        setAoiInfo({ id: aoiData.aoi_id, projectId: aoiData.project_id });
      } catch (error) {
        logger(error);
        toasts.error('Could not load AOI map');
      }
    }
    fetchData();
  }, [uuid, mapRef, tileUrl]);

  return (
    <App pageTitle='AOI Map'>
      <PageHeader>
        <DownloadAoiButton
          aoi={aoiInfo.id}
          projectId={aoiInfo.projectId}
          restApiClient={restApiClient}
          variation='primary-raised-dark'
        >
          Download map
        </DownloadAoiButton>
      </PageHeader>
      <PageBody role='main'>
        <MapContainer
          style={{ height: '100%' }}
          maxZoom={MAX_BASE_MAP_ZOOM_LEVEL}
          whenCreated={(m) => setMapRef(m)}
        >
          <BaseMapLayer />
          {mosaic && (
            <TileLayer
              url={tileUrlTemplate.replace('{LAYER_NAME}', mosaic)}
              attribution='&copy; NAIP'
              minZoom={12}
              maxZoom={20}
              opacity={mapLayers.mosaic.visible ? mapLayers.mosaic.opacity : 0}
            />
          )}
          {tileUrl && (
            <TileLayer
              url={tileUrl}
              minZoom={12}
              maxZoom={20}
              opacity={
                mapLayers.predictions.visible
                  ? mapLayers.predictions.opacity
                  : 0
              }
            />
          )}
          <FeatureGroup>
            <GenericControl
              id='layer-control'
              onClick={(e) => {
                e.stopPropagation();
                setShowLayersControl(!showLayersControl);
              }}
            />
          </FeatureGroup>
        </MapContainer>
        <LayersPanel
          mapRef={mapRef}
          parentId='layer-control'
          className='padded'
          active={showLayersControl}
          mapLayers={mapLayers}
          setMapLayers={setMapLayers}
        />
        <ClassLegend>
          <Subheading>LULC Classes</Subheading>
          {classes.length > 1
            ? classes.map((c) => (
                <Class key={c.name} noHover>
                  <ClassThumbnail color={c.color} />
                  <ClassHeading size='xsmall'>{c.name}</ClassHeading>
                </Class>
              ))
            : [1, 2, 3].map((i) => (
                <Class
                  key={i}
                  placeholder={+true}
                  className='placeholder-class'
                >
                  <ClassThumbnail />
                  <ClassHeading size='xsmall' placeholder={+true} />
                </Class>
              ))}
        </ClassLegend>
      </PageBody>
    </App>
  );
}

export default ShareMap;
