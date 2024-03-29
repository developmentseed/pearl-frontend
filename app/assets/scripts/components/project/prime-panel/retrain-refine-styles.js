import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';

import { PlaceholderMessage } from '../../../styles/placeholder.js';
import {
  DropdownBody,
  DropdownItem,
  DropdownFooter,
} from '../../../styles/dropdown';
import styled, { css } from 'styled-components';
import { Subheading } from '../../../styles/type/heading.js';

export const ToolsWrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};

  ${PlaceholderMessage} {
    padding: 2rem;
  }
`;

export const ClassList = styled.section`
  display: grid;

  > ${Subheading} {
    padding: 0.25rem 1.5rem;
  }
`;

export const Class = styled.div`
  display: grid;
  grid-template-columns: ${glsp(1.5)} minmax(10px, 1fr) auto auto;
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
    ${({ placeholder, noHover }) =>
      !placeholder &&
      !noHover &&
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
  line-height: 1.5rem;
  grid-column: ${(placeholder) => placeholder && '2'};
  grid-row: ${(placeholder) => placeholder && '1 / 3'};
`;

export const ClassSamples = styled.p`
  grid-row: 2;
  grid-column: 2;
  font-size: 0.75rem;
  white-space: nowrap;
`;

export const ClassOptions = styled(Button)`
  grid-row: 1 / 3;
`;

export const Thumbnail = styled.div`
  grid-row: 1 / 3;
  width: ${glsp(1.5)};
  height: ${glsp(1.5)};
  background: ${({ color }) => color || themeVal('color.baseAlphaD')};
  border: 1px solid ${themeVal('color.baseAlphaD')};
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
  grid-template-rows: max-content max-content;
  justify-content: space-between;
  ${Heading},
  ${Subheading} {
    padding: 0;
    grid-column: span 6;
    margin-bottom: ${glsp(0.25)};
  }
  ${Button} {
    padding: ${glsp(0.25)} ${glsp(0.375)};
    box-shadow: none;
    border: 2px solid ${themeVal('color.primaryAlphaB')};
    grid-row: 2;
    transition: all 0.24s ease-out;
    span {
      max-width: 0;
      overflow: hidden;
      opacity: 0;
      transition: all 0.24s ease-out;
    }
    &:before {
      margin-right: 0;
      transition: all 0.24s ease-out;
    }
    &:hover,
    &:active,
    &.active {
      span {
        max-width: 5rem;
        opacity: 1;
      }
      &:before {
        margin-right: ${glsp(0.375)};
      }
    }
    & ~ ${Button} {
      margin-left: ${glsp(0.5)};
    }
  }
`;

export const PickerStyles = {
  default: {
    picker: {
      boxShadow: 'none',
      fontFamily: 'inherit',
      background: themeVal('color.surface'),
    },
    body: {
      padding: '12px 0 6px',
    },
    saturation: {
      paddingBottom: '42%',
    },
  },
  disableAlpha: {
    color: {
      width: '32px',
    },
    swatch: {
      marginTop: '-5px',
      width: '20px',
      height: '20px',
      borderRadius: '10px',
    },
  },
};

export const PickerDropdownBody = styled(DropdownBody)`
  font-weight: 400;
  padding: 0;
`;

export const PickerDropdownItem = styled(DropdownItem)`
  justify-items: stretch;
  grid-template-columns: auto;
  label {
    display: flex;
    flex-flow: column nowrap;
    font-size: 0.875rem;
    & > input,
    & > div {
      margin-top: ${glsp(0.125)};
    }
  }
  input[id^='rc-editable-input'] {
    font-family: ${themeVal('type.base.family')} !important;
    font-size: 0.875rem !important;
    border: 1px solid rgba(240, 244, 255, 0.16) !important;
    border-radius: 0.2rem !important;
    background-color: #1c263c !important;
    color: #f0f4ff !important;
    line-height: 21px !important;
    height: auto !important;
    box-shadow: none !important;
    &:hover {
      box-shadow: none !important;
      border-color: rgba(240, 244, 255, 0.32) !important;
    }
    &:active,
    &:focus {
      outline: 0 !important;
      box-shadow: none !important;
      border-color: rgba(240, 244, 255, 0.64) !important;
    }
  }
  label[for^='rc-editable-input'] {
    color: ${themeVal('color.base')} !important;
    font-size: 0.875rem !important;
  }
  .chrome-picker .flexbox-fix svg {
    fill: ${themeVal('color.baseAlphaE')} !important;
    &:hover {
      fill: ${themeVal('color.base')} !important;
      background: transparent !important;
    }
  }
`;

export const PickerDropdownFooter = styled(DropdownFooter)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  > ${DropdownItem} {
    grid-template-columns: auto;
  }
`;

export const ClassThumbnail = styled.div`
  grid-row: 1 / 3;
  width: ${glsp(1.5)};
  height: ${glsp(1.5)};
  background: ${({ color }) => color || themeVal('color.baseAlphaD')};
  border: 1px solid ${themeVal('color.baseAlphaD')};
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
