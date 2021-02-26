import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import config from '../../config';
import { useAuth0 } from '@auth0/auth0-react';
import { NavLink, Link } from 'react-router-dom';

import { Button } from '@devseed-ui/button';
import {
  themeVal,
  rgba,
  visuallyHidden,
  multiply,
  media,
} from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';
import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
  DropdownFooter,
  DropdownTrigger,
} from '../../styles/dropdown';
import { filterComponentProps } from '../../styles/utils/general';

const { appTitle } = config;

const PageHead = styled.header`
  background-color: ${themeVal('color.baseAlphaA')};
  color: ${themeVal('color.baseLight')};
  position: sticky;
  z-index: 20;
  padding: ${multiply(themeVal('layout.space'), 0.625)} 0;
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
  grid-template-columns: 1fr auto;
  padding: 0 1.5rem;
  grid-gap: 1.5rem;
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
  grid-template-columns: 1fr min-content;
  grid-gap: 1.5rem;
  * {
    grid-row: 1;
    width: min-content;
  }
`;

const SecondarySection = styled.div`
  border-left: 0.5px solid ${themeVal('color.baseAlphaC')};
  padding-left: 1.5rem;
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: min-content min-content;

  .user-options-trigger::before {
    ${collecticon('house')}
    font-size: ${multiply(themeVal('type.base.size'), 1.125)};
  }
`;

const PageSpecificControls = styled.div`
  display: grid;
  grid-gap: 1.5rem;
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

// Please refer to filterComponentProps to understand why this is needed
const propsToFilter = [
  'variation',
  'size',
  'hideText',
  'useIcon',
  'active',
  'visuallyDisabled',
];
const StyledNavLink = filterComponentProps(NavLink, propsToFilter);
const StyledLink = filterComponentProps(Link, propsToFilter);

function PageHeader(props) {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const logoutWithRedirect = () =>
    logout({
      returnTo: window.location.origin,
    });

  return (
    <PageHead role='banner'>
      <PageHeadInner>
        <PageNav role='navigation'>
          <PrimarySection>
            <GlobalMenu>
              <li>
                <GlobalMenuLink
                  as={StyledLink}
                  to='/'
                  useIcon='house'
                  title='Visit the home page'
                  data-tip={appTitle}
                >
                  <span>{appTitle}</span>
                </GlobalMenuLink>
              </li>
            </GlobalMenu>
            {props.children ? (
              <PageSpecificControls>{props.children}</PageSpecificControls>
            ) : (
              // Default controls when no children is passed
              <PageSpecificControls>
                <Button
                  forwardedAs={StyledNavLink}
                  to='/about'
                  useIcon='circle-information'
                  title='Visit About page'
                >
                  About
                </Button>
                <Button
                  forwardedAs={StyledNavLink}
                  to='/explore'
                  variation='primary-raised-dark'
                  useIcon='globe'
                  title='Launch application'
                >
                  Launch Application
                </Button>
              </PageSpecificControls>
            )}
          </PrimarySection>
          <SecondarySection>
            {!isAuthenticated ? (
              <Button
                variation='primary-raised-light'
                className='button-class'
                title='sample button'
                onClick={() => loginWithRedirect({ prompt: 'consent' })}
              >
                Log in
              </Button>
            ) : (
              <Dropdown
                alignment='center'
                direction='down'
                triggerElement={(props) => (
                  <DropdownTrigger
                    variation='primary-raised-light'
                    useIcon={['chevron-down--small', 'after']}
                    usePreIcon='user'
                    title='Open dropdown'
                    className='user-options-trigger'
                    size='medium'
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
                    <DropdownItem
                      useIcon='logout'
                      onClick={() => logoutWithRedirect()}
                    >
                      Sign Out
                    </DropdownItem>
                  </DropdownFooter>
                </>
              </Dropdown>
            )}
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
