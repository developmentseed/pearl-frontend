import React from 'react';
import ClassDistribitionChart from './class-distribution-chart';
import T from 'prop-types';
import styled from 'styled-components';
import Panel from '../../common/panel';
import { PanelBlockBody } from '../../common/panel-block';

import { glsp } from '@devseed-ui/theme-provider';

const Body = styled(PanelBlockBody)`
  display: flex;
  justify-content: flex-start;
  padding: ${glsp(1)} ${glsp(1.5)};
`;

function SecPanel(props) {
  const { checkpoint } = props;
  return (
    <Panel
      collapsible
      direction='right'
      initialState={true}
      bodyContent={
        <Body>
          <ClassDistribitionChart checkpoint={checkpoint} />
        </Body>
      }
      data-cy='secondary-panel'
    />
  );
}

SecPanel.propTypes = {
  checkpoint: T.object,
};

export default SecPanel;
