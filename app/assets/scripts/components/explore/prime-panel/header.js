import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { themeVal, glsp, truncated } from '@devseed-ui/theme-provider';

import { BOUNDS_PADDING } from '../../common/map/constants';
import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../styles/panel';
import { EditButton } from '../../../styles/button';
import { Subheading } from '../../../styles/type/heading';
import collecticon from '@devseed-ui/collecticons';
import { PanelBlockHeader as BasePanelBlockHeader } from '../../common/panel-block';
import { formatThousands } from '../../../utils/format';

import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
  DropdownFooter,
} from '../../../styles/dropdown';
import { AoiEditButtons } from './aoi-edit-buttons';
import { useModels } from '../../../context/global';

const SelectAoiTrigger = styled.div`
  cursor: pointer;
`;

const SubheadingStrong = styled.h3`
  color: ${themeVal('color.base')};
  font-weight: ${themeVal('type.heading.weight')};
  font-size: 1.125rem;
  line-height: 1.5rem;
  ${truncated}

  ${({ useIcon }) =>
    useIcon &&
    css`
      display: grid;
      grid-template-columns: max-content max-content;
      grid-gap: 1rem;
      &::after {
        ${collecticon(useIcon)}
      }
    `}
  ${({ onClick, disabled }) =>
    onClick &&
    !disabled &&
    css`
      transition: opacity 0.24s ease 0s;
      &:hover {
        cursor: pointer;
        opacity: 0.64;
      }
    `}
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.64;
    `}
`;

function filterAoiList(aoiList) {
  const aois = new Map();
  aoiList.forEach((a) => {
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

const PanelBlockHeader = styled(BasePanelBlockHeader)`
  display: grid;
  grid-gap: ${glsp(0.75)};
