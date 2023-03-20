import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { PlaceholderMessage } from '../../../../../styles/placeholder';
import { PanelBlockHeader as BasePanelBlockHeader } from '../../../../common/panel-block';
import { AoiSelector } from './aoi-selector';

export const ToolsWrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};

  ${PlaceholderMessage} {
    padding: 2rem;
  }
`;

function Predict({ className }) {
  return (
    <ToolsWrapper className={className}>
      <Header />
    </ToolsWrapper>
  );
}

Predict.propTypes = {
  className: T.string,
};
export default Predict;

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
      <AoiSelector />
    </PanelBlockHeader>
  );
}

Header.propTypes = {};
