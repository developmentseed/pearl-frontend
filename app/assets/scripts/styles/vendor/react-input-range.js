import { css } from 'styled-components';
import { buttonVariation } from '@devseed-ui/button';
import { themeVal, rem, disabled } from '@devseed-ui/theme-provider';

// Some dependencies include styles that must be included.
// This file overrides to be used the default react-input-range styles.

const sliderSize = 1;
const trackHeight = 0.5;

export default () => css`
  .input-range__slider {
    ${(props) => {
      return buttonVariation(
        props.theme.color.base,
        'raised',
        'semidark',
        props
      );
    }}
    /* background: none; */
    border: none;
    width: ${rem(sliderSize)};
    height: ${rem(sliderSize)};
    margin-left: ${rem(sliderSize / -2)};
    margin-top: ${rem(sliderSize / -2 + trackHeight / -2)};

    &:active {
      transform: none;
    }

    &:focus {
      box-shadow: none;
    }

    .input-range--disabled & {
      border: none;
      box-shadow: none;
      transform: none;
      pointer-events: none;
    }
  }

  .input-range__label--value {
    display: none;
  }

  .input-range__track {
    height: ${rem(trackHeight)};
    background: ${themeVal('color.baseAlphaD')};

    &--active {
      background: ${themeVal('color.primary')};
    }
  }

  .input-range--disabled {
    &,
    & * {
      cursor: not-allowed;
    }
  }

  .input-range--disabled .input-range__track.input-range__track--active {
    background: ${themeVal('color.primary')};
    ${disabled()}
  }

  .input-range__label-container {
    left: -25%;
  }
  .input-range__label--max .input-range__label-container {
    left: 25%;
  }
`;
