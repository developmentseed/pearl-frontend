import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../context/auth';
import {
  ProjectMachineContext,
  ProjectMachineProvider,
} from '../../fsm/project';
import { PageBody } from '../../styles/page';

import theme from '../../styles/theme';
import App from '../common/app';
import { Button } from '@devseed-ui/button';
import {
  hideGlobalLoading,
  showGlobalLoading,
  showGlobalLoadingMessage,
} from '../common/global-loading';
import PageHeader from '../common/page-header';
import SizeAwareElement from '../common/size-aware-element';
import ProjectPageHeader from './header';
import ProjectPageMain from './main';
import { AoiModalDialog } from './aoi-modal-dialog';
import selectors from '../../fsm/project/selectors';

export const ProjectPage = () => {
  return (
    <App pageTitle='Project'>
      <ProjectMachineProvider>
        <ProjectPageInner />
      </ProjectMachineProvider>
    </App>
  );
};

const ProjectPageInner = () => {
  const { projectId } = useParams();
  const { isLoading, isAuthenticated, restApiClient } = useAuth();
  const projectActor = ProjectMachineContext.useActorRef();
  const [isMediumDown, setIsMediumDown] = useState(false);
  const resizeListener = ({ width }) => {
    setIsMediumDown(width < theme.dark.mediaRanges.large[0]);
  };
  const globalLoading = ProjectMachineContext.useSelector(
    selectors.globalLoading
  );
  const currentInstanceWebsocket = ProjectMachineContext.useSelector(
    selectors.currentInstanceWebsocket
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
    if (globalLoading.disabled) {
      hideGlobalLoading();
    } else if (globalLoading.message) {
      // Display a message, and the abort button if it's available
      showGlobalLoadingMessage(
        <>
          {globalLoading.message}
          {globalLoading.abortButton && (
            <Button
              data-cy='abort-run-button'
              style={{ display: 'block', margin: '1rem auto 0' }}
              variation='danger-raised-dark'
              onClick={() =>
                projectActor.send({ type: 'Abort button pressed' })
              }
            >
              Abort
            </Button>
          )}
        </>
      );
    } else {
      showGlobalLoading();
    }
  }, [
    globalLoading.disabled,
    globalLoading.message,
    globalLoading.abortButton,
  ]);

  useEffect(() => {
    return () => {
      // On umount, send terminate message and close websocket connection if it
      // exists
      if (currentInstanceWebsocket) {
        currentInstanceWebsocket.sendMessage({
          action: 'instance#terminate',
        });

        currentInstanceWebsocket.close();
      }
    };
  }, [currentInstanceWebsocket]);

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
      <AoiModalDialog />
    </>
  );
};
