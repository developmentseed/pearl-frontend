import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import config from '../../config';

import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import {
  themeVal,
  rgba,
  visuallyHidden,
  multiply,
  media,
} from '@devseed-ui/theme-provider';
import collecticon from '@devseed-ui/collecticons';
import { StyledNavLink, StyledLink } from '../../styles/links';

const { appTitle, appLongTitle } = config;

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
`;

const PrimarySection = styled.div`
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: max-content 1fr;
  grid-gap: 1.5rem;
  * {
    grid-row: 1;
  }
`;

const AppHeading = styled(Heading)`
  display: flex;
  flex-flow: column nowrap;
  letter-spacing: 4px;
  margin: 0;
  text-transform: uppercase;
  line-height: 1rem;
  span {
    display: none;
    ${media.mediumUp`
      font-weight: normal;
      font-size: 0.75rem;
      display: block;
      opacity: 0.72;
      letter-spacing: 2px;
    `}
  }
`;

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
                />
              </li>
              <AppHeading size='small'>
                {appTitle}
                <span>{appLongTitle}</span>
              </AppHeading>
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
