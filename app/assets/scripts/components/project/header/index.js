import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFocus } from '../../../utils/use-focus';

import { themeVal, glsp, media, truncated } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Form } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { FormInput, FormSwitch } from '@devseed-ui/form';

import { ProjectMachineContext } from '../../../fsm/project';

import { Modal } from '../../common/custom-modal';
import InfoButton from '../../common/info-button';
import { useHistory } from 'react-router';
import {
  Dropdown,
  DropdownBody,
  DropdownHeader,
  DropdownItem,
  DropdownTrigger,
} from '../../../styles/dropdown';

import { ShortcutHelp } from './shortcut-help';
import {
  copyShareUrlToClipboard,
  downloadShareGeotiff,
  getShareLink,
} from '../../../utils/share-link';
import logger from '../../../utils/logger';
import { useAuth } from '../../../context/auth';
import selectors from '../../../fsm/project/selectors';
import toasts from '../../common/toasts';
import { StyledLink } from '../../../styles/links';

const Wrapper = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: ${glsp()};
  align-items: center;
  ${media.mediumDown`
    grid-template-columns: 1fr auto;
  `}
`;

const StatusHeading = styled(Heading)`
  font-size: 0.875rem;
  text-align: center;
  span {
    font-weight: ${themeVal('type.base.weight')};
    color: ${themeVal('color.base')};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  ${media.mediumDown`
    display: none;
  `}
`;

const FormInputGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 2.125rem;
  input {
    display: none;
    ${media.mediumUp`
      display: revert;
    `};
  }
  > :first-child:not(:last-child) {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  > :last-child:not(:first-child) {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  .form__control::selection {
    background-color: unset;
    color: unset;
  }
`;

const ProjectHeading = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  line-height: 1.5;
  max-width: 14rem;
  z-index: 5;
  p {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
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
    ${truncated()}
  }
  ${Form} {
    grid-gap: ${glsp(0.5)};
    align-items: center;
    justify-items: center;
  }
`;

const HeadingInput = styled(FormInput)`
  transition: none;
  margin-left: ${glsp(0.25)};
  font-weight: ${themeVal('type.heading.weight')};
`;

const ModalForm = styled(Form)`
  display: grid;
  grid-gap: ${glsp(1)};
`;

function ProjectPageHeader({ isMediumDown }) {
  const history = useHistory();
  const { restApiClient, user, isAuthenticated } = useAuth();
  const [editProjectNameMode, setEditProjectNameMode] = useState(false);
  const [localProjectName, setLocalProjectName] = useState(null);
  const [isPublished, setIsPublished] = useState(null);
  const actorRef = ProjectMachineContext.useActorRef();
  const displayProjectNameModal = ProjectMachineContext.useSelector(
    selectors.displayProjectNameModal
  );
  const projectId = ProjectMachineContext.useSelector(
    (s) => s.context.project.id
  );
  const projectName = ProjectMachineContext.useSelector(selectors.projectName);
  const canExport = ProjectMachineContext.useSelector(selectors.canExport);
  const sessionStatusMessage = ProjectMachineContext.useSelector(
    selectors.sessionStatusMessage
  );
  const currentShare = ProjectMachineContext.useSelector(
    selectors.currentShare
  );
  const currentInstanceType = ProjectMachineContext.useSelector(
    selectors.currentInstanceType
  );
  const canSwitchInstanceType = ProjectMachineContext.useSelector(
    selectors.canSwitchInstanceType
  );
  const nextInstanceType = currentInstanceType === 'cpu' ? 'gpu' : 'cpu';

  const handleProjectNameSubmit = (e) => {
    e.preventDefault();
    const newProjectName = e.target.elements.projectName.value;

    // Always turn off edit mode at the end
    const finalize = (success = true, name = projectName) => {
      setLocalProjectName(success ? newProjectName : name);
      setEditProjectNameMode(false);
      if (!success)
        toasts.error(
          newProjectName?.length > 0
            ? 'Failed to update project name'
            : 'Project name cannot be empty'
        );
    };

    if (newProjectName === '') {
      finalize(false);
    } else if (projectId === 'new') {
      actorRef.send({
        type: 'Set project name',
        data: { projectName: newProjectName },
      });
      finalize();
    } else if (newProjectName !== projectName) {
      restApiClient
        .patch(`project/${projectId}`, { name: newProjectName })
        .then(() => finalize())
        .catch(() => finalize(false));
    } else {
      finalize();
    }
  };

  useEffect(() => {
    if (projectName) {
      setLocalProjectName(projectName);
    }
  }, [projectName]);

  useEffect(() => {
    if (!currentShare) return;
    setIsPublished(currentShare.published);
  }, [currentShare]);

  // Delays focus
  const [projectNameInputRef, setProjectNameInputFocus] = useFocus(0);

  return (
    <Wrapper>
      <ProjectHeading>
        <p>Project:</p>
        {!editProjectNameMode ? (
          <>
            <Heading
              variation={localProjectName ? 'primary' : 'baseAlphaE'}
              size='xsmall'
              onClick={() => {
                isAuthenticated && setEditProjectNameMode(true);
              }}
              title={
                !isAuthenticated ? 'Log in to set project name' : 'Project name'
              }
              data-cy='project-name'
            >
              {localProjectName}
            </Heading>
            <InfoButton
              size='small'
              useIcon='pencil'
              hideText
              id='project-edit-trigger'
              data-cy='project-name-edit'
              info={
                !isAuthenticated
                  ? 'Log in to set project name'
                  : localProjectName
                  ? 'Edit project Name'
                  : 'Set Project Name'
              }
              onClick={() => {
                isAuthenticated && setEditProjectNameMode(true);
              }}
            />
          </>
        ) : (
          <Form onSubmit={handleProjectNameSubmit}>
            <HeadingInput
              name='projectName'
              placeholder='Set Project Name'
              onChange={(e) => setLocalProjectName(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              value={localProjectName || ''}
              disabled={!isAuthenticated}
              data-cy='project-input'
            />
            <Button
              type='submit'
              size='small'
              useIcon='tick--small'
              hideText
              data-cy='project-name-confirm'
              title='Confirm project name'
            />
            <Button
              onClick={() => {
                setLocalProjectName(projectName);
                setEditProjectNameMode(false);
              }}
              size='small'
              useIcon='xmark--small'
              hideText
              title='Cancel'
            />
          </Form>
        )}
      </ProjectHeading>

      <StatusHeading
        data-cy='session-status'
        variation='primary'
        size='xxsmall'
      >
        <span>Session Status: </span>
        {sessionStatusMessage}
      </StatusHeading>

      <Modal
        id='project-name-modal'
        data-cy='project-name-modal'
        title='New project'
        revealed={displayProjectNameModal}
        size='small'
        closeButton={true}
        onCloseClick={() => history.push('/profile/projects')}
        onEntered={() => {
          setProjectNameInputFocus();
        }}
        content={
          <ModalForm onSubmit={handleProjectNameSubmit}>
            <p>Enter a project name to get started</p>
            <HeadingInput
              name='projectName'
              placeholder='Set Project Name'
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              onChange={(e) => {
                e.stopPropagation();
                setLocalProjectName(e.target.value);
              }}
              value={localProjectName || ''}
              ref={projectNameInputRef}
              data-cy='new-project-name-modal-input'
            />
            <Button
              type='submit'
              variation='primary-raised-dark'
              size='medium'
              useIcon={['arrow-right', 'after']}
              data-cy='create-project-button'
              title={
                !localProjectName
                  ? 'Set project name to start new project'
                  : 'Create new project'
              }
              disabled={!localProjectName}
            >
              Create Project
            </Button>
          </ModalForm>
        }
      />

      {user?.flags?.gpu && (
        <Button
          data-cy='toggle-instance-type-button'
          variation='primary-plain'
          disabled={!canSwitchInstanceType}
          title={`Click to switch to ${nextInstanceType.toUpperCase()} instance`}
          onClick={() => {
            canSwitchInstanceType &&
              actorRef.send({
                type: 'Switch current instance type',
                data: {
                  instanceType: nextInstanceType,
                },
              });
          }}
        >
          {currentInstanceType.toUpperCase()}
        </Button>
      )}

      <ShortcutHelp />

      <Dropdown
        alignment='right'
        direction='down'
        triggerElement={(props) => (
          <DropdownTrigger
            variation='primary-raised-dark'
            title='Export map'
            id='export-options-trigger'
            size='medium'
            useIcon='share'
            {...props}
            hideText={isMediumDown}
            disabled={!canExport}
          >
            Export
          </DropdownTrigger>
        )}
        className='global__dropdown'
      >
        <>
          <DropdownHeader>
            <p>Export Options</p>
          </DropdownHeader>
          <DropdownBody>
            {currentShare && (
              <li>
                <DropdownItem
                  useIcon='download-2'
                  onClick={() =>
                    downloadShareGeotiff(restApiClient, currentShare)
                  }
                >
                  Download .geotiff
                </DropdownItem>
              </li>
            )}
            <li>
              <DropdownItem
                useIcon='link'
                onClick={
                  !currentShare
                    ? () => actorRef.send('Requested AOI share URL')
                    : () => copyShareUrlToClipboard(currentShare)
                }
              >
                {currentShare ? 'Copy Share URL' : 'Create Share URL'}
              </DropdownItem>
              {currentShare && (
                <DropdownItem nonhoverable={!currentShare}>
                  <FormInputGroup>
                    <FormInput
                      readOnly
                      value={getShareLink(currentShare)}
                      disabled={!currentShare}
                      size='small'
                    />
                    <Button
                      variation='primary-plain'
                      useIcon='clipboard'
                      hideText
                      disabled={!currentShare}
                      title='Copy link to clipboard'
                      onClick={() =>
                        currentShare && copyShareUrlToClipboard(currentShare)
                      }
                    />
                  </FormInputGroup>
                </DropdownItem>
              )}
            </li>
            {currentShare && (
              <>
                <li>
                  <DropdownItem>
                    <FormSwitch
                      name='published'
                      title='Make share map public'
                      checked={isPublished}
                      onChange={async () => {
                        const newIsPublished = !isPublished;
                        setIsPublished(newIsPublished);

                        try {
                          await restApiClient.patch(
                            `share/${currentShare.uuid}`,
                            {
                              published: newIsPublished,
                            }
                          );
                          setIsPublished(newIsPublished);
                        } catch (err) {
                          setIsPublished(!newIsPublished);
                          logger(
                            'There was an unexpected error updating the exported map.',
                            err
                          );
                          toasts.error(
                            'There was an unexpected error updating the exported map.'
                          );
                        }
                      }}
                      textPlacement='right'
                    >
                      Publish Share
                    </FormSwitch>
                  </DropdownItem>
                </li>
                <li>
                  <DropdownItem
                    useIcon='resize-center-horizontal'
                    as={StyledLink}
                    nonhoverable={!isPublished}
                    muted={!isPublished}
                    disabled={!isPublished}
                    to={
                      isPublished
                        ? {
                            pathname: '/public-maps',
                            state: { uuid: currentShare.uuid },
                          }
                        : null
                    }
                  >
                    Compare map
                  </DropdownItem>
                </li>
              </>
            )}
          </DropdownBody>
        </>
      </Dropdown>
    </Wrapper>
  );
}

ProjectPageHeader.propTypes = {
  isMediumDown: PropTypes.bool,
};

export default ProjectPageHeader;
