import React from 'react';
import T from 'prop-types';

// Styles
import {
  ToolsWrapper,
  ToolBox,
  ClassList,
  Class,
  ClassHeading,
  ClassThumbnail,
  ClassInfoWrapper,
  ClassSamples,
  AddClassButton,
} from '../../retrain-refine-styles.js';
import { Subheading } from '../../../../../styles/type/heading.js';
import InfoButton from '../../../../common/info-button';
import { Dropdown, DropdownTrigger } from '../../../../../styles/dropdown';
import { ProjectMachineContext } from '../../../../../fsm/project';
import get from 'lodash.get';
import { RETRAIN_MAP_MODES } from '../../../../../fsm/project/constants';
import selectors from '../../../../../fsm/project/selectors';
import EditClass from './add-class.js';

function RetrainTab({ className }) {
  const actorRef = ProjectMachineContext.useActorRef();
  const retrainClasses = ProjectMachineContext.useSelector(
    selectors.retrainClasses
  );
  const retrainMapMode = ProjectMachineContext.useSelector(
    selectors.retrainMapMode
  );
  const retrainActiveClass = ProjectMachineContext.useSelector(
    selectors.retrainActiveClass
  );

  const isBatchArea = false;
  const isLoading = false;

  // Helper function to switch between map modes
  function toggleMapMode(mode) {
    // Do nothing if no class is selected
    if (!retrainActiveClass) return;

    // Switch between selected mode and browse mode
    const nextMapMode =
      retrainMapMode === mode ? RETRAIN_MAP_MODES.BROWSE : mode;

    // Send the event to the machine
    actorRef.send({
      type: 'Set retrain map mode',
      data: { retrainMapMode: nextMapMode },
    });
  }

  return (
    <ToolsWrapper className={className}>
      {!isBatchArea && !isLoading && retrainClasses && (
        <>
          <ToolBox>
            <Subheading>Sample Selection Tools</Subheading>

            <InfoButton
              id='freehand-draw-button'
              data-cy='retrain-draw-freehand'
              variation={
                retrainMapMode === RETRAIN_MAP_MODES.ADD_FREEHAND
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useIcon='pencil'
              visuallyDisabled={!retrainActiveClass}
              info={!retrainActiveClass && 'Select a class first'}
              onClick={() => toggleMapMode(RETRAIN_MAP_MODES.ADD_FREEHAND)}
              className={
                retrainMapMode == RETRAIN_MAP_MODES.ADD_FREEHAND && 'active'
              }
            >
              Freehand
            </InfoButton>

            <InfoButton
              id='eraser-button'
              data-cy='eraser-button'
              variation={
                retrainMapMode === RETRAIN_MAP_MODES.DELETE_SAMPLES
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useLocalButton
              useIcon='eraser'
              visuallyDisabled={!retrainActiveClass}
              info={
                !retrainActiveClass
                  ? 'Select a class first'
                  : 'Draw to trim sample shapes'
              }
              onClick={() => toggleMapMode(RETRAIN_MAP_MODES.DELETE_SAMPLES)}
              className={
                retrainMapMode === RETRAIN_MAP_MODES.DELETE_SAMPLES && 'active'
              }
            >
              Erase
            </InfoButton>
          </ToolBox>
          <ClassList>
            <Subheading>Classes</Subheading>
            {retrainClasses.map((c) => {
              let polygons = get(c, 'polygons.length');
              let points = get(c, 'points.coordinates.length');
              return (
                <Class
                  key={c.name}
                  data-cy={`${c.name}-class-button`}
                  onClick={() => {
                    actorRef.send({
                      type: 'Set retrain active class',
                      data: { retrainActiveClass: c.name },
                    });
                  }}
                  selected={retrainActiveClass === c.name}
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
                      disabled={retrainActiveClass !== c.name}
                      visuallyDisabled={retrainActiveClass !== c.name}
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
                  id='add-class-button'
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
              <EditClass />
            </Dropdown>
          </ClassList>
        </>
      )}
    </ToolsWrapper>
  );
}

RetrainTab.propTypes = {
  className: T.string,
  placeholderMessage: T.string,
  ready: T.oneOfType([T.bool, T.object]),
};
export default RetrainTab;
