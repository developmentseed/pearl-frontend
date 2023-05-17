import React from 'react';
import get from 'lodash.get';
import L from 'leaflet';
import GeoJSONLayer from '../../common/map/geojson-layer';
import { SESSION_MODES } from '../../../fsm/project/constants';
import { ProjectMachineContext } from '../../../fsm/project';

const selectors = {
  sessionMode: (state) => state.context.sessionMode,
  retrainSamples: (state) => state.context.retrainSamples,
  retrainClasses: (state) => state.context.retrainClasses,
};

export function RetrainSamples() {
  const sessionMode = ProjectMachineContext.useSelector(selectors.sessionMode);
  const retrainSamples = ProjectMachineContext.useSelector(
    selectors.retrainSamples
  );
  const retrainClasses = ProjectMachineContext.useSelector(
    selectors.retrainClasses
  );

  // Do not render layers if not in retrain mode
  if (sessionMode !== SESSION_MODES.RETRAIN) return null;

  // No retrain samples or classes to render
  if (retrainClasses?.length === 0 || retrainSamples?.length === 0) return null;

  return (
    <>
      {retrainClasses.map((c) => {
        // Get samples for this class
        const samples = retrainSamples.filter(
          (s) => get(s, 'properties.class') === c.name
        );

        // Bypass rendering if no samples
        if (samples.length === 0) return null;

        // Render samples
        return (
          <GeoJSONLayer
            key={c.name}
            data={samples}
            style={{
              stroke: false,
              fillColor: c.color,
            }}
            pointToLayer={function (feature, latlng) {
              return L.circleMarker(latlng, {
                radius: 4,
              });
            }}
          />
        );
      })}
    </>
  );
}

export default RetrainSamples;
