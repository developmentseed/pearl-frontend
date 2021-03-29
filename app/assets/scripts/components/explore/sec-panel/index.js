import React from 'react';
import ClassDistribitionChart from './class-distribution-chart';
import T from 'prop-types';
import styled from 'styled-components';
import Panel from '../../common/panel';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockBody,
} from '../../common/panel-block';
import { Heading } from '@devseed-ui/typography';
import { Subheading } from '../../../styles/type/heading';
import { PlaceholderMessage } from '../../../styles/placeholder.js';

import { glsp } from '@devseed-ui/theme-provider';

const Block = styled(PanelBlock)`
  grid-template-rows: 2rem 1fr 1fr;
`;

const Body = styled(PanelBlockBody)`
  justify-content: flex-start;
  ${PanelBlockHeader} {
    margin-bottom: ${glsp(0.5)};
  }
`;

function SecPanel(props) {
  const { checkpoint } = props;
  return (
    <Panel
      collapsible
      direction='right'
      initialState={true}
      bodyContent={
        <Block>
          <PanelBlockHeader>
            <Heading size='xsmall'>Analysis</Heading>
          </PanelBlockHeader>
          {checkpoint.analytics ? (
            <>
              <Body>
                <PanelBlockHeader>
                  <Subheading>Class Distribution</Subheading>
                </PanelBlockHeader>
                <ClassDistribitionChart checkpoint={checkpoint} />
              </Body>
            </>
          ) : (
            <PanelBlockBody>
              <PlaceholderMessage>Retrain to see metrics.</PlaceholderMessage>
            </PanelBlockBody>
          )}
        </Block>
      }
      data-cy='secondary-panel'
    />
  );
}

SecPanel.propTypes = {
  checkpoint: T.object,
};

export default SecPanel;
