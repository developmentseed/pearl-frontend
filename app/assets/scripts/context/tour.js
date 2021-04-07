import { useEffect, useMemo, useState } from 'react';

export const useTour = () => {
  const [tourStep, setTourStep] = useState(
    localStorage.getItem('site-tour')
      ? Number(localStorage.getItem('site-tour'))
      : null
  );

  useEffect(() => {
    localStorage.setItem('site-tour', tourStep);
  }, [tourStep]);

  return useMemo(
    () => ({
      setTourStep,
      tourStep,
    }),
    [setTourStep, tourStep]
  );
};
