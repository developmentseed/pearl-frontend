import React, { useState } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { glsp, themeVal, truncated } from '@devseed-ui/theme-provider';
// import get from 'lodash.get';

// Styles
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import { PlaceholderMessage } from '../../../../../styles/placeholder';
import { Subheading } from '../../../../../styles/type/heading.js';
import {
  DropdownBody,
  DropdownItem,
  DropdownFooter,
} from '../../../../../styles/dropdown';
import InfoButton from '../../../../common/info-button';
import { Dropdown, DropdownTrigger } from '../../../../../styles/dropdown';
import { ProjectMachineContext } from '../../../../../fsm/project';
import get from 'lodash.get';
import { MAP_MODES } from '../../../../../fsm/project/constants';

// import InfoButton from '../../../common/info-button';
// import { PlaceholderMessage } from '../../../../styles/placeholder.js';
// import { actions, useCheckpoint } from '../../../../context/checkpoint.js';
// import { useMapState } from '../../../../context/explore';
// import { useSessionStatus } from '../../../../context/explore';
// import { useMapRef } from '../../../../context/map';

// import { Dropdown, DropdownTrigger } from '../../../../styles/dropdown';
// import {
//   ToolsWrapper,
//   ClassList,
//   Class,
//   Thumbnail as ClassThumbnail,
//   ClassInfoWrapper,
//   ClassHeading,
//   ClassSamples,
//   ToolBox as RetrainTools,
//   AddClassButton,
// } from './retrain-refine-styles';

// import { Subheading } from '../../../../styles/type/heading';
// import { useAoi } from '../../../../context/aoi';
// import { useApiLimits } from '../../../../context/global';
// import { useModel } from '../../../../context/model';
// import EditClass from './edit-class';
// import ImportGeojsonModal from './retrain/import-geojson-modal';
// import ApplyOsmModal from './retrain/apply-osm-modal';

/*
 * Retrain Model
 * @param ready - true when checkpoint exists and we are in RETRAIN mode
 */

export const ToolsWrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};

  ${PlaceholderMessage} {
    padding: 2rem;
  }
`;

export const ClassList = styled.section`
  display: grid;

  > ${Subheading} {
    padding: 0.25rem 1.5rem;
  }
`;

export const Class = styled.div`
  display: grid;
  grid-template-columns: ${glsp(1.5)} minmax(10px, 1fr) auto auto;
  grid-gap: 0 ${glsp(1)};
  padding: ${({ placeholder }) =>
    placeholder ? '0 1.5rem 1rem' : '0.5rem 1.5rem'};
  align-items: center;
  background: none;
  border: none;
  outline: none;
  transition: all 0.16s ease-out 0s;
  min-height: 3.125rem;
  ${({ muted }) =>
    muted &&
    css`
      color: ${themeVal('color.baseAlphaE')};
      border-color: ${themeVal('color.baseAlphaE')};
    `};
  &.placeholder-class:first-child {
    margin-top: ${glsp(2)};
  }
  &:hover {
    ${({ placeholder, noHover }) =>
      !placeholder &&
      !noHover &&
      css`
        background: ${themeVal('color.primaryAlphaB')};
        cursor: pointer;
      `}
  }
  ${({ selected }) =>
    selected &&
    css`
      position: relative;
      background: ${themeVal('color.primaryAlphaB')};
      &:after {
        position: absolute;
        content: '';
        width: 6px;
        height: 100%;
        top: 0;
        left: 0;
        background: ${themeVal('color.primary')};
      }
    `};
`;

export const AddClassButton = styled(Class)`
  color: ${themeVal('color.base')};
  span {
    text-align: left;
  }
  &:before {
    box-shadow: inset 0 0 0 1px ${themeVal('color.base')};
    margin-right: 0;
    color: ${themeVal('color.base')};
    opacity: 0.8;
  }
`;

export const ClassInfoWrapper = styled.div`
  grid-row: 1 / 3;
  grid-column: 2;
  display: flex;
  flex-flow: column;
`;

export const ClassHeading = styled(Heading).attrs({ as: 'h4' })`
  ${truncated}
  margin: 0;
  text-align: left;
  background: ${({ placeholder }) =>
    placeholder ? themeVal('color.baseAlphaD') : 'none'};
  width: ${({ placeholder }) => (placeholder ? '10rem' : 'initial')};
  height: ${({ placeholder }) => (placeholder ? '1rem' : 'auto')};
  line-height: 1.5rem;
  grid-column: ${(placeholder) => placeholder && '2'};
  grid-row: ${(placeholder) => placeholder && '1 / 3'};
