import React, { createContext, useState } from 'react';
import T from 'prop-types';
import { viewModes } from './constants';

const ExploreContext = createContext({});

export function ExploreProvider(props) {
  const [viewMode, setViewMode] = useState(viewModes.BROWSE_MODE);
  const [aoi, setAoi] = useState(null);

  return (
    <ExploreContext.Provider
      value={{
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

export default ExploreContext;
