import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';
import { EditButton } from '../../../styles/button';
import { useMapState } from '../../../context/explore';
import T from 'prop-types';
import { formatThousands } from '../../../utils/format';

import {
  Modal,
  ModalHeadline,
  ModalFooter as BaseModalFooter,
} from '@devseed-ui/modal';
import { useMapRef } from '../../../context/map';
import { useApiMeta } from '../../../context/api-meta';

const ModalFooter = styled(BaseModalFooter)`
  padding: ${glsp(2)} 0 0 0;
  > button,
  ${Button} {
    flex: 1;
    margin: 0;
    border-radius: 0;
  }
`;

export function AoiEditButtons(props) {
  const { mapState, setMapMode, mapModes } = useMapState();
  const { mapRef } = useMapRef();

  const { apiLimits } = useApiMeta();

  const { aoiRef, aoiArea, aoiBounds, setAoiBounds, setAoiRef } = props;

  const [activeModal, setActiveModal] = useState(false);

  // Display confirm/cancel buttons when AOI edition is active
  if (
    mapState.mode === mapModes.CREATE_AOI_MODE ||
    mapState.mode === mapModes.EDIT_AOI_MODE
  ) {
    return (
      <>
        <EditButton
          onClick={function () {
            if (!apiLimits || apiLimits.live_inference > aoiArea) {
              setMapMode(mapModes.BROWSE_MODE);
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
            setMapMode(mapModes.BROWSE_MODE);
            if (aoiBounds) {
              // editing is canceled
              aoiRef.setBounds(aoiBounds);
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
                      setMapMode(mapModes.BROWSE_MODE);
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
        setMapMode(!aoiRef ? mapModes.CREATE_AOI_MODE : mapModes.EDIT_AOI_MODE);
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
  aoiRef: T.object,
  setAoiRef: T.func,
  aoiBounds: T.object,
  setAoiBounds: T.func,
  aoiArea: T.oneOfType([T.bool, T.number]),
};
