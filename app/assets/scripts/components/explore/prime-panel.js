import React, { useState } from 'react';
import Panel from '../common/panel';
import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

import { Button } from '@devseed-ui/button';
import { PanelBlock, PanelBlockHeader } from '../common/panel-block';
import { Subheading } from '../../styles/type/heading';
import SelectModal from './select-modal';
import { Card } from './card-list';

import { availableModels } from './sample-data';

const SubheadingStrong = styled.strong`
  color: ${themeVal('color.base')};
`;

export const HeadOption = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaC')};
  padding-bottom: ${glsp(0.5)};

  & ~ & {
    padding-top: ${glsp(0.5)};
  }
`;

export const HeadOptionHeadline = styled.div`
  grid-column: 1 / -1;
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
  width: 20rem;
`;

function PrimePanel() {
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

                <Subheading
                  variation='primary'
                  style={{
                    gridColumn: '1 / 4',
                  }}
                >
                  <SubheadingStrong>
                    {selectedArea || 'Not selected'}
                  </SubheadingStrong>
                </Subheading>

                <EditButton
                  onClick={function () {
                    setSelectedArea('1000 km2');
                  }}
                  title='Edit Model'
                  useIcon='area'
                  style={{
                    gridColumn: '4',
                    justifySelf: 'end',
                  }}
                >
                  Clear and Edit Area
                </EditButton>
                <EditButton
                  onClick={function () {
                    setSelectedArea(null);
                  }}
                  title='Edit Model'
                  useIcon='trash-bin'
                  style={{
                    gridColumn: '5',
                    justifySelf: 'end',
                  }}
                >
                  Edit Area Selection
                </EditButton>
              </HeadOption>

              <HeadOption>
                <HeadOptionHeadline>
                  <Subheading>Selected Model</Subheading>
                </HeadOptionHeadline>

                <Subheading
                  variation='primary'
                  style={{
                    gridColumn: '1 / 4',
                  }}
                >
                  <SubheadingStrong>
                    {selectedModel || 'Select Model'}
                  </SubheadingStrong>
                </Subheading>

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
              </HeadOption>
            </PanelBlockHeader>
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

export default PrimePanel;
