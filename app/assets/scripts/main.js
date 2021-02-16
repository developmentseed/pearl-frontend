import '@babel/polyfill';
import React, { useEffect } from 'react';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';

import { render } from 'react-dom';
import { Auth0Provider } from '@auth0/auth0-react';
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
import { GlobalLoading } from '@devseed-ui/global-loading';
import { ToastContainerCustom } from './components/common/toasts';

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

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
            <GlobalContextProvider>
              <CollecticonsGlobalStyle />
              <GlobalStyles />
              <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/explore' component={Explore} />
                <Route path='/about' component={About} />
                <Route path='*' component={UhOh} />
              </Switch>
              <GlobalLoading />
              <ToastContainerCustom />
            </GlobalContextProvider>
          </DevseedUiThemeProvider>
        </Router>
      </ErrorBoundary>
    </Auth0Provider>
  );
}

render(<Root />, document.querySelector('#app-container'));
