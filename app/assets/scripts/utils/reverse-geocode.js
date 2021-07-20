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
    `${config.bingSearchUrl}/Locations/${lat},${lon}?radius=${config.reverseGeocodeRadius}&includeEntityTypes=address,AdminDivision1,AdminDivision2, CountryRegion&key=${config.bingApiKey}`,
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
    const result = address.resourceSets[0].resources[0];
    const { entityType } = result;

    switch (entityType) {
      case 'Address':
        name = result.address.locality;
        break;
      case 'AdminDivision1':
      case 'AdminDivision2':
      case 'CountryRegion':
        name = result.name;
    }
    // Use first result if there are any
  } else {
    toasts.warn('AOI not geocodable, generic name used');
    name = 'Area';
  }
  // else leave name undefined, should be set by user
  return name;
}
