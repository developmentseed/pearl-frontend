import React from 'react';
import App from '../common/app';

import ExploreComponent from './explore';

class Explore extends React.Component {
  render() {
    return (
      <App pageTitle='Explore'>
        <ExploreComponent />
      </App>
    );
  }
}

export default Explore;
