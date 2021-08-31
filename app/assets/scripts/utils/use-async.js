import { useRef } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/auth';

export default function useAsync(asyncFunction, immediate = true) {
  const [status, setStatus] = useState('idle');
  const [value, setValue] = useState(null);
  const [error, setError] = useState(null);

  // The execute function wraps asyncFunction and
  // handles setting state for pending, value, and error.
  // useCallback ensures the below useEffect is not called
  // on every render, but only if asyncFunction changes.
  const execute = useCallback(() => {
    setStatus('pending');
    setValue(null);
    setError(null);

    return asyncFunction()
      .then((response) => {
        setValue(response);
        setStatus('success');
      })
      .catch((error) => {
        setError(error);
        setStatus('error');
      });
  }, [asyncFunction]);

  // Call execute if we want to fire it right away.
  // Otherwise execute can be called later, such as
  // in an onClick handler.
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, value, error };
}

/**
 * This hook should replace useAsync when possible.
 */
export const useFetchList = (urlPath, authRequired = true) => {
  const request = useRef();
  const { restApiClient, isAuthenticated, logout } = useAuth();

  const [status, setStatus] = useState('idle');
  const [error, setError] = useState();
  const [result, setResult] = useState([]);

  function fetch() {
    if (authRequired && !isAuthenticated) {
      return;
    }
    setStatus('loading');
    request.current = setTimeout(() => {
      restApiClient
        .get(urlPath)
        .then((res) => {
          setResult(res);
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

  // fetch request on page load, clear on unmount
  useEffect(() => {
    fetch();
    return () => clearTimeout(request.current);
  }, [urlPath, authRequired, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  return { fetch, result, status, isLoading: status === 'loading', error };
};
