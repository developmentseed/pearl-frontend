import React, { useEffect } from 'react';
import T from 'prop-types';
import { withRouter } from 'react-router';

import MetaTags from './meta-tags';
import SizeAwareElement from './size-aware-element';

import { Page } from '../../styles/page';

import config from '../../config';
import { useApiMeta } from '../../context/api-meta';
import { useAuth } from '../../context/auth';
import checkApiHealth from '../../utils/api-health';
import { withAITracking } from '@microsoft/applicationinsights-react-js';
import { reactPlugin } from '../../utils/azure-app-insights';

const { appTitle, appDescription, environment } = config;

function App(props) {
  const { location, pageTitle, children, hideFooter } = props;
  const title = pageTitle ? `${pageTitle} — ` : '';

  const { restApiClient } = useAuth();
  const { setApiLimits } = useApiMeta();

  // Handle cases where the page is updated without changing
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Check API health and fetch API meta on page mount
  useEffect(() => {
    checkApiHealth();
    restApiClient.getApiMeta().then((data) => {
      setApiLimits(data && data.limits);
    });
  }, []);

  return (
    <SizeAwareElement element={Page} className='page' hideFooter={hideFooter}>
      <MetaTags title={`${title}${appTitle}`} description={appDescription} />
      {children}
    </SizeAwareElement>
  );
}

App.propTypes = {
  children: T.node,
  location: T.object,
  hideFooter: T.bool,
  pageTitle: T.string,
};


let thisApp;
if (environment === 'production' || environment === 'staging') {
  // staging and production uses Azure App Insights
  thisApp = withRouter(withAITracking(reactPlugin, App));
} else {
  thisApp = withRouter(App);
}

export default thisApp;