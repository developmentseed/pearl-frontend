import React, { useEffect } from 'react';
import T from 'prop-types';
import { withRouter } from 'react-router';

import MetaTags from './meta-tags';
import SizeAwareElement from './size-aware-element';

import { Page } from '../../styles/page';

import config from '../../config';
import { useApiMeta } from '../../context/api-meta';
import { useRestApiClient } from '../../context/auth';

const { appTitle, appDescription } = config;

function App(props) {
  const { location, pageTitle, children, hideFooter } = props;
  const title = pageTitle ? `${pageTitle} — ` : '';

  const { restApiClient } = useRestApiClient();
  const { setApiLimits } = useApiMeta();

  // Handle cases where the page is updated without changing
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  // Fetch API meta on page mount
  useEffect(() => {
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

export default withRouter(App);
