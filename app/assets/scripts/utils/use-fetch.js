import { useRef } from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';

/**
 * Creates a hook to perform data fetching using restApiClient.
 *
 * @param {string} path URL path to query.
 * @param {object} opts Available options.
 * @param {func}   [opts.authRequired=true] Whether auth is required.
 * @param {func}   [opts.mutator=(body)=>body] Function to mutate API response.
 *
 * @returns {object}
 *
 */
export const useFetch = (urlPath, options = {}) => {
  const { authRequired, mutator } = options;

  const request = useRef();
  const { restApiClient, isAuthenticated, logout } = useAuth();

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState();
  const [data, setData] = useState(null);

  function fetch() {
    if (authRequired && !isAuthenticated) {
      return;
    }
    setStatus('loading');
    request.current = setTimeout(() => {
      restApiClient
        .get(urlPath)
        .then((body) => {
          setData(mutator ? mutator(body) : body);
          setStatus('success');
        })
        .catch(({ message }) => {
          if (message === 'Invalid Token') {
            logout();
          }
          setError(message);
          setStatus('error');
        });
    }, 250);
  }

  // Fetch request on page load, clear on unmount
  useEffect(() => {
    fetch();
    return () => clearTimeout(request.current);
  }, [urlPath, authRequired, isAuthenticated]);

  return {
    fetch,
    data,
    status,
    isReady: status !== 'idle' || status !== 'loading',
    hasError: status === 'error',
    error,
  };
};
