import React from 'react';
import styled from 'styled-components';

import config from '../../config';

import { NavLink } from 'react-router-dom';
import {
  themeVal,
  stylizeFunction,
  filterComponentProps,
} from '../../styles/utils/general';

import { rgba } from 'polished';
import { visuallyHidden } from '../../styles/helpers';
import collecticon from '../../styles/collecticons';
import { multiply } from '../../styles/utils/math';
import media from '../../styles/utils/media-queries';

const _rgba = stylizeFunction(rgba);

const { appTitle } = config;

const PageHead = styled.header`
  background-color: ${themeVal('color.baseAlphaE')};
  color: ${themeVal('color.baseLight')};
  position: sticky;
  z-index: 20;
  padding: ${multiply(themeVal('layout.space'), 0.5)} 0;
`;

const PageHeadInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  margin: 0 auto;
  ${media.mediumUp`
  `}
`;

const PageNav = styled.nav`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  width: 100%;
  ${media.mediumUp`
  `}
`;

const GlobalMenu = styled.ul`
  display: flex;
  flex: 1;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  margin: 0;
  list-style: none;
`;

const PrimarySection = styled.div`
  grid-column: 1 / 10;

  display: grid;
  align-items: center;
  justify-content: space-between;

  * {
    grid-row: 1;
    width: min-content;
  }

`;
const SecondarySection = styled.ul`
  border-left: 0.5px solid ${themeVal('color.base')};
  grid-column: 10 / -1;
`;

const PageSpecificControls = styled.div`
  display: grid;
  grid-gap: 1rem;
  padding: 0rem 1rem;
`;

const GlobalMenuLink = styled.a`
  position: relative;
  display: block;
  width: ${multiply(themeVal('layout.space'), 3)};
  height: ${multiply(themeVal('layout.space'), 3)};
  line-height: ${multiply(themeVal('layout.space'), 3)};
  text-align: center;
  border-radius: ${themeVal('shape.rounded')};
  transition: all 0.24s ease 0s;

  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    font-size: ${multiply(themeVal('type.base.size'), 1.125)};
  }

  &,
  &:visited {
    color: inherit;
  }

  &:hover {
    opacity: 1;
    background: ${_rgba(themeVal('color.baseLight'), 0.08)};
  }

  &.active {
    color: ${themeVal('color.baseLight')};
    opacity: 1;
    background: ${_rgba(themeVal('color.baseLight'), 0.16)};
  }

  span {
    ${visuallyHidden()}
  }
`;

// See documentation of filterComponentProp as to why this is
const propsToFilter = ['variation', 'size', 'hideText', 'useIcon', 'active'];
const StyledNavLink = filterComponentProps(NavLink, propsToFilter);

function PageHeader(props) {
  return (
    <PageHead role='banner'>
      <PageHeadInner>
        <PageNav role='navigation'>
          <PrimarySection>
            <GlobalMenu>
              <li>
                <GlobalMenuLink
                  as={StyledNavLink}
                  exact
                  to='/'
                  useIcon='house'
                  title='Visit the home page'
                  data-tip={appTitle}
                >
                  <span>{appTitle}</span>
                </GlobalMenuLink>
              </li>
            </GlobalMenu>
            {props.children && (
              <PageSpecificControls>
                {props.children}
              </PageSpecificControls>
            )}
          </PrimarySection>
          <SecondarySection>
          </SecondarySection>
        </PageNav>
      </PageHeadInner>
    </PageHead>
  );
}

PageHeader.propTypes = {};

export default PageHeader;