`;

export const ClassSamples = styled.p`
  grid-row: 2;
  grid-column: 2;
  font-size: 0.75rem;
  white-space: nowrap;
`;

export const ClassOptions = styled(Button)`
  grid-row: 1 / 3;
`;

export const Thumbnail = styled.div`
  grid-row: 1 / 3;
  width: ${glsp(1.5)};
  height: ${glsp(1.5)};
  background: ${({ color }) => color || themeVal('color.baseAlphaD')};
  border: 1px solid ${themeVal('color.baseAlphaD')};
  display: grid;
  justify-content: center;
  align-content: center;
  ${({ outline }) =>
    outline &&
    css`
      border: 1px solid;
    `};
  ${({ useIcon }) =>
    useIcon &&
    css`
      background: none;
      ::before {
        ${({ useIcon }) => useIcon && collecticon(useIcon)}
      }
    `};
`;

export const ToolBox = styled.section`
  padding: 0 1.5rem;
  display: grid;
  grid-template-rows: max-content max-content;
  justify-content: space-between;
  ${Heading},
  ${Subheading} {
    padding: 0;
    grid-column: span 6;
    margin-bottom: ${glsp(0.25)};
  }
  ${Button} {
    padding: ${glsp(0.25)} ${glsp(0.375)};
    box-shadow: none;
    border: 2px solid ${themeVal('color.primaryAlphaB')};
    grid-row: 2;
    transition: all 0.24s ease-out;
    span {
      max-width: 0;
      overflow: hidden;
      opacity: 0;
      transition: all 0.24s ease-out;
    }
    &:before {
      margin-right: 0;
      transition: all 0.24s ease-out;
    }
    &:hover,
    &:active,
    &.active {
      span {
        max-width: 5rem;
        opacity: 1;
      }
      &:before {
        margin-right: ${glsp(0.375)};
      }
    }
    & ~ ${Button} {
      margin-left: ${glsp(0.5)};
    }
  }
`;

export const PickerStyles = {
  default: {
    picker: {
      boxShadow: 'none',
      fontFamily: 'inherit',
      background: themeVal('color.surface'),
    },
    body: {
      padding: '12px 0 6px',
    },
    saturation: {
      paddingBottom: '42%',
    },
  },
  disableAlpha: {
    color: {
      width: '32px',
    },
    swatch: {
      marginTop: '-5px',
      width: '20px',
      height: '20px',
      borderRadius: '10px',
    },
  },
};

export const PickerDropdownBody = styled(DropdownBody)`
  font-weight: 400;
  padding: 0;
`;

export const PickerDropdownItem = styled(DropdownItem)`
  justify-items: stretch;
  grid-template-columns: auto;
  label {
    display: flex;
    flex-flow: column nowrap;
    font-size: 0.875rem;
    & > input,
    & > div {
      margin-top: ${glsp(0.125)};
    }
  }
  input[id^='rc-editable-input'] {
    font-family: ${themeVal('type.base.family')} !important;
    font-size: 0.875rem !important;
    border: 1px solid rgba(240, 244, 255, 0.16) !important;
    border-radius: 0.2rem !important;
    background-color: #1c263c !important;
    color: #f0f4ff !important;
    line-height: 21px !important;
    height: auto !important;
    box-shadow: none !important;
    &:hover {
      box-shadow: none !important;
      border-color: rgba(240, 244, 255, 0.32) !important;
    }
    &:active,
    &:focus {
      outline: 0 !important;
      box-shadow: none !important;
      border-color: rgba(240, 244, 255, 0.64) !important;
    }
  }
  label[for^='rc-editable-input'] {
    color: ${themeVal('color.base')} !important;
    font-size: 0.875rem !important;
  }
  .chrome-picker .flexbox-fix svg {
    fill: ${themeVal('color.baseAlphaE')} !important;
    &:hover {
      fill: ${themeVal('color.base')} !important;
      background: transparent !important;
    }
  }
`;

export const PickerDropdownFooter = styled(DropdownFooter)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  align-items: center;
  > ${DropdownItem} {
    grid-template-columns: auto;
  }
`;

export const ClassThumbnail = styled.div`
  grid-row: 1 / 3;
  width: ${glsp(1.5)};
  height: ${glsp(1.5)};
  background: ${({ color }) => color || themeVal('color.baseAlphaD')};
  border: 1px solid ${themeVal('color.baseAlphaD')};
  display: grid;
  justify-content: center;
  align-content: center;
  ${({ outline }) =>
    outline &&
    css`
      border: 1px solid;
    `};
  ${({ useIcon }) =>
    useIcon &&
    css`
      background: none;
      ::before {
        ${({ useIcon }) => useIcon && collecticon(useIcon)}
      }
    `};
`;

