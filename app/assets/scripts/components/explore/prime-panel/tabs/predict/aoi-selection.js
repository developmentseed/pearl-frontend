import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';

import { AoiEditButtons } from '../../aoi-edit-buttons';
import { Option, HeadOption } from '../selection-styles';
import {
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../styles/panel';
import { Subheading } from '../../../../../styles/type/heading';
import { EditButton } from '../../../../../styles/button';
import ShadowScrollbar from '../../../../common/shadow-scrollbar';
import toasts from '../../../../common/toasts';
import { ModalWrapper } from '../../../../common/modal-wrapper';
import { BOUNDS_PADDING } from '../../../../common/map/constants';
import { formatThousands } from '../../../../../utils/format';
import {
  useAoiMeta,
  useMapState,
  useSessionStatus,
} from '../../../../../context/explore';
import { sessionModes } from '../../../../../context/explore/session-status';
import { useMapRef } from '../../../../../context/map';
import { useAoi } from '../../../../../context/aoi';
import { useAuth } from '../../../../../context/auth';
import { useCheckpoint } from '../../../../../context/checkpoint';
import { useProject } from '../../../../../context/project';

const AoiOption = styled(Option)`
  grid-template-columns: auto min-content;
  padding-right: ${glsp(1.5)};

  ${({ hasSubtitle }) =>
    hasSubtitle &&
    css`
      .subtitle {
        margin: 0;
      }
    `}

  ${({ selected }) =>
    selected &&
    css`
      grid-template-columns: auto auto;
      align-items: center;
      justify-content: start;
      cursor: unset;
      grid-gap: 1rem;
    `}



  .aoi-delete-button {
    visibility: hidden;
  }

  &:hover {
    .aoi-delete-button {
      visibility: visible;
    }
  }
`;

function filterAoiList(aoiList, currentAoiName) {
  const aois = new Map();
  aoiList.forEach((a) => {
    if (currentAoiName === a.name) {
      // Do not include aois with currentAoiName in the list
      return;
    }

    // Treat AOIs with the same name as the same geometry
    // Use the latest one
    if (aois.has(a.name)) {
      if (aois.get(a.name).created > a.created) {
        aois.set(a.name, a);
      }
    } else {
      aois.set(a.name, a);
    }
  });
  return Array.from(aois.values());
}

function findCompatibleAoi(aoi, aoiList, ckpt) {
  const foundAoi = aoiList
    .filter((a) => a.name === aoi.name)
    .find((a) => Number(a.checkpoint_id) === ckpt.id);
  return foundAoi;
}

/*
 * Component to list AOIs and allow create, edit, delete operations
 *
 * @param setDeleteAoi - { func } parent
 */
function AoiSelection() {
  const [deleteAoi, setDeleteAoi] = useState();
  const [aoiToSwitch, setAoiToSwitch] = useState();

  const { currentAoi, aoiList, aoiName, setAoiList } = useAoi();
  const { aoiArea, loadAoi, createNewAoi } = useAoiMeta();

  const { restApiClient } = useAuth();

  const { mapRef } = useMapRef();
  const { mapState, mapModes } = useMapState();

  const { currentProject } = useProject();
  const { currentCheckpoint } = useCheckpoint();

  const { sessionStatus } = useSessionStatus();

  const renderSelectedAoi = () => {
    let header;
    let area;
    if (
      sessionStatus.mode === sessionModes.LOADING_PROJECT &&
      aoiList?.length === 0
    ) {
      header = 'Loading...';
    } else if (
      aoiArea &&
      aoiArea > 0 &&
      mapState.mode === mapModes.EDIT_AOI_MODE
    ) {
      header = aoiName;
      area = `${formatThousands(aoiArea / 1e6)} km2`;
    } else if (aoiName) {
      header = aoiName;
      area = `${formatThousands(aoiArea / 1e6)} km2`;
    } else if (mapState.mode === mapModes.CREATE_AOI_MODE) {
      if (aoiArea) {
        header = 'New AOI';
        area = `${formatThousands(aoiArea / 1e6)} km2`;
      } else {
        header = 'Drag on map to select';
      }
    } else if (!aoiList || aoiList?.length === 0) {
      header = 'Draw area on map or upload an AOI geometry';
    } else {
      return null;
    }

    return (
      <AoiOption hasSubtitle selected data-cy='selected-aoi-header'>
        <Heading size='xsmall'>{header}</Heading>
        {area && (
          <Subheading size='xsmall' className='subtitle'>
            {area}
          </Subheading>
        )}
      </AoiOption>
    );
  };

  const deleteAoiFunc = async (targetAoi) => {
    try {
      const deleteReqs = aoiList.map((aoi) => {
        if (aoi.name === targetAoi.name) {
          return restApiClient.deleteAoi(aoi.id, currentProject.id);
        } else {
          return null;
        }
      });

      await Promise.all(deleteReqs);
      const aoiReq = await restApiClient.getAOIs(currentProject.id);
      setAoiList(aoiReq.aois);

      if (aoiReq.aois.length) {
        const { aois } = aoiReq;
        loadAoi(
          currentProject,
          aois[aois.length - 1],
          aois[aois.length - 1].checkpoint_id === currentCheckpoint?.id
        ).then((bounds) =>
          mapRef.fitBounds(bounds, {
            padding: BOUNDS_PADDING,
          })
        );
      } else {
        mapRef.aoi.control.draw.clear();
        createNewAoi();
      }
    } catch (err) {
      toasts.error(err.message);
    }
  };

  const aoiSwitch = (aoi) => {
    if ((currentAoi === undefined || currentAoi === null) && aoiArea > 0) {
      setAoiToSwitch(aoi);
      return;
    }
    const relevantAoi = findCompatibleAoi(aoi, aoiList, currentCheckpoint);
    loadAoi(
      currentProject,
      relevantAoi || aoi,
      relevantAoi || false
    ).then((bounds) => mapRef.fitBounds(bounds, { padding: BOUNDS_PADDING }));
  };

  return (
    <>
      <HeadOption hasSubtitle>
        <HeadOptionHeadline usePadding>
          <Subheading>Areas of Interest</Subheading>
        </HeadOptionHeadline>
        <ShadowScrollbar
          style={{
            minHeight: '6rem',
            maxHeight: '10rem',
            backgroundColor: '#121826',
            padding: '0.25rem 0',
            margin: '0.75rem 0',
            boxShadow: 'inset 0 -1px 0 0 rgba(240, 244, 255, 0.16)',
          }}
          data-cy='aoi-list'
        >
          {
            // Current or new aoi
            renderSelectedAoi()
          }
          {
            // Remainder of list
            filterAoiList(aoiList, aoiName).map((aoi) => (
              <AoiOption
                key={aoi.id}
                className='listed-aoi'
                onClick={() => aoiSwitch(aoi)}
              >
                <Heading size='xsmall'>{aoi.name}</Heading>
                <EditButton
                  useIcon='trash-bin'
                  className='aoi-delete-button'
                  hideText
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setDeleteAoi(aoi);
                  }}
                >
                  Delete AOI
                </EditButton>
              </AoiOption>
            ))
          }
        </ShadowScrollbar>
        <HeadOptionToolbar>
          <AoiEditButtons deleteAoi={(aoi) => setDeleteAoi(aoi)} />
        </HeadOptionToolbar>
      </HeadOption>

      <Modal
        id='confirm-delete-aoi-modal'
        data-cy='confirm-delete-aoi-modal'
        revealed={deleteAoi}
        onOverlayClick={() => setDeleteAoi(null)}
        onCloseClick={() => setDeleteAoi(null)}
        title='Delete AOI'
        size='small'
        content={
          <ModalWrapper>
            <div>Are you sure you want to delete this AOI?</div>
            <Button
              data-cy='cancel-aoi-delete'
              variation='primary-plain'
              size='medium'
              useIcon='xmark'
              onClick={() => {
                setDeleteAoi(null);
              }}
            >
              Cancel
            </Button>
            <Button
              data-cy='confirm-aoi-delete'
              variation='danger-raised-dark'
              size='medium'
              useIcon='tick'
              onClick={() => {
                deleteAoiFunc(deleteAoi);

                setDeleteAoi(null);
              }}
            >
              Delete AOI
            </Button>
          </ModalWrapper>
        }
      />

      <Modal
        id='confirm-clear-aoi-modal'
        data-cy='confirm-clear-aoi-modal'
        revealed={aoiToSwitch}
        onOverlayClick={() => setAoiToSwitch(null)}
        onCloseClick={() => setAoiToSwitch(null)}
        title='Unsaved AOI'
        size='small'
        content={
          <ModalWrapper>
            <div>
              You have not submitted the drawn AOI for predictions. Switching to
              a new AOI will remove this unsaved AOI.
            </div>
            <Button
              data-cy='cancel-clear-aoi'
              variation='primary-plain'
              size='medium'
              useIcon='xmark'
              onClick={() => {
                setAoiToSwitch(null);
              }}
            >
              Cancel
            </Button>
            <Button
              data-cy='confirm-clear-aoi'
              variation='danger-raised-dark'
              size='medium'
              useIcon='trash-bin'
              onClick={() => {
                const relevantAoi = findCompatibleAoi(
                  aoiToSwitch,
                  aoiList,
                  currentCheckpoint
                );
                loadAoi(
                  currentProject,
                  relevantAoi || aoiToSwitch,
                  relevantAoi || false
                ).then((bounds) =>
                  mapRef.fitBounds(bounds, {
                    padding: BOUNDS_PADDING,
                  })
                );
                setAoiToSwitch(null);
              }}
            >
              Clear AOI
            </Button>
          </ModalWrapper>
        }
      />
    </>
  );
}

export default AoiSelection;
