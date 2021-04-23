import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import {
  DropdownBody,
  DropdownItem,
  DropdownFooter,
} from '../../../styles/dropdown';
import styled, { css } from 'styled-components';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';

export const ToolsWrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};

  ${PlaceholderMessage} {
    padding: 2rem;
  }
`;

export const ClassList = styled.section`
  display: grid;

  > ${Heading} {
    padding: 0 1.5rem;
  }
`;

export const Class = styled.div`
  display: grid;
  grid-template-columns: ${glsp(1.5)} minmax(10px, 1fr) ${glsp(2)};
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

export const AddClassButton = styled(Class)`
  color: ${themeVal('color.base')};
  span {
    text-align: left;
  }
  &:before {
    box-shadow: inset 0 0 0 1px ${themeVal('color.base')};
    margin-right: 0;
    color: ${themeVal('color.base')};
    opacity: 0.8;
  }
`;

export const ClassInfoWrapper = styled.div`
  grid-row: 1 / 3;
  grid-column: 2;
  display: flex;
  flex-flow: column;
`;

export const ClassHeading = styled(Heading).attrs({ as: 'h4' })`
  ${truncated}
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
  display: flex;
  flex-flow: row wrap;
  ${Heading} {
    flex-basis: 100%;
  }
  ${Button} {
    padding: 0.25rem 0.75rem 0.25rem 0.5rem;
    box-shadow: none;
    border: 2px solid ${themeVal('color.primaryAlphaB')};

    & ~ ${Button} {
      margin-left: ${glsp()};
    }
  }
`;

export const PickerStyles = {
  default: {
    picker: {
      boxShadow: 'none',
      fontFamily: 'inherit',
    },
    body: {
      padding: '12px 12px 6px',
    },
    saturation: {
      paddingBottom: '42%',
    },
  },
};

export const PickerDropdownBody = styled(DropdownBody)`
  font-weight: 400;
  padding: 0;
`;

export const PickerDropdownItem = styled(DropdownItem)`
  font-weight: 400;
  grid-gap: 0;
  label {
    font-size: 0.875rem;
  }
`;

export const PickerDropdownFooter = styled(DropdownFooter)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
`;
