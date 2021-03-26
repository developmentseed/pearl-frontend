import React, { useMemo, useContext, useEffect } from 'react';
import styled from 'styled-components';
import tArea from '@turf/area';
import tBboxPolygon from '@turf/bbox-polygon';
import SizeAwareElement from '../../common/size-aware-element';
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  ImageOverlay,
  Circle,
} from 'react-leaflet';
import GlobalContext from '../../../context/global';
import { ExploreContext, viewModes } from '../../../context/explore';
import { useMap, useMapLayers, usePredictionLayer } from '../../../context/map';

import GeoCoder from '../../common/map/geocoder';
import { BOUNDS_PADDING } from '../../common/map/constants';
import CenterMap from '../../common/map/center-map';

import { themeVal, multiply } from '@devseed-ui/theme-provider';
import theme from '../../../styles/theme';
import AoiDrawControl from './aoi-draw-control';
import AoiEditControl from './aoi-edit-control';
import config from '../../../config';
import { inRange } from '../../../utils/utils';
import { CheckpointContext, actions } from '../../../context/checkpoint';
import ModalMapEvent from './modal-events';

const center = [38.83428180092151, -79.37724530696869];
const zoom = 15;

const MAX = 3;
const NO_LIVE = 2;
const LIVE = 1;

const Container = styled.div`
  height: 100%;
  z-index: 1;

  .leaflet-draw-toolbar,
  .leaflet-draw-actions {
    visibility: hidden;
  }

  .leaflet-top.leaflet-left {
    /* Shift control container vertically */
    top: 7.5vh;
    .leaflet-geosearch-button.active form {
      /* CSS quirk to make input box the right height */
      line-height: 2.5;
    }
    .leaflet-control {
      margin-left: ${multiply(themeVal('layout.space'), 0.5)};
    }

    .leaflet-control.leaflet-draw {
      box-shadow: none;
    }
  }
`;

/**
 * Get area from bbox
 *
 * @param {array} bbox extent in minX, minY, maxX, maxY order
 */
function areaFromBounds(bbox) {
  const poly = tBboxPolygon(bbox);
  return tArea(poly);
}

