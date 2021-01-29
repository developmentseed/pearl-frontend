import React from 'react';
import styled from 'styled-components';

import config from '../../config';

import { Link, NavLink } from 'react-router-dom';
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

const { appTitle, appShortTitle } = config;

const PageHead = styled.header`
  background-color: ${themeVal('color.primary')};
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
  display: flex;
  flex-flow: row nowrap;
  flex: 1;
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

class PageHeader extends React.Component {
  render() {
    return (
      <PageHead role='banner'>
        <PageHeadInner>
          <PageNav role='navigation'>
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
              <li>
                <GlobalMenuLink
                  as={StyledNavLink}
                  exact
                  to='/explore'
                  useIcon='compass'
                  data-tip='Explore'
                  title='View Explore page'
                >
                  <span>Explore</span>
                </GlobalMenuLink>
              </li>
              <li>
                <GlobalMenuLink
                  as={StyledNavLink}
                  exact
                  to='/about'
                  useIcon='circle-information'
                  data-tip='About'
                  title='View About page'
                >
                  <span>About</span>
                </GlobalMenuLink>
              </li>
            </GlobalMenu>
          </PageNav>
        </PageHeadInner>
      </PageHead>
    );
  }
}

PageHeader.propTypes = {};

export default PageHeader;
