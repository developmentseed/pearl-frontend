import React, { Component } from 'react';
import T from 'prop-types';
import { withRouter } from 'react-router';
import styled from 'styled-components';

import MetaTags from './meta-tags';
import SizeAwareElement from './size-aware-element';
import PageHeader from './page-header';

import { reveal } from '../../styles/animation';

import config from '../../config';

const { appTitle, appDescription } = config;

const Page = styled.div`
  display: grid;
  grid-template-rows: minmax(2rem, min-content) 1fr ${({ hideFooter }) =>
      hideFooter ? 0 : 'auto'};
  min-height: 100vh;
`;

const PageBody = styled.main`
  padding: 0;
  margin: 0;

  /* Animation */
  animation: ${reveal} 0.48s ease 0s 1;
`;

class App extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  // Handle cases where the page is updated without changing
  componentDidUpdate(prevProps) {
    if (
      this.props.location &&
      this.props.location.pathname !== prevProps.location.pathname
    ) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const { pageTitle, children, hideFooter } = this.props;
    const title = pageTitle ? `${pageTitle} — ` : '';

    return (
      <SizeAwareElement element={Page} className='page' hideFooter={hideFooter}>
        <MetaTags title={`${title}${appTitle}`} description={appDescription} />
        <PageHeader />
        <PageBody role='main'>{children}</PageBody>
      </SizeAwareElement>
    );
  }
}

App.propTypes = {
  pageTitle: T.string,
  children: T.node,
  location: T.object,
  hideFooter: T.bool,
};

export default withRouter(App);
