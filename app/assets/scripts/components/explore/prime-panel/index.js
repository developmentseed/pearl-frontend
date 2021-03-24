import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
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
import SelectModal from '../../common/select-modal';
import { Card } from '../../common/card-list';
import {
  Modal,
  ModalHeadline,
  ModalFooter as BaseModalFooter,
} from '@devseed-ui/modal';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import { ExploreContext, viewModes } from '../../../context/explore';
import { MapContext } from '../../../context/map';
import GlobalContext from '../../../context/global';

import TabbedBlock from '../../common/tabbed-block-body';
import RetrainModel from './retrain-model';

import LayersPanel from '../layers-panel';
import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
} from '../../../styles/dropdown';
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
import { CheckpointContext } from '../../../context/checkpoint';

const PlaceholderPanelSection = styled.div`
  padding: ${glsp()};
`;

const SubheadingStrong = styled.h3`
  color: ${themeVal('color.base')};
  font-size: 1.125rem;
  line-height: 1.5rem;
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

const ModalFooter = styled(BaseModalFooter)`
  padding: ${glsp(2)} 0 0 0;
  > button,
  ${Button} {
    flex: 1;
    margin: 0;
    border-radius: 0;
  }
`;

function AoiEditButtons(props) {
  const {
    setViewMode,
    viewMode,
    aoiRef,
    aoiArea,
    aoiBounds,
    setAoiBounds,
    apiLimits,
    map,
    setAoiRef,
  } = props;

  const [activeModal, setActiveModal] = useState(false);

  // Display confirm/cancel buttons when AOI edition is active
  if (
    viewMode === viewModes.CREATE_AOI_MODE ||
    viewMode === viewModes.EDIT_AOI_MODE
  ) {
    return (
      <>
        <EditButton
          onClick={function () {
            if (!apiLimits || apiLimits.live_inference > aoiArea) {
              setViewMode(viewModes.BROWSE_MODE);
              setAoiBounds(aoiRef.getBounds());
            } else if (apiLimits.max_inference > aoiArea) {
              setActiveModal('no-live-inference');
            } else {
              setActiveModal('area-too-large');
            }
          }}
          title='Set Area of Interest'
          useIcon='tick'
        >
          Select AOI
        </EditButton>
        <EditButton
          onClick={() => {
            setViewMode(viewModes.BROWSE_MODE);
            if (aoiBounds) {
              // editing is canceled
              aoiRef.setBounds(aoiBounds);
            } else {
              // Drawing canceled
              map.aoi.control.draw.disable();

              //Edit mode is enabled as soon as draw is done
              if (map.aoi.control.edit._shape) {
                map.aoi.control.edit.disable();
              }

              //Layer must be removed from the map
              map.aoi.control.draw.clear();

              // Layer ref set to null, will be recreated when draw is attempted again
              setAoiRef(null);
            }
          }}
          useIcon='xmark'
        >
          Select AOI
        </EditButton>
        {activeModal && (
          <Modal
            id='confirm-area-size'
            revealed={true}
            size='small'
            closeButton={false}
            renderHeadline={() => (
              <ModalHeadline>
                {activeModal === 'no-live-inference' ? (
                  <h1>Save Area</h1>
                ) : (
                  <h1>Area too large</h1>
                )}
              </ModalHeadline>
            )}
            content={
              activeModal === 'no-live-inference' ? (
                <div>
                  Live inference is not available for areas larger than{' '}
                  {formatThousands(apiLimits.live_inference / 1e6)} km². You can
                  run inference on this AOI as a background process, or resize
                  to a smaller size to engage in retraining and run live
                  inference.
                </div>
              ) : (
                <div>
                  Area size is limited to{' '}
                  {formatThousands(apiLimits.max_inference / 1e6)} km².
                </div>
              )
            }
            renderFooter={() => (
              <ModalFooter>
                {activeModal && activeModal !== 'area-too-large' && (
                  <Button
                    size='xlarge'
                    variation='base-plain'
                    onClick={() => {
                      setActiveModal(false);
                      setViewMode(viewModes.BROWSE_MODE);
                      setAoiBounds(aoiRef.getBounds());
                    }}
                  >
                    Proceed anyway
                  </Button>
                )}
                <Button
                  size='xlarge'
                  variation='primary-plain'
                  onClick={() => setActiveModal(false)}
                >
                  Keep editing
                </Button>
              </ModalFooter>
            )}
          />
        )}
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
      id='edit-aoi-trigger'
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
  setAoiRef: T.func,
  aoiBounds: T.object,
  setAoiBounds: T.func,
  aoiArea: T.oneOfType([T.bool, T.number]),
  apiLimits: T.oneOfType([T.bool, T.object]),
  map: T.object,
};

function PrimePanel() {
  const { isAuthenticated } = useContext(AuthContext);

  const {
    viewMode,
    setViewMode,
    currentProject,
    checkpointList,
    selectedCheckpoint,
    setSelectedCheckpoint,
    selectedModel,
    setSelectedModel,
    aoiRef,
    setAoiRef,
    aoiArea,
    apiLimits,
    runInference,
    retrain,
    predictions,
  } = useContext(ExploreContext);

  const { currentCheckpoint } = useContext(CheckpointContext);

  const { modelsList, mosaicList } = useContext(GlobalContext);

  const { map, mapLayers, aoiBounds, setAoiBounds } = useContext(MapContext);

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
              <HeadOption>
                <HeadOptionHeadline>
                  <Subheading>Selected Area </Subheading>
                </HeadOptionHeadline>
                <SubheadingStrong>
                  {aoiArea && aoiArea > 0
                    ? `${formatThousands(aoiArea / 1e6)} km2`
                    : viewMode === viewModes.CREATE_AOI_MODE
                    ? 'Drag on map to select'
                    : 'None selected - Draw area on map'}
                </SubheadingStrong>
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
                  {checkpointList
                    ? selectedCheckpoint
                      ? selectedCheckpoint.name
                      : 'No checkpoint selected'
                    : 'No checkpoints available'}
                </SubheadingStrong>
                <HeadOptionToolbar>
                  <Dropdown
                    alignment='right'
                    direction='down'
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
                                (selectedCheckpoint && selectedCheckpoint.id)
                              }
                              onClick={() => setSelectedCheckpoint(ckpt)}
                            >
                              {ckpt.name}
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
