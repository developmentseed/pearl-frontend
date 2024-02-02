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
  Class,
  Thumbnail as ClassThumbnail,
  ClassHeading,
} from '../explore/prime-panel/tabs/retrain-refine-styles';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import { Subheading } from '../../styles/type/heading';
import LayersPanel from '../share-map/layers-control';
import GenericControl from '../common/map/generic-control';
import SideBySideTileLayer from './SideBySideTileLayer';
import DetailsList from '../common/details-list';
import { toTitleCase } from '../../utils/format';
import { downloadShareGeotiff, getShareLink } from '../../utils/share-link';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockFooter,
  PanelBlockBody,
} from '../common/panel-block';

const { restApiEndpoint, tileUrlTemplate } = config;

const AOIPanel = styled(PanelBlock)`
  background: ${themeVal('color.surface')};
  position: absolute;
  bottom: ${glsp(2)};
  right: ${glsp(2)};
  left: ${({ leftPanel }) => leftPanel && glsp(2)};
  padding: ${glsp()} ${glsp(1.5)};
  gap: ${glsp(0.5)};
  z-index: 401;
  width: 22rem;
  overflow: hidden;
  ${PanelBlockHeader} {
    padding: 0;
  }
  ${PanelBlockFooter} {
    padding: 0;
    display: flex;
    justify-content: space-between;
    gap: ${glsp()};
    > * {
      flex: 1;
    }
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
    width: ${glsp(0.875)};
    height: ${glsp(0.875)};
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

const composeMosaicName = (start, end) =>
  `${new Date(start).toLocaleString('default', {
    month: 'short',
  })} - ${new Date(end).toLocaleString('default', {
    month: 'short',
    year: 'numeric',
  })}`;

function CompareMap() {
  const { leftUUID, rightUUID } = useParams();
  const [mapRef, setMapRef] = useState(null);
  const { restApiClient } = useAuth();
  const [tileUrls, setTileUrls] = useState([]);
  const [mapLayers, setMapLayers] = useState(INITIAL_MAP_LAYERS);
  const [showLayersControl, setShowLayersControl] = useState(false);
  const [aoiClasses, setAoiClasses] = useState([]);
  const [aoisInfo, setAoisInfo] = useState([]);
  const { mosaics } = useMosaics();
  const mosaic = mosaics && mosaics.length > 0 ? mosaics[0] : null;

  useEffect(() => {
    if (!mapRef) return;
    const fetchDataForUUID = async (uuid) => {
      try {
        const [tileJSON, aoiData] = await Promise.all([
          restApiClient.getTileJSONFromUUID(uuid),
          restApiClient.get(`share/${uuid}`),
        ]);

        const tileUrl = `${restApiEndpoint}${tileJSON.tiles[0]}`;
        setTileUrls((prevTileUrls) => [...prevTileUrls, tileUrl]);
        setAoiClasses((prevClasses) => [...prevClasses, aoiData.classes]);
        setAoisInfo((prevAoiInfo) => [
          ...prevAoiInfo,
          {
            id: aoiData.aoi_id,
            name: aoiData.aoi.name,
            projectId: aoiData.project_id,
            timeframe: aoiData.timeframe_id,
            ...aoiData,
          },
        ]);

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
      } catch (error) {
        logger(error);
        toasts.error('There was an error loading AOI map tiles.');
      }
    };

    [leftUUID, rightUUID].forEach(fetchDataForUUID);
  }, [leftUUID, rightUUID, mapRef]);

  return (
    <App pageTitle='Compare AOI Maps'>
      <PageHeader />
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
          {tileUrls[0] && tileUrls[1] && (
            <SideBySideTileLayer
              leftTile={{ url: tileUrls[0], attr: '' }}
              rightTile={{
                url: tileUrls[1],
                attr: '',
              }}
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
        {aoisInfo &&
          aoisInfo.map((aoi, i) => (
            <AOIPanel key={aoi.uuid} leftPanel={i === 0}>
              <PanelBlockHeader>
                <Heading size='small'>{aoi.name}</Heading>
                <DetailsList
                  details={{
                    'Imagery source': toTitleCase(
                      aoi.mosaic.params.collection.replace('-', ' ')
                    ),
                    Mosaic: composeMosaicName(
                      aoi.mosaic.mosaic_ts_start,
                      aoi.mosaic.mosaic_ts_end
                    ),
                    Model: 'model name here',
                    Checkpoint: aoi.timeframe.checkpoint_id,
                  }}
                />
              </PanelBlockHeader>
              <PanelBlockBody>
                <Subheading>LULC Classes</Subheading>
                {aoiClasses[i].length > 1
                  ? aoiClasses[i].map((c) => (
                      <Class key={c.name} noHover>
                        <ClassThumbnail color={c.color} />
                        <ClassHeading size='xsmall'>{c.name}</ClassHeading>
                      </Class>
                    ))
                  : [1, 2, 3].map((a) => (
                      <Class
                        key={a}
                        placeholder={+true}
                        className='placeholder-class'
                      >
                        <ClassThumbnail />
                        <ClassHeading size='xsmall' placeholder={+true} />
                      </Class>
                    ))}
              </PanelBlockBody>
              <PanelBlockFooter>
                <Button
                  variation='primary-raised-dark'
                  onClick={() => downloadShareGeotiff(restApiClient, aoi)}
                  useIcon={['download-2', 'after']}
                  title='Download geotiff'
                >
                  Download
                </Button>
                <Button
                  forwardedAs='a'
                  href={getShareLink(aoi)}
                  target='_blank'
                  variation='achromic-plain'
                  useIcon={['expand-top-right', 'after']}
                  title='Visit share'
                >
                  View
                </Button>
              </PanelBlockFooter>
            </AOIPanel>
          ))}
      </PageBody>
    </App>
  );
}

export default CompareMap;