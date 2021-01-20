import React from 'react';
import { Link } from 'react-router-dom';

import App from '../common/app';

class About extends React.Component {
  render() {
    return (
      <App pageTitle='About'>
        <h1>About</h1>
        <Link to='/'>
          <strong>Go to home</strong>
        </Link>
      </App>
    );
  }
}

export default About;
