import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import T from 'prop-types';
import { Dropdown, DropdownTrigger } from '../../styles/dropdown';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Form as BaseForm, FormInput } from '@devseed-ui/form';
import Prose from '../../styles/type/prose';
import { ExploreContext } from '../../context/explore';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()};
`;

const DropWrapper = styled.div`
  padding: ${glsp()};
`;
const Form = styled(BaseForm)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  input {
    grid-column: 1 / -1;
  }
`;

function SessionOutputControl(props) {
  const { isAuthenticated } = useAuth0();

  const { status } = props;

  const { updateProjectName, currentProject, selectedModel } = useContext(
    ExploreContext
  );

  const initialName = currentProject ? currentProject.name : 'Untitled';
  const [localProjectName, setLocalProjectName] = useState(initialName);

  useEffect(() => setLocalProjectName(initialName), [initialName]);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const name = evt.target.elements.projectName.value;
    updateProjectName(name);
  };
  const clearInput = () => {
    setLocalProjectName(initialName);
  };

  return (
    <Wrapper>
      <Button variation='base-plain' disabled size='small'>
        Session Status: {status || 'None Provided'}
      </Button>

      <Dropdown
        alignment='center'
        direction='down'
        triggerElement={(props) => {
          const disabled = !isAuthenticated || !selectedModel;
          return (
            <DropdownTrigger
              variation='base-raised-dark'
              useIcon={['circle-tick', 'before']}
              title='Open dropdown'
              className='user-options-trigger'
              size='small'
              {...props}
              onClick={(t) => {
                /* eslint-disable-next-line */
                isAuthenticated && selectedModel && props.onClick(t);
              }}
              visuallyDisabled={disabled}
              info={disabled ? 'Select model to save the project' : null}
              id='save-project'
            >
              Save
            </DropdownTrigger>
          );
        }}
        className='global__dropdown'
      >
        <DropWrapper>
          <Heading useAlt>{localProjectName}</Heading>
          <Form onSubmit={handleSubmit}>
            <FormInput
              type='string'
              name='projectName'
              placeholder='Enter project name'
              onChange={(e) => setLocalProjectName(e.target.value)}
              value={localProjectName}
            />
            <Prose
              style={{
                gridColumn: '1 / -1',
              }}
              size='small'
            >
              Projects contain your saved AOI, current checkpoint, and all
              resutls refinements that you have applied
            </Prose>
            <Button
              type='submit'
              style={{
                gridColumn: '1 / 2',
              }}
              variation='base-raised-light'
              size='small'
              useIcon='tick--small'
            >
              Save
            </Button>
            <Button
              onClick={clearInput}
              variation='base-raised-light'
              size='small'
              useIcon='xmark--small'
              style={{
                gridColumn: '2 / -1',
              }}
            >
              Cancel
            </Button>
          </Form>
        </DropWrapper>
      </Dropdown>
      <DropdownTrigger
        variation='base-raised-semidark'
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
};

export default SessionOutputControl;
