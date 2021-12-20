import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Field, FastField } from 'formik';
import { FormHelperMessage, FormSwitch } from '@devseed-ui/form';

import FormGroupStructure from './form-group-structure';

/**
 * Text input with form group structure.
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
 * @prop {mixed} value Input value
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {boolean} invalid If value is invalid or not
 * @prop {function} onChange On change event handler
 * @prop {string} placeholder Input placeholder value.
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function InputSwitch(props) {
  const {
    id,
    label,
    labelHint,
    className,
    inputSize,
    inputVariation,
    description,
    helper,
    inputRef,
    invalid,
    name,
    value,
    placeholder,
    onChange,
    onBlur,
    onKeyUp,
    hideHeader,
    disabled,
    ...rest
  } = props;

  return (
    <FormGroupStructure
      id={id}
      label={label}
      labelHint={labelHint}
      className={className}
      description={description}
      helper={helper}
      hideHeader={hideHeader}
    >
      <FormSwitch
        disabled={disabled}
        ref={inputRef}
        type='checkbox'
        variation={inputVariation}
        id={id}
        size={inputSize}
        invalid={invalid}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
        {...rest}
      />
    </FormGroupStructure>
  );
}

InputSwitch.propTypes = {
  className: T.string,
  description: T.string,
  helper: T.node,
  id: T.string,
  inputRef: T.object,
  inputSize: T.string,
  inputVariation: T.string,
  invalid: T.bool,
  label: T.string,
  labelHint: T.oneOfType([T.bool, T.func, T.string]),
  name: T.string,
  onBlur: T.func,
  onChange: T.func,
  onKeyUp: T.func,
  placeholder: T.oneOfType([T.string, T.number]),
  value: T.oneOfType([T.string, T.number]),
  hideHeader: T.bool,
  'data-cy': T.string,
  disabled: T.bool,
};

/**
 * InputSwitch component for usage with Formik
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
export function FormikInputSwitch({
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
    <FormikField name={name}>
      {({ field, meta }) => {
        return (
          <InputSwitch
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

FormikInputSwitch.propTypes = {
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
