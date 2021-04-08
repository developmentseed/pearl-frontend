import config from '../config';
import tBboxPolygon from '@turf/bbox-polygon';
import tCentroid from '@turf/centroid';
import toasts from '../components/common/toasts';

/*
 * Reverse geocode using Bing
 *
 * @param bbox - should be turf bbox [minx, miny, maxX, maxY] or polygon feature
 */
export default async function reverseGeoCode(bbox) {
  /*
    if (!aoiBounds) {
      console.error('defined bounds before reverse geocoding')
    }*/

  let center;
  if (Array.isArray(bbox)) {
    // Need to create a polygon
    center = tCentroid(tBboxPolygon(bbox));
  } else {
    // Assume a polygon feature is provided
    center = tCentroid(bbox);
  }

  const [lon, lat] = center.geometry.coordinates;

  const address = await fetch(
    `${config.bingSearchUrl}/Locations/${lat},${lon}?radius=${config.reverseGeocodeRadius}&includeEntityTypes=address&key=${config.bingApiKey}`,
    {
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'cors',
    }
  )
    .then((res) => res.json())
    .catch(() => {
      toasts.error('Error querying address');
      return null;
    });

  let name;
  if (address && address.resourceSets[0].estimatedTotal) {
    // Use first result if there are any
    name = address.resourceSets[0].resources[0].address.locality;
  } else {
    toasts.warn('AOI not geocodable, generic name used');
    name = 'Area';
  }
  // else leave name undefined, should be set by user
  return name;
}
