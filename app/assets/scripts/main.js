import './wdyr';
import '@babel/polyfill';
import { install as installResizeObserver } from 'resize-observer';
import React, { useEffect } from 'react';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';

import { render } from 'react-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import GlobalStyles from './styles/global';
import ErrorBoundary from './fatal-error-boundary';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';

import theme from './styles/theme';

import Home from './components/home';
import Explore from './components/explore';
import ShareMap from './components/share-map';
import About from './components/about';
import UhOh from './components/uhoh';
import Projects from './components/profile/projects';
import Maps from './components/profile/maps';

import { GlobalContextProvider } from './context/global';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';
import GlobalLoadingProvider from './components/common/global-loading';
import { ToastContainerCustom } from './components/common/toasts';
import Project from './components/profile/project';
import { AuthProvider } from './context/auth';

installResizeObserver();

const ProtectedRoute = (
  { component, ...args } // eslint-disable-line react/prop-types
) => (
  <Route
    component={
      window.Cypress ? component : withAuthenticationRequired(component)
    }
    {...args}
  />
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
    <AuthProvider>
      <ErrorBoundary>
        <Router history={history}>
          <DevseedUiThemeProvider theme={theme.dark}>
            <GlobalLoadingProvider />
            <GlobalContextProvider>
              <CollecticonsGlobalStyle />
              <GlobalStyles />
              <Switch>
                <>
                  <Route exact path='/' component={Home} />
                  <Route path='/share/:uuid/map' component={ShareMap} />
                  <ProtectedRoute
                    path='/project/:projectId'
                    component={Explore}
                  />
                  <ProtectedRoute exact path='/profile/maps' component={Maps} />
                  <ProtectedRoute
                    exact
                    path='/profile/projects'
                    component={Projects}
                  />
                  <Route
                    path='/profile/projects/:projectId'
                    component={Project}
                  />
                  <Route path='/about' component={About} />
                </>
                <Route path='*' component={UhOh} />
              </Switch>
              <ToastContainerCustom />
            </GlobalContextProvider>
          </DevseedUiThemeProvider>
        </Router>
      </ErrorBoundary>
    </AuthProvider>
  );
}

render(<Root />, document.querySelector('#app-container'));
