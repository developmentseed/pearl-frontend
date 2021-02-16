import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import config from '../../config';

import { NavLink } from 'react-router-dom';
import { Button } from '@devseed-ui/button';

import BaseDropdown from '@devseed-ui/dropdown';
import {
  themeVal,
  rgba,
  visuallyHidden,
  multiply,
  media,
} from '@devseed-ui/theme-provider';

import { filterComponentProps } from '../../styles/utils/general';

import collecticon from '@devseed-ui/collecticons';
import {
  DropdownHeader,
  DropdownBody,
  DropdownItem,
  DropdownFooter,
} from '../../styles/dropdown';

const { appTitle } = config;
const Dropdown = styled(BaseDropdown)`
  padding: 0;
`;

const PageHead = styled.header`
  background-color: ${themeVal('color.baseAlphaA')};
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
  grid-template-columns: 6fr 1fr;
  padding: 0 1rem;
  grid-gap: 1rem;
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
  border: 1px solid ${themeVal('color.base')};
  border-radius: 2rem;
`;

const PrimarySection = styled.div`
  display: grid;
  align-items: center;
  justify-content: space-between;

  * {
    grid-row: 1;
    width: min-content;
  }
`;

const SecondarySection = styled.div`
  border-left: 0.5px solid ${themeVal('color.base')};
  padding-left: 1rem;
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: min-content min-content;
  grid-gap: 1rem;

  .user-options-trigger::before {
    ${collecticon('house')}
    font-size: ${multiply(themeVal('type.base.size'), 1.125)};
  }
`;

const PageSpecificControls = styled.div`
  display: grid;
  grid-gap: 1rem;
`;

const GlobalMenuLink = styled.a`
  position: relative;
  display: block;
  width: ${multiply(themeVal('layout.space'), 2)};
  height: ${multiply(themeVal('layout.space'), 2)};
  line-height: ${multiply(themeVal('layout.space'), 2)};
  text-align: center;
  border-radius: ${themeVal('shape.rounded')};
  transition: all 0.24s ease 0s;
  color: ${themeVal('color.base')};

  &::before {
    ${({ useIcon }) => collecticon(useIcon)}
    font-size: ${multiply(themeVal('type.base.size'), 1.125)};
  }

  &,
  &:visited {
    color: ${themeVal('color.base')};
  }

  &:hover {
    opacity: 1;
    background: ${rgba(themeVal('color.baseLight'), 0.08)};
  }

  &.active {
    color: ${themeVal('color.base')};
    opacity: 1;
    background: ${rgba(themeVal('color.baseLight'), 0.16)};
  }

  span {
    ${visuallyHidden()}
  }
`;
const DropdownTrigger = styled(Button)`
  &::before {
    ${collecticon('user')}
    font-size: ${multiply(themeVal('type.base.size'), 0.85)};
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
              <PageSpecificControls>{props.children}</PageSpecificControls>
            )}
          </PrimarySection>
          <SecondarySection>
            <Button
              variation='base-raised-semidark'
              useIcon='circle-question'
              title='App help'
              size='small'
              hideText
            >
              <span>Info</span>
            </Button>

            <Dropdown
              alignment='center'
              direction='down'
              triggerElement={(props) => (
                <DropdownTrigger
                  variation='base-raised-semidark'
                  useIcon={['chevron-down--small', 'after']}
                  title='Open dropdown'
                  className='user-options-trigger'
                  size='small'
                  {...props}
                >
                  Account
                </DropdownTrigger>
              )}
              className='global__dropdown'
            >
              <>
                <DropdownHeader>
                  <p>Hello</p>
                  <h1>Sylvan Couvert</h1>
                </DropdownHeader>
                <DropdownBody>
                  <li>
                    <DropdownItem useIcon='folder'>My Projects</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem useIcon='map'>My Saved Maps</DropdownItem>
                  </li>
                  <li>
                    <DropdownItem useIcon='git-fork'>
                      My Checkpoints
                    </DropdownItem>
                  </li>
                  <li>
                    <DropdownItem useIcon='house' to='/'>
                      Visit Homepage
                    </DropdownItem>
                  </li>
                </DropdownBody>
                <DropdownFooter>
                  <DropdownItem useIcon='logout'>Sign Out</DropdownItem>
                </DropdownFooter>
              </>
            </Dropdown>
          </SecondarySection>
        </PageNav>
      </PageHeadInner>
    </PageHead>
  );
}

PageHeader.propTypes = {
  children: T.node,
};

export default PageHeader;
