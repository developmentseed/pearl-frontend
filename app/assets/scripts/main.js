import '@babel/polyfill';
import React, { useEffect } from 'react';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';

import { render } from 'react-dom';
import { Auth0Provider, withAuthenticationRequired } from '@auth0/auth0-react';
import GlobalStyles from './styles/global';
import ErrorBoundary from './fatal-error-boundary';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';
import config from './config';

import theme from './styles/theme';

import Home from './components/home';
import Explore from './components/explore';
import About from './components/about';
import UhOh from './components/uhoh';

import { GlobalContextProvider } from './context/global';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';
import GlobalLoadingProvider from '@devseed-ui/global-loading';
import { ToastContainerCustom } from './components/common/toasts';
import Projects from './components/profile/projects';
import Maps from './components/profile/maps';

const onRedirectCallback = (appState) => {
  // Use the router's history module to replace the url
  history.replace(appState?.returnTo || window.location.pathname);
};

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ component, ...args }) => (
  <Route component={withAuthenticationRequired(component)} {...args} />
);

// Root component.
function Root() {
  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return (
    <Auth0Provider
      domain={config.auth0Domain}
      clientId={config.clientId}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <ErrorBoundary>
        <Router history={history}>
          <DevseedUiThemeProvider theme={theme.main}>
            <GlobalLoadingProvider />
            <GlobalContextProvider>
              <CollecticonsGlobalStyle />
              <GlobalStyles />
              <Switch>
                <Route exact path='/' component={Home} />
                <Route path='/project/:projectId' component={Explore} />
                <ProtectedRoute exact path='/profile/maps' component={Maps} />
                <ProtectedRoute
                  exact
                  path='/profile/projects'
                  component={Projects}
                />
                <Route path='/about' component={About} />
                <Route path='*' component={UhOh} />
              </Switch>
              <ToastContainerCustom />
            </GlobalContextProvider>
          </DevseedUiThemeProvider>
        </Router>
      </ErrorBoundary>
    </Auth0Provider>
  );
}

render(<Root />, document.querySelector('#app-container'));