function Map() {
  const {
    aoiRef,
    previousViewMode,
    setAoiRef,
    aoiArea,
    setAoiArea,
    aoiInitializer,
    setAoiBounds,

    setViewMode,
    viewMode,
    predictions,
    apiLimits,
  } = useContext(ExploreContext);

  const { map, setMap } = useMap();
  const { mapLayers, setMapLayers } = useMapLayers();
  const { predictionLayerSettings } = usePredictionLayer();

  const { mosaicList } = useContext(GlobalContext);
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useContext(
    CheckpointContext
  );

  const { mosaics } = mosaicList.isReady() ? mosaicList.getData() : {};

  const addClassSample = (e) => {
    if (viewMode !== viewModes.ADD_CLASS_SAMPLES) {
      return;
    }
    dispatchCurrentCheckpoint({
      type: actions.ADD_POINT_SAMPLE,
      data: e.latlng,
    });
  };

  useEffect(() => {
    if (!map) return;

    switch (viewMode) {
      case viewModes.CREATE_AOI_MODE:
        map.aoi.control.draw.enable();
        break;
      case viewModes.EDIT_AOI_MODE:
        map.aoi.control.draw.disable();
        map.aoi.control.edit.enable(aoiRef);
        break;
      case viewModes.BROWSE_MODE:
        if (map) {
          if (aoiRef) {
            // Only disable if something has been drawn
            map.aoi.control.draw.disable();
            if (map.aoi.control.edit._shape) {
              map.aoi.control.edit.disable();
            }
            if (
              previousViewMode === viewModes.CREATE_AOI_MODE ||
              previousViewMode === viewModes.EDIT_AOI_MODE
            ) {
              // On confirm, zoom to bounds
              map.fitBounds(aoiRef.getBounds(), { padding: BOUNDS_PADDING });
            }
          }
        }
        break;
      case viewModes.ADD_CLASS_SAMPLES:
        break;
      default:
        break;
    }
  }, [viewMode, aoiRef]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Add/update AOI controls on API metadata change.
   */
  useEffect(() => {
    if (!map) return;

    // Setup AOI controllers
    map.aoi = {
      control: {},
    };

    // Draw control, for creating an AOI
    map.aoi.control.draw = new AoiDrawControl(map, aoiInitializer, apiLimits, {
      onInitialize: (bbox, shape) => {
        setAoiRef(shape);
        setAoiBounds(shape.getBounds());
        setAoiArea(areaFromBounds(bbox));

        map.fitBounds(shape.getBounds(), { padding: BOUNDS_PADDING });
      },
      onDrawStart: (shape) => {
        setAoiRef(shape);
      },
      onDrawChange: (bbox) => {
        setAoiArea(areaFromBounds(bbox));
      },
      onDrawEnd: (bbox, shape) => {
        setAoiRef(shape);
        setAoiBounds(shape.getBounds());
        setViewMode(viewModes.BROWSE_MODE);
      },
    });

    // Edit AOI control
    map.aoi.control.edit = new AoiEditControl(map, apiLimits, {
      onBoundsChange: (bbox) => {
        setAoiArea(areaFromBounds(bbox));
      },
    });
  }, [map, aoiInitializer, apiLimits]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update color on area size change during draw
  useEffect(() => {
    if (!aoiRef) {
      return;
    }

    const { max_inference, live_inference } = apiLimits;

    if (inRange(aoiArea, max_inference, Infinity) && aoiRef.status !== MAX) {
      aoiRef.setStyle({
        color: theme.main.color.danger,
      });
      aoiRef.status = MAX;
    } else if (
      inRange(aoiArea, live_inference, max_inference) &&
      aoiRef.status !== NO_LIVE
    ) {
      aoiRef.setStyle({
        color: theme.main.color.warning,
      });
      aoiRef.status = NO_LIVE;
    } else if (inRange(aoiArea, 0, live_inference) && aoiRef.status !== LIVE) {
      aoiRef.setStyle({
        color: theme.main.color.info,
      });
      aoiRef.status = LIVE;
    }
  }, [aoiArea, apiLimits, aoiRef]);

  const displayMap = useMemo(
    () => (
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%' }}
        whenCreated={(m) => {
          // Add map to state
          setMap(m);

          if (process.env.NODE_ENV !== 'production') {
            // makes map accessible in console for debugging
            window.map = m;
          }
        }}
      >
        {viewMode === viewModes.ADD_CLASS_SAMPLES && (
          <ModalMapEvent event='click' func={addClassSample} />
        )}
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          maxZoom={18}
        />
        {mosaics &&
          mosaics.map((layer) => (
            <TileLayer
              key={layer}
              attribution='&copy; NAIP'
              url={config.tileUrlTemplate.replace('{LAYER_NAME}', layer)}
              minZoom={12}
              maxZoom={18}
              eventHandlers={{
                add: (v) => {
                  setMapLayers({
                    ...mapLayers,
                    [layer]: v.target,
                  });
                },
              }}
            />
          ))}

        {predictions.data.predictions &&
          predictions.data.predictions.map((p) => (
            <ImageOverlay
              key={p.key}
              url={p.image}
              bounds={p.bounds}
              opacity={
                predictionLayerSettings.visible
                  ? predictionLayerSettings.opacity
                  : 0
              }
            />
          ))}

        {currentCheckpoint &&
          currentCheckpoint.classes &&
          Object.values(currentCheckpoint.classes).map(
            (sampleClass) =>
              sampleClass.geometry &&
              sampleClass.geometry.coordinates &&
              sampleClass.geometry.coordinates.map(([lat, lng]) => (
                <Circle
                  key={JSON.stringify([lat, lng])}
                  pathOptions={{
                    color: sampleClass.color,
                  }}
                  eventHandlers={{
                    click: (e) => {
                      e.originalEvent.preventDefault();
                      dispatchCurrentCheckpoint({
                        type: actions.REMOVE_POINT_SAMPLE,
                        data: {
                          className: sampleClass.name,
                          lat,
                          lng,
                        },
                      });
                    },
                  }}
                  center={[lng, lat]}
                  radius={10}
                />
              ))
          )}
        <FeatureGroup>
          <GeoCoder />
          {aoiRef && <CenterMap aoiRef={aoiRef} />}
        </FeatureGroup>
      </MapContainer>
    ),
    [
      viewMode,
      apiLimits,
      mosaics,
      predictions,
      currentCheckpoint,
      predictionLayerSettings,
    ] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <SizeAwareElement
      element={Container}
      id='map'
      data-cy='leaflet-map'
      onChange={() => {
        if (map) {
          map.invalidateSize();
        }
      }}
    >
      {displayMap}
    </SizeAwareElement>
  );
}

export default Map;