`;

function Header(props) {
  const {
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
    checkpointHasSamples,

    setShowSelectModelModal,
    selectedModel,

    isAuthenticated,
    currentProject,
  } = props;

  const { models } = useModels();

  const renderAoiHeader = (triggerProps) => {
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
      <SelectAoiTrigger>
        <SubheadingStrong
          data-cy='aoi-selection-trigger'
          {...triggerProps}
          useIcon='chevron-down--small'
          {...(disabled ? disabledProps : {})}
        >
          {header}
        </SubheadingStrong>
        {area && <Subheading className='subtitle'>{area}</Subheading>}
      </SelectAoiTrigger>
    );
  };

  const renderCheckpointSelectionHeader = () => {
    if (currentCheckpoint && currentCheckpoint.id) {
      let realname = `${currentCheckpoint.name} (${currentCheckpoint.id})`;
      if (currentCheckpoint.bookmarked) {
        return realname;
      } else {
        return currentCheckpoint.parent
          ? 'Current checkpoint (Unsaved)'
          : `${selectedModel.name} (Base Model)`;
      }
    } else if (checkpointList?.length) {
      return `${checkpointList.length} checkpoint${
        checkpointList.length > 1 ? 's' : ''
      } available`;
    } else {
      return 'Run model to create first checkpoint';
    }
  };

  const modelNotChangeable =
    !isAuthenticated || models.status !== 'success' || checkpointList?.length;

  const renderModelLabel = () => {
    if (!isAuthenticated) {
      return 'Login to select model';
    }

    if (['pending', 'idle'].includes(models.status)) {
      return 'Loading...';
    }

    if (
      models.status === 'success' &&
      models.value &&
      models.value.length > 0
    ) {
      return 'Select Model';
    }

    return 'No models available';
  };

  return (
    <PanelBlockHeader>
      <HeadOption hasSubtitle>
        <HeadOptionHeadline>
          <Subheading>Selected Area </Subheading>
        </HeadOptionHeadline>

        <Dropdown
          alignment='left'
          direction='down'
          triggerElement={
            (triggerProps) => renderAoiHeader(triggerProps)
            /* eslint-disable-next-line */
          }
        >
          <>
            <DropdownHeader unshaded>
              <Subheading>Available Areas of Interest</Subheading>
            </DropdownHeader>
            <DropdownBody>
              {filterAoiList(aoiList).map((a) => (
                <li key={a.id} data-dropdown='click.close'>
                  <DropdownItem
                    checked={a.name == aoiName}
                    onClick={() => {
                      const relevantAoi = findCompatibleAoi(
                        a,
                        aoiList,
                        currentCheckpoint
                      );
                      loadAoi(
                        currentProject,
                        relevantAoi || a,
                        relevantAoi || false
                      ).then((bounds) =>
                        mapRef.fitBounds(bounds, {
                          padding: BOUNDS_PADDING,
                        })
                      );
                    }}
                  >
                    {`${a.name}`}
                  </DropdownItem>
                </li>
              ))}
            </DropdownBody>
            {(currentCheckpoint || aoiList?.length > 0) && (
              <DropdownFooter>
                <DropdownItem
                  useIcon='plus'
                  onClick={() => {
                    createNewAoi();
                    mapRef.aoi.control.draw.disable();
                    //Layer must be removed from the map
                    mapRef.aoi.control.draw.clear();
                  }}
                  data-cy='add-aoi-button'
                  data-dropdown='click.close'
                >
                  Add AOI
                </DropdownItem>
              </DropdownFooter>
            )}
          </>
        </Dropdown>

        <HeadOptionToolbar>
          <AoiEditButtons
            aoiRef={aoiRef}
            setAoiRef={setAoiRef}
            aoiArea={aoiArea}
            setAoiBounds={setAoiBounds}
            aoiBounds={aoiBounds}
          />
        </HeadOptionToolbar>
      </HeadOption>

      <HeadOption>
        <HeadOptionHeadline>
          <Subheading>Selected Model</Subheading>
        </HeadOptionHeadline>
        <SubheadingStrong
          data-cy='select-model-label'
          onClick={() => {
            !modelNotChangeable && setShowSelectModelModal(true);
          }}
          title={
            !checkpointList?.length
              ? 'Select Model'
              : 'Models can not be changed after running inference'
          }
        >
          {(selectedModel && selectedModel.name) || renderModelLabel()}
        </SubheadingStrong>
        {!modelNotChangeable && (
          <HeadOptionToolbar>
            <EditButton
              data-cy='show-select-model-button'
              useIcon='swap-horizontal'
              id='select-model-trigger'
              onClick={() => {
                setShowSelectModelModal(true);
              }}
              title='Select Model'
            >
              Edit Model Selection
            </EditButton>
          </HeadOptionToolbar>
        )}
      </HeadOption>

      <HeadOption>
        <HeadOptionHeadline>
          <Subheading>Checkpoint</Subheading>
        </HeadOptionHeadline>
        <Dropdown
          alignment='right'
          direction='down'
          triggerElement={(props) => {
            const disabled =
              checkpointHasSamples ||
              !checkpointList ||
              mapState.mode === mapModes.EDIT_AOI_MODE;
            return (
              <>
                <SubheadingStrong
                  {...props}
                onClick={(e) => !disabled && props.onClick(e)} // eslint-disable-line
                  title={
                    checkpointList
                      ? 'Change checkpoint'
                      : 'Run and retrain model to create first checkpoint'
                  }
                  disabled={disabled}
                >
                  {renderCheckpointSelectionHeader()}
                </SubheadingStrong>
                <HeadOptionToolbar>
                  <EditButton
                    data-cy='show-select-checkpoint-button'
                    useIcon='swap-horizontal'
                    title={
                      checkpointList
                        ? 'Change checkpoint'
                        : 'Run model to create first checkpoint'
                    }
                    id='checkpoint-list-trigger'
                    info={
                      checkpointHasSamples
                        ? 'Submit or clear samples to change checkpoint'
                        : !checkpointList
                        ? 'No checkpoints available'
                        : null
                    }
                    {...props}
                  onClick={(e) => !disabled && props.onClick(e)} // eslint-disable-line
                    visuallyDisabled={disabled}
                  >
                    Edit Checkpoint Selection
                  </EditButton>
                </HeadOptionToolbar>
              </>
            );
          }}
          className='global__dropdown'
        >
          <>
            <DropdownHeader unshaded>
              <p>Checkpoints</p>
            </DropdownHeader>
            <DropdownBody selectable>
              {checkpointList?.length &&
                checkpointList.map((ckpt) => (
                  <DropdownItem
                    key={ckpt.id}
                    data-dropdown='click.close'
                    checked={
                      ckpt.id == (currentCheckpoint && currentCheckpoint.id)
                    }
                    onClick={async () => {
                      await applyCheckpoint(currentProject.id, ckpt.id);
                    }}
                  >
                    {ckpt.parent
                      ? `${ckpt.name} (${ckpt.id})`
                      : `${selectedModel.name} (Base Model)`}
                  </DropdownItem>
                ))}
            </DropdownBody>
          </>
        </Dropdown>
      </HeadOption>
    </PanelBlockHeader>
  );
}

Header.propTypes = {
  aoiRef: T.object,
  setAoiRef: T.func,
  setAoiBounds: T.func,
  aoiBounds: T.object,
  aoiArea: T.number,
  aoiName: T.string,
  aoiList: T.array,
  loadAoi: T.func,
  createNewAoi: T.func,

  mapState: T.object,
  mapModes: T.object,
  mapRef: T.object,

  currentCheckpoint: T.object,
  checkpointList: T.array,
  applyCheckpoint: T.func,

  checkpointHasSamples: T.bool,

  setShowSelectModelModal: T.func,
  selectedModel: T.object,
  models: T.array,

  isAuthenticated: T.bool,
  currentProject: T.object,
};

export default Header;
