import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { media, glsp } from '@devseed-ui/theme-provider';

import Panel from '../../common/panel';
import { PanelBlock, PanelBlockBody } from '../../common/panel-block';
import SelectModal from '../../common/select-modal';
import ModelCard from './model-card';
import { useMapRef } from '../../../context/map';
import { ExploreContext, useMapState } from '../../../context/explore';
import { useModels } from '../../../context/global';

import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';

import TabbedBlock from '../../common/tabbed-block-body';
import RetrainModel from './tabs/retrain-model';
import RefineResults from './tabs/refine-results';

import PanelHeader from './header';
import PanelFooter from './footer';

import { useAuth } from '../../../context/auth';
import {
  useCheckpoint,
  actions as checkpointActions,
  checkpointModes,
} from '../../../context/checkpoint';
import { useInstance } from '../../../context/instance';
import { useAoi } from '../../../context/aoi';
import { usePredictions } from '../../../context/predictions';
import { useApiMeta } from '../../../context/api-meta';
import ClearSamplesModal from './clear-samples-modal';

const StyledPanelBlock = styled(PanelBlock)`
  ${media.largeUp`
    width: ${glsp(24)};
  `}
  ${media.xlargeUp`
    width: ${glsp(28)};
  `}
`;

const ModalHeader = styled.header`
  padding: ${glsp(2)};
`;

const Headline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${glsp(1)};

  h1 {
    margin: 0;
  }

  ${Button} {
    height: min-content;
    align-self: center;
  }
