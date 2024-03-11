import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Field, FastField, useField } from 'formik';
import { FormHelperMessage } from '@devseed-ui/form';
import { ChromePicker } from 'react-color';

import { Dropdown, DropdownTrigger } from '../../../styles/dropdown';
import {
  PickerStyles,
  PickerDropdownBody,
  PickerDropdownItem,
} from '../../project/prime-panel/retrain-refine-styles';
import FormGroupStructure from './form-group-structure';

/**
 * Text input with form group structure.
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * @prop {string} className Classname for the input
 * shows (optional)
 * @prop {mixed} value Input value
 * @prop {string} placeholder Input placeholder value.
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
function InputColor(props) {
  const {
    id,
    name,
    label,
    labelHint,
    className,
    description,
    helper,
    value,
    hideHeader,
  } = props;

  // eslint-disable-next-line
  const [field, meta, helpers] = useField(props);

  return (
    <FormGroupStructure
      id={id}
      name={name}
      label={label}
      labelHint={labelHint}
      className={className}
      description={description}
      helper={helper}
      hideHeader={hideHeader}
    >
      <Dropdown
        alignment='center'
        direction='up'
        triggerElement={(props) => (
          <span
            style={{
              color: '#F0F4FF',
              cursor: 'pointer',
              padding: '0.25rem 0.5rem 0.25rem 0.25rem',
              border: '1px solid rgba(240,244,255,0.16)',
              borderRadius: '0.25rem',
            }}
            as={DropdownTrigger}
            {...props}
          >
            {value}
          </span>
        )}
        className='add-class__dropdown'
      >
        <PickerDropdownBody>
          <PickerDropdownItem nonhoverable as='div'>
            <ChromePicker
              disableAlpha={true}
              color={value}
              width='100%'
              styles={PickerStyles}
              onChange={(color) => {
                helpers.setValue(color.hex);
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
            />
          </PickerDropdownItem>
        </PickerDropdownBody>
      </Dropdown>
    </FormGroupStructure>
  );
}

InputColor.propTypes = {
  className: T.string,
  description: T.string,
  helper: T.node,
  id: T.string,
  label: T.string,
  labelHint: T.oneOfType([T.bool, T.func, T.string]),
  name: T.string,
  value: T.oneOfType([T.string, T.number]),
  hideHeader: T.bool,
  'data-cy': T.string,
};

/**
 * InputText component for usage with Formik
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
 * @prop {mixed} value Input value
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {function} onChange On change event handler
 * @prop {string} placeholder Input placeholder value
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function FormikInputColor({
  className,
  description,
  helper,
  id,
  inputRef,
  inputSize,
  inputVariation,
  label,
  labelHint,
  name,
  onChange,
  onBlur,
  placeholder,
  value,
  useFastField,
  disabled,
  ...rest
}) {
  const FormikField = useFastField ? FastField : Field;
  return (
    <FormikField id={id} name={name}>
      {({ field, meta }) => {
        return (
          <InputColor
            disabled={disabled}
            className={className}
            description={description}
            id={id}
            helper={
              meta.touched && meta.error ? (
                <FormHelperMessage invalid>{`${meta.error}`}</FormHelperMessage>
              ) : (
                helper
              )
            }
            inputRef={inputRef}
            inputSize={inputSize}
            inputVariation={inputVariation}
            label={label}
            labelHint={labelHint}
            name={name}
            placeholder={placeholder}
            {...field}
            onChange={onChange || field.onChange}
            onBlur={onBlur || field.onBlur}
            value={value}
            invalid={!!meta.touched && !!meta.error}
            {...rest}
          />
        );
      }}
    </FormikField>
  );
}

FormikInputColor.propTypes = {
  className: T.string,
  description: T.string,
  helper: T.node,
  id: T.string,
  inputRef: T.object,
  inputSize: T.string,
  inputVariation: T.string,
  label: T.string,
  labelHint: T.oneOfType([T.bool, T.func, T.string]),
  name: T.string,
  onChange: T.func,
  onBlur: T.func,
  placeholder: T.oneOfType([T.string, T.number]),
  value: T.oneOfType([T.string, T.number]),
  useFastField: T.bool,
  'data-cy': T.string,
  disabled: T.bool,
};
