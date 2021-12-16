import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import T from 'prop-types';
import useFetch from '../utils/use-fetch';

const GlobalContext = createContext({});

export function GlobalContextProvider(props) {
  const [tourStep, setTourStep] = useState(0);
  const mosaicMeta = useFetch('mosaic/naip.latest');

  const apiLimits = useFetch('', {
    authRequired: false,
    mutator: (body) => {
      return body && body.limits;
    },
  });

  const mosaicList = useFetch('mosaic', { mutator: (body) => body.mosaics });

  useEffect(() => {
    const visited = localStorage.getItem('site-tour');
    if (visited !== null) {
      setTourStep(Number(visited));
    }
  }, []);

  return (
    <>
      <GlobalContext.Provider
        value={{
          apiLimits:
            apiLimits.isReady && !apiLimits.hasError ? apiLimits.data : null,

          mosaics:
            mosaicList.isReady && !mosaicList.hasError ? mosaicList.data : [],

          tourStep,
          setTourStep,

          mosaicMeta
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

// Check if consumer function is used properly
export const useGlobalContext = (fnName) => {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      `The \`${fnName}\` hook must be used inside the <GlobalContext> component's context.`
    );
  }

  return context;
};

export const useApiLimits = () => {
  const { apiLimits } = useGlobalContext('useApiLimits');

  return useMemo(
    () => ({
      apiLimits,
    }),
    [apiLimits]
  );
};

export const useMosaics = () => {
  const { mosaics, mosaicMeta } = useGlobalContext('useMosaics');

  return useMemo(
    () => ({
      mosaics,
      mosaicMeta
    }),
    [mosaics]
  );
};

export default GlobalContext;
