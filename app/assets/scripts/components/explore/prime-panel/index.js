import React, { useState, useContext } from 'react';
import styled, { css } from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import collecticon from '@devseed-ui/collecticons';
import Panel from '../../common/panel';
import {
  PanelBlock,
  PanelBlockHeader as BasePanelBlockHeader,
  PanelBlockBody,
  PanelBlockFooter,
} from '../../common/panel-block';
import { Subheading } from '../../../styles/type/heading';
import SelectModal from '../../common/select-modal';
import { Card } from '../../common/card-list';
import { PlaceholderMessage } from '../../../styles/placeholder.js';

import { Dropdown, DropdownBody, DropdownItem } from '../../../styles/dropdown';

import { ExploreContext, viewModes } from '../../../context/explore';
import { MapContext } from '../../../context/map';
import GlobalContext from '../../../context/global';

import TabbedBlock from '../../common/tabbed-block-body';
import RetrainModel from './retrain-model';

import LayersPanel from '../layers-panel';

import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../styles/panel';
import { EditButton } from '../../../styles/button';
import InfoButton from '../../common/info-button';

import { availableLayers } from '../sample-data';
import { formatThousands } from '../../../utils/format';
import { AuthContext } from '../../../context/auth';

import { AoiEditButtons } from './aoi-edit-buttons';

const PlaceholderPanelSection = styled.div`
  padding: ${glsp()};
`;

const SubheadingStrong = styled.h3`
  color: ${themeVal('color.base')};
  font-size: 1.125rem;
  line-height: 1.5rem;

  ${({ useIcon }) =>
    useIcon &&
    css`
      display: grid;
      grid-template-columns: max-content max-content;
      grid-gap: 1rem;
      &::after {
        ${collecticon(useIcon)}
      }
    `}
`;

const StyledPanelBlock = styled(PanelBlock)`
  width: ${glsp(24)};
`;

const PanelBlockHeader = styled(BasePanelBlockHeader)`
  display: grid;
  grid-gap: ${glsp()};
`;

