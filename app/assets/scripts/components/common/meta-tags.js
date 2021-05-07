import React from 'react';
import { PropTypes as T } from 'prop-types';
import { Helmet } from 'react-helmet';

import theme from '../../styles/theme';

import config from '../../config';
const { environment, baseUrl, appTitle, twitterHandle } = config;

const MetaTags = ({ title, description, children }) => {
  return (
    <Helmet>
      <title>{title}</title>
      {description ? <meta name='description' content={description} /> : null}

      {/* Theme color */}
      <meta name='theme-color' content={theme.dark.color.primary} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary' />
      <meta name='twitter:site' content={twitterHandle} />
      <meta name='twitter:title' content={title} />
      {description ? (
        <meta name='twitter:description' content={description} />
      ) : null}
      <meta
        name='twitter:image:src'
        content={`${baseUrl}/assets/graphics/meta/default-meta-image.png`}
      />

      {/* Open Graph */}
      <meta property='og:type' content='website' />
      <meta property='og:url' content={baseUrl} />
      <meta property='og:site_name' content={appTitle} />
      <meta property='og:title' content={title} />
      <meta
        property='og:image'
        content={`${baseUrl}/assets/graphics/meta/default-meta-image.png`}
      />
      {description ? (
        <meta property='og:description' content={description} />
      ) : null}

      {/* Additional children */}
      {children}
    </Helmet>
  );
};

if (environment !== 'production') {
  MetaTags.propTypes = {
    title: T.string,
    description: T.string,
    children: T.node,
  };
}

export default MetaTags;
