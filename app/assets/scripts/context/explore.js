import React, { createContext, useState, useEffect, useReducer } from 'react';
import T from 'prop-types';
import usePrevious from '../utils/use-previous';
import { initialApiRequestState } from '../reducers/reduxeed';
import { createApiMetaReducer, queryApiMeta } from '../reducers/api';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import toasts from '../components/common/toasts';
import { useHistory } from 'react-router-dom';

/**
 * Explore View Modes
 */
export const viewModes = {
  BROWSE_MODE: 'BROWSE_MODE',
  CREATE_AOI_MODE: 'CREATE_AOI_MODE',
  EDIT_AOI_MODE: 'EDIT_AOI_MODE',
  EDIT_CLASS_MODE: 'EDIT_CLASS_MODE',
};

/**
 * Context & Provider
 */
export const ExploreContext = createContext({});
export function ExploreProvider(props) {
  const history = useHistory();
  const [aoiRef, setAoiRef] = useState(null);
  const [aoiArea, setAoiArea] = useState(null);
  const [aoiBbox, setAoiBbox] = useState(null);
  const [viewMode, setViewMode] = useState(viewModes.BROWSE_MODE);
  const previousViewMode = usePrevious(viewMode);

  const [apiMeta, dispatchApiMeta] = useReducer(
    createApiMetaReducer,
    initialApiRequestState
  );

  // On mount, fetch API metadata
  useEffect(() => {
    showGlobalLoadingMessage('Checking API status...');
    queryApiMeta()(dispatchApiMeta);
  }, []);

  // If API is unreachable, redirect to home
  useEffect(() => {
    if (!apiMeta.isReady()) return;

    hideGlobalLoading();
    if (apiMeta.hasError()) {
      toasts.error('API is unavailable, please try again later.');
      history.push('/');
    }
  }, [apiMeta]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ExploreContext.Provider
      value={{
        apiLimits:
          apiMeta.isReady() && !apiMeta.hasError() && apiMeta.getData().limits,
        previousViewMode,
        viewMode,
        setViewMode,
        aoiRef,
        setAoiRef,
        aoiArea,
        setAoiArea,
      }}
    >
      {props.children}
    </ExploreContext.Provider>
  );
}

ExploreProvider.propTypes = {
  children: T.node,
};
