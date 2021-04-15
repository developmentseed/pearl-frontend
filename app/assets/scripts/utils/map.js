import tArea from '@turf/area';
import tBboxPolygon from '@turf/bbox-polygon';

/**
 * Get area from bbox
 *
 * @param {array} bbox extent in minX, minY, maxX, maxY order
 */
export function areaFromBounds(bbox) {
  const poly = tBboxPolygon(bbox);
  return tArea(poly);
}