`;
const TABS = [0, 1];
const [RETRAIN_TAB_INDEX, REFINE_TAB_INDEX] = TABS;

function PrimePanel() {
  const { isAuthenticated } = useAuth();
  const { mapState, mapModes, setMapMode } = useMapState();
  const { mapRef } = useMapRef();
  const { apiLimits } = useApiMeta();

  const {
    currentProject,
    checkpointList,
    selectedModel,
    setSelectedModel,
    aoiArea,
    createNewAoi,
    loadAoi,
    aoiList,
    aoiBounds,
    setAoiBounds,
    updateCheckpointName,
  } = useContext(ExploreContext);

  const { aoiRef, setAoiRef, aoiName, currentAoi } = useAoi();

  const { applyCheckpoint, runningBatch, getRunningBatch } = useInstance();

  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();

  const { models } = useModels();

  const { predictions } = usePredictions();

  const [showSelectModelModal, setShowSelectModelModal] = useState(false);
  const [showClearSamplesModal, setShowClearSamplesModal] = useState(null);

  const [localCheckpointName, setLocalCheckpointName] = useState(
    (currentCheckpoint &&
      currentCheckpoint.bookmarked &&
      currentCheckpoint.name) ||
      ''
  );

  const [activeTab, setActiveTab] = useState(0);

  // Check if AOI and selected model are defined, and if view mode is runnable
  const allowInferenceRun =
    [
      mapModes.BROWSE_MODE,
      mapModes.ADD_CLASS_SAMPLES,
      mapModes.ADD_SAMPLE_POINT,
      mapModes.ADD_SAMPLE_POLYGON,
      mapModes.ADD_SAMPLE_FREEHAND,
      mapModes.REMOVE_SAMPLE,
    ].includes(mapState.mode) &&
    typeof aoiRef !== 'undefined' &&
    aoiArea > 0 &&
    typeof selectedModel !== 'undefined' &&
    selectedModel !== null;

  // Retrain Panel Tab Empty State message
  const retrainPlaceHolderMessage = () => {
    if (predictions.isReady()) {
      // If predictions are ready, do not need a placeholder
      return null;
    }
    if (
      (aoiRef && selectedModel) ||
      !currentAoi ||
      aoiArea > apiLimits['live_inference']
    ) {
      return `Click the "Run Model" button to generate the class LULC map for your AOI`;
    } else if (aoiRef && !selectedModel) {
      return `Select a model to use for inference`;
    } else {
      return `Define an Area of Interest to run models at your selected location`;
    }
  };

  const checkpointHasSamples = () => {
    if (currentCheckpoint) {
      let sampleCount = Object.values(currentCheckpoint.classes || {}).reduce(
        (count, c) => {
          /**
           * Check which format the point collection is following to get the feature count.
           * This needs a refactor when possible. Feature initialization, map edit operations
           * and retrain tasks should use the same format, which is not happening now.
           */
          const points =
            c.points.type === 'Feature'
              ? c.points.geometry.coordinates
              : c.points.coordinates;

          // Return the feature count
          return count + points.length + c.polygons.length;
        },
        0
      );

      sampleCount += Object.values(
        currentCheckpoint.checkpointBrushes || {}
      ).reduce((count, c) => {
        return count + c.polygons.length;
      }, 0);

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
      if (currentCheckpoint.bookmarked) {
        setLocalCheckpointName(currentCheckpoint.name);
      } else {
        setLocalCheckpointName('');
      }
    }
  }, [currentCheckpoint]);

  // Check if any job is running on project load
  useEffect(() => {
    if (currentProject && !runningBatch) {
      getRunningBatch();
    }
  }, [currentProject, runningBatch]);

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
                checkpointModes,
                checkpointList,
                applyCheckpoint,

                checkpointHasSamples: checkpointHasSamples(),

                setShowSelectModelModal,
                selectedModel,

                isAuthenticated,
                currentProject,
              }}
            />
            <PanelBlockBody>
              <TabbedBlock activeTab={activeTab}>
                <RetrainModel
                  name='retrain model'
                  className='retrain-model'
                  tabId='retrain-tab-trigger'
                  placeholderMessage={retrainPlaceHolderMessage()}
                  ready={
                    currentCheckpoint &&
                    (currentCheckpoint.mode === checkpointModes.RETRAIN ||
                      currentCheckpoint.mode === checkpointModes.RUN) &&
                    currentCheckpoint.classes !== undefined &&
                    currentAoi
                  }
                  disabled={
                    !currentCheckpoint ||
                    mapState.mode === mapModes.EDIT_AOI_MODE
                  }
                  onTabClick={() => {
                    const hasSamples = checkpointHasSamples();
                    function onContinue() {
                      setActiveTab(RETRAIN_TAB_INDEX);
                      if (currentCheckpoint && currentAoi) {
                        setMapMode(mapModes.BROWSE_MODE);
                        dispatchCurrentCheckpoint({
                          type: checkpointActions.SET_ACTIVE_CLASS,
                          data: undefined,
                        });
                        if (currentCheckpoint.mode != checkpointModes.RETRAIN) {
                          // If current checkpoint has not been set,
                          // mode does not need to be set
                          //if (!checkpointHasSamples()) {
                          dispatchCurrentCheckpoint({
                            type: checkpointActions.SET_CHECKPOINT_MODE,
                            data: {
                              mode: checkpointModes.RETRAIN,
                            },
                          });
                          //}
                        }
                      }
                    }
                    if (hasSamples) {
                      //show modal
                      setShowClearSamplesModal(() => onContinue);
                    } else {
                      onContinue();
                    }
                  }}
                />
                <RefineResults
                  name='Refine Results'
                  tabId='refine-tab-trigger'
                  className='refine-model'
                  disabled={
                    !currentCheckpoint ||
                    !currentAoi ||
                    mapState.mode === mapModes.EDIT_AOI_MODE
                  }
                  ready={
                    currentCheckpoint &&
                    currentCheckpoint.mode === checkpointModes.REFINE
                  }
                  tabTooltip='Refine is not available until model has been run or retrained.'
                  onTabClick={() => {
                    const hasSamples = checkpointHasSamples();
                    function onContinue() {
                      setActiveTab(REFINE_TAB_INDEX);
                      if (currentCheckpoint) {
                        setMapMode(mapModes.BROWSE_MODE);
                        dispatchCurrentCheckpoint({
                          type: checkpointActions.SET_ACTIVE_CLASS,
                          data: undefined,
                        });
                        if (currentCheckpoint.mode !== checkpointModes.REFINE) {
                          // If current checkpoint has not been set,
                          // mode does not need to be set
                          dispatchCurrentCheckpoint({
                            type: checkpointActions.SET_CHECKPOINT_MODE,
                            data: {
                              mode: checkpointModes.REFINE,
                            },
                          });
                        }
                      }
                    }

                    if (hasSamples) {
                      setShowClearSamplesModal(() => onContinue);
                    } else {
                      onContinue();
                    }
                  }}
                />
              </TabbedBlock>
            </PanelBlockBody>
            <PanelFooter
              {...{
                dispatchCurrentCheckpoint,
                currentCheckpoint,
                checkpointActions,

                updateCheckpointName,
                localCheckpointName,
                setLocalCheckpointName,

                mapRef,

                setAoiBounds,

                disabled:
                  currentCheckpoint &&
                  (currentCheckpoint.mode === checkpointModes.RETRAIN ||
                    currentCheckpoint.mode === checkpointModes.REFINE) &&
                  !checkpointHasSamples(),

                allowInferenceRun,
              }}
            />
          </StyledPanelBlock>
        }
      />
      <SelectModal
        id='select-model-modal'
        revealed={showSelectModelModal}
        onOverlayClick={() => {
          setShowSelectModelModal(false);
        }}
        data={models.status === 'success' ? models.value : []}
        renderHeader={() => (
          <ModalHeader>
            <Headline>
              {' '}
              <Heading>Starter Models</Heading>
              <Button
                hideText
                variation='base-plain'
                size='small'
                useIcon='xmark'
                onClick={() => setShowSelectModelModal(false)}
              >
                Close modal
              </Button>
            </Headline>
          </ModalHeader>
        )}
        filterCard={(card) => {
          return card.name.includes('');
        }}
        renderCard={(model) => (
          <ModelCard
            key={model.name}
            model={model}
            onClick={() => {
              setShowSelectModelModal(false);
              setSelectedModel(model);
            }}
          />
        )}
        nonScrolling
      />
      <ClearSamplesModal
        revealed={showClearSamplesModal !== null}
        onClear={() => {
          dispatchCurrentCheckpoint({
            type: checkpointActions.CLEAR_SAMPLES,
          });
          mapRef.freehandDraw.clearLayers();
          let clearAndContinue = showClearSamplesModal;
          clearAndContinue();
          setShowClearSamplesModal(null);
        }}
        onCancel={() => {
          setShowClearSamplesModal(null);
        }}
      />
    </>
  );
}

export default PrimePanel;
