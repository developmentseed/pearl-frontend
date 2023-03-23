import { createMachine, assign } from 'xstate';
import L from 'leaflet';
import { reverseGeocodeLatLng } from '../../utils/reverse-geocode';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfCentroid from '@turf/centroid';
import turfArea from '@turf/area';
import { aoiActionButtonModes } from '../../components/project/prime-panel/tabs/predict/aoi-selector/action-buttons';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdicAOAKz33r6+6cBmAE5AgBoQAE9EW1cnOntbABY-VyD-Dy8AXwywtCxcQlIKGnomVnYWVDASCHCBHX0kEGQjE3VqcysEW38ndzprBOttfyTh4PcwyK7A6zptbWt4+etAkYTbJyycjGx8YjIqWkZmaXLK6trNWwbDY1N2xs7u3v7B4dGgwImIm3dtOgSMyGX387kC2nc7gSWyaO3y+yKRwAwgocABrGhQNgAMxY3FgYFQbA4snkijUKn4EDqenMzTubQ6UVcgLm0W0CX8CwhgQ2k2ZfW8TnsSTB9kC9l61hhuV2BQOxToKNwGOoWMouPxhOJMjkCiUlMEVxuTRa9yZXRZgTZrg5XKGYL5PwQi3+-lsQ3sIrs9l8DhlcL2hUO9AAonxCZiWLQAO4sWX5aMkIhgAQAZTAeHjgaz1GTYHqdLNjMeNhW-gB-iGrhi1hWtkS-K69n+UOBPm0Xu0tm0rgDeSDCqOABEwNjimxqK0SGIWABBADyAEkBEixMo0ZAWBBUCQ47H58uWAAjOR4DSFxr01pmUsupwLOgNh-uWzBLkt+xNlb-L0JCFBOKGyeO4-ZygiIZKucahqpwJDIAIACy8E6jg0GQJetw3g8oBPAsCRPjEaRvv43oxE2Dj-J2CSSg4CSchsPRgfCwaKgA6iQrSwdi6BEjuzAsLxLAqNQOBgGISEoVwWoQOgMZaLSV7FreuGIFWth9D4bhpAkTi6b43xTD+cQigBEq8r0mTZLCA7yoi9DDruMZRouS4nuE267lAUCYpJyCcDwBJcFImGmgyKmWGpr6zJCKySpy1h6dYTauLYAJOLy4qgk4zx9tZCaDvZdCOXuLlHseHn8d5vnIf50kEtwyChde5p3j0-50Cy1G+m4WkUWC-Sxd2oqeG+oH5TmEGKiVzmwa57mecwPlqqu67oluIlibO838XGp54OeCkmi1JaqQg6maYlKQsnpTgGRRulPlWto+J+frjdstlTUcABiNDsOQwnQWVK6yUcNASOgm50AVdmQX9U6wIDaFVDBWKuQgEPoJSbT1M1yk4ZFCDrLaAKuJlHrljMFEts4YK9vYaS8py-j+MxhXw5mFCTtOs4QKoJACGD9BY9DsPffQP1c4D-1qDO24C5j1CQzjF56Pj4WE50kpuoEKQrH4gQ5WCFF6Z1vRWt6pEStCE1faxv3Szzct8wLAiEhgqAw2Iqg8agRAw5NDuS07suUPL-N4CQSsq6ouPq4pWGtWdOt0EE+tfBlxuhM6PSuHMkJti2RvaL07Nw4q4YkMeYjSEupAwKgHlpjwqBiSwGa1-gvECPXJxNx3rft+UBJd1SGvYRaNGuI49gz3riW9u4dj9daBlvqXniLG+eWfeBwd0FXNfSIhRicTgHfifkPen7A586qP+QYYnYWT3er7ipWnIgd4N2r4Ny8exQn-H4SEWRrLUHQBAOAdIg5DjAEWTWFoCBfmdCg8uEtjhlA4NJCMEBEFvzOoMb8PY6Dgh7D0HKvhWaDAwQfUopwODnBqAQ5ORNKYEQhDlFs3YWTdGSs6N8s9vCDH-IlGir46HwKVKiVU6pNQEiJOUUk+oKSqEgKw067DC5xByjlBIM8BheAouCV4Iw55-DESKD6Nl97SIADLoGqFGMAFh2Bo2zLZTREUng6NovowxEjvwGOcKzbQgRdLtV4ZsO2diirhn4KgKMB5YZJhTN4rWNgOR9CGCsah9EPB6xpm6JIul-wuDrJQqRRURAQEoJUfALBzwsHIOgFM8YTgZItEMJI-QFgzHcGsQprhvxeE6t2OwPRBmlwidUyCo5xy0GduHbay4ul3gGBlOgkJojjFunpYpadSl6VLndawVTYksWkUiYGsFSDIHWWdWscQBjgkSkbGYRsTHCJZAMBYekvC2DmexTiHi-aLSxEJTa4lHlExWC8dO5y85GICE2d0FYvgQn4TEDwixgUjiciDBaVVlpQFhZ0UEnZKxGyCM8CE3gKI+G2esLsLhBhpBnviyW-0kZA1RiDclakjZ9HdHrM5HhYr+H-hCDwLgqzxBZF6Llh88zHxYH3Ruzch7SE7tfVAgribtTIRE6w11dLBBGYIgaMq-ABG3oqtmlyOaKilngbmYcI4CwNfRRwDYkgOF9GCL5giYgAg2HrLk+luSBGVUfWuLBb7311d3fVSkkF3kBL0kuqUA2DDnoymKLLaLgnFN4ZVB5YBR34CwWwBrBlel0akDkJcNIFuZQGnKJavh5SyEAA */
    predictableActionArguments: true,
    id: 'project-machine',
    initial: 'Page is mounted',

    context: {
      displayGlobalLoading: true,
      mapEventHandlers: {
        dragging: true,
        mousedown: false,
        mouseup: false,
        mousemove: false,
      },
      project: {},
      sessionStatusMessage: 'Loading...',
      aoiStatusMessage: 'Loading...',
      aoiActionButtons: {
        drawNewAoi: aoiActionButtonModes.ACTIVE,
        confirmAoiDraw: aoiActionButtonModes.HIDDEN,
        cancelAoiDraw: aoiActionButtonModes.HIDDEN,
      },
      imagerySourceSelector: {
        message: 'Loading...',
        disabled: true,
      },
      mosaicSelector: {
        message: 'Loading...',
        disabled: true,
      },
      modelSelector: {
        message: 'Loading...',
        disabled: true,
      },
      mosaicsList: [],
      imagerySourcesList: [],
      modelsList: [],
    },

    states: {
      'Page is mounted': {
        on: {
          'Resolve authentication': {
            target: 'Fetch initial data',
            actions: 'setInitialContext',
          },
        },
      },

      'Page is ready': {
        always: [
          {
            target: 'Checking if user is authenticated',
            cond: 'isProjectNew',
          },
          'Loading existing project',
        ],
      },

      'Checking if user is authenticated': {
        always: [
          {
            target: 'Entering new project name',
            cond: 'isAuthenticated',
          },
          'Redirect to home page',
        ],
      },

      'Loading existing project': {},

      'Entering new project name': {
        on: {
          'Set project name': {
            target: 'Define initial AOI',
            actions: 'setProjectName',
          },
        },

        entry: 'initializeNewProject',
      },

      'Redirect to home page': {},

      'Define initial AOI': {
        entry: 'initializeAoiList',

        on: {
          'Clicked draw new AOI button': {
            target: 'Waiting for drag or cancel',
            actions: 'setupNewRectangleAoiDraw',
          },
        },
      },

      'Creating map': {
        on: {
          'Map is created': {
            target: 'Page is ready',
            actions: ['setMapRef', 'toggleGlobalLoading'],
          },
        },
      },

      'Waiting for drag or cancel': {
        on: {
          'Map mousedown': {
            target: 'Drawing AOI by dragging',
            actions: ['startNewRectangleAoiDraw'],
          },
        },
      },

      'Drawing AOI by dragging': {
        on: {
          'Map mousemove': {
            target: 'Drawing AOI by dragging',
            internal: true,
            actions: 'updateRectangleAoiDraw',
          },

          'Map mouseup': {
            target: 'Finish creating AOI',
            actions: ['endNewRectangleAoiDraw'],
          },
          'Clicked cancel AOI draw button': {
            target: 'Define initial AOI',
            actions: 'resetMapEventHandlers',
          },
        },
      },

      'Finish creating AOI': {
        invoke: {
          src: 'geocodeAoi',
          onDone: {
            target: 'Enable Imagery Source Selector',
            actions: 'setCurrentAoiName',
          },
        },
      },

      'Enable Imagery Source Selector': {
        entry: 'enableImagerySourceSelector',

        on: {
          'Imagery Source is selected': {
            target: 'Enable Mosaic Selector',
            actions: 'setCurrentImagerySource',
          },
        },
      },

      'Fetch initial data': {
        invoke: {
          src: 'fetchInitialData',
          onDone: {
            target: 'Creating map',
            actions: 'setInitialData',
          },
          onError: {
            target: 'Redirect to home page',
          },
        },
      },

      'Enable Mosaic Selector': {
        on: {
          'Mosaic is selected': {
            target: 'new state 1',
            actions: 'setCurrentMosaic',
          },
        },
      },

      'new state 1': {},
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAuthenticated: (c) => c.isAuthenticated,
    },
    actions: {
      setInitialContext: assign((context, event) => {
        const { projectId, isAuthenticated, apiClient } = event.data;
        return {
          ...context,
          project: { id: projectId },
          isAuthenticated,
          apiClient,
        };
      }),
      setInitialData: assign((context, event) => {
        const { mosaicsList, imagerySourcesList, modelsList } = event.data;
        return {
          ...context,
          imagerySourcesList,
          mosaicsList,
          modelsList,
        };
      }),
      toggleGlobalLoading: assign((context) => {
        return {
          ...context,
          displayGlobalLoading: !context.displayGlobalLoading,
        };
      }),
      setProjectName: assign((context, event) => {
        const { projectName } = event.data;
        return {
          ...context,
          project: {
            ...context.project,
            name: projectName,
          },
        };
      }),
      setCurrentAoiName: assign((context, event) => {
        const { aoiName } = event.data;
        const { currentAoi } = context;
        return {
          ...context,
          currentAoi: {
            ...currentAoi,
            name: aoiName,
          },
        };
      }),
      setCurrentImagerySource: assign((context, event) => {
        const { imagerySource } = event.data;
        return {
          ...context,
          currentImagerySource: imagerySource,
          mosaicSelector: {
            disabled: false,
            message: 'Select a mosaic',
          },
        };
      }),
      setCurrentMosaic: assign((context, event) => {
        const { mosaic } = event.data;
        return {
          ...context,
          currentMosaic: mosaic,
          modelSelector: {
            disabled: false,
            message: 'Select a model',
          },
        };
      }),
      setMapRef: assign((context, event) => {
        const { mapRef } = event.data;
        return {
          ...context,
          mapRef,
        };
      }),
      initializeNewProject: assign((context) => {
        return {
          ...context,
          sessionStatusMessage: 'Set Project Name',
          imagerySourceSelector: {
            disabled: true,
            message: 'Define AOI first',
          },
          mosaicSelector: {
            disabled: true,
            message: 'Define AOI first',
          },
          modelSelector: {
            disabled: true,
            message: 'Define AOI first',
          },
        };
      }),
      enableImagerySourceSelector: assign((context) => {
        return {
          ...context,
          sessionStatusMessage: 'Select Mosaic & Model',
          imagerySourceSelector: {
            disabled: false,
            message: 'Select Imagery Source ',
          },
        };
      }),
      resetMapEventHandlers: assign((context) => {
        return {
          ...context,
          mapEventHandlers: {
            dragging: true,
          },
        };
      }),
      setupNewRectangleAoiDraw: assign((context) => {
        return {
          ...context,
          mapEventHandlers: {
            dragging: false,
            mousedown: true,
            mouseup: false,
            mousemove: false,
          },
        };
      }),
      startNewRectangleAoiDraw: assign((context, event) => {
        return {
          ...context,
          aoiStatusMessage: 'New AOI',
          mapEventHandlers: {
            dragging: false,
            mousedown: false,
            mouseup: true,
            mousemove: true,
          },
          rectangleAoi: {
            bounds: [event.data.latLng],
          },
        };
      }),
      updateRectangleAoiDraw: assign((context, event) => {
        const boundStart = context.rectangleAoi.bounds[0];
        const boundEnd = event.data.latLng;
        const bounds = [boundStart, boundEnd];

        // Update map layer
        let shape = context.rectangleAoi.shape;
        if (!shape) {
          shape = L.rectangle(bounds, {
            interactive: false,
          }).addTo(context.mapRef);
        } else {
          shape.setBounds(bounds);
        }

        // Calculate area
        const aoiGeojson = turfBboxPolygon(bounds.flat());
        return {
          ...context,
          currentAoi: {
            area: turfArea(aoiGeojson),
            geojson: aoiGeojson,
          },
          mapEventHandlers: {
            dragging: false,
            mousedown: false,
            mouseup: true,
            mousemove: true,
          },
          rectangleAoi: {
            bounds,
            shape,
          },
        };
      }),
      endNewRectangleAoiDraw: assign((context) => {
        // Take rectangle bounds and generate GeoJSON polygon feature
        const aoiGeojson = turfBboxPolygon(context.rectangleAoi.bounds.flat());

        return {
          ...context,
          currentAoi: {
            area: turfArea(aoiGeojson),
            geojson: aoiGeojson,
          },
          mapEventHandlers: {
            dragging: false,
            mousedown: false,
            mouseup: true,
            mousemove: true,
          },
        };
      }),
      initializeAoiList: assign((context) => {
        return {
          ...context,
          sessionStatusMessage: 'Set AOI',
          aoiStatusMessage: 'Draw area on map or upload an AOI geometry',
        };
      }),
    },
    services: {
      fetchInitialData: async (context) => {
        const { apiClient } = context;

        const { mosaics: mosaicsList } = await apiClient.get('mosaic');
        const { imagery_sources: imagerySourcesList } = await apiClient.get(
          'imagery'
        );
        const { models: modelsList } = await apiClient.get('model');

        return {
          mosaicsList,
          imagerySourcesList,
          modelsList,
        };
      },
      geocodeAoi: async (context) => {
        const centroid = turfCentroid(context.currentAoi.geojson);
        const [lng, lat] = centroid.geometry.coordinates;
        const aoiName = await reverseGeocodeLatLng(lng, lat);
        return { aoiName };
      },
    },
  }
);
