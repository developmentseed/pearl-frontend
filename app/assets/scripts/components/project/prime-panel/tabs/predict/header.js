import React from 'react';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

import { PanelBlockHeader as BasePanelBlockHeader } from '../../../../common/panel-block';
import AoiSelection from './aoi-selection.js';

const PanelBlockHeader = styled(BasePanelBlockHeader)`
  display: grid;
  grid-gap: ${glsp(0.75)};
  padding: 0;
  margin: unset;
  background: none;
`;

function Header() {
  return (
    <PanelBlockHeader id='header'>
      <AoiSelection />
    </PanelBlockHeader>
  );
}

Header.propTypes = {};

export default Header;
