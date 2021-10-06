import React, { useState } from 'react';
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

function Explore() {
  const [isMediumDown, setIsMediumDown] = useState(false);

  const resizeListener = ({ width }) => {
    setIsMediumDown(width < theme.dark.mediaRanges.large[0]);
  };

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
