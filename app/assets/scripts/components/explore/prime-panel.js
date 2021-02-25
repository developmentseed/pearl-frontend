import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';

import Panel from '../common/panel';
import {
  PanelBlock,
  PanelBlockHeader as BasePanelBlockHeader,
  PanelBlockBody,
  PanelBlockFooter,
} from '../common/panel-block';
import { Subheading } from '../../styles/type/heading';
import SelectModal from './select-modal';
import { Card } from './card-list';
import { PlaceholderMessage } from '../../styles/placeholder.js';
import { ExploreContext, viewModes } from '../../context/explore';
import TabbedBlock from '../common/tabbed-block-body';

import LayersPanel from './layers-panel';

import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../styles/panel';
import { EditButton } from '../../styles/button';

import { availableModels, availableLayers } from './sample-data';

const PlaceholderPanelSection = styled.div`
  padding: 1rem;
`;

const SubheadingStrong = styled.h3`
  color: ${themeVal('color.base')};
  font-size: 1.125rem;
  line-height: 1.5rem;
`;

const StyledPanelBlock = styled(PanelBlock)`
  width: 24rem;
`;

const PanelBlockHeader = styled(BasePanelBlockHeader)`
  display: grid;
  grid-gap: 1rem;
`;

const PanelControls = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
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
        fitContent
        bodyContent={
          <StyledPanelBlock>
            <PanelBlockHeader>
              <HeadOption>
                <HeadOptionHeadline>
                  <Subheading>Selected Area </Subheading>
                </HeadOptionHeadline>
                <SubheadingStrong>
                  {aoi && aoi.area > 0 ? `${aoi.area} km2` : 'Not selected'}
                </SubheadingStrong>
                <HeadOptionToolbar>
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
                </HeadOptionToolbar>
              </HeadOption>

              <HeadOption>
                <HeadOptionHeadline>
                  <Subheading>Selected Model</Subheading>
                </HeadOptionHeadline>
                <SubheadingStrong>
                  {selectedModel || 'Select Model'}
                </SubheadingStrong>
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
              <TabbedBlock>
                <PlaceholderPanelSection name='Retrain Model'>
                  <PlaceholderMessage>
                    Click &quot;Run Inference&quot; to generate the class LULC
                    map for your AOI
                  </PlaceholderMessage>
                </PlaceholderPanelSection>

                <PlaceholderPanelSection name='Refine Results'>
                  <PlaceholderMessage>Refine results</PlaceholderMessage>
                </PlaceholderPanelSection>
                <LayersPanel name='layers' layers={availableLayers} />
              </TabbedBlock>
            </PanelBlockBody>

            <PanelControls>
              <Button
                variation='primary-raised-light'
                size='medium'
                useIcon='tick--small'
                style={{
                  gridColumn: '1 / 2',
                }}
              >
                Reset
              </Button>
              <Button
                variation='primary-raised-light'
                size='medium'
                useIcon='tick--small'
                style={{
                  gridColumn: '2 / -1',
                }}
              >
                Undo
              </Button>

              <Button
                variation='primary-raised-dark'
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

export default PrimePanel;
