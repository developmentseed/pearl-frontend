import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Field } from 'formik';
import { FormSelect, FormHelperMessage } from '@devseed-ui/form';

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
 * @prop {boolean} invalid If value is invalid or not
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {function} onChange On change event handler
 * @prop {array} options Select options. Must have a value and a label. Value
 * must be unique
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function InputSelect(props) {
  const {
    id,
    label,
    labelHint,
    className,
    inputSize,
    inputVariation,
    description,
    helper,
    options,
    name,
    invalid,
    value,
    onChange,
    onBlur,
    disabled,
  } = props;

  return (
    <FormGroupStructure
      id={id}
      label={label}
      labelHint={labelHint}
      className={className}
      description={description}
      helper={helper}
    >
      <FormSelect
        disabled={disabled}
        variation={inputVariation}
        id={id}
        invalid={invalid}
        size={inputSize}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        {options.map(({ value, label, ...rest }) => (
          <option key={value} value={value} {...rest}>
            {label}
          </option>
        ))}
      </FormSelect>
    </FormGroupStructure>
  );
}

InputSelect.propTypes = {
  id: T.string,
  name: T.string,
  label: T.string,
  labelHint: T.oneOfType([T.bool, T.func, T.string]),
  className: T.string,
  value: T.oneOfType([T.string, T.number]),
  options: T.arrayOf(
    T.shape({
      value: T.oneOfType([T.string, T.number]),
      label: T.oneOfType([T.string, T.number]),
    })
  ),
  inputSize: T.string,
  inputVariation: T.string,
  invalid: T.bool,
  onBlur: T.func,
  onChange: T.func,
  description: T.string,
  helper: T.node,
  disabled: T.bool,
};

/**
 * InputSelect component for usage with Formik
 *
 * @prop {string} id Input field id
 * @prop {string} name Input field name
 * @prop {string} label Label for the input
 * @prop {function|string} labelHint Hint for the label. Setting it to true
 * shows (optional)
 * @prop {mixed} value Input value
 * @prop {string} inputSize Styled input size option
 * @prop {string} inputVariation Styled input variation option
 * @prop {array} options Select options. Must have a value and a label. Value
 * must be unique
 * @prop {function} onChange On change event handler
 * @prop {string} description Field description shown in a tooltip
 * @prop {node} helper Helper message shown below input.
 */
export function FormikInputSelect({
  className,
  description,
  helper,
  id,
  inputSize,
  inputVariation,
  label,
  labelHint,
  name,
  onBlur,
  onChange,
  options,
  value,
  disabled,
}) {
  return (
    <Field name={name}>
      {({ field, meta }) => {
        return (
          <InputSelect
            disabled={disabled}
            id={id}
            label={label}
            labelHint={labelHint}
            className={className}
            inputSize={inputSize}
            inputVariation={inputVariation}
            description={description}
            helper={
              meta.touched && meta.error ? (
                <FormHelperMessage invalid>{`${meta.error}`}</FormHelperMessage>
              ) : (
                helper
              )
            }
            options={options}
            name={name}
            invalid={!!meta.touched && !!meta.error}
            onChange={onChange}
            onBlur={onBlur}
            {...field}
            value={value}
          />
        );
      }}
    </Field>
  );
}

FormikInputSelect.propTypes = {
  id: T.string,
  name: T.string,
  label: T.string,
  labelHint: T.oneOfType([T.bool, T.func, T.string]),
  className: T.string,
  value: T.oneOfType([T.string, T.number]),
  options: T.arrayOf(
    T.shape({
      value: T.oneOfType([T.string, T.number]),
      label: T.oneOfType([T.string, T.number]),
    })
  ),
  inputSize: T.string,
  inputVariation: T.string,
  onBlur: T.func,
  onChange: T.func,
  description: T.string,
  helper: T.node,
  disabled: T.bool,
};
