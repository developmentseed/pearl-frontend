import React from 'react';
import ClassAnalyticsChart from './class-analytics-chart';
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
import { useCheckpoint } from '../../../context/checkpoint';

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
  justify-content: flex-start;
  height: calc(100vh - 10rem);
`;

function SecPanel() {
  const { currentCheckpoint } = useCheckpoint();

  if (!currentCheckpoint) return null;

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
          {currentCheckpoint.input_geoms && currentCheckpoint.retrain_geoms ? (
            <PanelBlockScroll>
              <ScrollBodyWrapper>
                <StyledBlockBody>
                  <PanelBlockHeader>
                    <Subheading>Class Distribution</Subheading>
                  </PanelBlockHeader>
                  <ClassAnalyticsChart
                    checkpoint={currentCheckpoint}
                    metric='percent'
                  />
                </StyledBlockBody>
                <StyledBlockBody>
                  <PanelBlockHeader>
                    <Subheading>Class F-1 Scores</Subheading>
                  </PanelBlockHeader>
                  <ClassAnalyticsChart
                    checkpoint={currentCheckpoint}
                    metric='f1score'
                  />
                </StyledBlockBody>
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

export default SecPanel;
