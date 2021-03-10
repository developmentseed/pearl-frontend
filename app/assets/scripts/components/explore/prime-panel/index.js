import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import T from 'prop-types';
import L from 'leaflet';
import { useAuth0 } from '@auth0/auth0-react';
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
import toasts from '../../common/toasts';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '@devseed-ui/global-loading';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import { ExploreContext, viewModes } from '../../../context/explore';
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
import useLocalstorage from '@rooks/use-localstorage';
import WebsocketClient from '../../../context/websocket-client';

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
  grid-gap: ${glsp()};
`;

const PanelControls = styled(PanelBlockFooter)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: ${glsp()};
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
  const { setViewMode, viewMode, aoiRef, aoiArea, apiLimits } = props;

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
        <EditButton useIcon='xmark'>Select AOI</EditButton>
        {activeModal && (
          <Modal
            id='confirm-area-size'
            revealed={true}
            size='small'
            closeButton={false}
            renderHeadline={() => (
              <ModalHeadline>
                <h1>Save Area</h1>
              </ModalHeadline>
            )}
            content={
              activeModal === 'no-live-inference' ? (
                <div>
                  Live inference is not available for areas larger than{' '}
                  {formatThousands(apiLimits.live_inference)} km2.
                </div>
              ) : (
                <div>
                  Area size is limited to{' '}
                  {formatThousands(apiLimits.max_inference)} km2.
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
  const {
    map,
    viewMode,
    setViewMode,
    aoiRef,
    aoiArea,
    apiLimits,
    setPrediction,
    currentInstance,
    setCurrentInstance
  } = useContext(ExploreContext);

  const { isAuthenticated } = useAuth0();

  const {
    restApiClient,
    selectedModel,
    setSelectedModel,
    modelsList,
  } = useContext(GlobalContext);

  const [showSelectModelModal, setShowSelectModelModal] = useState(false);
  const [inference, setInference] = useState(false);

  const [applyText, setApplyText] = useState();
  const [applyState, setApplyState] = useState();
  const [applyTooltip, setApplyTooltip] = useState();

  const [
    currentProject,
    setCurrentProject,
    removeCurrentProject,
  ] = useLocalstorage(null);

  const [currentInstanceStatus, setCurrentInstanceStatus] = useState(null);
  const [wsClient, setWsClient] = useState(null);

  useEffect(() => {
    if (!aoiArea || !selectedModel) {
      /* pre-AOI selected */
      setApplyState(false);
      setApplyTooltip('Select AOI to run model');
    } else if (!inference) {
      /* AOI selected, inference not yet applied */
      setApplyState(true);
      setApplyTooltip(null);
    }

    setApplyText('Run Model');
  }, [aoiArea, selectedModel]);

  useEffect(() => {
    if (inference) {
      /* No Retraining samples selected, AOI unchanged*/
      setApplyState(false);
      setApplyText('Retrain Model');
      setApplyTooltip('Select retraining samples to retrain model');
    }
  }, [inference /* retraining samples */]);

  const { models } = modelsList.isReady() && modelsList.getData();

  function requestPrediction() {

  }

  async function handleInferenceRun() {
    // if (!applyState) {
    //   return;
    // }
    // setInference(true);

    if (restApiClient) {
      let project = currentProject;
      if (!project) {
        try {
          showGlobalLoadingMessage('Creating project...');
          project = await restApiClient.createProject({
            model_id: 1,
            mosaic: 'naip.latest',
            name: 'Untitled',
          });
          setCurrentProject(project);
        } catch (error) {
          toasts.error('Could not create a project, please try again later.');
        } finally {
          hideGlobalLoading();
        }
      }

      let instance = currentInstance;
      if (!instance) {
        try {
          showGlobalLoadingMessage('Requesting instance to run inference...');
          instance = await restApiClient.createInstance(project.id);
          setCurrentInstance(instance);
        } catch (error) {
          toasts.error(
            'Error while creating an instance, please try again later.'
          );
        } finally {
          hideGlobalLoading();
        }
      }
    }

    // if (aoiRef && wsClient) {
    //   console.log('will request prediction');

    //   const {
    //     _southWest: { lng: minX, lat: minY },
    //     _northEast: { lng: maxX, lat: maxY },
    //   } = aoiRef.getBounds();
    //   const aoiPolygon = {
    //     type: 'Polygon',
    //     coordinates: [
    //       [
    //         [minX, minY],
    //         [maxX, minY],
    //         [maxX, maxY],
    //         [minX, maxY],
    //         [minX, minY],
    //       ],
    //     ],
    //   };

    //   wsClient.send(
    //     JSON.stringify({
    //       action: 'model#prediction',
    //       data: {
    //         name: 'Seneca Rocks, WV',
    //         polygon: aoiPolygon,
    //       },
    //     })
    //   );
    // }
  }

  // useEffect(() => {
  //   // removeCurrentInstance();
  //   // removeCurrentProject();

  //   if (currentInstance) {
  //     console.log(currentInstance);
  //     showGlobalLoadingMessage('Connecting to instance...');
  //     const wsClient = new WebsocketClient(currentInstance.token);
  //     wsClient.addEventListener('open', (event) => {
  //       console.log(event)
  //       hideGlobalLoading();
  //       setWsClient(wsClient);
  //       toasts.info('Connected to instance.');
  //     });

  //     wsClient.addEventListener('message', function (event) {
  //       console.log(event);
  //       if (event.data) {
  //         const eventData = JSON.parse(event.data);
  //         if (eventData.message === 'model#prediction') {
  //           const { data } = eventData;
  //           const [minX, minY, maxX, maxY] = data.bounds;
  //           console.log(data.image);
  //           console.log(`data:image/png;base64,${data.image}`);

  //           setPrediction({
  //             // image: data.image,
  //             // image: 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
  //             image: `data:image/png;base64,${data.image}`,
  //             bounds: [
  //               [minY, minX],
  //               [maxY, maxX],
  //             ],
  //           });
  //           // L.ImageOverlay(data.image, [
  //           //   [minY, minX],
  //           //   [maxY, maxX],
  //           // ]).addTo(map);
  //         }
  //       }
  //       // console.log(event)

  //       // console.log('Message from server ', data);
  //     });
  //   }

  //   return () => {
  //     // if (wsClient) {
  //     //   wsClient.close();
  //     // }
  //   };
  // }, []);

  // useEffect(() => {
  //   if (!aoiRef || !wsClient) return;

  //   console.log('will request prediction');

  //   const {
  //     _southWest: { lng: minX, lat: minY },
  //     _northEast: { lng: maxX, lat: maxY },
  //   } = aoiRef.getBounds();
  //   const aoiPolygon = {
  //     type: 'Polygon',
  //     coordinates: [
  //       [
  //         [minX, minY],
  //         [maxX, minY],
  //         [maxX, maxY],
  //         [minX, maxY],
  //         [minX, minY],
  //       ],
  //     ],
  //   };

  //   wsClient.send(
  //     JSON.stringify({
  //       action: 'model#prediction',
  //       data: {
  //         name: 'Seneca Rocks, WV',
  //         polygon: aoiPolygon,
  //       },
  //     })
  //   );
  // }, [aoiRef]);

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
                    ? `${formatThousands(aoiArea)} km2`
                    : viewMode === viewModes.CREATE_AOI_MODE
                    ? 'Drag on map to select'
                    : 'None selected - Draw area on map'}
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

              <InfoButton
                variation='primary-raised-dark'
                size='medium'
                useIcon='tick--small'
                style={{
                  gridColumn: '1 / -1',
                }}
                onClick={handleInferenceRun}
                // visuallyDisabled={!applyState}
                info={applyTooltip}
              >
                {applyText}
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
