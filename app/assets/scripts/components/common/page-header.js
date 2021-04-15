import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import config from '../../config';

import UserDropdown from '../common/user-dropdown';
import { Button } from '@devseed-ui/button';
import {
  themeVal,
  visuallyHidden,
  multiply,
  media,
  glsp,
} from '@devseed-ui/theme-provider';
import { StyledNavLink, StyledLink } from '../../styles/links';

const { appTitle, appLongTitle, baseUrl, environment } = config;

const PageHead = styled.header`
  background-color: ${themeVal('color.surface')};
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

const PageSpecificControls = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  justify-content: flex-end;
  > * ~ * {
    margin-left: 1rem;
  }
`;

const PageTitlePrimeLink = styled.a`
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-gap: 0 ${glsp(0.5)};
  &,
  &:visited {
    color: inherit;
  }
  &::before {
    grid-row: 1 / span 2;
    content: '';
    height: 2.5rem;
    width: 2.5rem;
    background: url('${baseUrl}/assets/graphics/content/app-logo.svg');
    background-size: contain;
    background-repeat: none;
    background-position: top;
  }
  &:hover {
    opacity: 1;
  }
  sub {
    grid-row: 2;
    line-height: 1;
    font-weight: ${themeVal('type.base.regular')};
    text-transform: uppercase;
    align-self: flex-start;
    top: inherit;
    vertical-align: inherit;
    display: none;
    ${media.mediumUp`
      font-size: 0.75rem;
      display: block;
      opacity: 0.72;
      letter-spacing: 2px;
    `}
  }
  strong {
    grid-row: 1 / span 2;
    font-weight: ${themeVal('type.base.weight')};
    letter-spacing: 4px;
    margin: 0;
    text-transform: uppercase;
    line-height: 1rem;
    font-size: 1.25rem;
    align-self: center;
    ${media.mediumUp`
      &:not(:only-child) {
        grid-row: 1;
        align-self: flex-end;
      }
    `}
    span {
      ${visuallyHidden()};
    }
  }
`;

const SecondarySection = styled.div`
  border-left: 0.5px solid ${themeVal('color.baseAlphaC')};
  padding-left: 1.5rem;
  display: grid;
  align-items: center;
  justify-content: space-between;
  grid-template-columns: min-content min-content;
`;

function PageHeader(props) {
  // FIXME: remove this for launch
  const isProduction = environment === 'production';

  return (
    <PageHead role='banner'>
      <PageHeadInner>
        <PageNav role='navigation'>
          <PrimarySection>
            <GlobalMenu>
              <li>
                <PageTitlePrimeLink
                  as={StyledLink}
                  to='/'
                  title='Visit the home page'
                >
                  <strong>
                    <span>Microsoft</span>
                    {appTitle}
                  </strong>
                  {location.pathname.split('/')[1] !== 'project' && (
                    <sub>{appLongTitle}</sub>
                  )}
                </PageTitlePrimeLink>
              </li>
            </GlobalMenu>
            {props.children ? (
              <PageSpecificControls>{props.children}</PageSpecificControls>
            ) : (
              // Default controls when no children is passed
              <PageSpecificControls>
                {location.pathname !== '/' && (
                  <>
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
                      to='/project/new'
                      variation='primary-raised-dark'
                      useIcon='globe'
                      title='Start a new project'
                    >
                      New project
                    </Button>
                  </>
                )}
              </PageSpecificControls>
            )}
          </PrimarySection>
          {
            // FIXME: remove this for launch
            !isProduction && (
              <SecondarySection>
                <UserDropdown />
              </SecondarySection>
            )
          }
        </PageNav>
      </PageHeadInner>
    </PageHead>
  );
}

PageHeader.propTypes = {
  children: T.node,
};

export default PageHeader;
