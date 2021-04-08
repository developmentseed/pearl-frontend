import React, { useState, Children } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import InfoButton from '../common/info-button';
import { listReset, themeVal, glsp } from '@devseed-ui/theme-provider';

import {
  PanelBlockScroll as ScrollableBody,
  PanelBlockHeader,
} from './panel-block';
import { headingAlt } from '@devseed-ui/typography';

const Tab = styled(InfoButton)`
  display: inline-flex;
  user-select: none;
  position: relative;
  transition: color 0.16s ease-in-out 0s;
  padding: ${glsp(0.25)} 0;
  color: ${themeVal('color.base')};
  ${headingAlt()};
  letter-spacing: 0.5px;
  &,
  &:visited {
    background-color: transparent;
    color: ${themeVal('color.base')};
  }

  &:hover {
    opacity: 1;
    color: ${themeVal('color.primary')};
    background-color: transparent;
  }

  &::after {
    position: absolute;
    margin: 0;
    bottom: 0;
    left: 50%;
    content: '';
    width: 0;
    height: 2px;
    background: ${themeVal('color.primary')};
    transform: translate(-50%, 0);

    /* Animation */
    transition: width 0.24s ease-in-out 0s;
  }

  ${({ active }) =>
    active &&
    css`
      /* stylelint-disable-next-line */
      &,
      &:visited {
        font-weight: ${themeVal('type.heading.weight')};
        color: ${themeVal('color.primary')};
        opacity: 1;
      }
      /* stylelint-disable-next-line no-duplicate-selectors */
      &::after {
        width: 105%;
      }
    `}
`;

const TabbedBlockHeader = styled(PanelBlockHeader)`
  /*padding: 0 1.5rem;*/
  ul {
    ${listReset}
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
  }
  /* PanelBlockHeader sets z-index. This causes
   * issues for TabbedBlockHeader so
   * unset it 
   */
  z-index: unset;
`;

const PanelBlockScroll = styled(ScrollableBody)`
  .inactive-panel {
    display: none;
  }
  padding: ${glsp(0.5)} 0;
`;

function TabbedBlock(props) {
  const { children } = props;
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <TabbedBlockHeader as='nav' role='navigation'>
        <ul>
          {Children.map(children, (child, ind) => {
            const { name, icon, tabId, disabled, tabTooltip } = child.props;
            return (
              <li key={name}>
                <Tab
                  id={tabId || `${name}-tab`}
                  active={ind === activeTab}
                  useIcon={icon}
                  title='Show menu'
                  size='small'
                  visuallyDisabled={disabled}
                  info={disabled ? tabTooltip : null}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!disabled) {
                      setActiveTab(ind);
                      child.props.onTabClick && child.props.onTabClick(e);
                    }
                  }}
                >
                  {name}
                </Tab>
              </li>
            );
          })}
        </ul>
      </TabbedBlockHeader>
      <PanelBlockScroll>
        {Children.map(children, (child, i) => {
          const active = i === activeTab;
          const className = child.props.className || '';
          return (
            <>
              {React.cloneElement(child, {
                active: active,
                //style: active ? {} : { display: 'none' },
                className: active ? className : `${className} inactive-panel`,
              })}
            </>
          );
        })}
      </PanelBlockScroll>
    </>
  );
}

TabbedBlock.propTypes = {
  children: T.node.isRequired,
};
export default TabbedBlock;
