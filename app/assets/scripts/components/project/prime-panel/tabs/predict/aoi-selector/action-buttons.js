import React from 'react';

import { EditButton } from '../../../../../../styles/button';

export function AoiActionButtons() {
  return (
    <>
      <EditButton
        title='Draw Area of Interest'
        id='edit-aoi-trigger'
        useIcon='pencil'
        data-cy='aoi-edit-button'
      >
        Select AOI
      </EditButton>
    </>
  );
}
