/**
 * Creates a file input triggered by the element returned by the children
 *
 * @prop {string} id Id for the file input
 * @prop {string} name Name for the file input
 * @prop {func} onFileSelect Callback for when the file is selected. Called with the selected file.
 * @prop {func} children Render function for the trigger element
 */
import React, { useCallback, useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { visuallyHidden } from '@devseed-ui/theme-provider';

const FileInput = styled.input`
  ${visuallyHidden()}
`;

export function FauxFileDialog({
  name,
  id,
  onFileSelect,
  children,
  'data-cy': dataCy,
}) {
  const fileInputRef = useRef(null);

  const onUploadClick = useCallback(() => fileInputRef.current.click(), []);
  const onChangeFile = useCallback(
    (e) => {
      const file = e.target.files[0];
      e.target.value = '';
      onFileSelect(file);
    },
    [onFileSelect]
  );

  if (typeof children !== 'function') {
    throw new Error('<FauxFileDialog /> expects a single function child');
  }

  return (
    <React.Fragment>
      {children({ onClick: onUploadClick })}
      <FileInput
        type='file'
        id={id}
        data-cy={dataCy}
        name={name}
        ref={fileInputRef}
        onChange={onChangeFile}
      />
    </React.Fragment>
  );
}

FauxFileDialog.propTypes = {
  name: T.string,
  id: T.string,
  onFileSelect: T.func,
  children: T.func,
};
