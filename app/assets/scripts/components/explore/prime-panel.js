import React, { useState, useContext } from 'react';
import Panel from '../common/panel';
import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

import { Button } from '@devseed-ui/button';
import { PanelBlock, PanelBlockHeader } from '../common/panel-block';
import { Subheading } from '../../styles/type/heading';
import SelectModal from './select-modal';
import { Card } from './card-list';
import { availableModels } from './sample-data';
import { ExploreContext, viewModes } from '../../context/explore';

const SubheadingStrong = styled.strong`
  color: ${themeVal('color.base')};
`;

export const HeadOption = styled.div`
  & ~ & {
    padding-top: ${glsp(0.5)};
  }
  &:last-of-type {
    box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
    padding-bottom: ${glsp(0.5)};
  }
`;

export const HeadOptionHeadline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > :first-child {
    min-width: 5rem;
  }
`;

export const EditButton = styled(Button).attrs({
  variation: 'base-plain',
  size: 'small',
  hideText: true,
})`
  opacity: 50%;
  margin-left: auto;
`;

function PrimePanel() {
  const { viewMode, setViewMode, aoi } = useContext(ExploreContext);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showSelectModelModal, setShowSelectModelModal] = useState(false);

  return (
    <>
      <Panel
        data-cy='primary-panel'
        collapsible
        direction='left'
        initialState={true}
        bodyContent={
          <PanelBlock>
            <PanelBlockHeader>
              <HeadOptionHeadline>
                <Subheading>Area: </Subheading>
                <Subheading variation='primary'>
                  <SubheadingStrong>
                    {aoi && aoi.area > 0 ? `${aoi.area} km2` : 'Not selected'}
                  </SubheadingStrong>
                </Subheading>
                <EditButton
                  onClick={function () {
                    if (!aoi) {
                      setViewMode(viewModes.CREATE_AOI_MODE);
                    } else {
                      if (viewMode === viewModes.BROWSE_MODE) {
                        setViewMode(viewModes.EDIT_AOI_MODE);
                      } else {
                        setViewMode(viewModes.BROWSE_MODE);
                      }
                    }
                  }}
                  title={
                    aoi ? 'Select Area of Interest' : 'Edit Area of Interest'
                  }
                  useIcon={
                    viewMode === viewModes.EDIT_AOI_MODE
                      ? 'tick'
                      : aoi
                      ? 'pencil'
                      : 'plus'
                  }
                >
                  Select AOI
                </EditButton>
              </HeadOptionHeadline>
            </PanelBlockHeader>
            <PanelBlockHeader>
              <HeadOptionHeadline>
                <Subheading>Model: </Subheading>
                <Subheading variation='primary'>
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
              </HeadOptionHeadline>
            </PanelBlockHeader>
          </PanelBlock>
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
