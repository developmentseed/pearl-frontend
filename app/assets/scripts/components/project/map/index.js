import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import L from 'leaflet';

import SizeAwareElement from '../../common/size-aware-element';
import {
  ImageOverlay,
  MapContainer,
  TileLayer,
  useMapEvent,
} from 'react-leaflet';

import {
  MAX_BASE_MAP_ZOOM_LEVEL,
  BaseMapLayer,
} from '../../common/map/base-map-layer';

import { themeVal, multiply } from '@devseed-ui/theme-provider';
import { ProjectMachineContext } from '../../../fsm/project';
import get from 'lodash.get';
import { useAuth } from '../../../context/auth';
import TileLayerWithHeaders from '../../common/map/tile-layer';
import config from '../../../config';
import { RETRAIN_MAP_MODES } from '../../../fsm/project/constants';
import FreehandDrawControl from './freehand-draw-control';
import PolygonDrawControl from './polygon-draw-control';
import selectors from '../../../fsm/project/selectors';
import { BOUNDS_PADDING } from '../../common/map/constants';

const center = [19.22819, -99.995841];
const zoom = 12;

const DEFAULT_PREDICTION_LAYER_OPACITY = 0.7;
const MOSAIC_LAYER_OPACITY = 0.8;

const Container = styled.div`
  height: 100%;
  z-index: 1;
  user-select: none;

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

// This component is used to add event handlers to the map
function ModalMapEvent(props) {
  const { event, func } = props;
  useMapEvent(event, func);
  return null;
}

function getEventLatLng(event) {
  const {
    latlng: { lng, lat },
  } = event;
  return [lat, lng];
}

function Map() {
  const { apiToken } = useAuth();

  // Local state
  const [mapRef, setMapRef] = useState();
  const [predictionsOpacity, setPredictionsOpacity] = useState(
    DEFAULT_PREDICTION_LAYER_OPACITY
  );

  // FSM listeners
  const actorRef = ProjectMachineContext.useActorRef();
  const isLoadingMap = ProjectMachineContext.useSelector(
    selectors.isLoadingMap
  );
  const retrainMapMode = ProjectMachineContext.useSelector(
    selectors.retrainMapMode
  );
  const mapEventHandlers = ProjectMachineContext.useSelector(
    selectors.mapEventHandlers
  );
  const currentAoi = ProjectMachineContext.useSelector(selectors.currentAoi);
  const currentPrediction = ProjectMachineContext.useSelector(
    selectors.currentPrediction
  );
  const currentTilejson = ProjectMachineContext.useSelector(
    selectors.currentTilejson
  );
  const mosaicTileUrl = ProjectMachineContext.useSelector(
    selectors.mosaicTileUrl
  );

  // Event handlers
  const handleMouseDown = useCallback(
    (e) => {
      actorRef.send({
        type: 'Map mousedown',
        data: { latLng: getEventLatLng(e) },
      });
    },
    [actorRef]
  );

  const handleMouseUp = useCallback(
    (e) => {
      actorRef.send({
        type: 'Map mouseup',
        data: { latLng: getEventLatLng(e) },
      });
    },
    [actorRef]
  );

  const handleMouseMove = useCallback(
    (e) => {
      actorRef.send({
        type: 'Map mousemove',
        data: { latLng: getEventLatLng(e) },
      });
    },
    [actorRef]
  );

  // Keyboard event handlers
  const onKeyDown = useCallback(
    (e) => {
      // Check if the event target is an input or other focusable element.
      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.tagName === 'SELECT' ||
        e.target.isContentEditable
      ) {
        // If it's an input, textarea, select or contentEditable element, ignore the event.
        return;
      }

      if (e.key === 'a') {
        // On "a" key press, reduce opacity to zero
        setPredictionsOpacity(0);
      } else if (e.key === 's') {
        // On "s" key press, reduce opacity by 10%
        setPredictionsOpacity((prev) => prev - 0.1);
      } else if (e.key === 'd') {
        // On "d" key press, increase opacity by 10%
        setPredictionsOpacity((prev) => prev + 0.1);
      } else if (e.key === 'f') {
        // On "f" key press, increase opacity to 100%
        setPredictionsOpacity(1);
      } else if (e.key === ' ' || e.code === 'Space') {
        // On space keypress, pan map to current aoi bounds
        const aoiShape = currentAoi?.shape;
        if (aoiShape) {
          mapRef.fitBounds(aoiShape.getBounds());
        }
      }
    },
    [mapRef, currentAoi]
  );

  // Set keyboard listeners and their cleanup
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  // Call event when map is created, set keyboard listeners
  useEffect(() => {
    if (isLoadingMap && mapRef) {
      actorRef.send({
        type: 'Map is created',
        data: {
          mapRef,
        },
      });
    }
  }, [mapRef, isLoadingMap]);

  // Enable/disable map drag
  useEffect(() => {
    if (!mapRef) return;

    if (mapEventHandlers.dragging) {
      mapRef.dragging.enable();
    } else {
      mapRef.dragging.disable();
    }
  }, [mapRef, mapEventHandlers.dragging]);

  // Enable/disable map mousedown
  useEffect(() => {
    if (!mapRef) return;

    if (mapEventHandlers.mousedown) {
      mapRef.on('mousedown', handleMouseDown);
    } else {
      mapRef.off('mousedown', handleMouseDown);
    }
  }, [mapRef, mapEventHandlers.mousedown]);

  // Enable/disable map mouseup
  useEffect(() => {
    if (!mapRef) return;

    if (mapEventHandlers.mouseup) {
      mapRef.on('mouseup', handleMouseUp);
    } else {
      mapRef.off('mouseup', handleMouseUp);
    }
  }, [mapRef, mapEventHandlers.mouseup]);

  // Enable/disable map mousemove
  useEffect(() => {
    if (!mapRef) return;

    if (mapEventHandlers.mousemove) {
      mapRef.on('mousemove', handleMouseMove);
    } else {
      mapRef.off('mousemove', handleMouseMove);
    }
  }, [mapRef, mapEventHandlers.mousemove]);

  const timeframeTilejsonUrl = get(currentTilejson, 'tiles[0]');

  return (
    <SizeAwareElement
      element={Container}
      id='map'
      data-cy='leaflet-map'
      onChange={() => {
        if (mapRef) {
          mapRef.invalidateSize();
        }
      }}
    >
      <MapContainer
        tap={false}
        center={center}
        zoom={zoom}
        maxZoom={MAX_BASE_MAP_ZOOM_LEVEL}
        boxZoom={false}
        style={{ height: '100%' }}
        whenCreated={(m) => {
          m.freehandDraw = new FreehandDrawControl(m, {
            onUpdate: (retrainClass, samples) => {
              // Apply class to samples and send to actor
              actorRef.send({
                type: 'Update retrain class samples',
                data: {
                  retrainClass,
                  samples: samples.map((s) => ({
                    ...s,
                    properties: { class: retrainClass },
                  })),
                },
              });
            },
          });

          m.polygonDraw = new PolygonDrawControl({
            map: m,
            onDrawFinish: (newPolygon) => {
              actorRef.send({
                type: 'Add retrain sample',
                data: {
                  sample: newPolygon,
                },
              });
            },
          });

          m.setAoiShapeFromGeojson = (geojson) => {
            const aoiShape = L.geoJSON(geojson, { fillOpacity: 0 });
            aoiShape.addTo(m);
            m.fitBounds(aoiShape.getBounds(), {
              padding: BOUNDS_PADDING,
            });
            return aoiShape;
          };

          // Add map to state
          setMapRef(m);

          if (process.env.NODE_ENV !== 'production') {
            // makes map accessible in console for debugging
            window.map = m;
            if (window.Cypress) {
              window.Cypress.map = m;
            }
          }
        }}
      >
        {retrainMapMode === RETRAIN_MAP_MODES.ADD_POINT && (
          <ModalMapEvent
            event='click'
            func={(e) => {
              if (retrainMapMode !== RETRAIN_MAP_MODES.ADD_POINT) {
                return;
              }
              const { lat, lng } = e.latlng;

              actorRef.send({
                type: 'Add retrain sample',
                data: {
                  sample: {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      coordinates: [lng, lat],
                      type: 'Point',
                    },
                  },
                },
              });
            }}
          />
        )}

        <BaseMapLayer />

        {mosaicTileUrl && (
          <TileLayer
            key={mosaicTileUrl}
            url={mosaicTileUrl}
            opacity={MOSAIC_LAYER_OPACITY}
          />
        )}

        {timeframeTilejsonUrl && (
          <TileLayerWithHeaders
            url={`${config.restApiEndpoint}${timeframeTilejsonUrl}`}
            headers={[
              {
                header: 'Authorization',
                value: `Bearer ${apiToken}`,
              },
            ]}
            opacity={predictionsOpacity}
          />
        )}

        {currentPrediction &&
          currentPrediction.predictions &&
          currentPrediction.predictions.map((p) => (
            <ImageOverlay
              key={p.key}
              url={p.image}
              bounds={p.bounds}
              opacity={predictionsOpacity}
            />
          ))}
      </MapContainer>
    </SizeAwareElement>
  );
}

export default Map;
