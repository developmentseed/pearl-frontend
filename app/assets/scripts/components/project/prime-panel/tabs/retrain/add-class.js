import React, { useState } from 'react';
import { Button } from '@devseed-ui/button';
import { ChromePicker } from 'react-color';

import { DropdownHeader, DropdownItem } from '../../../../../styles/dropdown';
import {
  PickerStyles,
  PickerDropdownBody,
  PickerDropdownItem,
  PickerDropdownFooter,
} from '../../retrain-refine-styles';
import AutoFocusFormInput from '../../../../common/auto-focus-form-input';
import { ProjectMachineContext } from '../../../../../fsm/project';

const AddClass = () => {
  const actorRef = ProjectMachineContext.useActorRef();
  const [addClassColor, setAddClassColor] = useState('#ffffff');
  const [addClassName, setAddClassName] = useState('');

  const saveClass = () => {
    actorRef.send({
      type: 'Add retrain class',
      data: {
        retrainClass: {
          name: addClassName,
          color: addClassColor,
        },
      },
    });
  };

  return (
    <>
      <DropdownHeader>
        <p>New class</p>
      </DropdownHeader>
      <PickerDropdownBody>
        <PickerDropdownItem nonhoverable as='div'>
          <label htmlFor='addClassName'>
            Class Name
            <AutoFocusFormInput
              inputId='addClassName'
              value={addClassName}
              setValue={setAddClassName}
            />
          </label>
        </PickerDropdownItem>
        <PickerDropdownItem nonhoverable as='div'>
          <label>
            Label Color
            <ChromePicker
              disableAlpha={true}
              color={addClassColor}
              width='100%'
              styles={PickerStyles}
              onChange={(color) => {
                setAddClassColor(color.hex);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            />
          </label>
        </PickerDropdownItem>
      </PickerDropdownBody>
      <PickerDropdownFooter>
        <DropdownItem nonhoverable data-dropdown='click.close'>
          Cancel
        </DropdownItem>
        <DropdownItem
          nonhoverable
          data-dropdown={!addClassName ? '' : 'click.close'}
        >
          <Button
            data-cy='edit-class-save-button'
            variation='primary-plain'
            disabled={!addClassName}
            onClick={(e) => {
              e.stopPropagation();
              saveClass();
              setAddClassName('');
              setAddClassColor('#1CE1CE');
            }}
          >
            Save
          </Button>
        </DropdownItem>
      </PickerDropdownFooter>
    </>
  );
};

AddClass.propTypes = {};

export default AddClass;
