import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import T from 'prop-types';
import { DropdownTrigger } from '../../styles/dropdown';
import { Button } from '@devseed-ui/button';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Form, FormInput } from '@devseed-ui/form';
import InfoButton from '../common/info-button';

const Wrapper = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  grid-gap: ${glsp()};
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
    margin: 0 ${glsp(0.25)};
    height: auto;
    padding: ${glsp(0.25)} ${glsp(0.5)};
    line-height: 1.5rem;
    border: 1px solid transparent;
    border-radius: 0.25rem;
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

      <Button
        variation='base-plain'
        size='small'
        useIcon='circle-question'
        onClick={openHelp}
      >
        Help
      </Button>
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
