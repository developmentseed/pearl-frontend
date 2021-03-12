import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import T from 'prop-types';
import { Dropdown, DropdownTrigger } from '../../styles/dropdown';
import { Button } from '@devseed-ui/button';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Form as BaseForm, FormInput } from '@devseed-ui/form';
import Prose from '../../styles/type/prose';
import InfoButton from '../common/info-button';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-flow: row nowrap;
  /* grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()}; */
  & > *:first-child {
    margin-right: auto;
  }
  > * ~ * {
    margin-left: ${glsp()};
  }
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

const StatusHeading = styled(Heading)`
  margin-right: auto;
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
    margin: 0;
    font-weight: ${themeVal('type.base.weight')};
  }
`;

const HeadingInput = styled(FormInput)`
  margin-left: 0.25rem;
  background: none;
  border: 1px solid transparent;
  font-weight: ${themeVal('type.heading.weight')};
  &:focus,
  &:active,
  .active {
    border: 1px solid;
    background: ${themeVal('color.surface')};
  }
`;

// function ProjectTitleEditButtons(props) {
//   const { isAuthenticated } = useAuth0();
//   const { setViewMode } = props;

//   if (viewMode === viewModes.EDIT_TITLE_MODE) {

//   }
//   return (
//     <>
//       <InfoButton
//         onClick={() => {
//           setViewMode(viewModes.EDIT_TITLE_MODE)
//         }}
//         hideText
//         useIcon='pencil'
//         info={
//           isAuthenticated
//             ? 'Change project Name'
//             : 'Log in to change project name'
//         }
//       />
//     </>
//   )
// }

// ProjectTitleEditButtons.propTypes = {
//   setViewMode: T.func
// };

function SessionOutputControl(props) {
  const { isAuthenticated } = useAuth0();

  const { status, projectName, setProjectName, openHelp } = props;
  const [localProjectName, setLocalProjectName] = useState(projectName);

  const handleSubmit = (evt) => {
    evt.preventDefault();
    const name = evt.target.elements.projectName.value;
    setProjectName(name);
  };
  const clearInput = () => {
    setLocalProjectName(projectName);
  };

  return (
    <Wrapper>
      {/* <Dropdown
        alignment='center'
        direction='down'
        triggerElement={(props) => (
          <DropdownTrigger
            variation='base-raised-dark'
            useIcon={['circle-tick', 'before']}
            title='Open dropdown'
            className='user-options-trigger'
            size='small'
            {...props}
            disabled={!isAuthenticated}
          >
            Save
          </DropdownTrigger>
        )}
        className='global__dropdown'
      >
        <DropWrapper>
          <Heading useAlt>{projectName}</Heading>
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
      </Dropdown> */}
      <ProjectHeading>
        <Heading variation='base' size='xsmall'>
          Project:
        </Heading>
        <Form onSubmit={handleSubmit}>
          <HeadingInput
            name='projectName'
            placeholder='Untitled Project'
            onChange={(e) => setLocalProjectName(e.target.value)}
            value={localProjectName}
            // disabled={!isAuthenticated}
          />
          <InfoButton
            hideText
            useIcon='pencil'
            info={
              isAuthenticated
                ? 'Change project Name'
                : 'Log in to change project name'
            }
          />
          <Button
            type='submit'
            size='small'
            useIcon='tick--small'
            hideText
            title='Save'
          >
            Save
          </Button>
          <Button
            onClick={clearInput}
            size='small'
            useIcon='xmark--small'
            hideText
            title='Cancel'
          >
            Cancel
          </Button>
          {/* <ProjectTitleEditButtons
            setViewMode={setViewMode}
          /> */}
        </Form>
      </ProjectHeading>
      <StatusHeading
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
