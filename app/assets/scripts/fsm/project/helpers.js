export function getMosaicTileUrl(mosaic) {
  if (!mosaic) return;
  const mosaicParams = mosaic?.ui_params || mosaic?.params;

  if (!mosaicParams) return;

  const { assets, ...otherParams } = mosaicParams;

  let params = [];

  // The tiler doesn't support array[] notation in the querystring, this will
  // generate a custom notation like 'asset=a&asset=b&asset=c'
  if (Array.isArray(assets)) {
    assets.forEach((a) => params.push(`assets=${a}`));
  } else {
    params.push(`assets=${assets}`);
  }

  // Serialize remaining params
  for (var p in otherParams) params.push(p + '=' + otherParams[p]);

  return `https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/${
    mosaic.id
  }/{z}/{x}/{y}?${params.join('&')}`;
}
