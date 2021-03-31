import '@babel/polyfill';
import React, { useEffect } from 'react';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';

import { render } from 'react-dom';
import GlobalStyles from './styles/global';
import ErrorBoundary from './fatal-error-boundary';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';

import theme from './styles/theme';

import Landing from './components/landing';
import UhOh from './components/uhoh';

import { GlobalContextProvider } from './context/global';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';
import GlobalLoadingProvider from '@devseed-ui/global-loading';
import { ToastContainerCustom } from './components/common/toasts';
import { AuthProvider } from './context/auth';

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
          <DevseedUiThemeProvider theme={theme.main}>
            <GlobalLoadingProvider />
            <GlobalContextProvider>
              <CollecticonsGlobalStyle />
              <GlobalStyles />
              <Switch>
                <Route exact path='/' component={Landing} />
                {/* <Route path='/project/:projectId' component={Explore} />
                <ProtectedRoute exact path='/profile/maps' component={Maps} />
                <ProtectedRoute
                  exact
                  path='/profile/projects'
                  component={Projects}
                />
                <Route path='/about' component={About} /> */}
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
