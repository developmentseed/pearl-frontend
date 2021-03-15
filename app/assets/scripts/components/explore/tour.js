export const tourSteps = [
  {
    title: 'Select area',
    target: '#edit-aoi-trigger',
    content: `Select an area of interest to run the model. Click the pencil icon to start drawing on the map, then click the ✔ to confirm. Areas must be under {LIVE_INFERENCE_MAX_AREA} km² to retrain models, and under {INFERENCE_MAX_AREA} km² total to run inference.`,
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Select model',
    target: '#select-model-trigger',
    content:
      'Land cover segmentation models are selected for you by default according to your selected region. To see details about the model selected or to choose a different model, click the model swap icon to view available model information.',
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
      'After running the model, use the retraining tools to update your model. Select points or draw polygons to identify pixels to reclassify with alternate classses.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Refine Results',
    target: '#refine-tab-trigger',
    content:
      'After running inference, use the refinment tools to change classes directly on your map. Fill in specified areas with a single class, or select a previous model checkpoint to  Select points or draw polygons to identify pixels to reclassify with alternate classses.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Layer controls',
    target: '#layers-tab-trigger',
    content:
      'View available base imagery layers and modify the inference layer opacity.',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
];
