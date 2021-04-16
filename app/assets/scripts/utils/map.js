import tArea from '@turf/area';
import tBboxPolygon from '@turf/bbox-polygon';
import { saveAs } from 'file-saver';

/**
 * Get area from bbox
 *
 * @param {array} bbox extent in minX, minY, maxX, maxY order
 */
export function areaFromBounds(bbox) {
  const poly = tBboxPolygon(bbox);
  return tArea(poly);
}

export function downloadGeotiff (arrayBuffer, filename) {
  var blob = new Blob([arrayBuffer], {
    type: 'application/x-geotiff',
  });
  saveAs(blob, filename);  
}
