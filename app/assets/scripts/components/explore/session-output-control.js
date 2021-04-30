import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import copy from '../../utils/copy-text-to-clipboard';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
  DropdownTrigger,
} from '../../styles/dropdown';
import { Button } from '@devseed-ui/button';
import { themeVal, glsp, media } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Form, FormInput } from '@devseed-ui/form';
import InfoButton from '../common/info-button';
import { ExploreContext, useProjectId } from '../../context/explore';
import { useAuth } from '../../context/auth';
import { useAoi } from '../../context/aoi';
import toasts from '../common/toasts';
import logger from '../../utils/logger';
import { useInstance } from '../../context/instance';
import { downloadGeotiff as downloadGeotiffUtil } from '../../utils/map';

const Wrapper = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-gap: ${glsp()};
  align-items: center;
  ${media.mediumDown`
    grid-template-columns: 1fr auto;
  `}
`;

const StatusHeading = styled(Heading)`
  font-size: 0.875rem;
  span {
    font-weight: ${themeVal('type.base.weight')};
    color: ${themeVal('color.base')};
  }
  ${media.mediumDown`
    display: none;
  `}
`;
const ProjectHeading = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  line-height: 1.5;
  p {
    ${media.mediumDown`
      display: none;
    `}
  }
  ${Heading} {
    margin: 0 ${glsp(0.25)};
    height: auto;
    padding: ${glsp(0.25)} ${glsp(0.5)};
    line-height: 1.5rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    max-height: 2rem;
    overflow: hidden;
    &:hover {
      border: 1px solid ${themeVal('color.baseAlphaE')};
    }
  }
  ${Form} {
    grid-gap: ${glsp(0.5)};
    align-items: center;
    justify-items: center;
  }
`;

const HeadingInput = styled(FormInput)`
  margin-left: ${glsp(0.25)};
  font-weight: ${themeVal('type.heading.weight')};
`;

