import { createMachine, assign } from 'xstate';
import L from 'leaflet';
import { reverseGeocodeLatLng } from '../../utils/reverse-geocode';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfCentroid from '@turf/centroid';
import turfArea from '@turf/area';
import { aoiActionButtonModes } from '../../components/project/prime-panel/tabs/predict/aoi-selector/action-buttons';

/**
 * These are helpers to set context without repetion, mostly used on onEntry
 * actions.
 */
const set = {
  sessionStatusMessage: (sessionStatusMessage) =>
    assign((context) => {
      return {
        ...context,
        sessionStatusMessage,
      };
    }),
};

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdicAOAKz33r6+6cBmAE5AgBoQAE8ba386f1t-f1d-bQTbFPt7AF9MsLQsXEJSChp6JlZ2FlQwEghwgR19JBBkIxN1anMrBHindzprABZrFIH3FOD3azDIhGt7QLptBwHg+zjAl20nbNyMbHxiMipaRmZpCqqaus1bRsNjUw6mrp6+weH-UfHAyembNLok3m2iWvgGtj87h2zT2BUOxROAGEFDgANY0KBsABmLG4sDAqDYHFk8kUahU-Ag9T05haD3anUQtlcK0WzO0A2Sw3cgSmERsvTonNs4O09jSTl87ihORh+QORWO9GRuHR1ExlBxeIJRJkcgUSgpghud2arUejO6LIWS1cHK52h5fJmw20zi29uigXm9kd0Ly+0KRxKdAAonwCRiWLQAO4sAMFaMkIhgAQAZTAeHjsPwSZTDVp5oZzyigRinOGrlckusgVszpsY1iHlca2sHx5tn9OaDCPoABEwFiSmxqG0SGIWABBADyAEkBIixMpUZAWBBUCQ47Hp-OWAAjOR4DQFpp0tpmEuzJzaax0Wy2G-uWzBZLiv6zDL9H4QuIZBJjNssoJgqwZIpcajqpwJDIAIACyMG6jgEGQKe9wXk8oAvLeAz3tWiQvv49hDNWH7trhgzVuk7j+DeD5Abs8q9kqdAAOokG0UFYughIbswLA8SwKjUDgYBiPBiFcNqEDoDGWg0meRaXlhiD+HYfQ+G4iQDE4OlzGRX61s+NEOGs-iAd2THwix-abjGUaznOB7hOum5QFAGIScgnA8PiXBSGhZr0spliqc+d7SrW9i6WpunWE4H4vrYbJ1nYYpOHW2hlpZgbWSGtlbg5e77i5fHuZ5CHeVJ+LcMggXnhaV60QMbosmKAz2PFVbxe4BmuM4P4mf+5lbDlcKKvldlFU5JWucwHnqouy5omuwmiZOjlzXGh54Me8mmg1xYqQgakQnQmlJCyumSvYiXts4ayBFsowuCy7gDGNoF9nQABiNDsOQQkQdNAgyScNASOgq50CBzEhn9Y6wIDyHVJBmKOQgEPoBS7QNPVSmYaFCDgnaQquHW4rtmWvJkTe35PYkWXBMsWTAT2eUnD9mYUKO46ThAqgkKDGj0Fj0Owxz9Bc3gPP-WoE7roLmPUJDOMnno+PBYTXTRW6QRJEZGVOA4ZFBIsPJVg4z69J8XZs1ZE2c9zgNy5QCsC3gQsEhgqAw2IqjcagRAw+zjtS87vPy-zStY2r+2axhlq67EgQGz8Rsm-yCCuMlOl1k4nVfIkQTZLK1DoBAcC0qHYFgIWWuWgQt1ZwQfTBO3Hed-4n1wycZTnBwUkRhA9eJ1eQxkR1gLBCy0TW3arOMblYenOUHCXLUo+Ncd9aDObxu+ra4LmQZrVDKMvpESy5M95LdAqmiUaari+KEhUJIGuSqiQFvR1ExC0o6DRUfCKVsgwvD+AMk4fofhzI5zFF4MsMol7jVrnQAAMugGoUYwAWHYGjbMTFf4hReNKPowDjYDDAR1GiZFtD9QLq9GicxUrxFvivcM-BUBRh3LDPMddFINyvMMUY-Rby8hogMKhzcXRNmZLyIIWUso51cOwtBIgICUCqLmY8LByDoBTPGM4xDtY2A5G8cRvhPjSMSnWIBqx-wPmiKMZBcpl5oMHMOWgkc3YbXnCYy0gwMqAmfOTdOOkYpkTkeTL0SjU7MjUd9REwMoKkGQAEq81Y7yFyevFDYvJU6n3OufTw6Rr6BESSxdinFMSBzmpiQSa0xIZOOrWQU+toi0R8B1FwZFyaAhzpTKhYx6yVMmoVKCm1ZplQWlAFpRMRqOE5BsIIPRHQyJsLyRYgz6zDNBGMzm-0kZA1RtNeZXQgjtJfFk6wHhIoJSznMfqFtJgM3mH4AuBz6DhhIPuMQ0g5ykBgKgFyaYeCoFEiwDM-z8A8XOYgTkuk6DBBItpDKhTHn2GeanV56R06fPtu4760tZZjijorT28LiZTwfKMUyvhggPJdNEe8Dg3AF1bFI3kH1S5AA */
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
        const { mosaicsList, imagerySourcesList } = event.data;
        return {
          ...context,
          imagerySourcesList,
          imagerySourceStatusMessage: 'Select a imagery source',
          mosaicsList,
          mosaicSelector: {
            disabled: false,
            message: 'Select a mosaic',
          },
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

        return {
          mosaicsList,
          imagerySourcesList,
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
