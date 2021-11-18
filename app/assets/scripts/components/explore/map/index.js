import React, { useMemo, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import SizeAwareElement from '../../common/size-aware-element';
import {
  MapContainer,
  ScaleControl,
  TileLayer,
  FeatureGroup,
  ImageOverlay,
  CircleMarker,
} from 'react-leaflet';
import L from 'leaflet';
import {
  ExploreContext,
  useMapState,
  useSessionStatus,
  useShortcutState,
  sessionModes,
} from '../../../context/explore';
import { actions as shortcutActions } from '../../../context/explore/shortcuts';
import { useMapRef, useMapLayers, useUserLayers } from '../../../context/map';

import GeoCoder from '../../common/map/geocoder';
import GenericControl from '../../common/map/generic-control';
import { BOUNDS_PADDING } from '../../common/map/constants';
import {
  MAX_BASE_MAP_ZOOM_LEVEL,
  BaseMapLayer,
} from '../../common/map/base-map-layer';
import CenterMap from '../../common/map/center-map';

import { themeVal, multiply } from '@devseed-ui/theme-provider';
import theme from '../../../styles/theme';
import AoiDrawControl from './aoi-draw-control';
import AoiEditControl from './aoi-edit-control';
import FreehandDrawControl from './freehand-draw-control';
import config from '../../../config';
import { inRange } from '../../../utils/utils';
import { areaFromBounds } from '../../../utils/map';
import {
  useCheckpoint,
  actions as checkpointActions,
} from '../../../context/checkpoint';
import ModalMapEvent from './modal-events';

import GeoJSONLayer from '../../common/map/geojson-layer';
import TileLayerWithHeaders from '../../common/map/tile-layer';
import { useAuth } from '../../../context/auth';
import { useApiLimits, useMosaics } from '../../../context/global';
import { useAoi, useAoiPatch, useAoiName } from '../../../context/aoi';
import {
  actions as predictionActions,
  usePredictions,
} from '../../../context/predictions';
import toasts from '../../common/toasts';
import logger from '../../../utils/logger';
import PolygonDrawControl from './polygon-draw-control';
import OsmQaLayer from '../../common/map/osm-qa-layer';

const center = [38.889805, -77.009056];
const zoom = 12;

const MIN = 4;
const MAX = 3;
const NO_LIVE = 2;
const LIVE = 1;

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

function Map() {
  const {
    aoiArea,
    setAoiArea,
    aoiInitializer,
    setAoiBounds,
    predictions,
    currentProject,
  } = useContext(ExploreContext);

  const { sessionStatus, setSessionStatusMode } = useSessionStatus();

  const { apiLimits } = useApiLimits();
  const {
    aoiRef,
    setAoiRef,
    currentAoi,
    setActiveModal,
    setCurrentAoi,
  } = useAoi();
  const { updateAoiName } = useAoiName();

  const { restApiClient } = useAuth();
  const { aoiPatchList } = useAoiPatch();

  const { mapState, mapModes, setMapMode } = useMapState();

  const { mapRef, setMapRef } = useMapRef();
  const [tileUrl, setTileUrl] = useState(null);
  const { dispatchPredictions } = usePredictions();

  const { mapLayers, setMapLayers } = useMapLayers();
  const { userLayers, setUserLayers } = useUserLayers();

  const { mosaics } = useMosaics();
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const [mostRecentClass, setMostRecentClass] = useState(null);

  const { shortcutState, dispatchShortcutState } = useShortcutState();

  useEffect(() => {
    if (currentCheckpoint && currentCheckpoint.classes) {
      const classList = Object.keys(currentCheckpoint.classes);
      if (classList.length) {
        setMostRecentClass(classList[classList.length - 1]);
      }
    }
  }, [currentCheckpoint]);

  // Manage changes in map mode
  useEffect(() => {
    // Check if map mode changed and disable previous controls
    if (mapState?.previousMode) {
      switch (mapState.previousMode) {
        case mapModes.CREATE_AOI_MODE:
          mapRef.aoi.control.draw.disable();
          break;
        case mapModes.EDIT_AOI_MODE:
          mapRef.aoi.control.edit.disable();
          break;
        case mapModes.ADD_SAMPLE_POLYGON:
          if (shortcutState.overrideBrowseMode) {
            mapRef.polygonDraw?.pause();
          } else if (
            !shortcutState.overrideBrowseMode &&
            mapState.mode === mapModes.BROWSE_MODE
          ) {
            // Keyboard shortcut SPACE will enter override mode when held down
            // On KEYUP, we will dispatch an update to return to previousMode, but overrideBrowseMode
            // will be set to false before the mode update can be dispatched
            // do nothing
          } else if (mapState.mode === mapModes.BROWSE_MODE) {
            mapRef.polygonDraw.disable();
          }
          break;
        case mapModes.DELETE_SAMPLES: {
          mapRef.freehandDraw?.disable();
          break;
        }
        case mapModes.ADD_SAMPLE_FREEHAND: {
          mapRef.freehandDraw?.disable();
        }
      }
    }

    /**
     * The following block enables/disables map edit controls. Ideally we should use
     * previous map mode to disable controls. In a refactor we should move disable actions
     * to the code block above.
     */
    switch (mapState.mode) {
      case mapModes.CREATE_AOI_MODE:
        mapRef.aoi.control.draw.enable();
        mapRef._container.style.cursor = 'crosshair';
        break;
      case mapModes.EDIT_AOI_MODE:
        mapRef.aoi.control.edit.enable(aoiRef);
        break;
      case mapModes.BROWSE_MODE:
        if (mapRef && aoiRef) {
          if (
            mapState.previousMode === mapModes.CREATE_AOI_MODE ||
            mapState.previousMode === mapModes.EDIT_AOI_MODE
          ) {
            mapRef.fitBounds(aoiRef.getBounds(), { padding: BOUNDS_PADDING });
            setSessionStatusMode(sessionModes.SET_AOI);
          }
          mapRef._container.style.cursor = 'grab';
        }
        break;
      case mapModes.ADD_SAMPLE_POINT:
        mapRef._container.style.cursor = 'crosshair';
        break;
      case mapModes.ADD_SAMPLE_POLYGON:
        if (currentCheckpoint?.activeItem) {
          mapRef._container.style.cursor = 'crosshair';
          mapRef.polygonDraw.enable(currentCheckpoint.activeItem);
        }
        break;
      case mapModes.ADD_SAMPLE_FREEHAND:
        if (currentCheckpoint?.activeItem) {
          mapRef._container.style.cursor = 'crosshair';
          mapRef.freehandDraw.enableAdd(currentCheckpoint.activeItem);
        }
        break;
      case mapModes.DELETE_SAMPLES:
        if (currentCheckpoint?.activeItem) {
          mapRef._container.style.cursor = 'grab';
          mapRef.freehandDraw.enableSubtract(currentCheckpoint.activeItem);
        }
        break;
      default:
        mapRef._container.style.cursor = 'grab';
        break;
    }
  }, [
    mapState.mode,
    aoiRef,
    currentCheckpoint && currentCheckpoint.activeItem,
    shortcutState.overrideBrowseMode,
  ]);

  const classLength =
    currentCheckpoint && currentCheckpoint.classes
      ? Object.keys(currentCheckpoint.classes).length
      : 0;
  const id = currentCheckpoint ? currentCheckpoint.id : null;

  // Add polygon layers to be drawn when checkpoint has changed
  useEffect(() => {
    if (!mapRef || !mapRef.freehandDraw) return;
    mapRef.freehandDraw.clearLayers();

    if (currentCheckpoint && currentCheckpoint.classes) {
      mapRef.freehandDraw.setLayers(currentCheckpoint.classes);
      mapRef.freehandDraw.setLayerPolygons(currentCheckpoint.classes);
    }
  }, [mapRef, id, classLength, mostRecentClass]);

  /**
   * Add/update AOI controls on API metadata change.
   */
  useEffect(() => {
    if (!mapRef) return;

    // Setup AOI controllers
    mapRef.aoi = {
      control: {},
    };

    // Draw control, for creating an AOI
    mapRef.aoi.control.draw = new AoiDrawControl(
      mapRef,
      aoiInitializer,
      apiLimits,
      {
        onInitialize: (bbox, shape) => {
          setAoiRef(shape);
          setAoiBounds(shape.getBounds());
          setAoiArea(areaFromBounds(bbox));

          mapRef.fitBounds(shape.getBounds(), { padding: BOUNDS_PADDING });
        },
        onDrawStart: (shape) => {
          setAoiRef(shape);
        },
        onDrawChange: (bbox) => {
          setAoiArea(areaFromBounds(bbox));
        },
        onDrawEnd: (bbox, shape) => {
          const area = areaFromBounds(bbox);

          if (area < config.minimumAoiArea) {
            setActiveModal('area-too-tiny');
            return;
          }

          if (!apiLimits || apiLimits.live_inference > area) {
            const bounds = shape.getBounds();
            setMapMode(mapModes.BROWSE_MODE);
            setAoiBounds(bounds);
            updateAoiName(bounds);

            setAoiRef(shape);
            //Current AOI should only be set after AOI has been sent to the api
            setCurrentAoi(null);
          } else if (apiLimits.max_inference > area) {
            setActiveModal('batch-inference');
          } else {
            setActiveModal('area-too-large');
          }
        },
      }
    );

    // Edit AOI control
    mapRef.aoi.control.edit = new AoiEditControl(mapRef, apiLimits, {
      onBoundsChange: (bbox) => {
        setAoiArea(areaFromBounds(bbox));
      },
    });
  }, [mapRef, aoiInitializer, apiLimits]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update color on area size change during draw
  useEffect(() => {
    if (!aoiRef || !apiLimits) {
      return;
    }

    const { max_inference, live_inference } = apiLimits;

    if (inRange(aoiArea, max_inference, Infinity) && aoiRef.status !== MAX) {
      aoiRef.setStyle({
        color: theme.dark.color.danger,
      });
      aoiRef.status = MAX;
    } else if (
      inRange(aoiArea, 0, config.minimumAoiArea) &&
      aoiRef.status !== MIN
    ) {
      aoiRef.setStyle({
        color: theme.dark.color.danger,
      });
      aoiRef.status = MIN;
    } else if (
      inRange(aoiArea, live_inference, max_inference) &&
      aoiRef.status !== NO_LIVE
    ) {
      aoiRef.setStyle({
        color: theme.dark.color.warning,
      });
      aoiRef.status = NO_LIVE;
    } else if (
      inRange(aoiArea, config.minimumAoiArea, live_inference) &&
      aoiRef.status !== LIVE
    ) {
      aoiRef.setStyle({
        color: theme.dark.color.info,
      });
      aoiRef.status = LIVE;
    }
  }, [aoiArea, apiLimits, aoiRef]);

  useEffect(() => {
    async function updateTileUrl() {
      if (mapRef && currentProject && currentAoi && aoiRef) {
        mapRef.fitBounds(aoiRef.getBounds(), { padding: BOUNDS_PADDING });
        if (!currentAoi.storage) {
          // Do not load tiles when storage is false
          setTileUrl(null);
          return;
        }
        try {
          const tileJSON = await restApiClient.getTileJSON(
            currentProject.id,
            currentAoi.id
          );
          setTileUrl(`${config.restApiEndpoint}${tileJSON.tiles[0]}`);
        } catch (error) {
          logger(error);
          toasts.error('Could not load AOI map');
        }
      }
    }
    updateTileUrl();
  }, [currentAoi, currentProject, mapRef, aoiRef]);

  /**
   * Setup PolygonDrawControl: state of polygon map layers are handled by FreeHandDraw,
   * this will wait for it to be ready before adding PolygonDraw. It also has activeClass
   * as a dependency and will create a new instance when the controller changes.
   */
  const activeClass = currentCheckpoint && currentCheckpoint.activeItem;
  useEffect(() => {
    if (!mapRef || !currentCheckpoint || !mapRef.freehandDraw) return;

    if (!mapRef.polygonDraw) {
      mapRef.polygonDraw = new PolygonDrawControl({
        map: mapRef,
        onDrawFinish: (updatedCheckpoint) => {
          // Update layers on free hand draw
          mapRef.freehandDraw.setLayerPolygons(updatedCheckpoint.classes);

          // Update polygons on state
          dispatchCurrentCheckpoint({
            type: checkpointActions.UPDATE_POLYGONS,
            data: {
              name: updatedCheckpoint.activeItem,
              isCheckpointPolygon: updatedCheckpoint.activeItem.includes(
                'checkpoint'
              ),
              polygons:
                updatedCheckpoint.classes[updatedCheckpoint.activeItem]
                  .polygons,
            },
          });
        },
      });
    }

    mapRef.polygonDraw.setCheckpoint(currentCheckpoint);
  }, [mapRef, currentCheckpoint, activeClass]);

  useEffect(() => {
    if (
      shortcutState.escapePressed &&
      mapRef?.polygonDraw &&
      mapState.mode === mapModes.ADD_SAMPLE_POLYGON
    ) {
      mapRef.polygonDraw._clear();
    }
  }, [mapState.mode, shortcutState.escapePressed, mapRef?.polygonDraw]);

  const displayMap = useMemo(() => {
    return (
      <MapContainer
        tap={false}
        center={center}
        zoom={zoom}
        maxZoom={MAX_BASE_MAP_ZOOM_LEVEL}
        boxZoom={false}
        style={{ height: '100%' }}
        whenCreated={(m) => {
          const freehandDraw = new FreehandDrawControl(m, {
            onUpdate: (name, polygons) => {
              let isCheckpointPolygon;
              if (name.includes('checkpoint')) {
                isCheckpointPolygon = true;
              }
              // Assume class polygon
              dispatchCurrentCheckpoint({
                type: checkpointActions.UPDATE_POLYGONS,
                data: {
                  name,
                  isCheckpointPolygon,
                  polygons: polygons.map((f) => f.geometry),
                },
              });
            },
          });

          m.freehandDraw = freehandDraw;

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
        {mapState.mode === mapModes.ADD_SAMPLE_POINT && (
          <ModalMapEvent
            event='click'
            func={(e) => {
              if (mapState.mode !== mapModes.ADD_SAMPLE_POINT) {
                return;
              }
              const { lat, lng } = e.latlng;
              dispatchCurrentCheckpoint({
                type: checkpointActions.ADD_POINT_SAMPLES,
                data: [[lng, lat]],
              });
            }}
          />
        )}

        <BaseMapLayer />

        {mosaics &&
          mosaics.map((layer) => (
            <TileLayer
              key={layer}
              attribution='&copy; NAIP'
              url={config.tileUrlTemplate.replace('{LAYER_NAME}', layer)}
              minZoom={12}
              maxZoom={20}
              pane='tilePane'
              eventHandlers={{
                add: (v) => {
                  setMapLayers({
                    ...mapLayers,
                    [layer]: {
                      layer: v.target,
                      active: true,
                      name: layer,
                      opacity: 1,
                    },
                  });
                },
              }}
            />
          ))}

        {predictions &&
          predictions.data &&
          predictions.data.predictions &&
          predictions.data.predictions.map((p) => (
            <ImageOverlay
              key={p.key}
              url={p.image}
              bounds={p.bounds}
              opacity={
                userLayers.predictions.visible
                  ? shortcutState.predictionLayerOpacity
                  : 0
              }
            />
          ))}

        {aoiPatchList.map((patch) => {
          // Id format set in context/map.js

          return (
            <React.Fragment key={patch.id}>
              {patch.patches.map((p) => (
                <ImageOverlay
                  key={p.key}
                  url={p.image}
                  bounds={p.bounds}
                  pane='markerPane'
                  opacity={
                    userLayers.refinementsLayer.visible
                      ? userLayers.refinementsLayer.opacity
                      : 0
                  }
                />
              ))}
            </React.Fragment>
          );
        })}

        {currentCheckpoint &&
          currentCheckpoint.retrain_geoms &&
          userLayers.retrainingSamples.active &&
          currentCheckpoint.retrain_geoms
            .filter((geoms, i) => Object.values(currentCheckpoint.classes)[i])
            .map((geoms, i) => (
              <GeoJSONLayer
                key={Object.keys(currentCheckpoint.classes)[i]}
                data={{
                  type: 'Feature',
                  geometry: geoms,
                  properties: {
                    id: currentCheckpoint.id,
                  },
                }}
                style={{
                  stroke: false,
                  fillColor: Object.values(currentCheckpoint.classes)[i].color,
                  fillOpacity: userLayers.retrainingSamples.opacity,
                }}
                opacity={
                  userLayers.retrainingSamples.visible
                    ? userLayers.retrainingSamples.opacity
                    : 0
                }
                pointToLayer={function (feature, latlng) {
                  return L.circleMarker(latlng, {
                    radius: 4,
                  });
                }}
              />
            ))}

        {tileUrl &&
          currentProject &&
          currentCheckpoint &&
          currentAoi &&
          !predictions.fetching && (
            <TileLayerWithHeaders
              url={tileUrl}
              headers={[
                {
                  header: 'Authorization',
                  value: `Bearer ${restApiClient.apiToken}`,
                },
              ]}
              options={{
                pane: 'overlayPane',
                bounds: currentAoi.bounds,
                maxZoom: 20,
              }}
              opacity={
                userLayers.predictions.visible
                  ? shortcutState.predictionLayerOpacity
                  : 0
              }
              eventHandlers={{
                add: () => {
                  if (predictions.isReady() || !predictions.data.predictions) {
                    setUserLayers({
                      ...userLayers,
                      predictions: {
                        ...userLayers.predictions,
                        active: true,
                      },
                    });
                  }
                },
                load: () => {
                  if (predictions.isReady() || !predictions.data.predictions) {
                    setTimeout(() => {
                      dispatchPredictions({
                        type: predictionActions.CLEAR_PREDICTION,
                      });
                    }, 1000);
                  }
                },
                remove: () => {
                  setUserLayers({
                    ...userLayers,
                    predictions: {
                      ...userLayers.predictions,
                      active: false,
                    },
                  });
                },
              }}
            />
          )}

        {currentCheckpoint &&
          currentCheckpoint.classes &&
          Object.values(currentCheckpoint.classes).map(
            (sampleClass) =>
              sampleClass.points &&
              sampleClass.points.coordinates &&
              sampleClass.points.coordinates.map(([lat, lng]) => (
                <CircleMarker
                  key={JSON.stringify([lat, lng])}
                  pathOptions={{
                    color: sampleClass.color,
                  }}
                  eventHandlers={{
                    click: () => {
                      if (mapState.mode === mapModes.DELETE_SAMPLES) {
                        dispatchCurrentCheckpoint({
                          type: checkpointActions.REMOVE_POINT_SAMPLE,
                          data: {
                            className: sampleClass.name,
                            lat,
                            lng,
                          },
                        });
                      }
                    },
                  }}
                  center={[lng, lat]}
                  radius={6}
                />
              ))
          )}

        {!window.Cypress &&
          sessionStatus?.mode === sessionModes.RETRAIN_READY &&
          currentCheckpoint &&
          aoiRef && (
            <OsmQaLayer
              modelClasses={currentCheckpoint.classes}
              aoiRef={aoiRef}
            />
          )}

        <FeatureGroup>
          <GenericControl
            id='layer-control'
            onClick={(e) => {
              e.stopPropagation();
              dispatchShortcutState({
                type: shortcutActions.TOGGLE_LAYER_TRAY,
              });
            }}
          />
          <GeoCoder />
          {aoiRef && <CenterMap aoiRef={aoiRef} />}
        </FeatureGroup>
        <ScaleControl />
      </MapContainer>
    );
  }, [
    mapModes,
    aoiRef,
    currentAoi,
    currentCheckpoint,
    dispatchCurrentCheckpoint,
    userLayers,
    mapLayers,
    mosaics,
    mapState.mode,
    predictions.data.predictions,
    restApiClient,
    setMapLayers,
    setMapRef,
    aoiPatchList,
    tileUrl,
    shortcutState,
  ]);

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
      {displayMap}
    </SizeAwareElement>
  );
}

export default Map;
