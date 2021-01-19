import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from 'react-dom';
import GlobalStyles from './styles/global';
import ErrorBoundary from './fatal-error-boundary';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';

import Home from './components/home';
import Explore from './components/explore';
import About from './components/about';
import UhOh from './components/uhoh';

// Root component.
function Root() {
  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return (
    <Router history={history}>
      <ThemeProvider theme={{}}>
        <ErrorBoundary>
          <GlobalStyles />
          <Switch>
            <Route exact path='/' component={Home} />
            <Route exact path='/explore' component={Explore} />
            <Route path='/about' component={About} />
            <Route path='*' component={UhOh} />
          </Switch>
        </ErrorBoundary>
      </ThemeProvider>
    </Router>
  );
}

render(<Root />, document.querySelector('#app-container'));
