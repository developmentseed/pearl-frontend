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

const ProjectPageInner = () => {
  const { projectId } = useParams();
  const { isLoading, isAuthenticated } = useAuth();
  const projectActor = ProjectMachineContext.useActorRef();
  const [isMediumDown, setIsMediumDown] = useState(false);
  const resizeListener = ({ width }) => {
    setIsMediumDown(width < theme.dark.mediaRanges.large[0]);
  };

  // After authentication is resolved, send machine event
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      projectActor.send({
        type: 'Initialize page state',
        data: { projectId, isAuthenticated },
      });
    }
  }, [isLoading, isAuthenticated, projectId]);

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
