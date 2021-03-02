import React from 'react';
import App from '../../common/app';

import PageHeader from '../../common/page-header';
import { PageBody } from '../../../styles/page';

function Checkpoints() {
  return (
    <App pageTitle='Checkpoints'>
      <PageHeader />
      <PageBody role='main'>
        <h1>Checkpoints page</h1>
      </PageBody>
    </App>
  );
}

export default Checkpoints;
