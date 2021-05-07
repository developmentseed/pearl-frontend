import { rgba, lighten, darken } from 'polished';

let color = {
  baseLight: '#FFFFFF',
  baseDark: '#121826',
  primary: '#07A68C',
  secondary: '#F7C948',
  tertiary: '#42A6D1',
  quaternary: '#EE4E44',
};

color = {
  ...color,
  base: color.baseDark,
  background: color.baseLight,
  surface: color.baseLight,
  link: color.primary,
  danger: color.quaternary,
  warning: color.secondary,
  success: color.primary,
  info: color.tertiary,
};

color = {
  ...color,
  baseAlphaA: rgba(color.base, 0.02),
  baseAlphaB: rgba(color.base, 0.04),
  baseAlphaC: rgba(color.base, 0.08),
  baseAlphaD: rgba(color.base, 0.16),
  baseAlphaE: rgba(color.base, 0.32),
  primaryAlphaA: rgba(color.primary, 0.04),
  primaryAlphaB: rgba(color.primary, 0.08),
  silkLight: `radial-gradient(farthest-side, ${color.baseLight}, ${rgba(
    color.baseLight,
    0.64
  )})`,
  silkDark: `radial-gradient(farthest-side, ${color.baseDark}, ${rgba(
    color.baseDark,
    0.64
  )})`,
};

let colorDark = {
  ...color,
  baseLight: '#F0F4FF',
  baseDark: '#121826',
  primary: '#09CEAD',
};
colorDark = {
  ...colorDark,
  base: colorDark.baseLight,
  background: colorDark.baseDark,
  surface: lighten(0.0625, colorDark.baseDark),
};
colorDark = {
  ...colorDark,
  baseAlphaA: rgba(colorDark.base, 0.02),
  baseAlphaB: rgba(colorDark.base, 0.04),
  baseAlphaC: rgba(colorDark.base, 0.08),
  baseAlphaD: rgba(colorDark.base, 0.16),
  baseAlphaE: rgba(colorDark.base, 0.32),
  baseDarkAlphaA: rgba(darken(0.05, colorDark.baseDark), 0.02),
  baseDarkAlphaB: rgba(darken(0.05, colorDark.baseDark), 0.04),
  baseDarkAlphaC: rgba(darken(0.05, colorDark.baseDark), 0.08),
  baseDarkAlphaD: rgba(darken(0.05, colorDark.baseDark), 0.16),
  baseDarkAlphaE: rgba(darken(0.05, colorDark.baseDark), 0.32),
};

const type = {
  base: {
    root: '16px',
    size: '1rem',
    line: '1.5',
    color: color.base,
    family: '"Titillium Web", Titillium Web, sans-serif',
    style: 'normal',
    settings: 'normal',
    case: 'none',
    light: 300,
    regular: 400,
    medium: 600,
    bold: 700,
    weight: 400,
    antialiasing: true,
  },
  heading: {
    family: '"Titillium Web", Titillium Web, sans-serif',
    style: 'normal',
    settings: 'normal',
    case: 'none',
    light: 300,
    regular: 400,
    medium: 600,
    bold: 700,
    weight: 700,
    textTransform: 'none',
  },
  button: {
    family: '"Titillium Web", Titillium Web, sans-serif',
    style: 'normal',
    settings: 'normal',
    case: 'none',
    weight: 700,
  },
};

const typeDark = {
  ...type,
  base: {
    ...type.base,
    color: colorDark.base,
  },
};

const shape = {
  rounded: '0.25rem',
  ellipsoid: '320rem',
};

const layout = {
  space: '1rem',
  border: '1px',
  min: '320px',
  max: '1280px',
};

const boxShadow = {
  inset: `inset 0px 0px 3px 0px ${color.baseAlphaA};`,
  input: `0 -1px 1px 0 ${color.baseAlphaC}, 0 2px 6px 0 ${color.baseAlphaD};`,
  elevationA: `0 0 4px 0 ${color.baseAlphaC}, 0 2px 2px 0 ${color.baseAlphaC};`,
  elevationB: `0 0 4px 0 ${color.baseAlphaC}, 0 4px 4px 0 ${color.baseAlphaC};`,
  elevationC: `0 0 4px 0 ${color.baseAlphaC}, 0 8px 12px 0 ${color.baseAlphaC};`,
  elevationD: `0 0 4px 0 ${color.baseAlphaC}, 0 12px 24px 0 ${color.baseAlphaC};`,
};

const mediaRanges = {
  xsmall: [null, 543],
  small: [544, 767],
  medium: [768, 991],
  large: [992, 1199],
  xlarge: [1216, null],
};

export default {
  light: {
    layout,
    color,
    type,
    shape,
    boxShadow,
    mediaRanges,
  },
  dark: {
    layout,
    color: colorDark,
    type: typeDark,
    shape,
    boxShadow,
    mediaRanges,
  },
};
