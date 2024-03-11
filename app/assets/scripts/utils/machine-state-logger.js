import get from 'lodash.get';

/* eslint-disable no-console */

export function machineStateLogger(s) {
  console.groupCollapsed(
    '%c event',
    'color: gray; font-weight: lighter;',
    s.event.type
  );
  console.log('%c prev state', 'color: #9E9E9E; font-weight: bold;', s.history);
  console.log('%c event', 'color: #03A9F4; font-weight: bold;', s.event);
  console.log('%c next state', 'color: #4CAF50; font-weight: bold;', s);
  console.groupEnd();

  const checkpointList = get(s.context, 'checkpointList', []);
  console.log(`ckpts ${checkpointList?.map((c) => c.id)}`);
  console.log(checkpointList);

  const aoisList = get(s.context, 'aoisList', []);
  console.log(`aois ${aoisList?.map((aoi) => aoi.id)}`);
  console.log(aoisList);

  const timeframesList = get(s.context, 'timeframesList', []);
  console.log(`tmfs ${timeframesList?.map((t) => t.id)}`);
  console.log(timeframesList);

  console.log(
    [
      ['currentCheckpoint.id', 'ckpt'],
      ['currentAoi.id', 'aoi'],
      ['currentTimeframe.id', 'tmf'],
      ['currentMosaic.id', 'msc'],
    ]
      .map(([path, label]) => {
        const value = get(s.context, path);
        return `${label}: ${value}`;
      })
      .join(' | ')
  );
}
