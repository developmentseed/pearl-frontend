import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

import { PanelBlockHeader as BasePanelBlockHeader } from '../../../../common/panel-block';
import AoiSelection from './aoi-selection.js';
import CheckpointSelection from './checkpoint-selection';
import { ModelSelector } from './model-selector';
import { ImagerySourceSelector } from './imagery-source-selector';
import { MosaicSelector } from './mosaic-selector';

const PanelBlockHeader = styled(BasePanelBlockHeader)`
  display: grid;
  grid-gap: ${glsp(0.75)};
  padding: 0;
  margin: unset;
  background: none;
`;

function Header(props) {
  const { checkpointHasSamples } = props;

  return (
    <PanelBlockHeader id='header'>
      <AoiSelection />
      <ImagerySourceSelector />
      <MosaicSelector />
      <ModelSelector />
      <CheckpointSelection checkpointHasSamples={checkpointHasSamples} />
    </PanelBlockHeader>
  );
}

Header.propTypes = {
  checkpointHasSamples: T.bool,
};

export default Header;
