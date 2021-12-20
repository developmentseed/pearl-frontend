import React from 'react';
import { PropTypes as T } from 'prop-types';
import { FormInput } from '@devseed-ui/form';

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
export function InputFile(props) {
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
    onChange,
    onBlur,
    accept,
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
      <FormInput
        ref={inputRef}
        type='file'
        accept={accept}
        variation={inputVariation}
        id={id}
        size={inputSize}
        invalid={invalid}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
    </FormGroupStructure>
  );
}

InputFile.propTypes = {
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
  value: T.oneOfType([T.string, T.number]),
  accept: T.string,
};
