import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';

const ProjectContext = createContext(null);

export function ProjectProvider(props) {
  const [currentProject, setCurrentProject] = useState(null);

  const value = {
    currentProject,
    setCurrentProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {props.children}
    </ProjectContext.Provider>
  );
}

ProjectProvider.propTypes = {
  children: T.node,
};

// Check if consumer function is used properly
const useProjectContext = (fnName) => {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <ProjectContext> component's context.`
    );
  }

  return context;
};

export const useProject = () => {
  const { currentProject, setCurrentProject } = useProjectContext('useProject');

  return useMemo(
    () => ({
      currentProject,
      setCurrentProject,
    }),
    [currentProject]
  );
};
