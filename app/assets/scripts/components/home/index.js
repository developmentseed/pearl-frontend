import React from 'react';

import App from '../common/app';
import { Link } from 'react-router-dom';

class Home extends React.Component {
  render() {
    return (
      <App pageTitle='Home'>
        <h1>Home</h1>
        <ul>
          <li>
            <Link to='/explore'>Explore</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
        </ul>
      </App>
    );
  }
}

export default Home;
