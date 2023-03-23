import { createMachine, assign } from 'xstate';
import L from 'leaflet';
import { reverseGeocodeLatLng } from '../../utils/reverse-geocode';
import turfBboxPolygon from '@turf/bbox-polygon';
import turfCentroid from '@turf/centroid';
import turfArea from '@turf/area';
import { aoiActionButtonModes } from '../../components/project/prime-panel/tabs/predict/aoi-selector/action-buttons';
import config from '../../config';
import get from 'lodash.get';
import { delay } from '../../utils/utils';
import toasts from '../../components/common/toasts';
import { BOUNDS_PADDING } from '../../components/common/map/constants';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYAjADY6AdgCcADmva3AFnvfvAMxubvYANCAAnoj2AKy2dG621m5OwQEuQW4AvlnhaFi4hKQUNPRMrOwsqGAkEBECOvpIIMhGJurU5lYInl50Ad5Oft4e3tZxYZGIbjExdC4uTkveXrba2i7eOXkY2PjEZFS0jMzSldW19Zq2TYbGpp3N3b1u-YPDo+MO4VEICy50GIjeweWwBGLjey2bYtXaFA4lY4AYQUOAA1jQoGwAGYsbiwMCoNgcWTyRRqFT8CANPTmVr3DpdRBOdKA2wZNxeVLaWJOH7TWzeOjspyDXp+cZbXKwgr7YpHego3AY6hYyi4-GE4kyOQKJSUwTXW4tNoPJkIFkAuIcrmc3n8hD2JzaOjeGKxd3BaxO3ww-J7IqHUp0ACifEJmJYtAA7ix-YUoyQiGABABlMB4ONw-CJ5ONOmmxlPGzeFyOH3+T5eSa-NwBF0ZDLrUu2BxSnaywOI+gAETA2NKbGo7RIYhYAEEAPIASQESLEyjRkBYEFQJFjMYnM5YACM5HgNPnmvT2mZiz04kL1nFnd664kAg6nNYhXXRYkWZ4-C4-dmuwq6CRC41FVTgSGQAQAFlwO1HBgMgI87lPR5QG6WwYlcBI3W9Ww6xcGIAlFB0fDmXD7GsZ92RcLwNl-TsEQAgB1Eh2lA7F0CJVdmBYDiWBUagcDAMQoJgrhNQgdBoy0Wlj0LM9UJsdZXgGIZKxfL4a0QAj4k5NY628VsxlbOiAwY4MezXaNIynaddwiFc1ygKBMRE5BOB4AkuCkRCTQZeTLBsb1rDoDZAmfMsNnsJ0HV8eJxkIpwMLcBYnDBEz4XlczLOs7cd3srinJc6C3LEgluGQHyTzNc8XzLOgKxGdTqwdAjgvsAYDIrRK3XSuUg2OCz1xy2y8oc5hnNVOcF3RZd+MEscbLG2M9zwA9pONKqiwUnpS3LUU1LGZqpkdZJnHBTYXGsIIVkWXr-2DAAxGh2HIPjgOGgQJOOGgJHQJc6HjPruzoJ7h1gV64JqECsRshAfvQSkOkaSq5JQgKEHrOJATrAJcMu7QIRSFqBmFcFtCScZtDsWI7rM44wxIHcxGkadSBgVB7NTHhUEElh02Z-AOIEVnTg5vnud5yoCQFqkUb8tHunBDDnE2cZqI8dJrGJtqOocfbupiWnMuOB6MwoIcRzHCBVBIT6NHoeH-sB+6TbN17nrUUcVxtuHqF+xHDz0OXkPNVt7BdKntESqPkkMmJiN8eqQhCJZtDdMYf2lZ26foU28HNj3KC9628FtwkMFQAGxFUdjUCIAG-xzkG3Ytz2rZ9+GA-W4Pqu2sOI88aPn0SQV4+O1wAXZHwBhiFwHGbI3+voBmmekSCjBYnA+aEwohfX2BN+1aXCgQmSkN79GVhWbGo9iOfnXI7X6t1rqgUNrPG+N5fqEZ5mWHXiAQlt4yz3ugQBY4pY73wKfDaqNzT+E2PVewF0eTIKOr8Vqz9-B638AbRewMGDVAgMoB4VQah1AEIQygyZdz7g0FmOABIIA9y2pfCE8RAjpBZMsEEj5joGXiMgzYsxOQxGSq4Jw+CAJhn4ESNAkASEdCqLwGksD5bmkxvEMRARcbJU8ITPkx01iOBZP4Xk9Z3Blnfh2UyX9QzhjkUQxR9DUAqKNAWdR55NHYx0XjfRyRDG-Fqq6RKQQvBAlFGnbIH96J2JkVqeRxD8BKNcdQBo1g1Ehy8QTLROM-EEwCQ6aw+FXSzxBOMAiIQQT2CkcGICUMPpfQdn7P69Bs52PqaoYavt-ZdMDroFh-luhXxdGI2+s9bAPy1sddwdBITR2CGnQi1iZS2KXnQEQABHbgcBoZDlgKXASKYml0Edm0z+6ytk7IOZGGgBySBHJ6QjPp3cz6+SydtBBQooooJ+egxASQdJllwpHcOPhcK1OOFc3ZtzqD3KOQIcuHEq41w4vXdplywDbJhaBO5hzBJPK7sjN5m0hmIC+Ug35aCQgOgcACa6ARinOgMsEIYkL6DpjwOVfZ+Ljn21OS0p2Fzgacu5Xih5BLO4vOJZki+wyFgBASAEdquFIRRxcLSuwCRgWci-F4Fl7KNm8GHKBRJzi0mDIVlpIIHDBTsh0alMEbgHQLBCtRfVdgEpckNZ0vZzs7bfUFec2J6zfWRmdoS6VQcSVwK8bMJwKsxizy8FdS6xFFWTOGNoueKQAg5GlNQMBcA6TCoVB4j56MCCaQQFWkK6x60NvrXYQ15QzgcDEuGCA5a5Xkumb8J0pFcI4ypmMUYLbTjaguHUbtrC0KigBKKNYl1kHJH+AnIUCwoRXUZXYDCkiYlrOBkqdEtyNQEiJJUUkeoKSqEgDOslCAzHCgIu6J0uMnQsgdAO4UQ6dEjuSC+Q18TUCRk3M7XMYB71Wp6C+V4SbVLYRmBq46dYXTzvQg4QUL4vCGpEMQ6oOYDwsHIOgGhyBThQdDsq4K8VFiBG9OsF8X7ErzHYVFcEQx0I1IPRldZfYBy0FbkXBaM5KM1VSAm+s4ceRXVSJdPtzIXz1UGIMWeKQQiER9e9UCpBkBib7prZwYjw6bDWJRbwxEQSunk96IIXCCKGuYqxLEtcxpYl4nNIS+n0aZuCtRUsuN3AE0ZchjB7VhSsvBBRSZ2h0iGsGlZUCi1RoFQmlAbzzwKnzCWPpPwGGibHXdMFJW9YPB1nIjTHjQMAKgxem9BpSXROyU8dtZIad+jum4e4Z0PIx4YMZa6fw3pUhOjrGlKrLtv6-xZmzQknMJbSH5rvVAGXECMsThsGI6xLqqVmE-fwYxRujdxnmibTc84F2HG3b2pdVt-HBGdNOFFh5LGrakV4mwUhR0-LJ6JNjePAxXn-feh8luCxW81itisPxutUqkWYdLAlaVmPMFYhENjFL8MEIDP9V7-yLWOMHB4Ifn1nb2wiSqdGfeTo-QrA2DvDZTmN07-3qvBkIQo5JLjyG-FJw+lToyQRU2KXjDIDpMjOFi1F-aNEVkYsBw4hhSTSGpLuxRDw-QeTrHIoRPRCmEB6VJlTLb2kCkQi0w1mGTW+fQaCN6QESkbzOkmUMF1jhX3a9LKI1NuGsXXL2eKo5d2xgjH6EkKXiwNiEVpa2ZTKr0LpHrGrQ1oq3KB8EsHxKcxAiCmbGZkYLrJMKvSMzmYlXWeTaNdQE1WIzVc7RqS6D1oXSMqieCN0qq+sAs8NqoEo6MieEZfuivTcw2mr-HdkLwUWyzCCO6dIgpiIcJmM7t0QvPB-dWQDgCIhLgsFc9UPAa4aDKIb7G7aswMhzPR1UueOSY-T4kSsYp-gttQnzVkIAA */
    predictableActionArguments: true,
    id: 'project-machine',
    initial: 'Page is mounted',

    context: {
      globalLoading: {
        disabled: true,
      },
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
        placeholderLabel: 'Loading...',
        disabled: true,
      },
      primeButton: {
        label: 'Ready for prediction run',
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
            target: 'Checking if user is authenticated',
            actions: 'setInitialContext',
          },
        },
      },

      'Page is ready': {
        always: [
          {
            target: 'Entering new project name',
            cond: 'isProjectNew',
          },
          'Ready for retrain run',
        ],

        entry: 'disableGlobalLoading',
      },

      'Checking if user is authenticated': {
        always: [
          {
            target: 'Fetch initial data',
            cond: 'isAuthenticated',
          },
          'Redirect to home page',
        ],
      },

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
            actions: ['initializeMap'],
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
            target: 'Enable Model Selector',
            actions: 'setCurrentMosaic',
          },
        },
      },

      'Enable Model Selector': {
        entry: 'enableModelSelector',

        on: {
          'Model is selected': {
            target: 'Prediction ready',
            actions: 'setCurrentModel',
          },
        },
      },

      'Prediction ready': {
        entry: 'enablePredictionRun',

        on: {
          'Prime button pressed': 'Enter prediction run',
        },
      },

      'Enter prediction run': {
        entry: 'enterPredictionRun',
        always: [
          {
            target: 'Creating project',
            cond: 'isProjectNew',
          },
          {
            target: 'Creating AOI',
            cond: 'isAoiNew',
          },
          'Requesting instance',
        ],
      },

      'Creating AOI': {
        invoke: {
          src: 'createAoi',
          onDone: {
            target: 'Requesting instance',
            actions: 'setCurrentAoi',
          },
        },
      },

      'Requesting instance': {
        invoke: {
          src: 'requestInstance',
          onDone: {
            target: 'Setup instance',
          },
          onError: {
            target: 'Prediction ready',
            actions: 'handleInstanceCreationError',
          },
        },
      },

      'Setup instance': {
        invoke: {
          src: 'setupInstance',
          onDone: {
            target: 'Running prediction',
          },
        },
      },

      'Running prediction': {
        always: [
          {
            target: 'Ready for retrain run',
            actions: 'handlePredictionFinish',
          },
        ],
      },

      'Creating project': {
        invoke: {
          src: 'createProject',
          onDone: {
            target: 'Creating AOI',
            actions: 'setProject',
          },
        },
      },

      'Ready for retrain run': {
        entry: 'enterRetrainIsReady',
      },
    },
  },
  {
    guards: {
      isProjectNew: (c) => c.project.id === 'new',
      isAoiNew: (c) => !c.currentAoi.id,
      isAuthenticated: (c) => c.isAuthenticated,
    },
    actions: {
      setInitialContext: assign((context, event) => {
        const { projectId, isAuthenticated, apiClient } = event.data;
        return {
          project: { id: projectId },
          isAuthenticated,
          apiClient,
          globalLoading: {
            disabled: false,
          },
        };
      }),
      setInitialData: assign((context, event) => ({ ...event.data })),
      setProjectName: assign((context, event) => {
        const { projectName } = event.data;
        return {
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
          currentAoi: {
            ...currentAoi,
            name: aoiName,
          },
        };
      }),
      setCurrentImagerySource: assign((context, event) => {
        const { imagerySource } = event.data;
        return {
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
          currentMosaic: mosaic,
        };
      }),
      setCurrentModel: assign((context, event) => ({
        currentModel: event.data.model,
      })),
      setCurrentAoi: assign((context, event) => ({
        currentAoi: event.data.aoi,
      })),
      initializeMap: assign((context, event) => {
        const { mapRef } = event.data;

        const { currentAoi } = context;
        let aoiGeojson;
        let aoiShape;

        // Add currentAoi to map, if it exists
        if (currentAoi && currentAoi.bounds) {
          const aoiGeojson = {
            type: 'Feature',
            properties: {},
            geometry: currentAoi.bounds,
          };
          const aoiShape = L.geoJSON(aoiGeojson).addTo(mapRef);
          mapRef.fitBounds(aoiShape.getBounds(), {
            padding: BOUNDS_PADDING,
          });
        }

        return {
          mapRef,
          currentAoi: currentAoi && {
            ...currentAoi,
            shape: aoiShape,
            geojson: aoiGeojson,
          },
        };
      }),
      setProject: assign((context, event) => ({
        project: event.data.project,
      })),
      initializeNewProject: assign(() => {
        return {
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
            placeholderLabel: 'Define AOI first',
          },
        };
      }),
      enableImagerySourceSelector: assign(() => {
        return {
          sessionStatusMessage: 'Select Mosaic & Model',
          imagerySourceSelector: {
            disabled: false,
            message: 'Select Imagery Source',
          },
        };
      }),
      enableModelSelector: assign(() => ({
        modelSelector: {
          disabled: false,
          placeholderLabel: 'Select Model',
        },
      })),
      enablePredictionRun: assign(() => ({
        sessionStatusMessage: 'Ready for prediction run',
        primeButton: {
          disabled: false,
          label: 'Run Prediction',
        },
      })),
      enterPredictionRun: assign(() => ({
        sessionStatusMessage: 'Running prediction',
        globalLoading: {
          disabled: false,
          message: 'Running prediction',
        },
        primeButton: {
          disabled: false,
          label: 'Run Prediction',
        },
      })),
      resetMapEventHandlers: assign(() => {
        return {
          mapEventHandlers: {
            dragging: true,
          },
        };
      }),
      setupNewRectangleAoiDraw: assign(() => {
        return {
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
      initializeAoiList: assign(() => {
        return {
          sessionStatusMessage: 'Set AOI',
          aoiStatusMessage: 'Draw area on map or upload an AOI geometry',
        };
      }),
      handleInstanceCreationError: assign(() => {
        toasts.error(
          'Could not start instance at the moment, please try again later.'
        );
        return {
          globalLoading: {
            disabled: true,
          },
        };
      }),
      handlePredictionFinish: assign(() => ({
        globalLoading: {
          disabled: true,
        },
      })),
      enterRetrainIsReady: assign(() => ({
        sessionStatusMessage: 'Ready for retrain run',
        primeButton: {
          disabled: false,
          label: 'Retrain Model',
        },
      })),
      disableGlobalLoading: assign(() => ({
        globalLoading: {
          disabled: true,
        },
      })),
    },
    services: {
      fetchInitialData: async (context) => {
        const {
          apiClient,
          project: { id: projectId },
        } = context;

        // Initialize project and aois
        let project;
        let aoisList;
        let timeframesList;
        let checkpointList;
        let currentAoi;
        let currentTimeframe;
        let currentImagerySource;
        let currentMosaic;
        let currentModel;

        // Fetch lists
        const { mosaics: mosaicsList } = await apiClient.get('mosaic');
        const { imagery_sources: imagerySourcesList } = await apiClient.get(
          'imagery'
        );
        const { models: modelsList } = await apiClient.get('model');

        // If project is not new, fetch project data
        if (projectId !== 'new') {
          project = await apiClient.get(`project/${projectId}`);

          currentModel = modelsList.find(
            (model) => model.id === project.model_id
          );

          // Fetch project aois
          aoisList = (await apiClient.get(`project/${projectId}/aoi`)).aois;

          // If there are aois, fetch the first one's timeframes
          if (aoisList.length > 0) {
            currentAoi = aoisList[0];

            timeframesList = (
              await apiClient.get(
                `project/${projectId}/aoi/${currentAoi.id}/timeframe`
              )
            ).timeframes;

            if (timeframesList.length > 0) {
              currentTimeframe = timeframesList[0];
              currentMosaic = mosaicsList.find(
                (mosaic) => mosaic.id === currentTimeframe.mosaic
              );
              currentImagerySource = imagerySourcesList.find(
                (imagerySource) =>
                  imagerySource.id === currentMosaic.imagery_source_id
              );
            }
          }

          // Get project's checkpoints
          checkpointList = (
            await apiClient.get(`project/${projectId}/checkpoint`)
          ).checkpoints;
        }

        return {
          mosaicsList,
          imagerySourcesList,
          modelsList,
          project: project || { id: 'new' },
          aoisList,
          checkpointList,
          timeframesList,
          currentAoi,
          currentTimeframe,
          currentImagerySource,
          currentMosaic,
          currentModel,
        };
      },

      geocodeAoi: async (context) => {
        const centroid = turfCentroid(context.currentAoi.geojson);
        const [lng, lat] = centroid.geometry.coordinates;
        const aoiName = await reverseGeocodeLatLng(lng, lat);
        return { aoiName };
      },
      createProject: async (context) => {
        const {
          apiClient,
          project: { name: projectName },
          currentModel,
        } = context;

        const project = await apiClient.post('project', {
          name: projectName,
          model_id: currentModel.id,
        });

        // Update page URL. For the context of this page, it is ok not to use
        // react-router as we are not keeping track of the project ID in the
        // URL at this point.
        window.history.replaceState(
          null,
          projectName,
          `/project/${project.id}`
        );

        return { project };
      },
      createAoi: async (context) => {
        const { apiClient } = context;
        const { name, geojson } = context.currentAoi;
        const { id: projectId } = context.project;

        const aoi = await apiClient.post(`/project/${projectId}/aoi`, {
          name: name,
          bounds: geojson,
        });

        return { aoi };
      },
      requestInstance: async (context) => {
        const { apiClient } = context;
        const { id: projectId } = context.project;

        let instance;

        // Fetch active instances for this project
        const activeInstances = await apiClient.get(
          `/project/${projectId}/instance/?status=active`
        );

        // Reuse existing instance if available
        if (activeInstances.total > 0) {
          const { id: instanceId } = activeInstances.instances[0];
          instance = await apiClient.get(
            `/project/${projectId}/instance/${instanceId}`
          );
        } else {
          instance = await apiClient.post(`/project/${projectId}/instance`);
        }

        // Confirm instance has running status
        let instanceStatus;
        let creationDuration = 0;
        while (
          !instanceStatus ||
          creationDuration < config.instanceCreationTimeout
        ) {
          // Get instance status
          instanceStatus = await apiClient.get(
            `project/${projectId}/instance/${instance.id}`
          );
          const instancePhase = get(instanceStatus, 'status.phase');

          // Process status
          if (instancePhase === 'Running') {
            break;
          } else if (instancePhase === 'Failed') {
            throw new Error('Instance creation failed');
          }

          // Update timer
          await delay(config.instanceCreationCheckInterval);
          creationDuration += config.instanceCreationCheckInterval;

          // Check timeout
          if (creationDuration >= config.instanceCreationTimeout) {
            throw new Error('Instance creation timeout');
          }
        }

        return { instance };
      },
      setupInstance: async () => {
        return {};
      },
    },
  }
);
