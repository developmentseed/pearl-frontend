import React, { useState } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import T from 'prop-types';
import Panel from '../common/panel';
import {
  PanelBlock,
  PanelBlockHeader,
  PanelBlockBody,
} from '../common/panel-block';
import { Subheading as BaseSubheading } from '../../styles/type/heading';
import SelectModal from './select-modal';
import { Card } from './card-list';
import { PlaceholderMessage } from '../../styles/placeholder.js';

import { availableModels } from './sample-data';

const SubheadingStrong = styled.strong`
  color: ${themeVal('color.base')};
  font-size: 0.875rem;
`;

const Subheading = styled(BaseSubheading)`
  font-size: 0.75rem;
`;

export const HeadOption = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaC')};
  padding: 1rem 0;
  gap: 0.5rem;
`;

export const HeadOptionHeadline = styled.div`
  grid-column: 1 / -1;
`;

export const HeadOptionToolbar = styled.div`
  display: grid;
  justify-self: end;
  grid-template-columns: repeat(auto-fill, minmax(1rem, 1fr));
  gap: 1rem;
  grid-auto-flow: column;
  justify-items: center;
`;

export const EditButton = styled(Button).attrs({
  variation: 'base-plain',
  size: 'small',
  hideText: true,
})`
  opacity: 50%;
  width: min-content;
`;

const StyledPanelBlock = styled(PanelBlock)`
  width: 24rem;
  display: flex;
  justify-content: space-between;
  > * {
    padding: 1.5rem 2rem;
  }
`;

const PanelControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
`;

function PrimePanel(props) {
  const { inferenceResults } = props;

  const [selectedModel, setSelectedModel] = useState(null);
  const [showSelectModelModal, setShowSelectModelModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  return (
    <>
      <Panel
        data-cy='primary-panel'
        collapsible
        direction='left'
        initialState={true}
        fitContent
        bodyContent={
          <StyledPanelBlock>
            <PanelBlockHeader>
              <HeadOption>
                <HeadOptionHeadline>
                  <Subheading>Selected Area </Subheading>
                </HeadOptionHeadline>

                <Subheading variation='primary'>
                  <SubheadingStrong>
                    {selectedArea || 'Not selected'}
                  </SubheadingStrong>
                </Subheading>
                <HeadOptionToolbar>
                  <EditButton
                    onClick={function () {
                      setSelectedArea('1000 km2');
                    }}
                    title='Edit Model'
                    useIcon='area'
                  >
                    Clear and Edit Area
                  </EditButton>
                  <EditButton
                    onClick={function () {
                      setSelectedArea(null);
                    }}
                    title='Edit Model'
                    useIcon='pencil'
                  >
                    Edit Area Selection
                  </EditButton>
                </HeadOptionToolbar>
              </HeadOption>

              <HeadOption>
                <HeadOptionHeadline>
                  <Subheading>Selected Model</Subheading>
                </HeadOptionHeadline>

                <Subheading variation='primary'>
                  <SubheadingStrong>
                    {selectedModel || 'Select Model'}
                  </SubheadingStrong>
                </Subheading>
                <HeadOptionToolbar>
                  <EditButton
                    data-cy='show-select-model-button'
                    useIcon='swap-horizontal'
                    onClick={function () {
                      setShowSelectModelModal(true);
                    }}
                    title='Edit Model'
                  >
                    Edit Model Selection
                  </EditButton>
                </HeadOptionToolbar>
              </HeadOption>
            </PanelBlockHeader>
            <PanelBlockBody>
              {inferenceResults ? (
                <div>Inference</div>
              ) : (
                <PlaceholderMessage>
                  Click &quot;Run Inference&quot; to generate the class LULC map
                  for your AOI
                </PlaceholderMessage>
              )}
            </PanelBlockBody>

            <PanelControls>
              <Button
                variation='base-raised-light'
                size='medium'
                useIcon='tick--small'
                style={{
                  gridColumn: '1 / 2',
                }}
              >
                Reset
              </Button>
              <Button
                variation='base-raised-light'
                size='medium'
                useIcon='tick--small'
                style={{
                  gridColumn: '2 / -1',
                }}
              >
                Undo
              </Button>

              <Button
                variation='base-raised-dark'
                size='medium'
                useIcon='tick--small'
                style={{
                  gridColumn: '1 / -1',
                }}
              >
                Run inference
              </Button>
            </PanelControls>
          </StyledPanelBlock>
        }
      />
      <SelectModal
        id='select-model-modal'
        revealed={showSelectModelModal}
        onOverlayClick={() => {
          setShowSelectModelModal(false);
        }}
        data={availableModels}
        renderCard={(model) => (
          <Card
            id={`model-${model.name}-card`}
            key={model.name}
            title={model.name}
            size='large'
            borderlessMedia
            onClick={() => {
              setShowSelectModelModal(false);
              setSelectedModel(model.name);
            }}
          />
        )}
        nonScrolling
      />
    </>
  );
}

PrimePanel.propTypes = {
  inferenceResults: T.array,
};
export default PrimePanel;
