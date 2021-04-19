import React from 'react';
import T from 'prop-types';
import tBbox from '@turf/bbox';
import config from '../../../config';
function ProjectMap({ bounds }) {
  let bbox = tBbox(bounds);
  // lat,lng
  bbox = [bbox[1], bbox[0], bbox[3], bbox[2]];
  const src = `https://dev.virtualearth.net/REST/v1/Imagery/Map/AerialWithLabels?mapArea=${bbox.join(
    ','
  )}&key=${config.bingApiKey}`;
  return (
    <div>
      <img src={src} />
    </div>
  );
}

ProjectMap.propTypes = {
  bounds: T.object,
};

export default ProjectMap;
