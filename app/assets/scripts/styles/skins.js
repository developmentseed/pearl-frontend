import { css } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

export const stackSkin = () => css`
  background-color: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaB')};
`;

export const cardSkin = () => css`
  border-radius: ${themeVal('shape.rounded')};
  background-color: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaB')};
`;

export const panelSkin = () => css`
  background-color: ${themeVal('color.background')};
  box-shadow: 0 0 16px 2px ${themeVal('color.baseDarkAlphaB')};
`;

export const surfaceElevatedD = () => css`
  background-color: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.baseAlphaB')},
    0 0 16px 2px ${themeVal('color.baseDarkAlphaB')};
`;
