export function setMapLayerOpacity(map, name, opacity) {
  const layer = getLayerByName(map, name);
  layer.setOpacity(opacity);
}
