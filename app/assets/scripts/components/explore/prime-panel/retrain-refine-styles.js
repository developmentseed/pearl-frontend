import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import styled, { css } from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';

export const ClassList = styled.section`
  display: grid;

  ${PlaceholderMessage} {
    padding: 2rem;
  }

  > ${Heading} {
    padding: 0 1.5rem;
  }
`;

export const Class = styled.div`
  display: grid;
  grid-template-columns: min-content auto min-content;
  grid-gap: 0 ${glsp(1)};
  padding: ${({ placeholder }) =>
    placeholder ? '0 1.5rem 1rem' : '0.5rem 1.5rem'};
  align-items: center;
  background: none;
  border: none;
  outline: none;
  transition: all 0.16s ease-out 0s;
  min-height: 3.125rem;
  ${({ muted }) =>
    muted &&
    css`
      color: ${themeVal('color.baseAlphaE')};
      border-color: ${themeVal('color.baseAlphaE')};
    `};
  &.add__class {
    padding: ${glsp(0.5)} ${glsp(1.5)};
    // Add Class Button styles. May be removed if this takes on a different onClick configuration
    span {
      display: grid;
      grid-template-columns: min-content auto min-content;
      align-items: center;
      grid-gap: 0 ${glsp(1)};
    }
    ${Heading} {
      margin: 0;
      line-height: 1.5;
    }
  }
  &.placeholder-class:first-child {
    margin-top: ${glsp(2)};
  }
  &:hover {
    ${({ placeholder }) =>
      !placeholder &&
      css`
        background: ${themeVal('color.primaryAlphaB')};
        cursor: pointer;
      `}
  }
  ${({ selected }) =>
    selected &&
    css`
      position: relative;
      background: ${themeVal('color.primaryAlphaB')};
      &:after {
        position: absolute;
        content: '';
        width: 6px;
        height: 100%;
        top: 0;
        left: 0;
        background: ${themeVal('color.primary')};
      }
    `};
`;

export const ClassInfoWrapper = styled.div`
  grid-row: 1 / 3;
  grid-column: 2;
  display: flex;
  flex-flow: column;
`;

export const ClassHeading = styled(Heading)`
  margin: 0;
  text-align: left;
  background: ${({ placeholder }) =>
    placeholder ? themeVal('color.baseAlphaD') : 'none'};
  width: ${({ placeholder }) => (placeholder ? '10rem' : 'initial')};
  height: ${({ placeholder }) => (placeholder ? '1rem' : 'auto')};
  line-height: 1;
  grid-column: ${(placeholder) => placeholder && '2'};
  grid-row: ${(placeholder) => placeholder && '1 / 3'};
`;

export const ClassSamples = styled.p`
  grid-row: 2;
  grid-column: 2;
  font-size: 0.75rem;
`;

export const ClassOptions = styled(Button)`
  grid-row: 1 / 3;
`;

export const Thumbnail = styled.div`
  grid-row: 1 / 3;
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

export const ToolBox = styled.section`
  padding: 0 1.5rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 0 ${glsp(0.25)};
  ${Heading} {
    grid-column: 1 / -1;
  }
  ${Button} {
    padding: 0.25rem 0.75rem 0.25rem 0.5rem;
    box-shadow: none;
    border: 2px solid ${themeVal('color.primaryAlphaB')};
  }
`;
