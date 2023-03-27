import { createMachine, assign, raise } from 'xstate';
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
import { WebsocketClient } from './websocket-client';

export const projectMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QAcBOB7AVmAxgFwFoBbAQxwAsBLAOzADoAFEmAAkthaPQFdq9IAxACU46ADYA3MCxLc85MH0o4SeSumoBtAAwBdRCnSxKajQZAAPRACYA7NbrbrANm0BWe9YCcbgIzbfABoQAE8bWwAOOl9bLwjfPwAWD0TfX0SAXwzgtCxcQlIKGnomVnYWVDASCBCBHX0kEGQjE3VqcysEa21nAGY6ZPjk22c453TgsIRe3qjfazcPeecIu0SvLJyMbHxiMipaRmZpcsrq2s1fBsNjU3bGzu6+gbchj1GI8cTJm16HZw+7l6iQiiUStmSmya23yeyKhwAwgocABrGhQNgAMxY3FgYFQbA4snkijUKn4EDqenMzVubQ6iFiiTotm08T+wK8Xm831CiF62i8dGciW0fxGvnGvVsbky2WheV2hQO9CRuDR1AxlGxuPxhJkcgUSnJgku1yaLTuDIQTJZbN8HPW3K8vKmDuZvS5TK8vgi2lsvoiUNyOwK+2KdAAonx8eiWLQAO4sEP5eMkIhgAQAZTAeGTMPwaYz9RplvpDxsiw9o0W7jcgtBP2mDscsS5bMiiWskrcwYLYfh9AAImBMcU2NRWiQxCwAIIAeQAkgIEWJlCjICwIKgSEnE3OlywAEZyPAaEuNWmtMwVrpLO1OTteAG+pvJNx0P2RCEg149PuKgOKp0AiZxqJqnAkMgAgALJQfqOBgZAF43Ne9ygJ0krAnQcRYd0-j2JKTbeFEETSn8XjAvalFylsgFwsBADqJCtBBmLoAS27MCwHEsCo1A4GAYiwfBXC6hA6AJlo1KXmWN4YTYPT9IM6TvGMEx8ggAJCp8KxkQE-jOG4vQAaGDERkOO4JnGC6LseIRbjuUBQOiInIJwPB4lwUgoRadLyZYvy+jhMyzIkzgyl4ARNm4XJ0DMPoOjM74+qZsLKhZVk2YeR4OVxzmuXB7liXi3DIL5V5WreCyyvFNb1rWcSuogKz9MZ2jaOFZGsv4GzyimSrhoclm7tldm5Y5zAuZqK5rqim78YJM62ZNSYnngZ7SealXlgpd61b09V1g2zUIK8tgDBFbijA6PidUG-X9uZhwAGI0Ow5B8WBY0CBJhw0BI6AbnQA1ARGb2TrAn2IVU4EYrZCAA+g5JtPUFVyehgXNoKdALNYnofNY4UJE2KwfmKnq2L0tbWLpaWDYOUbUCQR5iNIi6kDAqAOVmPCoIJLA5mz+AcQIHPHNzgt8wL5R4sLFLo-5mOdIdCQvGKnV2L60puKTZF0O1nWtT1gr02Dr25hQE5TjOECqCQv0aPQSPA6Dz30C9lufe9ajTlu9uI9QgMo+eeiK2h1rzGrMQrH0Na+D4zhNgK2jxakCyuLKgp+Gb7t0J7eBWz7lB+3beAO-iGCoCDYiqOxqBECDT0ZRbhfe5Ovu2wHSMh1t4dVXtUcfjHnyHT4CfXcRbgOBEESyrPVGzAGzi5y39DRizbMsDBRgsTggtCfkos77Ae-6nL+TITJqED1jopxNEXi2AG0+dh4uuaa1Bsp110oBKbj16JryZpvaQO8IBCQPvLY+6AIEzlloffAV9toY2tO+BwLgAhP3rAsHoes2o-2Nv-PqdEzLAIYJUCAyg7gVCqDUAQFDKAZmPKeDQ+Y4B4ggP3Xad8PBCjFP4FwPp7peBis4f4AQjKz2SAnVYq8hrrxjASNAkBqFtAqLwKkKClbWl6L1XG08CZxCJuMD+boASfklP6RIMxYhOEovIxm0Z+DKMoWothqBNFmlLDo28eicZ4yMasYmZj+Q41lJ6bssdKLuEccBZxeoVFUPwOozx1A6jWG0RHPx+jAnPmMSEt80pH6vDBIKX0xlDpxIjKBWGP0-rOyDkDegbtgG1NUGNQOwcOmh10NwgKnR75zCfi-OwoJ37EVZDhFwwIYgBgFAGaphwRAAEduBwDhhOWA5cBKZgaXQF2LTm4KLoKs9Z2y4w0G2SQXZXTkY9L7tfPy2S9roNxq4BOMonD1iTppAUQoRjjABCMCIcQ2S0QVGQk5ZyNmXOoNc3ZAhK4cRrnXDijdWnQrAGs2FEErk7MEnc3uaMnk7QGYgN5mDPk4J+W+eYn5uhz26npWYvZAFQsZkIXgk4IJJPcekkQglKBSAgHxZEKJmg0DwP05WFKIgjANrFamrUFgJybJKIUei+jpE+LFcKtgln0C5dQHlGI+UpI0AILgcCBAsw4nmSoQqRUyutH4AUl0ZhAtnn0UJ0xZ4sipq8OIfhZ6GtOdyuM5q7hWtgUJAQ1y8C4loU65BPiXl31iP0KKIK7AymBL6-wBibFsmMtYbwEIEhhuNaa9hyTo3WrjWoDMmIdwZgEDgdARBkBs34MmsAwrU2yV8XtN1qdwqeslN66mxF5WfnCunPRoIXAjCrRG3lbiLXpPxTcwSAgXFEBoKoaQeI+AutvKOj1qs9I+uTrMeKgpnzjG7FTWIYb2mbNBo7f6TTXbHMZu+yN-YiUPJJVk2+KtTHqwFF2AM3UC02Nxj+RY4jwT3yyPKagsb4CXj-SqNN4HEAEF+VMAgz9ca4NmPKpwZbnxhtKCcDgYkYwQHwzwzoT9cbgm7ETWIAYITJwCJdcRHgZS0xFBCzFjN6P6jODUVj5KEC+k6p+EU1MfREzBHo4iD8RT+l9LggEZa33isuTqPEBJyjEiNGSI9LGh3ps6PWXwdUKnfKiuyATznwrCeftPT4YIw0JNQHGfcoMixgHk7KroAo2r4yJvjZ8Ccn7J3pQvYE4xPlRSqey9KWKqGOrzGeFg5BO3SGQMcSLkdUgXVFMCMtoLvCUQiMRMEwpuj+NlDEYEcicsM2AiOMctBradwPIuSr1U57MlwosbsMT+OaWuh+bNYpRgimXivXr5tVTfQgqQZA43B5gguolAUrhxGrGin8st0R8Z+mupKVIscw3MVYhieuk0MS8UWkJA7WNfTBScKCD44w569D1uTPjLgqNP0+GGka1kIIrQmvlaaUBfuPD0TPbobIehMusE2VkY6AixX8H8Ho08w0Qw+l9OpiOlzo5sPKhwYp8bSlnjKeYzXP761CjYlIZNZiBeZqzdmnN8Q82ltIIWR9UAM+mDFlk7xOpdkWI2bn-RefUwhALh6pDcuMwLkXDuJcu7lzl+2T8MSkp+BQ8RxnHpcJL0wQ+oXoDt672UFAmXcul7MipqkF0sHuynVZM4SxRl8ZpEwaCV3Iv3dwK9yLWX9mCMIC7D4AY0ohEdT+H4fB8Vkpa66sZXXkL9fAQoaozdtDzhy5BAGd56ei-+jt1pcYOEawghmD0fJQuXG1v5RozGZKou03WDheIM2E4LNOqKMPop4hPB8DMa6EncM1J2-DenKe2P8mkdEam+NXCEU6sRUY5GRP2JdFW7F5zNnbt2XXgUS35h-ifnYcRydnyfmfhW+6sRYdNs84cxE13IH9BI698c-lYocJVccFVZbsDUgDgFq1AMq9b4R80F5VnMXAm8UgW9b0ohYgPgYgZFYhK1kCTkAN11AIfdqZU4Eh-cF9x5bB1VUgDYqZuROo0gE5-Qb9zgWB3tKg8AdwaAh85d8YxQDY4suwCYktWDNJugasP8khn1D86MN0aFyhBsPpIA5dZQLEFgZQ1t6wwQZ0ohQpIkYdkgXAND0D1FLMjx7U9Cd8FMDCw8jDV8vkzC-lVhHAo4fQUhQQ+D0MgA */
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
            target: 'Running prediction',
            actions: 'setCurrentInstance',
          },
          onError: {
            target: 'Prediction ready',
            actions: 'handleInstanceCreationError',
          },
        },
      },

      'Setup instance': {
        invoke: {
          src: 'openWebsocket',
        },
      },

      'Running prediction': {
        on: {
          'model#abort received': 'Prediction is aborted',

          'model#status received': {
            target: 'Running prediction',
            internal: true,
            actions: 'setCurrentInstanceStatus',
          },

          'model#timeframe#complete received': 'Prediction is finished',

          'instance#terminate sent': 'Prediction is aborted',
          'Received checkpoint': {
            target: 'Running prediction',
            internal: true,
            actions: 'setCurrentCheckpoint',
          },
          'Received timeframe': {
            target: 'Running prediction',
            internal: true,
            actions: 'setCurrentTimeframe',
          },

          'Received prediction progress': {
            target: 'Running prediction',
            internal: true,
            actions: 'updateCurrentPrediction',
          },
        },

        invoke: {
          src: 'runPrediction',
        },
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

      'Prediction is finished': {},
      'Prediction is aborted': {},
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
      setCurrentInstance: assign((context, event) => ({
        currentInstance: event.data.instance,
      })),
      setCurrentInstanceStatus: assign((context, event) => ({
        currentInstance: {
          ...context.currentInstance,
          ...event.data,
        },
      })),
      setCurrentCheckpoint: assign((context, event) => ({
        currentCheckpoint: event.data,
      })),
      setCurrentTimeframe: assign((context, event) => ({
        currentTimeframe: event.data,
      })),
      updateCurrentPrediction: assign((context, { data }) => {
        // Get bounds
        let predictions = get(context, 'currentPrediction.predictions', []);

        const [minX, minY, maxX, maxY] = data.bounds;

        // Build prediction object
        predictions = predictions.concat({
          key: predictions.length + 1,
          image: `data:image/png;base64,${data.image}`,
          bounds: [
            [minY, minX],
            [maxY, maxX],
          ],
        });

        return {
          sessionStatusMessage: `Received image ${data.processed} of ${data.total}...`,
          currentPrediction: {
            ...context.currentPrediction,
            processed: data.processed,
            total: data.total,
            predictions,
          },
        };
      }),
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
      runPrediction: (context) => (callback) => {
        const { token } = context.currentInstance;
        const websocket = new WebsocketClient(token);

        websocket.addEventListener('message', (e) => {
          const { message, data } = JSON.parse(e.data);

          switch (message) {
            case 'info#connected':
              // After connection, send a message to the server to request
              // model status
              websocket.sendMessage({
                action: 'model#status',
              });
              break;
            case 'model#status':
              // If not already running or aborting, request prediction
              if (!data.processing && !data.is_aborting) {
                websocket.sendMessage({
                  action: 'model#prediction',
                  data: {
                    aoi_id: context.currentAoi.id,
                    mosaic: context.currentMosaic.id,
                  },
                });
              }
              break;
            case 'model#checkpoint':
              callback({
                type: 'Received checkpoint',
                data: { currentCheckpoint: data },
              });
              websocket.sendMessage({
                action: 'model#status',
              });
              break;
            case 'model#timeframe':
              callback({
                type: 'Received timeframe',
                data,
              });
              break;
            case 'model#prediction':
              callback({
                type: 'Received prediction progress',
                data,
              });
              break;

            default:
              break;
          }
        });
        return () => websocket.close();
      },
    },
  }
);
