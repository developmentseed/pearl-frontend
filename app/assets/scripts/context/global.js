import React, { createContext, useEffect, useReducer } from 'react';
import T from 'prop-types';
import { initialApiRequestState } from '../reducers/reduxeed';
import {
  createRestApiHealthReducer,
  queryRestApiHealth,
} from '../reducers/api';

const GlobalContext = createContext({});

export function GlobalContextProvider(props) {
  const [restApiHealth, dispatchRestApiStatus] = useReducer(
    createRestApiHealthReducer,
    initialApiRequestState
  );

  useEffect(() => {
    queryRestApiHealth()(dispatchRestApiStatus);
  }, []);

  return (
    <>
      <GlobalContext.Provider
        value={{
          restApiHealth,
        }}
      >
        {props.children}
      </GlobalContext.Provider>
    </>
  );
}

GlobalContextProvider.propTypes = {
  children: T.node,
};

export default GlobalContext;
