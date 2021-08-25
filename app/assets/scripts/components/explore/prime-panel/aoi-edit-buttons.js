import React from 'react';
import L from 'leaflet';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { EditButton } from '../../../styles/button';
import { useMapState } from '../../../context/explore';
import Prose from '../../../styles/type/prose';
import T from 'prop-types';
import { formatThousands } from '../../../utils/format';
import { FauxFileDialog } from '../../common/faux-file-dialog';

import {
  Modal,
  ModalHeadline,
  ModalFooter as BaseModalFooter,
} from '@devseed-ui/modal';
import { useMapRef } from '../../../context/map';
import { useApiMeta } from '../../../context/api-meta';
import { useAoi, useAoiName } from '../../../context/aoi';
import {
  useCheckpoint,
  actions as checkpointActions,
  checkpointModes,
} from '../../../context/checkpoint';
import { areaFromBounds } from '../../../utils/map';
import { useState } from 'react';
import bbox from '@turf/bbox';
import logger from '../../../utils/logger';
import { BOUNDS_PADDING } from '../../common/map/constants';
import { inRange } from '../../../utils/utils';

const ModalFooter = styled(BaseModalFooter)`
  padding: ${glsp(2)} 0 0 0;
  > button,
  ${Button} {
    flex: 1;
    margin: 0;
    border-radius: 0;
  }
`;

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  h1 {
    grid-column: 1 / -1;
  }
  div.prose {
    grid-column: 1 / -1;
  }
  .warning {
    color: ${themeVal('color.danger')};
  }
  grid-gap: 1rem;
