import React, { useEffect, useRef } from 'react';
import T from 'prop-types';

import { FormInput } from '@devseed-ui/form';

const AutoFocusFormInput = ({ value, setValue }) => {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <FormInput
      ref={inputRef}
      id='addClassName'
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
};

export default AutoFocusFormInput;
