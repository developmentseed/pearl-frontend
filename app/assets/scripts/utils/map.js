import tArea from '@turf/area';
import tBboxPolygon from '@turf/bbox-polygon';
import booleanIntersects from '@turf/boolean-intersects';
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

export function downloadGeotiff(arrayBuffer, filename) {
  var blob = new Blob([arrayBuffer], {
    type: 'application/x-geotiff',
  });
  saveAs(blob, filename);
}

/**
 * Verify if a bbox intersects a mapBounds
 *
 * @param {array} bbox extent in minX, minY, maxX, maxY order
 * @param {function} mapBounds Leaflet map bounds
 */
export function bboxIntersectsMapBounds(bbox, mapBounds) {
  if (mapBounds) {
    const mapBoundsPolygon = tBboxPolygon(
      mapBounds
        .toBBoxString()
        .split(',')
        .map((i) => Number(i))
    );
    return booleanIntersects(tBboxPolygon(bbox), mapBoundsPolygon);
  }
  return false;
}

export function aoiBoundsToArray(bounds) {
  // Get bbox polygon from AOI
  const {
    _southWest: { lng: minX, lat: minY },
    _northEast: { lng: maxX, lat: maxY },
  } = bounds;

  return [minX, minY, maxX, maxY];
}
