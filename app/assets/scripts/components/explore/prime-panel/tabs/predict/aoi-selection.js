import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../styles/panel';
import ShadowScrollbar from '../../../../common/shadow-scrollbar';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Subheading } from '../../../../../styles/type/heading';
import { BOUNDS_PADDING } from '../../../../common/map/constants';
import { formatThousands } from '../../../../../utils/format';
import {
  useAoiMeta,
  useMapState,
  useSessionStatus,
} from '../../../../../context/explore';
import { useMapRef } from '../../../../../context/map';
import { useAoi } from '../../../../../context/aoi';
import { useAuth } from '../../../../../context/auth';

import { useCheckpoint } from '../../../../../context/checkpoint';
import { useProject } from '../../../../../context/project';
import { AoiEditButtons } from '../../aoi-edit-buttons';
import { EditButton } from '../../../../../styles/button';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import toasts from '../../../../common/toasts';

import { Option, HeadOption } from '../selection-styles';

const ModalWrapper = styled.div`
  display: grid;
  grid-template-areas:
    'a a'
    'b c';
  grid-gap: ${glsp(1)};
  div {
    grid-area: a;
  }
`;

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

function filterAoiList(aoiList, currentAoi) {
  const aois = new Map();
  aoiList.forEach((a) => {
    if (currentAoi?.name === a.name) {
      // Do not include currentAoi in the list
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
  const { currentAoi, aoiList, aoiName, setAoiList } = useAoi();
  const [deleteAoi, setDeleteAoi] = useState();
  const { aoiArea, loadAoi, createNewAoi } = useAoiMeta();
  const { restApiClient } = useAuth();

  const { mapRef } = useMapRef();

  const { currentProject } = useProject();

  const { currentCheckpoint } = useCheckpoint();

  const { mapState, mapModes } = useMapState();

  const { sessionStatus } = useSessionStatus();

  const renderSelectedAoi = () => {
    let header;
    let area;
    if (aoiArea && aoiArea > 0 && mapState.mode === mapModes.EDIT_AOI_MODE) {
      header = `${formatThousands(aoiArea / 1e6)} km2`;
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
    } else if (sessionStatus.mode === 'loading-project') {
      header = 'Loading...';
    } else {
      header = 'None selected - Draw area on map or upload AOI ';
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
        >
          {
            // Current or new aoi
            renderSelectedAoi()
          }
          {
            // Remainder of list
            filterAoiList(aoiList, currentAoi).map((aoi) => {
              return (
                <AoiOption
                  key={aoi.id}
                  className='listed-aoi'
                  onClick={() => {
                    const relevantAoi = findCompatibleAoi(
                      aoi,
                      aoiList,
                      currentCheckpoint
                    );
                    loadAoi(
                      currentProject,
                      relevantAoi || aoi,
                      relevantAoi || false
                    ).then((bounds) =>
                      mapRef.fitBounds(bounds, {
                        padding: BOUNDS_PADDING,
                      })
                    );
                  }}
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
              );
            })
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
    </>
  );
}

export default AoiSelection;
