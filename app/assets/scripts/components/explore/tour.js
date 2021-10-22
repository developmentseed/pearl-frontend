export const tourSteps = [
  {
    title: 'Welcome to Pearl',
    target: '#welcome-trigger',
    content:
      'PEARL allows you to make a landcover map in minutes. Select an area of interest, choose a machine learning model, and click "Run" to get predictions. You can then retrain models to suit your needs. Click "Show me more" to view guidance, or "Skip" if you want to skip the introduction and jump right in.',
    media: '/assets/graphics/content/guide-aoi.png',
    disableBeacon: true,
    placement: 'center',
    spotlightClicks: true,
  },
  {
    title: 'Select model',
    target: '#select-model-trigger',
    content:
      'Land cover segmentation models are recommended for you based on your selected region. To see details about the model selected or to choose a different model, click the model swap icon to view available model information.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Select area',
    target: '#edit-aoi-trigger',
    content: `Select an area of interest to run the model. Click the pencil icon to start drawing on the map, then click the ✔ to confirm. Areas must be under {LIVE_INFERENCE_MAX_AREA} km² to retrain models, and under {INFERENCE_MAX_AREA} km² total to run inference.`,
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Upload area',
    target: '#upload-aoi-modal-button',
    content: `You can also upload an area in a .geojson file.`,
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Apply Model',
    target: '#apply-button-trigger',
    content:
      'Run the model over your selected area of interest to infer land cover classes.',
    disableBeacon: true,
    placement: 'right-end',
    spotlightClicks: true,
  },
  {
    title: 'Retrain Model',
    target: '#retrain-tab-trigger',
    content:
      'After running the model, use the retraining tools to update your model. Select points or draw polygons to identify pixels to reclassify with alternate classes.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Refine Results',
    target: '#refine-tab-trigger',
    content:
      'After running inference, use the refinement tools to change classes directly on your map. Fill in specified areas with a single class, or select a previous model checkpoint to run inference in your drawn area with an alternate trained model checkpoint.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Layer controls',
    target: '#layer-control',
    content:
      'View available base imagery layers and modify the inference layer opacity.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Export',
    target: '#export-options-trigger',
    content:
      'Export results as a .geotiff, or generate a URL to share with anyone on the web.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
];
