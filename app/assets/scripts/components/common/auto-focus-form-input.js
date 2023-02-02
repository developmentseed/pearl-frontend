import React, { useEffect, useRef } from 'react';
import T from 'prop-types';

import { FormInput } from '@devseed-ui/form';

export const AutoFocusFormInput = ({
  value,
  setValue,
  placeholder,
  inputId,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <FormInput
      ref={inputRef}
      id={inputId}
      placeholder={placeholder}
      value={value}
      onKeyDown={(e) => {
        e.stopPropagation();
      }}
      onChange={(e) => {
        setValue(e.target.value);
      }}
    />
  );
};
AutoFocusFormInput.propTypes = {
  value: T.string,
  setValue: T.func,
  placeholder: T.string,
  inputId: T.string,
};

export default AutoFocusFormInput;
