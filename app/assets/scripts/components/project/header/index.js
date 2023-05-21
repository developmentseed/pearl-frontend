import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useFocus } from '../../../utils/use-focus';

import { themeVal, glsp, media, truncated } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Form } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { FormInput } from '@devseed-ui/form';

import { ProjectMachineContext } from '../../../fsm/project';

import { Modal } from '../../common/custom-modal';
import get from 'lodash.get';
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
import { useAuth } from '../../../context/auth';

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

const selectors = {
  displayProjectNameModal: (state) =>
    state.matches('Entering new project name'),
  projectName: (state) => get(state, 'context.project.name', ''),
  sessionStatusMessage: (state) =>
    get(state, 'context.sessionStatusMessage', {}),
  currentShare: (state) => get(state, 'context.currentShare'),
  currentInstanceType: (state) =>
    get(state, 'context.currentInstanceType', 'cpu'),
};

function ProjectPageHeader({ isMediumDown }) {
  const history = useHistory();
  const { restApiClient, user } = useAuth();
  const [localProjectName, setLocalProjectName] = useState(null);
  const actorRef = ProjectMachineContext.useActorRef();
  const displayProjectNameModal = ProjectMachineContext.useSelector(
    selectors.displayProjectNameModal
  );
  const projectName = ProjectMachineContext.useSelector(selectors.projectName);
  const sessionStatusMessage = ProjectMachineContext.useSelector(
    selectors.sessionStatusMessage
  );
  const currentShare = ProjectMachineContext.useSelector(
    selectors.currentShare
  );
  const currentInstanceType = ProjectMachineContext.useSelector(
    selectors.currentInstanceType
  );
  const nextInstanceType = currentInstanceType === 'cpu' ? 'gpu' : 'cpu';

  const handleSubmit = (e) => {
    e.preventDefault();

    actorRef.send({
      type: 'Set project name',
      data: {
        projectName: e.target.elements.projectName.value,
      },
    });
  };

  // Delays focus
  const [projectNameInputRef, setProjectNameInputFocus] = useFocus(0);

  return (
    <Wrapper>
      <ProjectHeading>
        <p>Project:</p>
        <Heading size='xsmall' data-cy='project-name'>
          {projectName}
        </Heading>
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
          <ModalForm onSubmit={handleSubmit}>
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
          title={`Click to switch to ${nextInstanceType.toUpperCase()} instance`}
          onClick={() => {
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