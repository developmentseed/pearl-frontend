import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PageHeader from '../common/page-header';
import toasts from '../common/toasts';
import { PageBody } from '../../styles/page';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { useMosaics } from '../../context/global';

import { useParams } from 'react-router-dom';
import App from '../common/app';
import {
  MAX_BASE_MAP_ZOOM_LEVEL,
  BaseMapLayer,
} from '../common/map/base-map-layer';
import { BOUNDS_PADDING } from '../common/map/constants';
import config from '../../config';
import { useAuth } from '../../context/auth';
import logger from '../../utils/logger';
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

const ClassLegend = styled(ClassList)`
  background: ${themeVal('color.surface')};
  position: absolute;
  bottom: ${glsp(2)};
  right: ${glsp(2)};
  padding: ${glsp(1.5)};
  grid-gap: ${glsp()};
  z-index: 401;
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
  const { mosaics } = useMosaics();
  const mosaic = mosaics && mosaics.length > 0 ? mosaics[0] : null;

  useEffect(() => {
    if (!mapRef) return;
    restApiClient
      .getTileJSONFromUUID(uuid)
      .then((tileJSON) => {
        setTileUrl(`${restApiEndpoint}${tileJSON.tiles[0]}`);
      })
      .catch((error) => {
        logger(error);
        toasts.error('There was an error loading AOI map tiles.');
      });
    restApiClient.getAOIFromUUID(uuid).then((aoiData) => {
      setClasses(aoiData.classes);
      setAoiInfo({ id: aoiData.aoi_id, projectId: aoiData.project_id });
      if (aoiData.bounds && aoiData.bounds.coordinates) {
        const bounds = [
          aoiData.bounds.coordinates[0][0].reverse(),
          aoiData.bounds.coordinates[0][2].reverse(),
        ];
        mapRef.fitBounds(bounds, {
          padding: BOUNDS_PADDING,
          maxZoom: MAX_BASE_MAP_ZOOM_LEVEL,
        });
      }
    });
  }, [uuid, mapRef]);

  return (
    <App pageTitle='AOI Map'>
      <PageHeader>
        <DownloadAoiButton
          aoi={aoiInfo.id}
          projectId={aoiInfo.projectId}
          uuid={uuid}
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
              zIndex={2}
              opacity={mapLayers.mosaic.visible ? mapLayers.mosaic.opacity : 0}
            />
          )}
          {tileUrl && (
            <TileLayer
              url={tileUrl}
              minZoom={12}
              maxZoom={20}
              zIndex={3}
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
