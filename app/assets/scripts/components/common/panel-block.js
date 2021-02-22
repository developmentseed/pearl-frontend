import styled from 'styled-components';
import { tint } from 'polished';

import { themeVal, stylizeFunction, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import ShadowScrollbar from '../common/shadow-scrollbar';

const _tint = stylizeFunction(tint);

export const PanelBlock = styled.section`
  /* Grid style assumes header, body, footer layout */
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content 1fr min-content;
  grid-gap: 1rem;

  position: relative;
  z-index: 10;
  box-shadow: 0 -1px 0 0 ${themeVal('color.baseAlphaB')};
  padding: ${glsp()} ${glsp(1.5)};
`;

export const PanelBlockHeader = styled.header`
  background: ${_tint(0.02, themeVal('color.surface'))};
  position: relative;
  z-index: 10;
`;

export const PanelBlockFooter = styled.footer`
  box-shadow: 0px -1px 1px -1px ${themeVal('color.baseAlphaD')};
  background: ${_tint(0.02, themeVal('color.surface'))};
  position: relative;
  z-index: 10;
`;

export const PanelBlockTitle = styled(Heading).attrs({ size: 'medium' })`
  margin: 0;
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
`;
