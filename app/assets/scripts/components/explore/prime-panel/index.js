import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import T from 'prop-types';

import Panel from '../../common/panel';
import {
  PanelBlock,
  PanelBlockHeader as BasePanelBlockHeader,
  PanelBlockBody,
  PanelBlockFooter,
} from '../../common/panel-block';
import { Subheading } from '../../../styles/type/heading';
import SelectModal from '../select-modal';
import { Card } from '../card-list';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import { ExploreContext, viewModes } from '../../../context/explore';
import TabbedBlock from '../../common/tabbed-block-body';
import RetrainModel from './retrain-model';

import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../styles/panel';
import { EditButton } from '../../../styles/button';

import { availableModels } from '../sample-data';
import { round } from '../../../utils/format';

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

function AoiEditButtons(props) {
  const { setViewMode, viewMode, aoiRef, aoiArea, apiLimits } = props;

  // Display confirm/cancel buttons when AOI edition is active
  if (
    viewMode === viewModes.CREATE_AOI_MODE ||
    viewMode === viewModes.EDIT_AOI_MODE
  ) {
    return (
      <>
        <EditButton
          onClick={function () {
            setViewMode(viewModes.BROWSE_MODE);
          }}
          title='Set Area of Interest'
          useIcon='tick'
          disabled={
            !aoiArea ||
            aoiArea === 0 ||
            (apiLimits &&
              apiLimits.max_inference &&
              apiLimits.max_inference < aoiArea)
          }
        >
          Select AOI
        </EditButton>
        <EditButton useIcon='xmark'>Select AOI</EditButton>
      </>
    );
  }

  return (
    <EditButton
      onClick={() => {
        setViewMode(
          !aoiRef ? viewModes.CREATE_AOI_MODE : viewModes.EDIT_AOI_MODE
        );
      }}
      title='Draw Area of Interest'
      useIcon='pencil'
    >
      Select AOI
    </EditButton>
  );
}

AoiEditButtons.propTypes = {
  setViewMode: T.func,
  viewMode: T.string,
  aoiRef: T.object,
  aoiArea: T.oneOfType([T.bool, T.number]),
  apiLimits: T.oneOfType([T.bool, T.object]),
};

function PrimePanel() {
  const { viewMode, setViewMode, aoiRef, aoiArea, apiLimits } = useContext(
    ExploreContext
  );

  const [selectedModel, setSelectedModel] = useState(null);
  const [showSelectModelModal, setShowSelectModelModal] = useState(false);
  const [inference, setInference] = useState(false);

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
                  {aoiArea && aoiArea > 0
                    ? `${round(aoiArea, 0)} km2`
                    : 'Not selected'}
                </SubheadingStrong>
                <HeadOptionToolbar>
                  <AoiEditButtons
                    setViewMode={setViewMode}
                    aoiRef={aoiRef}
                    aoiArea={aoiArea}
                    viewMode={viewMode}
                    apiLimits={apiLimits}
                  />
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
                  {!inference ? (
                    <PlaceholderMessage>
                      Click &quot;Run Inference&quot; to generate the class LULC
                      map for your AOI
                    </PlaceholderMessage>
                  ) : (
                    <RetrainModel />
                  )}
                </PlaceholderPanelSection>

                <PlaceholderPanelSection name='Refine Results'>
                  <PlaceholderMessage>Refine results</PlaceholderMessage>
                </PlaceholderPanelSection>
                <PlaceholderPanelSection name='Layers'>
                  <PlaceholderMessage>Refine results</PlaceholderMessage>
                </PlaceholderPanelSection>
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
                onClick={() => setInference(true)}
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
