import styled from 'styled-components';
import { themeVal } from '../utils/general';
import { glsp } from '../utils/theme-values';
import { FormSwitch } from './switch';
import Button from '../button/button';
import collecticon from '../collecticons/index';

const Form = styled.form`
  display: grid;
  grid-template-rows: auto;
  grid-gap: ${themeVal('layout.space')};
`;

export const FormWrapper = styled.section`
  ${({ active }) => {
    if (!active) {
      return 'display: none;';
    }
  }}
`;

export const FormGroupWrapper = styled.div`
  box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
  padding: 1rem 0;

  &:first-of-type {
    padding-top: 0;
  }
`;

export const FormHeader = styled.div`
  margin-bottom: ${glsp(0.5)};
  font-size: 0.875rem;

  h1 {
    text-transform: uppercase;
    margin-right: auto;
  }
  span {
    color: ${themeVal('color.primary')};
    margin-right: ${glsp()};
  }

  @keyframes open {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  details summary {
    width: 100%;
    padding: 0.5rem 0;
    position: relative;
    cursor: pointer;
    list-style: none;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    line-height: initial;
    outline: 0;
  }

  details summary::-webkit-details-marker {
    display: none;
  }

  details[open] summary ~ * {
    animation: open 240ms ease-in-out;
  }

  details summary:after {
    content: ${collecticon('plus--small')};
    color: ${themeVal('color.primary')};
    position: absolute;
    line-height: 0;
    font-size: 1rem;
    right: 0;
    transform-origin: center;
    transition: transform 240ms ease-in-out;
  }
  details[open] summary:after {
    transform: rotate(45deg);
  }
`;

export const PanelOption = styled.div`
  ${({ hidden }) => hidden && 'display: none;'}
  margin-bottom: 1.5rem;
`;

export const PanelOptionTitle = styled.div`
  font-weight: ${themeVal('type.base.weight')};
  font-size: 0.875rem;
`;
export const HeadOption = styled.div`
  & ~ & {
    padding-top: ${glsp(0.5)};
  }
  &:last-of-type {
    box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
    padding-bottom: ${glsp(0.5)};
  }
`;

export const HeadOptionHeadline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > :first-child {
    min-width: 5rem;
  }
`;

export const OptionHeadline = styled(HeadOptionHeadline)`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  > ${FormSwitch} {
    grid-column-start: 5;
  }
  > ${Button}.info-button {
    grid-column-start: 4;
  }
`;
export const InactiveMessage = styled.div`
  padding: 0.5rem 0;
  font-size: 0.875rem;
  font-style: italic;
`;

export default Form;
