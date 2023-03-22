import get from 'lodash.get';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../context/auth';
import {
  ProjectMachineContext,
  ProjectMachineProvider,
} from '../../context/project-xstate';
import { PageBody } from '../../styles/page';

import theme from '../../styles/theme';
import Composer from '../../utils/compose-components';
import App from '../common/app';
import { hideGlobalLoading, showGlobalLoading } from '../common/global-loading';
import PageHeader from '../common/page-header';
import SizeAwareElement from '../common/size-aware-element';
import ProjectPageHeader from './header';
import ProjectPageMain from './main';

export const ProjectPage = () => {
  return (
    <App pageTitle='Project'>
      <Composer components={[ProjectMachineProvider]}>
        <ProjectPageInner />
      </Composer>
    </App>
  );
};

const selectors = {
  displayGlobalLoading: (state) =>
    get(state, 'context.displayGlobalLoading', false),
};

const ProjectPageInner = () => {
  const { projectId } = useParams();
  const { isLoading, isAuthenticated, restApiClient } = useAuth();
  const projectActor = ProjectMachineContext.useActorRef();
  const [isMediumDown, setIsMediumDown] = useState(false);
  const resizeListener = ({ width }) => {
    setIsMediumDown(width < theme.dark.mediaRanges.large[0]);
  };
  const displayGlobalLoading = ProjectMachineContext.useSelector(
    selectors.displayGlobalLoading
  );

  // After authentication is resolved, send machine event
  useEffect(() => {
    if (!isLoading) {
      projectActor.send({
        type: 'Resolve authentication',
        data: { projectId, isAuthenticated, apiClient: restApiClient },
      });
    }
  }, [isLoading, isAuthenticated, projectId]);

  useEffect(() => {
    if (displayGlobalLoading) {
      showGlobalLoading();
    } else {
      hideGlobalLoading();
    }
  }, [displayGlobalLoading]);

  return (
    <>
      <SizeAwareElement
        element='header'
        className='header'
        onChange={resizeListener}
      >
        <PageHeader hideLongAppTitle>
          <ProjectPageHeader isMediumDown={isMediumDown} />
        </PageHeader>
      </SizeAwareElement>
      <PageBody role='main'>
        <ProjectPageMain />
      </PageBody>
    </>
  );
};
