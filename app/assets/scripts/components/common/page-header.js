import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import config from '../../config';

import { Button } from '@devseed-ui/button';
import {
  themeVal,
  rgba,
  visuallyHidden,
  multiply,
  media,
} from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';
// import UserDropdown from '../common/user-dropdown';
import { StyledNavLink, StyledLink } from '../../styles/links';

const { appTitle } = config;

const PageHead = styled.header`
  background-color: ${themeVal('color.baseAlphaA')};
  color: ${themeVal('color.base')};
  position: sticky;
  z-index: 20;
  padding: ${multiply(themeVal('layout.space'), 0.625)} 0;
  max-width: 100vw;
  max-height: 3.5rem;
  overflow: hidden;
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
  grid-template-columns: min-content 1fr;
  grid-gap: 1.5rem;
  * {
    grid-row: 1;
  }
`;

// const SecondarySection = styled.div`
//   border-left: 0.5px solid ${themeVal('color.baseAlphaC')};
//   padding-left: 1.5rem;
//   display: grid;
//   align-items: center;
//   justify-content: space-between;
//   grid-template-columns: min-content min-content;

//   .user-options-trigger::before {
//     ${collecticon('house')}
//     font-size: ${multiply(themeVal('type.base.size'), 1.125)};
//   }
// `;

const PageSpecificControls = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: flex-end;
  > * ~ * {
    margin-left: 1rem;
  }
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

function PageHeader(props) {
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
                {location.pathname !== '/' && (
                  <Button
                    forwardedAs={StyledNavLink}
                    to='/project/new'
                    variation='primary-raised-dark'
                    useIcon='globe'
                    title='Start a new project'
                  >
                    New project
                  </Button>
                )}
              </PageSpecificControls>
            )}
          </PrimarySection>
          {/* <SecondarySection>
            <UserDropdown />
          </SecondarySection> */}
        </PageNav>
      </PageHeadInner>
    </PageHead>
  );
}

PageHeader.propTypes = {
  children: T.node,
};

export default PageHeader;
