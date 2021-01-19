import React from 'react';
import App from '../common/app';
import { Link } from 'react-router-dom';

class Explore extends React.Component {
  render() {
    return (
      <App pageTitle='Explore'>
        <h1>Explore page</h1>
        <Link to='/'>
          <strong>Go to home</strong>
        </Link>
      </App>
    );
  }
}

export default Explore;
