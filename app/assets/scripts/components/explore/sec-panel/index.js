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
import { useAoi } from '../../../context/aoi';

const StyledBlockBody = styled(PanelBlockBody)`
  justify-content: flex-start;
  padding-bottom: ${glsp(2)};
  margin-top: auto;
  ${PanelBlockHeader} {
    margin-bottom: ${glsp(0.5)};
    background: none;
  }
`;

const ScrollBodyWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-start;
  height: calc(100vh - 10rem);
`;

const PanelBlockScrollPadded = styled(PanelBlockScroll)`
  padding: 0 1.5rem;
  margin: 0 -1.5rem;
`;

function SecPanel() {
  const { currentCheckpoint } = useCheckpoint();
  const { currentAoi } = useAoi();

  if (!currentCheckpoint || !currentAoi) return null;

  const { px_stats } = currentAoi;

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
          {currentCheckpoint.input_geoms &&
          currentCheckpoint.retrain_geoms &&
          currentCheckpoint.analytics ? (
            <PanelBlockScrollPadded>
              <ScrollBodyWrapper>
                <StyledBlockBody>
                  <PanelBlockHeader>
                    <Subheading>Retraining Sample Distribution</Subheading>
                  </PanelBlockHeader>
                  <ClassAnalyticsChart
                    checkpoint={{
                      ...currentCheckpoint,
                      analytics: currentCheckpoint.analytics.map((c, ind) => ({
                        ...c,
                        px_stat: px_stats[ind],
                      })),
                    }}
                    label='Retraining Sample Distribution'
                    metric='px_stat'
                    formatter = {v => v}
                  />
                </StyledBlockBody>
                <StyledBlockBody>
                  <PanelBlockHeader>
                    <Subheading>Class F1 Scores</Subheading>
                  </PanelBlockHeader>
                  <ClassAnalyticsChart
                    checkpoint={currentCheckpoint}
                    label='Class F1 Score'
                    metric='f1score'
                  />
                </StyledBlockBody>
              </ScrollBodyWrapper>
            </PanelBlockScrollPadded>
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
