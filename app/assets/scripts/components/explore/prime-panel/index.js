import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';

import Panel from '../../common/panel';
import { PanelBlock, PanelBlockBody } from '../../common/panel-block';
import SelectModal from '../../common/select-modal';
import ModelCard from './model-card';
import { useMapLayers, useMapRef } from '../../../context/map';
import { ExploreContext, useMapState } from '../../../context/explore';
import GlobalContext, { useModels } from '../../../context/global';

import { Heading } from '@devseed-ui/typography';
// import {
//   FormGroup,
//   FormGroupHeader,
//   FormGroupBody,
//   FormLabel,
//   FormInput,
// } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';

import TabbedBlock from '../../common/tabbed-block-body';
import RetrainModel from './retrain-model';
import RefineModel from './refine-model';

import PanelHeader from './header';
import PanelFooter from './footer';

import LayersPanel from '../layers-panel';

import { useAuth } from '../../../context/auth';
import {
  useCheckpoint,
  actions as checkpointActions,
  checkpointModes,
} from '../../../context/checkpoint';
import { useInstance } from '../../../context/instance';
import { useAoi } from '../../../context/aoi';
import { usePredictions } from '../../../context/predictions';

const StyledPanelBlock = styled(PanelBlock)`
  width: ${glsp(24)};
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

function PrimePanel() {
  const { isAuthenticated } = useAuth();
  const { mapState, mapModes, setMapMode } = useMapState();
  const { mapRef } = useMapRef();

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

  const { applyCheckpoint } = useInstance();

  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();

  const { mosaicList } = useContext(GlobalContext);
  const { models } = useModels();

  const { mapLayers } = useMapLayers();

  const { predictions } = usePredictions();

  const [showSelectModelModal, setShowSelectModelModal] = useState(false);
  // const [modelFilterString, setModelFilterString] = useState('');
  const [localCheckpointName, setLocalCheckpointName] = useState(
    (currentCheckpoint &&
      currentCheckpoint.bookmarked &&
      currentCheckpoint.name) ||
      ''
  );

  const [activeTab, setActiveTab] = useState(checkpointModes.RETRAIN);

  // Check if AOI and selected model are defined, and if view mode is runnable
  const allowInferenceRun =
    [
      mapModes.BROWSE_MODE,
      mapModes.ADD_CLASS_SAMPLES,
      mapModes.ADD_SAMPLE_POINT,
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
    if ((aoiRef && selectedModel) || !currentAoi) {
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
          return count + c.points.coordinates.length + c.polygons.length;
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
              <TabbedBlock>
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
                    setActiveTab(checkpointModes.RETRAIN);
                    if (currentCheckpoint && currentAoi) {
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
                  disabled={mapState.mode === mapModes.EDIT_AOI_MODE}
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
            {activeTab !== 'LAYERS' && (
              <PanelFooter
                {...{
                  dispatchCurrentCheckpoint,
                  currentCheckpoint,
                  checkpointActions,

                  updateCheckpointName,
                  localCheckpointName,
                  setLocalCheckpointName,

                  mapRef,

                  disabled: mapState.mode === mapModes.EDIT_AOI_MODE,

                  allowInferenceRun,
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
            {/* <FormGroup>
              <FormGroupHeader>
                <FormLabel htmlFor='model-filter'>Search Models</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <FormInput
                  type='text'
                  id='model-filter'
                  name='model-filter'
                  onChange={(e) => setModelFilterString(e.target.value)}
                  placeholder='Filter models'
                />
              </FormGroupBody>
            </FormGroup> */}
          </ModalHeader>
        )}
        filterCard={(card) => {
          return card.name.includes('');
          // return card.name.includes(modelFilterString.toLowerCase());
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
    </>
  );
}

export default PrimePanel;
