import React, { useState, useEffect } from 'react';
import App from '../common/app';
import ExploreComponent from './explore';
import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';
import { ExploreProvider } from '../../context/explore';
import { MapProvider } from '../../context/map';
import SizeAwareElement from '../common/size-aware-element';
import theme from '../../styles/theme';
import ExploreHeader from './explore-header';
import { CheckpointProvider } from '../../context/checkpoint';
import { AoiProvider } from '../../context/aoi';
import { ProjectProvider } from '../../context/project';
import { InstanceProvider } from '../../context/instance';
import { PredictionsProvider } from '../../context/predictions';
import { ModelProvider } from '../../context/model';
import Composer from '../../utils/compose-components';
import { useAuth } from '../../context/auth';
import history from '../../history';
import toasts from '../../components/common/toasts';

function Explore() {
  const [isMediumDown, setIsMediumDown] = useState(false);
  const { isAuthenticated, authStateIsLoading, isLoading } = useAuth();

  const resizeListener = ({ width }) => {
    setIsMediumDown(width < theme.dark.mediaRanges.large[0]);
  };

  useEffect(() => {
    if (!authStateIsLoading && !isLoading) {
      if (!isAuthenticated) {
        toasts.error('Please sign in to view this page.');
        history.push('/');
      }
    }
  }, [isAuthenticated, authStateIsLoading, isLoading]);

  if (authStateIsLoading || isLoading || !isAuthenticated) {
    return <div />;
  }

  return (
    <App pageTitle='Explore'>
      <Composer
        components={[
          CheckpointProvider,
          AoiProvider,
          ModelProvider,
          ProjectProvider,
          PredictionsProvider,
          InstanceProvider,
          ExploreProvider,
          MapProvider,
        ]}
      >
        <SizeAwareElement
          element='header'
          className='header'
          onChange={resizeListener}
        >
          <PageHeader>
            <ExploreHeader isMediumDown={isMediumDown} />
          </PageHeader>
        </SizeAwareElement>
        <PageBody role='main'>
          <ExploreComponent />
        </PageBody>
      </Composer>
    </App>
  );
}

if (process.env.NODE_ENV === 'development') {
  Explore.whyDidYouRender = true;
}

export default Explore;
