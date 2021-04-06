import React from 'react';
import ClassDistribitionChart from './class-distribution-chart';
import T from 'prop-types';
import styled from 'styled-components';
import Panel from '../../common/panel';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockBody,
  PanelBlockScroll,
} from '../../common/panel-block';
import { Heading } from '@devseed-ui/typography';
import { Subheading } from '../../../styles/type/heading';
import { PlaceholderMessage } from '../../../styles/placeholder.js';

import { glsp } from '@devseed-ui/theme-provider';

const StyledBlockBody = styled(PanelBlockBody)`
  justify-content: flex-start;
  padding-bottom: ${glsp(2)};
  margin-top: auto;
  ${PanelBlockHeader} {
    margin-bottom: ${glsp(0.5)};
  }
`;

const ScrollBodyWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  height: calc(100vh - 10rem);
`;

function SecPanel(props) {
  const { checkpoint } = props;
  return (
    <Panel
      collapsible
      direction='right'
      initialState={true}
      bodyContent={
        <PanelBlock>
          <PanelBlockHeader>
            <Heading size='xsmall'>Analysis</Heading>
          </PanelBlockHeader>
          {checkpoint.input_geoms && checkpoint.retrain_geoms ? (
            <PanelBlockScroll>
              <ScrollBodyWrapper>
                <StyledBlockBody>
                  <PanelBlockHeader>
                    <Subheading>Class Distribution</Subheading>
                  </PanelBlockHeader>
                  <ClassDistribitionChart checkpoint={checkpoint} />
                </StyledBlockBody>
                {/* Stubbed out second chart below:
                <StyledBlockBody>
                  <PanelBlockHeader>
                    <Subheading>Class F-1 Scores</Subheading>
                  </PanelBlockHeader>
                  <ClassF1Chart checkpoint={checkpoint} />
                </StyledBlockBody> */}
              </ScrollBodyWrapper>
            </PanelBlockScroll>
          ) : (
            <PanelBlockBody>
              <PlaceholderMessage>Retrain to see metrics.</PlaceholderMessage>
            </PanelBlockBody>
          )}
        </PanelBlock>
      }
      data-cy='secondary-panel'
    />
  );
}

SecPanel.propTypes = {
  checkpoint: T.object,
};

export default SecPanel;
