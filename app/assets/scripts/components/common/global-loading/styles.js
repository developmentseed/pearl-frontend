import styled, { createGlobalStyle, keyframes } from 'styled-components';

import { themeVal, antialiased, glsp } from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';

// Block the body scroll when the loading is visible
export const BodyUnscrollable = createGlobalStyle`
  body {
    overflow-y: hidden;
  }
`;

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  display: flex;

  &::before {
    ${collecticon('arrow-spin-cw')}
    animation: ${rotate360} 1s linear infinite;
    transform: translateZ(0);
    font-size: 3rem;
  }
`;

export const GlobalLoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 9997;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
  cursor: not-allowed;
  background: ${themeVal('color.silkLight')};

  &.overlay-loader-enter {
    transform: translate3d(0, 0, 0);
    transition: opacity 0.32s ease 0s, visibility 0.32s linear 0s;
    opacity: 0;
    visibility: hidden;

    &.overlay-loader-enter-active {
      opacity: 1;
      visibility: visible;
    }
  }

  &.overlay-loader-exit {
    transition: opacity 0.32s ease 0s, visibility 0.32s linear 0s;
    opacity: 1;
    visibility: visible;

    &.overlay-loader-exit-active {
      opacity: 0;
      visibility: hidden;
    }
  }
`;

export const Message = styled.p`
  ${antialiased()}
  margin-top: ${glsp()};
  color: ${themeVal('color.base')};
`;