function SessionOutputControl(props) {
  const { projectId } = useProjectId();
  const { projectName, openHelp, isMediumDown } = props;
  const { isAuthenticated, restApiClient } = useAuth();

  const { instance } = useInstance();

  const { currentAoi } = useAoi();

  const {
    updateProjectName,
    currentProject,
    selectedModel,
    predictions,
    aoiName,
  } = useContext(ExploreContext);
  const initialName = currentProject ? currentProject.name : 'Untitled';

  const [localProjectName, setLocalProjectName] = useState(projectName);
  const [titleEditMode, setTitleEditMode] = useState(false);
  useEffect(() => setLocalProjectName(initialName), [initialName]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const name = evt.target.elements.projectName.value;
    updateProjectName(name);
    setTitleEditMode(false);
  };

  const downloadGeotiff = async () => {
    const projectId = currentProject.id;
    const aoiId = predictions.data?.aoiId || currentAoi.id;
    showGlobalLoadingMessage('Preparing GeoTIFF for Download');
    try {
      await restApiClient.bookmarkAOI(projectId, aoiId, aoiName);
      const geotiffArrayBuffer = await restApiClient.downloadGeotiff(
        projectId,
        aoiId
      );
      const filename = `${aoiId}.tiff`;
      downloadGeotiffUtil(geotiffArrayBuffer, filename);
    } catch (error) {
      logger('Error with geotiff download', error);
      toasts.error('Failed to download GeoTIFF');
    }
    hideGlobalLoading();
    return;
  };

  const copyTilesLink = async () => {
    const projectId = currentProject.id;
    const aoiId = predictions.data?.aoiId || currentAoi.id;
    let share;
    showGlobalLoadingMessage('Creating shareable map.');
    try {
      //FIXME: ideally, these two requests should happen in parallel
      await restApiClient.bookmarkAOI(projectId, aoiId, aoiName);
      share = await restApiClient.createShare(projectId, aoiId);
    } catch (err) {
      logger('Error creating share', err);
      hideGlobalLoading();
      toasts.error('Failed to create share.');
      return;
    }

    hideGlobalLoading();
    const url = `${window.location.origin}/share/${share.uuid}/map`;
    const copied = copy(url);
    if (copied) {
      toasts.success('URL copied to clipboard');
    } else {
      toasts.error('Failed to copy to clipboard');
    }
  };

  const clearInput = () => {
    setLocalProjectName(initialName);
    setTitleEditMode(false);
  };
  const getEditInfo = () => {
    if (!isAuthenticated) {
      return 'Log in to set project name';
    } else if (!selectedModel) {
      return 'Model must be selected to set project name';
    } else if (localProjectName) {
      return 'Edit project Name';
    } else {
      return 'Set Project Name';
    }
  };

  const exportEnabled =
    isAuthenticated &&
    currentProject &&
    (predictions.data?.aoiId || currentAoi?.id);
  return (
    <Wrapper>
      <ProjectHeading>
        <p>Project:</p>
        {!titleEditMode ? (
          <>
            <Heading
              variation={localProjectName ? 'primary' : 'baseAlphaE'}
              size='xsmall'
              onClick={() => {
                isAuthenticated && selectedModel && setTitleEditMode(true);
              }}
              title={
                !isAuthenticated ? 'Log in to set project name' : 'Project name'
              }
            >
              {localProjectName || 'Untitled Project'}
            </Heading>
            <InfoButton
              size='small'
              useIcon='pencil'
              hideText
              id='project-edit-trigger'
              info={getEditInfo()}
              onClick={() => {
                isAuthenticated && selectedModel && setTitleEditMode(true);
              }}
            />
          </>
        ) : (
          <Form onSubmit={handleSubmit}>
            <HeadingInput
              name='projectName'
              placeholder='Set Project Name'
              onChange={(e) => setLocalProjectName(e.target.value)}
              value={localProjectName}
              disabled={!isAuthenticated}
              autoFocus
            />
            <Button
              type='submit'
              size='small'
              useIcon='tick--small'
              hideText
              title='Confirm project name'
            />
            <Button
              onClick={clearInput}
              size='small'
              useIcon='xmark--small'
              hideText
              title='Cancel'
            />
          </Form>
        )}
      </ProjectHeading>
      <StatusHeading
        // TODO: replace status 'OK' with API active instance response
        variation={
          projectId === 'new' || status === 'OK' ? 'primary' : 'danger'
        }
        size='xxsmall'
      >
        <span>Session Status:</span>{' '}
        {projectId === 'new' ? 'Waiting for model run' : instance.gpuMessage}
      </StatusHeading>
      <Button
        variation='base-plain'
        size='small'
        useIcon='circle-question'
        onClick={openHelp}
        hideText={isMediumDown}
      >
        Help
      </Button>
      <Dropdown
        alignment='right'
        direction='down'
        triggerElement={(props) => (
          <DropdownTrigger
            variation='primary-raised-light'
            title='Export map'
            className='user-options-trigger'
            size='medium'
            useIcon='share'
            {...props}
            disabled={!exportEnabled}
            hideText={isMediumDown}
          >
            Export
          </DropdownTrigger>
        )}
        className='global__dropdown'
      >
        <>
          <DropdownHeader>Export Options</DropdownHeader>
          <DropdownBody>
            <li>
              <DropdownItem useIcon='download-2' onClick={downloadGeotiff}>
                Download .geotiff
              </DropdownItem>
            </li>
            <li>
              <DropdownItem useIcon='link' onClick={copyTilesLink}>
                Copy link to online map
              </DropdownItem>
            </li>
          </DropdownBody>
        </>
      </Dropdown>
    </Wrapper>
  );
}

SessionOutputControl.propTypes = {
  status: T.string,
  projectName: T.string,
  setProjectName: T.func,
  openHelp: T.func,
  isMediumDown: T.bool,
};

export default SessionOutputControl;
