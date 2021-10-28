import styled from 'styled-components';
import { rgba } from 'polished';

import { themeVal, stylizeFunction, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import ShadowScrollbar from '../common/shadow-scrollbar';

const _rgba = stylizeFunction(rgba);

export const PanelBlock = styled.section`
  flex: 1;
  display: flex;
  flex-flow: column nowrap;

  position: relative;
  z-index: 10;
  box-shadow: 0 -1px 0 0 ${themeVal('color.baseAlphaB')};
`;

export const PanelBlockHeader = styled.header`
  padding: 0 ${glsp(1.5)};
  background: ${_rgba(themeVal('color.surface'), 0.64)};
  position: relative;
  z-index: 10;
`;

export const PanelBlockFooter = styled.footer`
  padding: ${glsp()} ${glsp(1.5)};
  box-shadow: 0px -1px 1px -1px ${themeVal('color.baseAlphaD')};
  position: relative;
  z-index: 10;
`;

export const PanelBlockTitle = styled(Heading).attrs({ size: 'medium' })`
  margin: 0;
  color: ${themeVal('color.base')};
`;

export const PanelBlockBody = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  flex: 1;
`;

export const PanelBlockScroll = styled(ShadowScrollbar)`
  flex: 1;
  z-index: 1;
  background: ${_rgba(themeVal('color.surface'), 0.64)};
`;
