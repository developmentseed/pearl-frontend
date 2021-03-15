import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import T from 'prop-types';
import { Dropdown, DropdownTrigger } from '../../styles/dropdown';
import { Button } from '@devseed-ui/button';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Form, FormInput } from '@devseed-ui/form';
import InfoButton from '../common/info-button';

const Wrapper = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-gap: 1rem;
`;

const StatusHeading = styled(Heading)`
  font-size: 0.875rem;
  span {
    font-weight: ${themeVal('type.base.weight')};
    color: ${themeVal('color.base')};
  }
`;
const ProjectHeading = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  line-height: 1.5;
  ${Heading} {
    margin: 0 0.25rem;
    height: auto;
    padding: 0.25rem 0.5rem;
    line-height: 1.5rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    &:hover {
      border: 1px solid ${themeVal('color.baseAlphaE')};
    }
  }
  ${Form} {
    grid-gap: 0.5rem;
    align-items: center;
    justify-items: center;
  }
`;

const HeadingInput = styled(FormInput)`
  margin-left: 0.25rem;
  font-weight: ${themeVal('type.heading.weight')};
`;

function SessionOutputControl(props) {
  const { isAuthenticated } = useAuth0();

  const { status, projectName, setProjectName, openHelp } = props;
  const [localProjectName, setLocalProjectName] = useState(projectName);
  const [titleEditMode, setTitleEditMode] = useState(false);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const name = evt.target.elements.projectName.value;
    setProjectName(name);
    setTitleEditMode(false);
  };
  const clearInput = () => {
    setLocalProjectName(projectName || '');
    setTitleEditMode(false);
  };

  return (
    <Wrapper>
      <ProjectHeading>
        <p>Project:</p>
        {!titleEditMode ? (
          <>
            <Heading
              variation={localProjectName ? 'primary' : 'baseAlphaE'}
              size='xsmall'
              onClick={() => isAuthenticated && setTitleEditMode(true)}
              title={!isAuthenticated && 'Log in to set project name'}
            >
              {localProjectName || 'Untitled Project'}
            </Heading>
            <InfoButton
              size='small'
              useIcon='pencil'
              info={
                isAuthenticated
                  ? localProjectName
                    ? 'Edit project Name'
                    : 'Set Project Name'
                  : 'Log in to set project name'
              }
              onClick={() => isAuthenticated && setTitleEditMode(true)}
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
            />
            <InfoButton
              type='submit'
              size='small'
              useIcon='tick--small'
              info='Confirm project name'
              id='project-name__confirm'
            />
            <InfoButton
              onClick={clearInput}
              size='small'
              useIcon='xmark--small'
              info='Cancel'
              id='project-name__cancel'
            />
          </Form>
        )}
      </ProjectHeading>
      <StatusHeading
        // TODO: replace status 'OK' with API active instance response
        variation={status === 'OK' ? 'primary' : 'danger'}
        size='xxsmall'
      >
        <span>Session Status:</span> {status || 'None Provided'}
      </StatusHeading>
      <Button
        variation='base-plain'
        size='small'
        useIcon='circle-question'
        onClick={openHelp}
      >
        Help
      </Button>
      <DropdownTrigger
        variation='base-raised-light'
        useIcon={['download', 'before']}
        title='Open dropdown'
        className='user-options-trigger'
        size='medium'
        {...props}
        disabled={!isAuthenticated}
      >
        Export
      </DropdownTrigger>
    </Wrapper>
  );
}

SessionOutputControl.propTypes = {
  status: T.string,
  projectName: T.string,
  setProjectName: T.func,
  openHelp: T.func,
};

export default SessionOutputControl;
