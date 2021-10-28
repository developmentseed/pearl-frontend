import React, { useState } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import { ChromePicker } from 'react-color';

import { DropdownHeader, DropdownItem } from '../../../../styles/dropdown';
import {
  PickerStyles,
  PickerDropdownBody,
  PickerDropdownItem,
  PickerDropdownFooter,
} from './retrain-refine-styles';
import AutoFocusFormInput from '../../../common/auto-focus-form-input';
import { actions, useCheckpoint } from '../../../../context/checkpoint';
import { useMapState } from '../../../../context/explore';

const EditClass = ({ currentClassName, currentColor = '#000000' }) => {
  const [addClassColor, setAddClassColor] = useState(currentColor);
  const [addClassName, setAddClassName] = useState(currentClassName);
  const { dispatchCurrentCheckpoint } = useCheckpoint();
  const { mapModes, setMapMode } = useMapState();

  const saveClass = () => {
    if (currentClassName) {
      setMapMode(mapModes.BROWSE_MODE);
      dispatchCurrentCheckpoint({
        type: actions.EDIT_CLASS,
        data: {
          oldName: currentClassName,
          name: addClassName,
          color: addClassColor,
        },
      });
    } else {
      dispatchCurrentCheckpoint({
        type: actions.ADD_CLASS,
        data: {
          name: addClassName,
          color: addClassColor,
        },
      });
    }
  };

  return (
    <>
      <DropdownHeader>
        <p>{currentClassName ? 'Edit Class' : 'New Class'}</p>
      </DropdownHeader>
      <PickerDropdownBody>
        <PickerDropdownItem nonhoverable as='div'>
          <label htmlFor='addClassName'>Class Name</label>
          <AutoFocusFormInput
            inputId='addClassName'
            value={addClassName}
            setValue={setAddClassName}
          />
        </PickerDropdownItem>
        <PickerDropdownItem nonhoverable as='div'>
          <label>Label Color</label>
          <ChromePicker
            disableAlpha={true}
            color={addClassColor}
            width='100%'
            styles={PickerStyles}
            onChangeComplete={(color) => {
              setAddClassColor(color.hex);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
          />
        </PickerDropdownItem>
      </PickerDropdownBody>
      <PickerDropdownFooter>
        <DropdownItem nonhoverable data-dropdown='click.close'>
          Cancel
        </DropdownItem>
        <DropdownItem nonhoverable data-dropdown='click.close'>
          <Button
            data-cy='edit-class-save-button'
            variation='primary-plain'
            onClick={() => {
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

EditClass.propTypes = {
  currentClassName: T.string,
  currentColor: T.string,
};

export default EditClass;
