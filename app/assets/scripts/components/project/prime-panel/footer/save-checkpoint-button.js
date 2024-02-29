import React, { useState } from 'react';
import { Dropdown, DropdownBody } from '../../../../styles/dropdown';
import InfoButton from '../../../common/info-button';
import { Form, FormInput } from '@devseed-ui/form';
import { glsp } from '@devseed-ui/theme-provider';

import { ProjectMachineContext } from '../../../../fsm/project';
import { Subheading } from '../../../../styles/type/heading';
import { LocalButton } from '../../../../styles/local-button';
import styled from 'styled-components';

const SaveCheckpoint = styled(DropdownBody)`
  padding: ${glsp()};
`;

const SaveCheckpointButton = () => {
  const actorRef = ProjectMachineContext.useActorRef();
  const currentCheckpoint = ProjectMachineContext.useSelector(
    (s) => s.context.currentCheckpoint
  );

  const [localCheckpointName, setLocalCheckpointName] = useState('');
  return (
    <Dropdown
      alignment='center'
      direction='up'
      triggerElement={(triggerProps) => (
        <InfoButton
          data-cy='save-checkpoint-button'
          variation='primary-plain'
          size='medium'
          useIcon='save-disk'
          useLocalButton
          style={{
            gridColumn: '1 / -1',
          }}
          id='rename-button-trigger'
          {...triggerProps}
        >
          Save Checkpoint
        </InfoButton>
      )}
    >
      <SaveCheckpoint>
        <Subheading>Checkpoint name:</Subheading>
        <Form
          onSubmit={(evt) => {
            evt.preventDefault();
            const name = evt.target.elements.checkpointName.value;
            actorRef.send('Save checkpoint', {
              data: {
                checkpoint: { ...currentCheckpoint, name, bookmarked: true },
              },
            });
          }}
        >
          <FormInput
            name='checkpointName'
            placeholder='Set Checkpoint Name'
            value={localCheckpointName}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            onChange={(e) => setLocalCheckpointName(e.target.value)}
            autoFocus
          />
          <LocalButton
            type='submit'
            variation='primary-plain'
            useIcon='save-disk'
            title='Rename checkpoint'
            data-dropdown='click.close'
          >
            Save
          </LocalButton>
        </Form>
      </SaveCheckpoint>
    </Dropdown>
  );
};

export default SaveCheckpointButton;
