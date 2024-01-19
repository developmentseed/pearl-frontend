import { formatTimestampToSimpleUTC } from './dates';

/**
 * Get planetary computer search id for a Sentinel 2 Level2a for a interval
 * and other filters.
 *
 * @param {object} options
 * @param {Date} options.start
 * @param {Date} options.end
 * @returns {string} searchid
 */
export async function getSentinel2PCSearchId({ start, end }) {
  const res = await fetch(
    'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/register',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        'filter-lang': 'cql2-json',
        filter: {
          op: 'and',
          args: [
            { op: '=', args: [{ property: 'collection' }, 'sentinel-2-l2a'] },
            {
              op: 'anyinteracts',
              args: [
                { property: 'datetime' },
                { interval: [start.toISOString(), end.toISOString()] },
              ],
            },
            { op: '<=', args: [{ property: 'eo:cloud_cover' }, 50] },
          ],
        },
        sortby: [{ field: 'datetime', direction: 'desc' }],
      }),
      method: 'POST',
    }
  );

  const { searchid } = await res.json();

  return searchid;
}

/**
 * Generate a mosaic object for Sentinel 2 Level2a to be used in the API.
 *
 * @param {object} options
 * @param {number} options.startTime
 * @param {number} options.endTime
 * @param {number} options.imagerySourceId
 * @returns {object} mosaic
 */
export async function generateSentinel2L2AMosaic({
  startTime,
  endTime,
  imagerySourceId,
}) {
  const baseSentinelMosaic = {
    params: {
      assets: ['B04', 'B03', 'B02', 'B08'],
      rescale: '0,10000',
      collection: 'sentinel-2-l2a',
    },
    imagery_source_id: 2,
    ui_params: {
      assets: ['B04', 'B03', 'B02'],
      collection: 'sentinel-2-l2a',
      color_formula: 'Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35',
    },
  };

  return {
    ...baseSentinelMosaic,
    id: await getSentinel2PCSearchId({
      start: new Date(startTime),
      end: new Date(endTime),
    }),
    imagery_source_id: imagerySourceId,
    name: `Sentinel-2 Level-2A ${formatTimestampToSimpleUTC(
      startTime
    )} - ${formatTimestampToSimpleUTC(endTime)}`,
    mosaic_ts_start: startTime,
    mosaic_ts_end: endTime,
  };
}
