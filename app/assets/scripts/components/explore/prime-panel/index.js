import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

import Panel from '../../common/panel';
import { PanelBlock, PanelBlockBody } from '../../common/panel-block';
import SelectModal from '../../common/select-modal';
import { Card } from '../../common/card-list';

import { useMapLayers, useMapRef } from '../../../context/map';
import {
  ExploreContext,
  useInstance,
  useMapState,
  usePredictions,
} from '../../../context/explore';
import GlobalContext from '../../../context/global';

import TabbedBlock from '../../common/tabbed-block-body';
import RetrainModel from './retrain-model';
import RefineModel from './refine-model';

import PanelHeader from './header';
import PanelFooter from './footer';

import LayersPanel from '../layers-panel';

import { AuthContext } from '../../../context/auth';
import {
  useCheckpoint,
  actions as checkpointActions,
  checkpointModes,
} from '../../../context/checkpoint';

const StyledPanelBlock = styled(PanelBlock)`
  width: ${glsp(24)};
`;

function PrimePanel() {
  const { isAuthenticated } = useContext(AuthContext);
  const { mapState, mapModes, setMapMode } = useMapState();
  const { mapRef } = useMapRef();

  const {
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
    aoiBounds,
    setAoiBounds,
    updateCheckpointName,
  } = useContext(ExploreContext);

  const { runInference, retrain, refine, applyCheckpoint } = useInstance();

  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();

  const { modelsList, mosaicList } = useContext(GlobalContext);

  const { mapLayers } = useMapLayers();

  const { predictions } = usePredictions();

  const [showSelectModelModal, setShowSelectModelModal] = useState(false);
  const [localCheckpointName, setLocalCheckpointName] = useState(
    (currentCheckpoint && currentCheckpoint.name) || ''
  );

  const [activeTab, setActiveTab] = useState(checkpointModes.RETRAIN);

  const { models } = modelsList.isReady() && modelsList.getData();

  // Check if AOI and selected model are defined, and if view mode is runnable
  const allowInferenceRun =
    [
      mapModes.BROWSE_MODE,
      mapModes.ADD_CLASS_SAMPLES,
      mapModes.ADD_SAMPLE_POINT,
      mapModes.ADD_SAMPLE_POLYGON,
      mapModes.REMOVE_SAMPLE,
    ].includes(mapState.mode) &&
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

  const checkpointHasSamples = () => {
    if (currentCheckpoint) {
      let sampleCount = Object.values(currentCheckpoint.classes).reduce(
        (count, c) => {
          return count + c.points.coordinates.length + c.polygons.length;
        },
        0
      );

      sampleCount += Object.values(currentCheckpoint.checkpointBrushes).reduce(
        (count, c) => {
          return count + c.polygons.length;
        },
        0
      );

      // There should be no polygon or point samples on the map
      // User must submit or clear retrain samples before starting refine
      if (sampleCount > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (currentCheckpoint && currentCheckpoint.name) {
      setLocalCheckpointName(currentCheckpoint.name);
    }
  }, [currentCheckpoint]);

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
            <PanelHeader
              {...{
                aoiRef,
                setAoiRef,
                setAoiBounds,
                aoiBounds,
                aoiArea,
                aoiName,
                aoiList,
                loadAoi,
                createNewAoi,

                mapState,
                mapModes,
                mapRef,

                currentCheckpoint,
                checkpointList,
                applyCheckpoint,

                setShowSelectModelModal,
                selectedModel,
                models,

                isAuthenticated,
                currentProject,
              }}
            />
            <PanelBlockBody>
              <TabbedBlock>
                <RetrainModel
                  name='retrain model'
                  className='retrain-model'
                  tabId='retrain-tab-trigger'
                  placeholderMessage={retrainPlaceHolderMessage()}
                  ready={
                    currentCheckpoint &&
                    (currentCheckpoint.mode === checkpointModes.RETRAIN ||
                      currentCheckpoint.mode === checkpointModes.RUN)
                  }
                  onTabClick={() => {
                    setActiveTab(checkpointModes.RETRAIN);
                    if (currentCheckpoint) {
                      setMapMode(mapModes.BROWSE_MODE);
                      dispatchCurrentCheckpoint({
                        type: checkpointActions.SET_ACTIVE_CLASS,
                        data: undefined,
                      });
                      if (currentCheckpoint.mode != checkpointModes.RETRAIN) {
                        // If current checkpoint has not been set,
                        // mode does not need to be set
                        if (!checkpointHasSamples()) {
                          dispatchCurrentCheckpoint({
                            type: checkpointActions.SET_CHECKPOINT_MODE,
                            data: {
                              mode: checkpointModes.RETRAIN,
                            },
                          });
                        }
                      }
                    }
                  }}
                />
                <RefineModel
                  name='Refine Results'
                  tabId='refine-tab-trigger'
                  className='refine-model'
                  disabled={!currentCheckpoint}
                  ready={
                    currentCheckpoint &&
                    currentCheckpoint.mode === checkpointModes.REFINE
                  }
                  tabTooltip='Refine is not available until model has been run or retrained.'
                  onTabClick={() => {
                    setActiveTab(checkpointModes.REFINE);
                    if (currentCheckpoint) {
                      setMapMode(mapModes.BROWSE_MODE);
                      dispatchCurrentCheckpoint({
                        type: checkpointActions.SET_ACTIVE_CLASS,
                        data: undefined,
                      });
                      if (currentCheckpoint.mode !== checkpointModes.REFINE) {
                        // If current checkpoint has not been set,
                        // mode does not need to be set
                        if (!checkpointHasSamples()) {
                          dispatchCurrentCheckpoint({
                            type: checkpointActions.SET_CHECKPOINT_MODE,
                            data: {
                              mode: checkpointModes.REFINE,
                            },
                          });
                        }
                      }
                    }
                  }}
                />
                <LayersPanel
                  onTabClick={() => {
                    setActiveTab('LAYERS');
                  }}
                  className='padded'
                  name='layers'
                  tabId='layers-tab-trigger'
                  mapLayers={mapLayers}
                  baseLayerNames={
                    mosaicList.isReady() && !mosaicList.hasError()
                      ? mosaicList.getData().mosaics
                      : []
                  }
                />
              </TabbedBlock>
            </PanelBlockBody>
            {(!currentCheckpoint || activeTab === currentCheckpoint.mode) && (
              <PanelFooter
                {...{
                  dispatchCurrentCheckpoint,
                  currentCheckpoint,
                  checkpointActions,
                  checkpointModes,

                  updateCheckpointName,
                  localCheckpointName,
                  setLocalCheckpointName,

                  mapRef,

                  allowInferenceRun: allowInferenceRun && true,

                  applyTooltip,
                  runInference,
                  retrain,
                  refine
                }}
              />
            )}
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
