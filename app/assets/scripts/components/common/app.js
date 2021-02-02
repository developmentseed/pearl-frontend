import React, { useEffect } from 'react';
import T from 'prop-types';
import { withRouter } from 'react-router';

import MetaTags from './meta-tags';
import SizeAwareElement from './size-aware-element';

import { Page } from '../../styles/page';

import config from '../../config';

const { appTitle, appDescription } = config;

//class App extends Component {
function App(props) {
  const { location, pageTitle, children, hideFooter } = props;
  const title = pageTitle ? `${pageTitle} — ` : '';

  // Handle cases where the page is updated without changing
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

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
