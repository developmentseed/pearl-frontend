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
import Prose from '../../../styles/type/prose';
import { Subheading } from '../../../styles/type/heading';

import { glsp } from '@devseed-ui/theme-provider';
import { useCheckpoint } from '../../../context/checkpoint';
import { useAoi } from '../../../context/aoi';
import { round } from '../../../utils/format';

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
const CountList = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
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
          <PanelBlockScrollPadded>
            <ScrollBodyWrapper>
              {currentCheckpoint.input_geoms &&
                currentCheckpoint.retrain_geoms &&
                currentCheckpoint.analytics && (
                  <StyledBlockBody>
                    <PanelBlockHeader>
                      <Subheading>Training Samples Submitted</Subheading>
                    </PanelBlockHeader>
                    <CountList>
                      {Object.values(currentCheckpoint.classes).map(
                        (cl, ind) => {
                          return (
                            <>
                              <Prose size='small'>{cl.name}</Prose>
                              <Prose size='small'>
                                {`${currentCheckpoint.analytics[ind].counts}`}
                              </Prose>
                            </>
                          );
                        }
                      )}
                    </CountList>
                  </StyledBlockBody>
                )}

              {px_stats && currentCheckpoint.classes && (
                <StyledBlockBody>
                  <PanelBlockHeader>
                    <Subheading>Checkpoint Class Distribution</Subheading>
                  </PanelBlockHeader>
                  <ClassAnalyticsChart
                    checkpoint={{
                      ...currentCheckpoint,
                      analytics: Object.keys(currentCheckpoint.classes).map(
                        (_, ind) => ({
                          px_stat: px_stats[ind],
                        })
                      ),
                    }}
                    label='Retraining Sample Distribution'
                    metric='px_stat'
                    formatter={(v) => `${round(v, 2) * 100}%`}
                  />
                </StyledBlockBody>
              )}
              {currentCheckpoint.input_geoms &&
                currentCheckpoint.retrain_geoms &&
                currentCheckpoint.analytics && (
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
                )}
            </ScrollBodyWrapper>
          </PanelBlockScrollPadded>
        </PanelBlock>
      }
      data-cy='secondary-panel'
    />
  );
}

export default SecPanel;
