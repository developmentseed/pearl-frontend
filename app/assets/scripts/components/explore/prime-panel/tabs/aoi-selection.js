import React from 'react';
import styled, { css } from 'styled-components';
import {
  HeadOption as BaseHeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../styles/panel';
import { Heading } from '@devseed-ui/typography';
import { Subheading } from '../../../../styles/type/heading';
import { BOUNDS_PADDING } from '../../../common/map/constants';
import { formatThousands } from '../../../../utils/format';
import { useAoiMeta, useMapState } from '../../../../context/explore';
import { useMapRef } from '../../../../context/map';
import { useAoi } from '../../../../context/aoi';

import { useCheckpoint } from '../../../../context/checkpoint';
import { useProject } from '../../../../context/project';
import { AoiEditButtons } from '../aoi-edit-buttons';
import { EditButton } from '../../../../styles/button';
const AoiOption = styled.div`
  display: grid;
  grid-template-columns: auto min-content;

  ${({ hasSubtitle }) =>
    hasSubtitle &&
    css`
      grid-template-rows: 1fr 1fr;
      .subtitle {
        grid-row: 2;
        margin: 0;
      }
    `}
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
function AoiSelection({ setDeleteAoi }) {
  const { currentAoi, aoiList, aoiName } = useAoi();
  const {
    //setAoiBounds,
    //aoiBounds,
    aoiArea,
    //aoiName
    loadAoi,
    //createNewAoi,
  } = useAoiMeta();

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

    const disabledProps = {
      onClick: () => null,
      useIcon: null,
    };

    if (mapState.mode === mapModes.EDIT_AOI_MODE || aoiList?.length === 0) {
      disabled = true;
    }

    return (
      <AoiOption hasSubtitle>
        <Heading size='xsmall'>{header}</Heading>
        {area && (
          <Subheading size='xsmall' className='subtitle'>
            {area}
          </Subheading>
        )}
        <EditButton
          useIcon='trash-bin'
          className='aoi-delete-button'
          hideText
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            //setDeleteAoi(aoi);
          }}
        >
          Delete AOI
        </EditButton>
      </AoiOption>
    );
  };

  return (
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
                    setDeleteAoi(a);
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
  );
}

export default AoiSelection;