const PanelControls = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()};
`;

function PrimePanel() {
  const { isAuthenticated } = useContext(AuthContext);

  const {
    viewMode,
    setViewMode,
    currentProject,
    selectedModel,
    setSelectedModel,
    availableClasses,
    aoiRef,
    setAoiRef,
    aoiArea,
    createNewAoi,
    aoiName,
    loadAoi,
    aoiList,
    apiLimits,
    runInference,
    predictions,
    aoiBounds,
    setAoiBounds,
  } = useContext(ExploreContext);

  const { modelsList, mosaicList } = useContext(GlobalContext);

  const { map, mapLayers } = useContext(MapContext);

  const [showSelectModelModal, setShowSelectModelModal] = useState(false);

  const { models } = modelsList.isReady() && modelsList.getData();

  // Enable/disable "Run Inference" button
  const allowInferenceRun =
    viewMode === viewModes.BROWSE_MODE &&
    aoiRef &&
    aoiArea > 0 &&
    selectedModel;

  // "Run Inference" button
  const applyTooltip = currentProject
    ? 'Run inference for this model'
    : 'Create project and run model';

  const renderAoiHeader = (triggerProps) => {
    let header;
    let area;
    if (aoiArea && aoiArea > 0 && viewMode === viewModes.EDIT_AOI_MODE) {
      header = `${formatThousands(aoiArea / 1e6)} km2`;
    } else if (aoiName) {
      header = aoiName;
      area = `${formatThousands(aoiArea / 1e6)} km2`;
    } else if (viewMode === viewModes.CREATE_AOI_MODE) {
      header = 'Drag on map to select';
    } else {
      header = 'None selected - Draw area on map';
    }

    return (
      <>
        <SubheadingStrong {...triggerProps} useIcon='chevron-down--small'>
          {header}
        </SubheadingStrong>
        {area && (
          <Heading className='subtitle' useAlt>
            {area}
          </Heading>
        )}
      </>
    );
  };

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
              <HeadOption hasSubtitle>
                <HeadOptionHeadline>
                  <Subheading>Selected Area </Subheading>
                </HeadOptionHeadline>

                <Dropdown
                  alignment='left'
                  direction='down'
                  triggerElement={
                    (triggerProps) => renderAoiHeader(triggerProps)
                    /* eslint-disable-next-line */
                  }
                >
                  <>
                    <DropdownBody>
                      {aoiList.map((a) => (
                        <DropdownItem
                          key={a.id}
                          onClick={() => {
                            loadAoi(currentProject, a.id);
                          }}
                        >
                          {`${a.name}`}
                        </DropdownItem>
                      ))}
                      <DropdownItem
                        muted
                        useIcon='plus'
                        onClick={() => {
                          createNewAoi();
                          map.aoi.control.draw.disable();
                          //Layer must be removed from the map
                          map.aoi.control.draw.clear();
                        }}
                      >
                        Add AOI
                      </DropdownItem>
                    </DropdownBody>
                  </>
                </Dropdown>

                <HeadOptionToolbar>
                  <AoiEditButtons
                    setViewMode={setViewMode}
                    aoiRef={aoiRef}
                    setAoiRef={setAoiRef}
                    map={map}
                    aoiArea={aoiArea}
                    setAoiBounds={setAoiBounds}
                    aoiBounds={aoiBounds}
                    viewMode={viewMode}
                    apiLimits={apiLimits}
                  />
                </HeadOptionToolbar>
              </HeadOption>

              <HeadOption>
                <HeadOptionHeadline>
                  <Subheading>Selected Model</Subheading>
                </HeadOptionHeadline>
                <SubheadingStrong data-cy='select-model-label'>
                  {(selectedModel && selectedModel.name) ||
                    (isAuthenticated
                      ? models && models.length
                        ? 'Select Model'
                        : 'No models available'
                      : 'Login to select model')}
                </SubheadingStrong>
                <HeadOptionToolbar>
                  <EditButton
                    data-cy='show-select-model-button'
                    useIcon='swap-horizontal'
                    id='select-model-trigger'
                    onClick={function () {
                      setShowSelectModelModal(true);
                    }}
                    title='Edit Model'
                    disabled={!models?.length}
                  >
                    Edit Model Selection
                  </EditButton>
                </HeadOptionToolbar>
              </HeadOption>
            </PanelBlockHeader>
            <PanelBlockBody>
              <TabbedBlock>
                {predictions && !predictions.error && predictions.fetched ? (
                  <RetrainModel
                    name='retrain model'
                    tabId='retrain-tab-trigger'
                    classList={availableClasses}
                  />
                ) : (
                  <PlaceholderPanelSection
                    name='Retrain Model'
                    tabId='retrain-tab-trigger'
                  >
                    <PlaceholderMessage>
                      Click &quot;Run Inference&quot; to generate the class LULC
                      map for your AOI
                    </PlaceholderMessage>
                  </PlaceholderPanelSection>
                )}
                <PlaceholderPanelSection
                  name='Refine Results'
                  tabId='refine-tab-trigger'
                >
                  <PlaceholderMessage>Refine results</PlaceholderMessage>
                </PlaceholderPanelSection>
                <LayersPanel
                  name='layers'
                  tabId='layers-tab-trigger'
                  layers={availableLayers}
                  baseLayerNames={
                    mosaicList.isReady() && !mosaicList.hasError()
                      ? mosaicList.getData().mosaics
                      : []
                  }
                  onSliderChange={(name, value) => {
                    mapLayers[name].setOpacity(value);
                  }}
                  onVisibilityToggle={(name, value) => {
                    if (value) {
                      map.addLayer(mapLayers[name]);
                    } else {
                      map.removeLayer(mapLayers[name]);
                    }
                  }}
                />
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
                id='reset-button-trigger'
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
                id='undo-button-trigger'
              >
                Undo
              </Button>

              <InfoButton
                variation='primary-raised-dark'
                size='medium'
                useIcon='tick--small'
                style={{
                  gridColumn: '1 / -1',
                }}
                onClick={() => allowInferenceRun && runInference()}
                visuallyDisabled={!allowInferenceRun}
                info={applyTooltip}
                id='apply-button-trigger'
              >
                Run Model
              </InfoButton>
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
        data={models || []}
        renderCard={(model) => (
          <Card
            id={`model-${model.name}-card`}
            key={model.name}
            title={model.name}
            size='large'
            borderlessMedia
            onClick={() => {
              setShowSelectModelModal(false);
              setSelectedModel(model);
            }}
          />
        )}
        nonScrolling
      />
    </>
  );
}

export default PrimePanel;
