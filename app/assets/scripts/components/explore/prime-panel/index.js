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

import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
  DropdownFooter,
} from '../../../styles/dropdown';

import {
  ExploreContext,
  useWebsocketClient,
  viewModes,
} from '../../../context/explore';
import { useMap, useMapLayers, usePredictionLayer } from '../../../context/map';
import GlobalContext from '../../../context/global';

import TabbedBlock from '../../common/tabbed-block-body';
import RetrainModel from './retrain-model';

import LayersPanel from '../layers-panel';
import { BOUNDS_PADDING } from '../../common/map/constants';
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
import { useCheckpoint } from '../../../context/checkpoint';

import { AoiEditButtons } from './aoi-edit-buttons';

const SelectAoiTrigger = styled.div`
  cursor: pointer;
`;
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
  grid-gap: ${glsp(0.75)};
`;

const PanelControls = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()};
  padding-bottom: ${glsp(2)};
`;

function PrimePanel() {
  const { isAuthenticated } = useContext(AuthContext);

  const {
    viewMode,
    setViewMode,
    currentProject,
    checkpointList,
    selectedModel,
    setSelectedModel,
    aoiRef,
    setAoiRef,
    aoiArea,
    createNewAoi,
    aoiName,
    loadAoi,
    aoiList,
    apiLimits,
    predictions,
    aoiBounds,
    setAoiBounds,
  } = useContext(ExploreContext);

  const { runInference, retrain } = useWebsocketClient();

  const { currentCheckpoint, applyCurrentCheckpoint } = useCheckpoint();

  const { modelsList, mosaicList } = useContext(GlobalContext);

  const { map } = useMap();
  const { mapLayers } = useMapLayers();
  const {
    predictionLayerSettings,
    setPredictionLayerSettings,
  } = usePredictionLayer();

  const [showSelectModelModal, setShowSelectModelModal] = useState(false);

  const { models } = modelsList.isReady() && modelsList.getData();

  // Check if AOI and selected model are defined, and if view mode is runnable
  const allowInferenceRun =
    [viewModes.BROWSE_MODE, viewModes.ADD_CLASS_SAMPLES].includes(viewMode) &&
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
    let disabled;
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

    const disabledProps = {
      onClick: () => null,
      useIcon: null,
    };

    if (viewMode === viewModes.EDIT_AOI_MODE || aoiList.length === 0) {
      disabled = true;
    }

    return (
      <SelectAoiTrigger>
        <SubheadingStrong
          data-cy='aoi-selection-trigger'
          {...triggerProps}
          useIcon='chevron-down--small'
          {...(disabled ? disabledProps : {})}
        >
          {header}
        </SubheadingStrong>
        {area && (
          <Heading className='subtitle' useAlt>
            {area}
          </Heading>
        )}
      </SelectAoiTrigger>
    );
  };
  // Retrain Panel Tab Empty State message
  //
  const retrainPlaceHolderMessage = () => {
    if (predictions.isReady()) {
      // If predictions are ready, do not need a placeholder
      return null;
    }
    if (aoiRef && selectedModel) {
      return `Click the "Run Model" button to generate the class LULC map for your AOI`;
    } else if (aoiRef && !selectedModel) {
      return `Select a model to use for inference`;
    } else {
      return `Define an Area of Interest to run models at your selected location`;
    }
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
                    <DropdownHeader unshaded>
                      <Heading useAlt size='xsmall'>
                        Available Areas of Interest
                      </Heading>
                    </DropdownHeader>
                    <DropdownBody>
                      {aoiList.map((a) => (
                        <li key={a.id} data-dropdown='click.close'>
                          <DropdownItem
                            onClick={() => {
                              loadAoi(currentProject, a).then((bounds) =>
                                map.fitBounds(bounds, {
                                  padding: BOUNDS_PADDING,
                                })
                              );
                            }}
                          >
                            {`${a.name}`}
                          </DropdownItem>
                        </li>
                      ))}
                    </DropdownBody>
                    {(currentCheckpoint || aoiList.length > 0) && (
                      <DropdownFooter>
                        <DropdownItem
                          useIcon='plus'
                          onClick={() => {
                            createNewAoi();
                            map.aoi.control.draw.disable();
                            //Layer must be removed from the map
                            map.aoi.control.draw.clear();
                          }}
                          data-cy='add-aoi-button'
                          data-dropdown='click.close'
                        >
                          Add AOI
                        </DropdownItem>
                      </DropdownFooter>
                    )}
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

              <HeadOption>
                <HeadOptionHeadline>
                  <Subheading>Checkpoint</Subheading>
                </HeadOptionHeadline>
                <SubheadingStrong>
                  {currentCheckpoint && currentCheckpoint.id
                    ? `${currentCheckpoint.name} (${currentCheckpoint.id})`
                    : '-'}
                </SubheadingStrong>
                <HeadOptionToolbar>
                  <Dropdown
                    alignment='right'
                    direction='down'
                    data-dropdown='click.close'
                    triggerElement={(props) => (
                      <EditButton
                        data-cy='show-select-checkpoint-button'
                        useIcon='swap-horizontal'
                        title={
                          checkpointList
                            ? 'Change checkpoint'
                            : 'Run model to create first checkpoint'
                        }
                        {...props}
                        onClick={() => checkpointList && props.onClick()} // eslint-disable-line
                        id='checkpoint-list-trigger'
                      >
                        Edit Checkpoint Selection
                      </EditButton>
                    )}
                    className='global__dropdown'
                  >
                    <>
                      <DropdownHeader unshaded>
                        <p>Checkpoints</p>
                      </DropdownHeader>
                      <DropdownBody selectable>
                        {checkpointList?.length &&
                          checkpointList.map((ckpt) => (
                            <DropdownItem
                              key={ckpt.id}
                              checked={
                                ckpt.id ==
                                (currentCheckpoint && currentCheckpoint.id)
                              }
                              onClick={() =>
                                applyCurrentCheckpoint(
                                  currentProject.id,
                                  ckpt.id
                                )
                              }
                            >
                              {ckpt.name} ({ckpt.id})
                            </DropdownItem>
                          ))}
                      </DropdownBody>
                    </>
                  </Dropdown>
                </HeadOptionToolbar>
              </HeadOption>
            </PanelBlockHeader>
            <PanelBlockBody>
              <TabbedBlock>
                <RetrainModel
                  name='retrain model'
                  tabId='retrain-tab-trigger'
                  placeholderMessage={retrainPlaceHolderMessage()}
                />
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
                  predictionReady={predictions.isReady()}
                  predictionLayerOpacity={predictionLayerSettings.opacity}
                  onPredictionLayerVisibilityToggle={() => {
                    setPredictionLayerSettings({
                      ...predictionLayerSettings,
                      visible: !predictionLayerSettings.visible,
                    });
                  }}
                  setPredictionLayerOpacity={(v) => {
                    setPredictionLayerSettings({
                      ...predictionLayerSettings,
                      opacity: v,
                    });
                  }}
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
                data-cy={allowInferenceRun ? 'run-model-button' : 'disabled'}
                variation='primary-raised-dark'
                size='medium'
                useIcon='tick--small'
                style={{
                  gridColumn: '1 / -1',
                }}
                onClick={() => {
                  allowInferenceRun && !currentCheckpoint
                    ? runInference()
                    : retrain();
                }}
                visuallyDisabled={!allowInferenceRun}
                info={applyTooltip}
                id='apply-button-trigger'
              >
                {!currentCheckpoint ? 'Run Model' : 'Retrain'}
              </InfoButton>
              <InfoButton
                variation='primary-plain'
                size='medium'
                useIcon='pencil'
                style={{
                  gridColumn: '1 / -1',
                }}
                id='rename-button-trigger'
              >
                Save Checkpoint
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
            id={`model-${model.id}-card`}
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
