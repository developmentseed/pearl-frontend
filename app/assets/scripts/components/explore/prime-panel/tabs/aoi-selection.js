import React from 'react';
import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../styles/panel';
import { Subheading } from '../../../../styles/type/heading';
import { AoiEditButtons } from '../aoi-edit-buttons';

function AoiSelection({ setDeleteAoi }) {
  return (
    <HeadOption hasSubtitle>
      <HeadOptionHeadline>
        <Subheading>Areas of Interest</Subheading>
      </HeadOptionHeadline>
      <div>aois</div>
      <HeadOptionToolbar>
        <AoiEditButtons
          deleteAoi={(aoi) => setDeleteAoi(aoi)}
        />
      </HeadOptionToolbar>
    </HeadOption>
  );
}

export default AoiSelection;
