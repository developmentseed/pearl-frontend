import React, { createContext, useState } from 'react';
import T from 'prop-types';
import { viewModes } from './constants';

const ExploreContext = createContext({});

export function ExploreProvider(props) {
  const [viewMode, setViewMode] = useState(viewModes.BROWSE_MODE);

  return (
    <ExploreContext.Provider
      value={{
        viewMode,
        setViewMode,
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
