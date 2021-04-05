import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import styled, { css } from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';

export const ClassList = styled.div`
  display: grid;
  grid-gap: ${glsp(0.5)};

  ${PlaceholderMessage} {
    padding: 2rem;
  }
`;

export const Class = styled.div`
  display: grid;
  grid-template-columns: min-content auto min-content;
  grid-gap: ${glsp(1)};
  padding-bottom: ${({ placeholder }) => placeholder && glsp()};
  align-items: ${({ placeholder }) => (placeholder ? 'stretch' : 'center')};
  background: none;
  border: none;
  outline: none;
  ${Heading} {
    margin: 0;
    align-self: center;
    text-align: left;
    background: ${({ placeholder }) =>
      placeholder ? themeVal('color.baseAlphaD') : 'none'};
    width: ${({ placeholder }) => (placeholder ? '10rem' : 'initial')};
    height: ${({ placeholder }) => (placeholder ? '1rem' : 'auto')};
    line-height: 1;
  }

  ${({ muted }) =>
    muted &&
    css`
      color: ${themeVal('color.baseAlphaE')};
      border-color: ${themeVal('color.baseAlphaE')};
    `};
  &.add__class {
    transition: all 0.16s ease-out 0s;
    margin-top: ${glsp()};
    padding: ${glsp(0.5)} 0;
    span {
      display: grid;
      grid-template-columns: min-content auto min-content;
      grid-gap: ${glsp(1)};
    }
    :hover {
      color: ${themeVal('color.base')};
    }
  }
  &.placeholder-class:first-child {
    margin-top: ${glsp(2)};
  }
`;
export const Thumbnail = styled.div`
  width: ${glsp(1.5)};
  height: ${glsp(1.5)};
  background: ${({ color }) => color || themeVal('color.baseAlphaD')};
  display: grid;
  justify-content: center;
  align-content: center;
  ${({ outline }) =>
    outline &&
    css`
      border: 1px solid;
    `};
  ${({ useIcon }) =>
    useIcon &&
    css`
      background: none;
      ::before {
        ${({ useIcon }) => useIcon && collecticon(useIcon)}
      }
    `};
`;
