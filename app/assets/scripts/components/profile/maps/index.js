import React from 'react';
import App from '../../common/app';

import PageHeader from '../../common/page-header';
import { PageBody } from '../../../styles/page';

function Maps() {
  return (
    <App pageTitle='Maps'>
      <PageHeader />
      <PageBody role='main'>
        <h1>Maps page</h1>
      </PageBody>
    </App>
  );
}

export default Maps;
