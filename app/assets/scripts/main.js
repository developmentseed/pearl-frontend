import '@babel/polyfill';
import { install as installResizeObserver } from 'resize-observer';
import React from 'react';
import { DevseedUiThemeProvider } from '@devseed-ui/theme-provider';

import { render } from 'react-dom';
import GlobalStyles from './styles/global';
import ErrorBoundary from './fatal-error-boundary';
import { Router, Route, Switch } from 'react-router-dom';
import history from './history';

import theme from './styles/theme';

import Home from './components/home';
import Explore from './components/explore';
import PublicMaps from './components/public-maps';
import ShareMap from './components/share-map';
import About from './components/about';
import UhOh from './components/uhoh';
import Projects from './components/profile/projects';

import { GlobalContextProvider } from './context/global';
import { CollecticonsGlobalStyle } from '@devseed-ui/collecticons';
import GlobalLoadingProvider from './components/common/global-loading';
import { ToastContainerCustom } from './components/common/toasts';
import Project from './components/profile/project';
import { AuthProvider, withAuthenticationRequired } from './context/auth';
import ModelIndex from './components/admin/models';
import ViewModel from './components/admin/models/view';
import NewModel from './components/admin/models/new';
import UploadModel from './components/admin/models/upload';
import UserIndex from './components/admin/users';
import { ProjectPage } from './components/project';

installResizeObserver();

const ProtectedRoute = (
  { component, ...args } // eslint-disable-line react/prop-types
) => (
  <Route
    component={
      window.Cypress && window.localStorage.getItem('useFakeLogin')
        ? component
        : withAuthenticationRequired(component, args.access)
    }
    {...args}
  />
);

// Root component.
function Root() {
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
                <Route exact path='/' component={Home} />
                <Route exact path='/share/:uuid/map' component={ShareMap} />
                <Route exact path='/public-maps' component={PublicMaps} />
                <ProtectedRoute
                  path='/project-old/:projectId'
                  component={Explore}
                />
                <ProtectedRoute
                  path='/project/:projectId'
                  component={ProjectPage}
                />
                <ProtectedRoute
                  exact
                  path='/profile/projects'
                  component={Projects}
                />
                <ProtectedRoute
                  exact
                  path='/profile/projects/:projectId'
                  component={Project}
                />
                <ProtectedRoute
                  exact
                  path='/admin/models'
                  component={ModelIndex}
                  access='admin'
                />
                <ProtectedRoute
                  exact
                  path='/admin/models/new'
                  component={NewModel}
                  access='admin'
                />
                <ProtectedRoute
                  exact
                  path='/admin/models/:modelId'
                  component={ViewModel}
                  access='admin'
                />
                <ProtectedRoute
                  exact
                  path='/admin/models/:modelId/upload'
                  component={UploadModel}
                  access='admin'
                />
                <ProtectedRoute
                  exact
                  path='/admin/users'
                  component={UserIndex}
                  access='admin'
                />
                <Route exact path='/about' component={About} />
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