const selectors = {
  currentClasses: (state) => state.context.currentClasses,
  mapMode: (state) => state.context.mapMode,
};

function RetrainTab({ className }) {
  // const { className, placeholderMessage } = props;
  // const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  // const { setCurrentMapMode, mapModes, mapState } = useMapState();
  // const { sessionStatus } = useSessionStatus();
  // const { mapRef } = useMapRef();
  // const isLoading = ['loading-project', 'retraining'].includes(
  //   sessionStatus.mode
  // );

  // const [importSamplesModalRevealed, setImportSamplesModalRevealed] = useState(
  //   false
  // );
  // const [osmModalRevealed, setOsmModalRevealed] = useState(false);
  // const { aoiArea } = useAoi();
  // const { apiLimits } = useApiLimits();
  // const { selectedModel } = useModel();

  // const isBatchArea =
  //   aoiArea && apiLimits && aoiArea > apiLimits['live_inference'];

  const actorRef = ProjectMachineContext.useActorRef();
  const currentClasses = ProjectMachineContext.useSelector(
    selectors.currentClasses
  );
  const currentMapMode = ProjectMachineContext.useSelector(selectors.mapMode);

  const [activeClass, setActiveClass] = useState(null);

  const isBatchArea = false;
  const isLoading = false;

  // Helper function to switch between map modes
  function toggleMapMode(mode) {
    // Do nothing if no class is selected
    if (!activeClass) return;

    // Switch between selected mode and browse mode
    const nextMapMode = currentMapMode === mode ? MAP_MODES.BROWSE : mode;

    // Send the event to the machine
    actorRef.send({
      type: 'Toggle map mode',
      data: { mapMode: nextMapMode },
    });
  }

  return (
    <ToolsWrapper className={className}>
      {!isBatchArea && !isLoading && currentClasses && (
        <>
          <ToolBox>
            {/* <ImportGeojsonModal
                setRevealed={setImportSamplesModalRevealed}
                revealed={importSamplesModalRevealed}
              /> */}
            {/* <ApplyOsmModal
                setRevealed={setOsmModalRevealed}
                revealed={osmModalRevealed}
              /> */}
            <Subheading>Sample Selection Tools</Subheading>
            <InfoButton
              data-cy='retrain-draw-polygon'
              variation={
                currentMapMode === MAP_MODES.ADD_POLYGON
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useLocalButton
              useIcon='polygon'
              visuallyDisabled={!activeClass}
              info={!activeClass && 'No class selected'}
              onClick={() => toggleMapMode(MAP_MODES.ADD_POLYGON)}
              className={currentMapMode == MAP_MODES.ADD_POLYGON && 'active'}
            >
              Polygon
            </InfoButton>
            <InfoButton
              data-cy='retrain-draw-freehand'
              variation={
                currentMapMode === MAP_MODES.ADD_FREEHAND
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useIcon='pencil'
              visuallyDisabled={!activeClass}
              info={!activeClass && 'Select a class first'}
              onClick={() => toggleMapMode(MAP_MODES.ADD_FREEHAND)}
              className={currentMapMode == MAP_MODES.ADD_FREEHAND && 'active'}
            >
              Freehand
            </InfoButton>
            <InfoButton
              data-cy='add-point-sample-button'
              variation={
                currentMapMode === MAP_MODES.ADD_POINT
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useIcon='crosshair'
              visuallyDisabled={!activeClass}
              info={!activeClass && 'Select a class first'}
              onClick={() => toggleMapMode(MAP_MODES.ADD_POINT)}
              className={currentMapMode == MAP_MODES.ADD_POINT && 'active'}
            >
              Point
            </InfoButton>

            <InfoButton
              data-cy='eraser-button'
              variation={
                currentMapMode === MAP_MODES.DELETE_SAMPLES
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useLocalButton
              useIcon='eraser'
              id='eraser-button'
              visuallyDisabled={!activeClass}
              info={
                !activeClass
                  ? 'Select a class first'
                  : 'Draw to erase, click to delete'
              }
              onClick={() => toggleMapMode(MAP_MODES.DELETE_SAMPLES)}
              className={
                currentMapMode === MAP_MODES.DELETE_SAMPLES && 'active'
              }
            >
              Erase
            </InfoButton>
            <InfoButton
              id='open-import-samples-modal-button'
              data-cy='open-import-samples-modal-button'
              // variation={
              //   importSamplesModalRevealed
              //     ? 'primary-raised-dark'
              //     : 'primary-plain'
              // }
              size='small'
              radius='ellipsoid'
              useLocalButton
              useIcon='upload'
              // visuallyDisabled={!activeClass}
              info='Import samples from GeoJSON file'
              // onClick={() => {
              //   setImportSamplesModalRevealed(true);
              // }}
            >
              Import
            </InfoButton>
            <InfoButton
              id='open-osm-modal-button'
              data-cy='open-osm-modal-button'
              // variation={
              //   osmModalRevealed ? 'primary-raised-dark' : 'primary-plain'
              // }
              size='small'
              radius='ellipsoid'
              useLocalButton
              useIcon='brand-osm'
              // visuallyDisabled={
              //   !activeClass || !selectedModel.osmtag_id
              // }
              // info={
              //   !selectedModel.osmtag_id
              //     ? 'OpenStreetMap features are not available for this model'
              //     : 'Apply OpenStreetMap features as samples'
              // }
              // onClick={() => {
              //   setOsmModalRevealed(true);
              // }}
            >
              Use OSM
            </InfoButton>
          </ToolBox>
          <ClassList>
            <Subheading>Classes</Subheading>
            {Object.values(currentClasses).map((c) => {
              let polygons = get(c, 'polygons.length');
              let points = get(c, 'points.coordinates.length');
              return (
                <Class
                  key={c.name}
                  data-cy={`${c.name}-class-button`}
                  onClick={() => {
                    setActiveClass(c.name);
                  }}
                  selected={activeClass === c.name}
                >
                  <ClassThumbnail color={c.color} />
                  <ClassInfoWrapper>
                    <ClassHeading size='xsmall'>{c.name}</ClassHeading>
                    <ClassSamples>
                      {polygons > 0 && (
                        <strong>
                          {polygons} {polygons > 1 ? 'polygons' : 'polygon'}
                        </strong>
                      )}
                      {points > 0 && polygons > 0 && ` | `}
                      {points > 0 && (
                        <strong>
                          {points} {points > 1 ? 'points' : 'point'}
                        </strong>
                      )}{' '}
                      {(polygons > 0 || points > 0) &&
                        `selected since last retrain`}
                    </ClassSamples>
                  </ClassInfoWrapper>
                  {points + polygons > 0 && (
                    <InfoButton
                      variation='base-plain'
                      size='medium'
                      useIcon='arrow-loop'
                      title='Clear class samples drawn since last retrain or save'
                      info='Clear class samples drawn since last retrain or save'
                      id='reset-button-trigger'
                      hideText
                      disabled={activeClass !== c.name}
                      visuallyDisabled={activeClass !== c.name}
                      // onClick={() => {
                      //   dispatchCurrentCheckpoint({
                      //     type: actions.CLEAR_CLASS_SAMPLES,
                      //     data: {
                      //       className: c.name,
                      //     },
                      //   });
                      //   mapRef.freehandDraw.clearLayer(c.name);
                      // }}
                    >
                      Clear
                    </InfoButton>
                  )}
                </Class>
              );
            })}
            <Dropdown
              alignment='center'
              direction='up'
              triggerElement={(props) => (
                <AddClassButton
                  as={DropdownTrigger}
                  variation='primary-plain'
                  useIcon='plus--small'
                  title='Open dropdown'
                  className='add__class'
                  size='medium'
                  {...props}
                >
                  Add Class
                </AddClassButton>
              )}
              className='add-class__dropdown'
            >
              {/* <EditClass /> */}
            </Dropdown>
          </ClassList>
        </>
      )}

      {/* {(isLoading || placeholderMessage) && (
        <ClassList>
          {isLoading && !isBatchArea ? (
            [1, 2, 3].map((i) => (
              // +true workaround
              // Styled components will try to pass true to the DOM element
              // assing a + casts it to int which is logically equivalent
              // but does not cause the DOM error
              <Class key={i} placeholder={+true} className='placeholder-class'>
                <ClassThumbnail />
                <ClassHeading size='xsmall' placeholder={+true} />
              </Class>
            ))
          ) : (
            <></>
          )}
          <PlaceholderMessage>{placeholderMessage}</PlaceholderMessage>
        </ClassList>
      )} */}
    </ToolsWrapper>
  );
}

RetrainTab.propTypes = {
  className: T.string,
  placeholderMessage: T.string,
  ready: T.oneOfType([T.bool, T.object]),
};
export default RetrainTab;
