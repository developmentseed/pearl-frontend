import { rgba } from 'polished';

let color = {
  baseLight: '#FFFFFF',
  baseDark: '#323232', // "Black"
  primary: '#00264C', // Ocean Blue
  secondary: '#2C3E50', // Midnight Blue
  tertiary: '#673285', // Royal Purple
};

color = {
  ...color,
  base: color.baseDark,
  background: color.baseLight,
  surface: color.baseLight,
  link: color.primary,
  danger: '#B3241C', // Red
  success: '#189C54', // Dark Green
  warning: '#F39C12', // Yellow
  info: color.primary,
};

color = {
  ...color,
  baseAlphaA: rgba(color.base, 0.04),
  baseAlphaB: rgba(color.base, 0.08),
  baseAlphaC: rgba(color.base, 0.16),
  baseAlphaD: rgba(color.base, 0.32),
  silk: `radial-gradient(farthest-side, ${color.surface}, ${rgba(
    color.surface,
    0.64
  )})`,
  darkSilk: `radial-gradient(farthest-side, ${color.baseDark}, ${rgba(
    color.baseDark,
    0.64
  )})`,
};

const type = {
  base: {
    root: '16px',
    size: '1rem',
    line: '1.5',
    color: color.base,
    family: '"Source Sans Pro", sans-serif',
    style: 'normal',
    weight: 300,
    light: 300,
    regular: 400,
    medium: 400,
    bold: 700,
    extrabold: 800,
    antialiasing: true,
  },
  heading: {
    family: '"Source Sans Pro", sans-serif',
    style: 'normal',
    weight: 700,
    light: 300,
    regular: 400,
    medium: 400,
    bold: 700,
    extrabold: 800,
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

export default {
  main: {
    layout,
    color,
    type,
    shape,
  },
};

/**
 * Media query ranges used by the media utility.
 * They're not exported with the main theme because the utility does not
 * build the media functions in runtime, needing the values beforehand.
 */
export const mediaRanges = {
  xsmall: [null, 543],
  small: [544, 767],
  medium: [768, 1023],
  large: [1024, 1399],
  xlarge: [1400, null],
};

export const indicatorGroupColors = {
  economic: {
    color: '#C0C0C0',
    name: 'Grey',
  },
  'water-quality': {
    color: '#154F8D',
    name: 'Deep blue',
  },
  'air-quality': {
    color: '#f2a73a',
    name: 'Gold',
  },
  'greenhouse-gas': {
    color: '#189C54',
    name: 'Dark Green',
  },
};
