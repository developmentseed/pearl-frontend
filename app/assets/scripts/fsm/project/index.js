import React, { useEffect } from 'react';
import T from 'prop-types';
import { createActorContext } from '@xstate/react';
import { projectMachine } from './machine';
import { machineStateLogger } from '../../utils/machine-state-logger';

import config from '../../config';
const { environment } = config;

export const ProjectMachineContext = createActorContext(projectMachine);

export function ProjectMachineProvider(props) {
  return (
    <ProjectMachineContext.Provider>
      {environment !== 'production' && <MachineStateLogger />}
      {props.children}
    </ProjectMachineContext.Provider>
  );
}

ProjectMachineProvider.propTypes = {
  children: T.node,
};

/**
 * This component logs state changes
 */
function MachineStateLogger() {
  const actor = ProjectMachineContext.useActorRef();
  useEffect(() => {
    actor.onTransition(machineStateLogger);
  }, []);
  return <></>;
}
