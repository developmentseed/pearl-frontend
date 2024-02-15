import React from 'react';
import styled from 'styled-components';
import ClassAnalyticsChart from './class-analytics-chart';
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
import { round } from '../../../utils/format';
import InfoButton from '../../common/info-button';
import { ProjectMachineContext } from '../../../fsm/project';
import selectors from '../../../fsm/project/selectors';

const StyledBlockBody = styled(PanelBlockBody)`
  justify-content: flex-start;
  padding-bottom: ${glsp(2)};
  margin-top: auto;
  ${PanelBlockHeader} {
    margin-bottom: ${glsp(0.5)};
    padding: 0;
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
`;
const CountList = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  & > ${Prose}:nth-child(2n) {
    text-align: right;
  }
`;
const DefinedTerm = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function SecPanel() {
  const currentCheckpoint = ProjectMachineContext.useSelector(
    selectors.currentCheckpoint
  );
  const currentTimeframe = ProjectMachineContext.useSelector(
    selectors.currentTimeframe
  );

  if (!currentCheckpoint || !currentCheckpoint.analytics || !currentTimeframe)
    return null;

  const { px_stats } = currentTimeframe;

  const sampleCount =
    currentCheckpoint.analytics &&
    currentCheckpoint.analytics.reduce((count, cl) => count + cl.counts, 0);

  return (
    <Panel
      collapsible
      direction='right'
      initialState={currentCheckpoint.classes ? true : false}
      bodyContent={
        <PanelBlock>
          <PanelBlockHeader>
            <Heading size='xsmall'>Analysis</Heading>
          </PanelBlockHeader>
          <PanelBlockScrollPadded>
            <ScrollBodyWrapper>
              {currentCheckpoint.input_geoms &&
                currentCheckpoint.retrain_geoms &&
                currentCheckpoint.analytics &&
                sampleCount > 0 && (
                  <StyledBlockBody>
                    <PanelBlockHeader>
                      <Subheading>Training Samples Submitted</Subheading>
                    </PanelBlockHeader>
                    <CountList>
                      {Object.values(currentCheckpoint.classes).map(
                        (cl, ind) => {
                          return (
                            <React.Fragment key={cl.name}>
                              <Prose size='small'>{cl.name}</Prose>
                              <Prose size='small'>
                                {`${currentCheckpoint.analytics[ind].counts}`}
                              </Prose>
                            </React.Fragment>
                          );
                        }
                      )}
                    </CountList>
                  </StyledBlockBody>
                )}

              {px_stats && currentCheckpoint.classes && (
                <StyledBlockBody data-cy='checkpoint_class_distro'>
                  <PanelBlockHeader>
                    <DefinedTerm>
                      <Subheading>Checkpoint Class Distribution</Subheading>
                      <InfoButton
                        size='small'
                        hideText
                        id='class-dist-info'
                        info='Pixel distribution per class for the current AOI, at the currently loaded checkpoint.'
                      />
                    </DefinedTerm>
                  </PanelBlockHeader>
                  {Object.keys(px_stats).length ? (
                    <ClassAnalyticsChart
                      checkpoint={{
                        ...currentCheckpoint,
                        analytics: Object.keys(currentCheckpoint.classes).map(
                          (_, ind) => ({
                            px_stat: px_stats[ind],
                          })
                        ),
                      }}
                      label='Checkpoint Class Distribution'
                      metric='px_stat'
                      formatter={(v) => `${round(v * 100, 0)}%`}
                    />
                  ) : (
                    <Prose>Class distribution metrics are not available</Prose>
                  )}
                </StyledBlockBody>
              )}
              {currentCheckpoint.input_geoms &&
                currentCheckpoint.retrain_geoms &&
                currentCheckpoint.analytics && (
                  <StyledBlockBody>
                    <PanelBlockHeader>
                      <DefinedTerm>
                        <Subheading>Class F1 Scores</Subheading>
                        <InfoButton
                          size='small'
                          hideText
                          id='class-f1-info'
                          info='Class F1 score shows the harmonic mean of precision and recall per class.'
                        />
                      </DefinedTerm>
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
