import React, { useContext, useMemo, createContext, useState } from 'react';
import T from 'prop-types';

const ProjectContext = createContext(null);

export function ProjectProvider(props) {
  // Current Project object to be set after creation with api response
  const [currentProject, setCurrentProject] = useState(null);

  // Front end state variable. Must be set before creating project
  const [projectName, setProjectName] = useState(null);

  const value = {
    currentProject,
    setCurrentProject,

    projectName,
    setProjectName,
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
  const {
    currentProject,
    setCurrentProject,
    projectName,
    setProjectName,
  } = useProjectContext('useProject');

  return useMemo(
    () => ({
      currentProject,
      setCurrentProject,
      projectName,
      setProjectName,
    }),
    [currentProject, projectName]
  );
};
