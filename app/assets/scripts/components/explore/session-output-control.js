import React from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
  DropdownFooter,
  DropdownTrigger,
} from '../../styles/dropdown';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Form, FormInput } from '@devseed-ui/form';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()};
`;

function SessionOutputControl(props) {
  const { isAuthenticated } = useAuth0();

  return (
    <Wrapper>
      <Button variation='base-plain' disabled size='small'
      >
        Session Status
      </Button>

      <Dropdown
        alignment='center'
        direction='down'
        triggerElement={(props) => (
          <DropdownTrigger
            variation='base-raised-semidark'
            preIcon='save'
            title='Open dropdown'
            className='user-options-trigger'
            size='small'
            {...props}
          >
            Save
          </DropdownTrigger>
        )}
        className='global__dropdown'
      >
        <>
          <Heading useAlt>Untitled project</Heading>
          <Form>
            <FormInput placeholder='Enter project name' />
            <Button>Cancel</Button>
          </Form>
        </>
      </Dropdown>
    </Wrapper>
  );
}

export default SessionOutputControl;