`;

function UploadAoiModal({ revealed, setRevealed, onImport, apiLimits }) {
  const [file, setFile] = useState(null);
  const [warning, setWarning] = useState(null);
  const onFileSelect = async (uploadedFile) => {
    try {
      // Check if file extension
      const filename = uploadedFile.name;
      if (!filename.endsWith('.json') && !filename.endsWith('.geojson')) {
        setWarning(`Invalid file extension, please upload a valid file.`);
        return;
      }

      // Parse JSON
      const geojson = JSON.parse(await uploadedFile.text());

      // Check for a FeatureCollection
      if (geojson.type !== 'FeatureCollection') {
        setWarning(
          'GeoJSON must be of FeatureCollection type, please upload a valid file.'
        );
        return;
      }

      const bounds = bbox(geojson);
      const totalArea = areaFromBounds(bounds);

      if (isNaN(totalArea) || totalArea === 0) {
        // Area should be bigger than zero, abort import
        setWarning(
          'File is empty or does not conform a valid area, please upload another file.'
        );
        setFile(null);
        return;
      } else if (totalArea > apiLimits.max_inference) {
        // Area should be lower than max_inference, abort import
        setWarning('Area is too large, please upload another file.');
        setFile(null);
        return;
      } else if (
        inRange(totalArea, apiLimits.live_inference, apiLimits.max_inference)
      ) {
        // If area is bigger than apiLimits.live_inference, show warning and proceed import
        setWarning('Due to area size live inference will not be available.');
      } else {
        // Area is ok, clear warning
        setWarning(null);
      }

      // File is ok, allow importing
      setFile({
        name: filename,
        bounds,
        totalArea,
      });
    } catch (error) {
      logger(error);
      setWarning(
        'An unexpected error occurred, please upload a valid GeoJSON file or try again later.'
      );
    }
  };

  return (
    <Modal
      id='import-aoi-modal'
      size='small'
      revealed={revealed}
      title='Upload an AOI'
      onCloseClick={() => setRevealed(false)}
      content={
        <Wrapper>
          {!file && (
            <Prose className='prose'>
              Once imported, the bounding box containing all features in the
              file will be set as an AOI.
            </Prose>
          )}
          <FauxFileDialog
            name='image-file'
            data-cy='aoi-upload-input'
            onFileSelect={onFileSelect}
          >
            {(fieProps) =>
              !file && (
                <Button
                  data-cy='select-aoi-file-button'
                  variation='primary-raised-light'
                  size='medium'
                  useIcon='upload'
                  style={{
                    gridColumn: '2 / 1',
                  }}
                  {...fieProps}
                >
                  Select GeoJSON file
                </Button>
              )
            }
          </FauxFileDialog>
          {file && (
            <>
              <div className='prose'>
                <strong>Selected file: </strong>
                {file.name}
              </div>
              <div className='prose'>
                <strong>MinX: </strong>
                {file.bounds[0]}
              </div>
              <div className='prose'>
                <strong>MinY: </strong>
                {file.bounds[1]}
              </div>
              <div className='prose'>
                <strong>MaxX: </strong>
                {file.bounds[2]}
              </div>
              <div className='prose'>
                <strong>MaxY: </strong>
                {file.bounds[3]}
              </div>
            </>
          )}
          {warning && (
            <div data-cy='import-aoi-warning-text' className='prose warning'>
              {warning}
            </div>
          )}
          <Button
            data-cy='import-aoi-button'
            variation='primary-raised-dark'
            size='medium'
            useIcon='tick'
            visuallyDisabled={!file}
            disabled={!file}
            style={{
              gridColumn: '1 / -1',
            }}
            onClick={() => {
              if (onImport(file)) {
                setRevealed(false);
              } else {
                setWarning(
                  'An unexpected error occurred, please upload a valid GeoJSON file or try again later.'
                );
              }
            }}
          >
            Import
          </Button>
        </Wrapper>
      }
    />
  );
}

UploadAoiModal.propTypes = {
  revealed: T.bool,
  setRevealed: T.func,
  onImport: T.func,
  apiLimits: T.object,
};

export function AoiEditButtons(props) {
  const { mapState, setMapMode, mapModes } = useMapState();
  const [showUploadAoiModal, setShowUploadAoiModal] = useState(false);
  const { updateAoiName } = useAoiName();
  const {
    currentAoi,
    setCurrentAoi,
    activeModal,
    setActiveModal,
    setAoiArea,
  } = useAoi();
  const { mapRef } = useMapRef();

  const { dispatchCurrentCheckpoint } = useCheckpoint();

  const { apiLimits } = useApiMeta();

  const {
    aoiRef,
    aoiArea,
    aoiBounds,
    setAoiBounds,
    setAoiRef,
    deleteAoi,
  } = props;

  // Confirm AOI, used in finish edit button and "confirm batch inference" modal
  function applyAoi() {
    setMapMode(mapModes.BROWSE_MODE);
    let bounds = aoiRef.getBounds();
    setAoiBounds(bounds);
    updateAoiName(bounds);

    // When AOI is edited -> we go to run mode
    dispatchCurrentCheckpoint({
      type: checkpointActions.SET_CHECKPOINT_MODE,
      data: {
        mode: checkpointModes.RUN,
      },
    });

    //Current aoi should only be set after aoi has been sent to the api
    setCurrentAoi(null);
  }

  // Display confirm/cancel buttons when AOI editing is active
  if (
    mapState.mode === mapModes.CREATE_AOI_MODE ||
    mapState.mode === mapModes.EDIT_AOI_MODE
  ) {
    return (
      <>
        <EditButton
          onClick={function () {
            if (!apiLimits || apiLimits.live_inference > aoiArea) {
              applyAoi();
            } else if (apiLimits.max_inference > aoiArea) {
              setActiveModal('batch-inference');
            } else {
              setActiveModal('area-too-large');
            }
          }}
          title='Set Area of Interest'
          useIcon='tick'
          data-cy='aoi-edit-confirm-button'
        >
          Select AOI
        </EditButton>
        <EditButton
          onClick={() => {
            setMapMode(mapModes.BROWSE_MODE);
            if (aoiBounds) {
              // editing is canceled
              aoiRef.setBounds(aoiBounds);
              const bbox = [
                aoiBounds.getWest(),
                aoiBounds.getSouth(),
                aoiBounds.getEast(),
                aoiBounds.getNorth(),
              ];

              setAoiArea(areaFromBounds(bbox));
            } else {
              // Drawing canceled
              mapRef.aoi.control.draw.disable();

              //Edit mode is enabled as soon as draw is done
              if (mapRef.aoi.control.edit._shape) {
                mapRef.aoi.control.edit.disable();
              }

              //Layer must be removed from the map
              mapRef.aoi.control.draw.clear();

              // Layer ref set to null, will be recreated when draw is attempted again
              setAoiRef(null);
            }
          }}
          useIcon='xmark'
          data-cy='aoi-edit-cancel-button'
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
                {activeModal === 'batch-inference' ? (
                  <h1>Save Area</h1>
                ) : (
                  <h1>Area too large</h1>
                )}
              </ModalHeadline>
            )}
            content={
              activeModal === 'batch-inference' ? (
                <div>
                  Live inference is not available for areas larger than{' '}
                  {formatThousands(apiLimits.live_inference / 1e6)} km². You can
                  run inference on this AOI as a background process, or resize
                  to a smaller size to engage in retraining and run live
                  inference.
                </div>
              ) : (
                <div>
                  The area has {formatThousands(aoiArea / 1e6, { decimals: 0 })}{' '}
                  km², please select an area smaller than{' '}
                  {formatThousands(apiLimits.max_inference / 1e6, {
                    decimals: 0,
                  })}{' '}
                  km².
                </div>
              )
            }
            renderFooter={() => (
              <ModalFooter>
                {activeModal && activeModal !== 'area-too-large' && (
                  <Button
                    size='xlarge'
                    variation='base-plain'
                    data-cy='proceed-anyway-button'
                    onClick={() => {
                      setActiveModal(false);
                      applyAoi();
                    }}
                  >
                    Proceed anyway
                  </Button>
                )}
                <Button
                  size='xlarge'
                  variation='primary-plain'
                  onClick={() => {
                    setActiveModal(false);
                    setMapMode(mapModes.EDIT_AOI_MODE);
                  }}
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
    <>
      {currentAoi && (
        <EditButton
          onClick={() => deleteAoi(currentAoi)}
          title='Delete current aoi'
          id='delete-aoi'
          useIcon='trash-bin'
          data-cy='delete-current-aoi-button'
        >
          Delete current Aoi
        </EditButton>
      )}
      <UploadAoiModal
        revealed={showUploadAoiModal}
        setRevealed={setShowUploadAoiModal}
        apiLimits={apiLimits}
        onImport={({ bounds, totalArea }) => {
          try {
            let aoiShape;
            const [minX, minY, maxX, maxY] = bounds;
            const leafletBounds = [
              [minY, minX],
              [maxY, maxX],
            ];
            if (!aoiRef) {
              aoiShape = L.rectangle(leafletBounds).addTo(mapRef);
              setAoiRef(aoiShape);
            } else {
              aoiShape = aoiRef;
              aoiRef.setBounds(leafletBounds);
            }

            mapRef.fitBounds(aoiShape.getBounds(), {
              padding: BOUNDS_PADDING,
            });
            setAoiArea(totalArea);
            setAoiBounds(aoiShape.getBounds());
            setMapMode(mapModes.EDIT_AOI_MODE);

            return true;
          } catch (error) {
            logger(error);
            return false;
          }
        }}
      />
      <EditButton
        onClick={() => {
          setMapMode(
            !aoiRef ? mapModes.CREATE_AOI_MODE : mapModes.EDIT_AOI_MODE
          );
        }}
        title='Draw Area of Interest'
        id='edit-aoi-trigger'
        useIcon='pencil'
        data-cy='aoi-edit-button'
      >
        Select AOI
      </EditButton>
      <EditButton
        title='Upload AOI GeoJSON'
        data-cy='upload-aoi-modal-button'
        id='upload-aoi-modal-button'
        useIcon='upload'
        onClick={() => setShowUploadAoiModal(true)}
      >
        Upload AOI
      </EditButton>
    </>
  );
}

AoiEditButtons.propTypes = {
  aoiRef: T.object,
  setAoiRef: T.func,
  aoiBounds: T.object,
  setAoiBounds: T.func,
  aoiArea: T.oneOfType([T.bool, T.number]),
  deleteAoi: T.func,
};
