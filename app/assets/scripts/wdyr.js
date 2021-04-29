import React from 'react';
import logger from './utils/logger';
import config from './config';

if (config.environment === 'development' && config.wdyrLogs) {
  logger(
    '"Why did you render" module was loaded, which might slow down React in development mode.'
  );
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, {
    trackAllPureComponents: true,
  });
}
