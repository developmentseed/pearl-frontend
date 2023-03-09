import React, { useEffect } from 'react';
import T from 'prop-types';
import { createActorContext } from '@xstate/react';
import { exploreMachine } from './machine';
import { useParams } from 'react-router';
import { machineStateLogger } from '../../utils/machine-state-logger';

import config from '../../config';
const { environment } = config;

export const ExploreMachineContext = createActorContext(exploreMachine);

export function ExploreMachineProvider(props) {
  let { projectId } = useParams();

  return (
    <ExploreMachineContext.Provider
      machine={exploreMachine.withContext({
        project: {
          id: projectId,
        },
      })}
    >
      <MachineStateLogger />
      {props.children}
    </ExploreMachineContext.Provider>
  );
}

ExploreMachineProvider.propTypes = {
  children: T.node,
};

/**
 * This component logs state changes
 */
function MachineStateLogger() {
  const actor = ExploreMachineContext.useActorRef();
  useEffect(() => {
    actor.onTransition(machineStateLogger);
  }, []);
  return <></>;
}
