import React, { useState, useMemo, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { convertArea } from '@turf/helpers';
import tArea from '@turf/area';
import tBboxPolygon from '@turf/bbox-polygon';
import SizeAwareElement from '../../common/size-aware-element';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import GlobalContext from '../../../context/global';
import { ExploreContext, viewModes } from '../../../context/explore';
import { MapContext } from '../../../context/map';

import GeoCoder from '../../common/map/geocoder';
import { themeVal, multiply } from '@devseed-ui/theme-provider';
import FreeDraw, { ALL } from 'leaflet-freedraw';
import AoiDrawControl from './aoi-draw-control';
import AoiEditControl from './aoi-edit-control';
import config from '../../../config';

const center = [38.942, -95.449];
const zoom = 4;
const freeDraw = new FreeDraw({
  mode: ALL,
});

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
  return convertArea(tArea(poly), 'meters', 'kilometers');
}

function Map() {
  const { map, setMap, layerIds, setLayerIds } = useContext(MapContext);
  const {
    apiLimits,
    aoiRef,
    previousViewMode,
    setAoiRef,
    setAoiArea,
    setViewMode,
    viewMode,
  } = useContext(ExploreContext);

  const { mosaicList } = useContext(GlobalContext);

  const { mosaics } = mosaicList.isReady() ? mosaicList.getData() : {};

  useEffect(() => {
    if (!map) return;

    if (previousViewMode === viewModes.EDIT_CLASS_MODE) {
      map.removeLayer(freeDraw);
    }

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
          map.aoi.control.draw.disable();
          map.aoi.control.edit.disable();
          if (
            previousViewMode === viewModes.CREATE_AOI_MODE ||
            previousViewMode === viewModes.EDIT_AOI_MODE
          ) {
            map.fitBounds(aoiRef.getBounds(), { padding: [25, 25] });
          }
        }
        break;
      case viewModes.EDIT_CLASS_MODE:
        map.addLayer(freeDraw);
        break;
      default:
        break;
    }
  }, [viewMode]); // eslint-disable-line react-hooks/exhaustive-deps

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
    map.aoi.control.draw = new AoiDrawControl(map, {
      onDrawChange: (bbox) => {
        setAoiArea(areaFromBounds(bbox));
      },
      onDrawEnd: (bbox, shape) => {
        setAoiRef(shape);
        setViewMode(viewModes.EDIT_AOI_MODE);
      },
    });

    // Edit AOI control
    map.aoi.control.edit = new AoiEditControl(map, {
      onBoundsChange: (bbox) => {
        setAoiArea(areaFromBounds(bbox));
      },
    });
  }, [map, apiLimits]); // eslint-disable-line react-hooks/exhaustive-deps

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
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          maxZoom={11}
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
                  setLayerIds({
                    ...layerIds,
                    [layer]: v.target._leaflet_id,
                  });
                },
              }}
            />
          ))}
        <FeatureGroup>
          <GeoCoder />
        </FeatureGroup>
      </MapContainer>
    ),
    [viewMode, apiLimits, mosaics] // eslint-disable-line react-hooks/exhaustive-deps
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
