import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import {
  HeadOption as BaseHeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../styles/panel';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Subheading } from '../../../../styles/type/heading';
import { BOUNDS_PADDING } from '../../../common/map/constants';
import { formatThousands } from '../../../../utils/format';
import { useAoiMeta, useMapState } from '../../../../context/explore';
import { useMapRef } from '../../../../context/map';
import { useAoi } from '../../../../context/aoi';
import { useAuth } from '../../../../context/auth';

import { useCheckpoint } from '../../../../context/checkpoint';
import { useProject } from '../../../../context/project';
import { AoiEditButtons } from '../aoi-edit-buttons';
import { EditButton } from '../../../../styles/button';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import toasts from '../../../common/toasts';

const ModalWrapper = styled.div`
  display: grid;
  grid-template-areas:
    'a a'
    'b c';
  grid-gap: ${glsp(1)};
  padding: ${glsp()};
  div {
    grid-area: a;
  }
`;

const AoiOption = styled.div`
  display: grid;
  grid-template-columns: auto min-content;
  cursor: pointer;

  ${({ hasSubtitle }) =>
    hasSubtitle &&
    css`
      grid-template-rows: auto auto;
      .subtitle {
        grid-row: 2;
        margin: 0;
      }
    `}
  ${({ selected }) =>
    selected &&
    css`
      h1 {
        color: ${themeVal('color.primary')};
        background: ${themeVal('color.primaryAlphaA')};
        border-left: 2px solid ${themeVal('color.primary')};
        padding-left: ${glsp()};
      }
    `}


  .aoi-delete-button {
    visibility: hidden;
  }

  &:hover {
    .aoi-delete-button {
      visibility: visible;
    }
    background: ${themeVal('color.primaryAlphaB')};
  }
`;
const HeadOption = styled(BaseHeadOption)`
  grid-template-columns: auto;
  ${HeadOptionToolbar} {
    grid-row: auto;
    grid-column: auto;
  }
`;
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
function AoiSelection({ }) {
  const { currentAoi, aoiList, aoiName, setAoiList } = useAoi();
  const [deleteAoi, setDeleteAoi] = useState();
  const {
    //setAoiBounds,
    //aoiBounds,
    aoiArea,
    //aoiName
    loadAoi,
    createNewAoi,
  } = useAoiMeta();
  const { restApiClient } = useAuth();

  const { mapRef } = useMapRef();

  const { currentProject } = useProject();

  const { currentCheckpoint } = useCheckpoint();

  const { mapState, mapModes } = useMapState();

  const renderSelectedAoi = () => {
    let header;
    let area;
    let disabled;
    if (aoiArea && aoiArea > 0 && mapState.mode === mapModes.EDIT_AOI_MODE) {
      header = `${formatThousands(aoiArea / 1e6)} km2`;
    } else if (aoiName) {
      header = aoiName;
      area = `${formatThousands(aoiArea / 1e6)} km2`;
    } else if (mapState.mode === mapModes.CREATE_AOI_MODE) {
      header = 'Drag on map to select';
    } else {
      header = 'None selected - Draw area on map';
    }

    return (
      <AoiOption hasSubtitle selected>
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
        <HeadOptionHeadline>
          <Subheading>Areas of Interest</Subheading>
        </HeadOptionHeadline>
        {
          // Current or new aoi
          //
          renderSelectedAoi()
        }
        {
          // remainder of list
          //
          aoiList
            .filter((a) => a.id !== currentAoi?.id)
            .map((aoi) => {
              return (
                <AoiOption
                  key={aoi.id}
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
