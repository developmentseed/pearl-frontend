import React from 'react';
import App from '../common/app';

import PageHeader from '../common/page-header';
import { PageBody } from '../../styles/page';

function ExportedMaps() {
  return (
    <App pageTitle='ExportedMaps'>
      <PageHeader />
      <PageBody role='main'>
        <div>Exported Maps</div>
      </PageBody>
    </App>
  );
}

export default ExportedMaps;
