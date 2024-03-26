import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PageHeader from '../common/page-header';
import toasts from '../common/toasts';
import { PageBody } from '../../styles/page';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';

import { getMosaicTileUrl } from '../../utils/mosaics';
import { toTitleCase } from '../../utils/format';
import { composeMosaicName } from '../../utils/mosaics';
import { Accordion, AccordionFold as BaseFold } from '@devseed-ui/accordion';
import ClassAnalyticsChart from '../project/sec-panel/class-analytics-chart';
import { round } from '../../utils/format';

import { useParams } from 'react-router-dom';
import App from '../common/app';
import {
  MAX_BASE_MAP_ZOOM_LEVEL,
  BaseMapLayer,
} from '../common/map/base-map-layer';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockFooter,
  PanelBlockBody,
} from '../common/panel-block';
import DetailsList from '../common/details-list';
import { BOUNDS_PADDING } from '../common/map/constants';
import config from '../../config';
import { useAuth } from '../../context/auth';
import logger from '../../utils/logger';
import {
  Class,
  Thumbnail as ClassThumbnail,
  ClassHeading,
} from '../project/prime-panel/retrain-refine-styles';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { DownloadAoiButton } from '../profile/project/batch-list';
import LayersPanel from './layers-control';
import GenericControl from '../common/map/generic-control';

const { restApiEndpoint } = config;

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
  ${Heading} {
    margin: 0;
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
    gap: 0 ${glsp(0.5)};
    padding: 0;
    min-height: 0;
  }
  ${ClassHeading} {
    white-space: normal;
    font-size: 0.875rem;
  }
  ${ClassThumbnail} {
    width: ${glsp(0.875)};
    height: ${glsp(0.875)};
    border: 1px solid ${themeVal('color.baseAlphaD')};
  }
`;

const AccordionFold = styled(BaseFold)`
  header {
    a {
      padding: ${glsp(0.5)} 0;
      &:active {
        transform: none;
      }
    }
  }
  > div {
    overflow: visible;
    & > div {
      padding: 1rem 2rem;
      margin: 0 -2rem;
    }
  }
`;

const INITIAL_MAP_LAYERS = {
  mosaic: {
    id: 'mosaic',
    name: 'Mosaic',
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
  const [mosaicUrl, setMosaicUrl] = useState(null);

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

    restApiClient.get(`share/${uuid}`).then((aoiData) => {
      setClasses(aoiData.classes);
      setAoiInfo({
        id: aoiData.aoi_id,
        projectId: aoiData.project_id,
        timeframe_id: aoiData.timeframe_id,
        ...aoiData,
      });
      setMosaicUrl(getMosaicTileUrl(aoiData.mosaic));
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
          timeframeId={aoiInfo?.timeframe_id}
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
          whenCreated={(m) => {
            m.attributionControl.setPrefix('');
            setMapRef(m);
          }}
        >
          <BaseMapLayer />
          {mosaicUrl && aoiInfo.mosaic && (
            <TileLayer
              url={mosaicUrl}
              attribution={toTitleCase(
                `${aoiInfo.mosaic?.params.collection.replace(
                  /-/g,
                  ' '
                )} | Microsoft Planetary Computer`
              )}
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
        {aoiInfo.mosaic && (
          <AOIPanel>
            <Accordion
              className='aoi__panel'
              foldCount={1}
              initialState={[true]}
            >
              {({ checkExpanded, setExpanded }) => (
                <AccordionFold
                  title={aoiInfo.aoi.name}
                  isFoldExpanded={checkExpanded(0)}
                  setFoldExpanded={(v) => setExpanded(0, v)}
                  content={
                    <DetailsList
                      styles={{
                        fontSize: '0.875rem',
                        gridTemplateColumns: 'minmax(0,3fr) minmax(0,4fr)',
                      }}
                      details={{
                        'Imagery source': toTitleCase(
                          aoiInfo.mosaic?.params.collection.replace('-', ' ')
                        ),
                        Mosaic: composeMosaicName(
                          aoiInfo.mosaic.mosaic_ts_start,
                          aoiInfo.mosaic.mosaic_ts_end
                        ),
                        Model: aoiInfo.model.name,
                        Checkpoint: aoiInfo.checkpoint.name,
                      }}
                    />
                  }
                />
              )}
            </Accordion>
            <PanelBlockBody>
              {Object.keys(aoiInfo.timeframe.px_stats).length ? (
                <ClassAnalyticsChart
                  checkpoint={{
                    ...aoiInfo.timeframe,
                    analytics: Object.keys(classes).map((_, ind) => ({
                      px_stat: aoiInfo.timeframe.px_stats[ind],
                    })),
                  }}
                  totalArea={aoiInfo.bounds.bounds}
                  label='Checkpoint Class Distribution'
                  metric='px_stat'
                  formatter={(v) => `${round(v * 100, 0)}%`}
                />
              ) : classes.length > 1 ? (
                classes.map((c) => (
                  <Class key={c.name} noHover>
                    <ClassThumbnail color={c.color} />
                    <ClassHeading size='xsmall'>{c.name}</ClassHeading>
                  </Class>
                ))
              ) : (
                [1, 2, 3].map((a) => (
                  <Class
                    key={a}
                    placeholder={+true}
                    className='placeholder-class'
                  >
                    <ClassThumbnail />
                    <ClassHeading size='xsmall' placeholder={+true} />
                  </Class>
                ))
              )}
            </PanelBlockBody>
          </AOIPanel>
        )}
      </PageBody>
    </App>
  );
}

export default ShareMap;
