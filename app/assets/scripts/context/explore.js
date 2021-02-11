import React, { createContext, useState } from 'react';
import T from 'prop-types';
import usePrevious from '../utils/use-previous';

/**
 * Explore View Modes
 */
const BROWSE_MODE = 'BROWSE_MODE';
const CREATE_AOI_MODE = 'CREATE_AOI_MODE';
const EDIT_AOI_MODE = 'EDIT_AOI_MODE';
export const viewModes = {
  BROWSE_MODE,
  CREATE_AOI_MODE,
  EDIT_AOI_MODE,
};

/**
 * Context & Provider
 */
export const ExploreContext = createContext({});
export function ExploreProvider(props) {
  const [aoi, setAoi] = useState(null);
  const [viewMode, setViewMode] = useState(viewModes.BROWSE_MODE);
  const previousViewMode = usePrevious(viewMode);

  return (
    <ExploreContext.Provider
      value={{
        previousViewMode,
        viewMode,
        setViewMode,
        aoi,
        setAoi,
      }}
    >
      {props.children}
    </ExploreContext.Provider>
  );
}

ExploreProvider.propTypes = {
  children: T.node,
};
