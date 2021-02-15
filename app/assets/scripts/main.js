import '@babel/polyfill';
import React, { useEffect } from 'react';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';

import { render } from 'react-dom';
import GlobalStyles from './styles/global';
import ErrorBoundary from './fatal-error-boundary';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';

import theme from './styles/theme';

import Home from './components/home';
import Explore from './components/explore';
import About from './components/about';
import UhOh from './components/uhoh';

import { GlobalContextProvider } from './context/global';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';
import { GlobalLoading } from '@devseed-ui/global-loading';
import { ToastContainerCustom } from './components/common/toasts';

// Root component.
function Root() {
  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return (
    <ErrorBoundary>
      <Router history={history}>
        <DevseedUiThemeProvider theme={theme.main}>
          <CollecticonsGlobalStyle />
          <GlobalContextProvider>
            <GlobalStyles />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/explore' component={Explore} />
              <Route path='/about' component={About} />
              <Route path='*' component={UhOh} />
            </Switch>
          </GlobalContextProvider>
          <GlobalLoading />
          <ToastContainerCustom />
        </DevseedUiThemeProvider>
      </Router>
    </ErrorBoundary>
  );
}

render(<Root />, document.querySelector('#app-container'));
