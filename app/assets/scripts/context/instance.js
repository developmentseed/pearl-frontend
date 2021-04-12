import config from '../config';
import logger from '../utils/logger';
import { actions as checkpointActions, checkpointModes } from './checkpoint';
import { actions as aoiPatchActions } from './reducers/aoi_patch';
const { actions: predictionsActions } = require('./reducers/predictions');

export const messageQueueActionTypes = {
  ADD: 'ADD',
  SEND: 'SEND',
};

export const instanceActionTypes = {
  SET_TOKEN: 'SET_TOKEN',
  SET_CONNECTION_STATUS: 'SET_CONNECTION_STATUS',
};

export const instanceInitialState = {
  connected: false,
};

export function instanceReducer(state, action) {
  const { type, data } = action;

  switch (type) {
    case instanceActionTypes.SET_CONNECTION_STATUS: {
      return {
        ...state,
        connected: data,
      };
    }
    default:
      logger('Unexpected instance action type: ', { action });
      throw new Error('Unexpected error.');
  }
}
export class WebsocketClient extends WebSocket {
  constructor({
    token,
    dispatchInstance,
    dispatchCurrentCheckpoint,
    fetchCheckpoint,
    dispatchPredictions,
    dispatchAoiPatch,
  }) {
    super(config.websocketEndpoint + `?token=${token}`);

    this.addEventListener('message', (event) => {
      if (!event.data) {
        logger('Websocket message with no data', event);
        return;
      }

      const { message, data } = JSON.parse(event.data);

      // On connected, request a prediction
      switch (message) {
        case 'info#connected':
          logger('Instance connected.');
          dispatchInstance({
            type: instanceActionTypes.SET_CONNECTION_STATUS,
            data: true,
          });
          break;
        case 'info#disconnected':
          logger('Instance disconnected.');
          dispatchInstance({
            type: instanceActionTypes.SET_CONNECTION_STATUS,
            data: false,
          });
          break;
        case 'model#aoi':
          dispatchCurrentCheckpoint({
            type: checkpointActions.SET_CHECKPOINT,
            data: {
              id: data.checkpoint_id,
              name: data.name,
            },
          });
          dispatchPredictions({
            type: predictionsActions.RECEIVE_AOI_META,
            data: {
              id: data.id,
            },
          });
          break;

        case 'model#checkpoint':
          fetchCheckpoint(data.id);
          break;
        case 'model#prediction':
          dispatchPredictions({
            type: predictionsActions.RECEIVE_PREDICTION,
            data: data,
          });
          break;
        case 'model#prediction#complete':
          dispatchPredictions({
            type: predictionsActions.COMPLETE_PREDICTION,
          });
          dispatchCurrentCheckpoint({
            type: checkpointActions.SET_CHECKPOINT_MODE,
            data: {
              mode: checkpointModes.RETRAIN,
            },
          });
          break;
        case 'model#patch':
          //receive new patch
          dispatchAoiPatch({
            type: aoiPatchActions.START_PATCH,
            data: {
              id: data.id,
            },
          });
          break;
        case 'model#patch#progress':
          //receive image
          break;
        case 'model#patch#complete':
        // finish waiting for patch
        default:
          logger('Unknown websocket message:');
          logger(event);
          break;
      }
    });
  }
}
