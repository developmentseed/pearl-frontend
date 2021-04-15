import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  useCheckpoint,
  actions as checkpointActions,
} from '../../../context/checkpoint';
import {
  ToolsWrapper,
  ClassList as ItemList,
  Class as Item,
  Thumbnail,
  ToolBox as RefineTools,
  ClassHeading,
  ClassSamples,
  ClassInfoWrapper,
} from './retrain-refine-styles';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import InfoButton from '../../common/info-button';
import get from 'lodash.get';
import { glsp } from '@devseed-ui/theme-provider';
import { useMapState, useExploreContext } from '../../../context/explore.js';
import { useMapRef } from '../../../context/map';
import { PlaceholderMessage } from '../../../styles/placeholder';

const CheckpointSection = styled(ItemList)`
  max-height: ${glsp(7.5)};
  overflow-y: scroll;
`;

/*
 * Refine model
 * @param ready - true when checkpoint exists and we are in REFINE mode
 */
function RefineModel(props) {
  const { className, ready } = props;
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const { setMapMode, mapModes, mapState } = useMapState();
  const { mapRef } = useMapRef();

  const { checkpointList } = useExploreContext();

  return (
    <ToolsWrapper className={className}>
      {ready ? (
        <>
          <RefineTools>
            <Heading useAlt>Refinement Tools</Heading>
            <InfoButton
              variation={
                mapState.mode === mapModes.ADD_SAMPLE_POLYGON
                  ? 'primary-raised-dark'
                  : 'primary-raised-light'
              }
              size='small'
              radius='ellipsoid'
              useIcon='pencil'
              visuallyDisabled={!currentCheckpoint.activeItem}
              info={!currentCheckpoint.activeItem && 'No active item selected'}
              onClick={() => {
                if (currentCheckpoint.activeItem) {
                  setMapMode(mapModes.ADD_SAMPLE_POLYGON);
                }
              }}
            >
              Draw
            </InfoButton>

            <InfoButton
              variation={
                mapState.mode === mapModes.DELETE_SAMPLES
                  ? 'primary-raised-dark'
                  : 'primary-raised-light'
              }
              size='small'
              radius='ellipsoid'
              useIcon='trash-bin'
              visuallyDisabled={!currentCheckpoint.activeItem}
              info={!currentCheckpoint.activeItem && 'No active item selected'}
              onClick={() => {
                if (currentCheckpoint.activeItem) {
                  //setMapMode(mapModes.REMOVE_SAMPLE);
                  setMapMode(mapModes.DELETE_SAMPLES);
                }
              }}
            >
              Delete
            </InfoButton>

          </RefineTools>
          <CheckpointSection>
            <Heading useAlt>Checkpoint List</Heading>

            {checkpointList.map((c) => {
              const id = `checkpoint-${c.name}-${c.id}`;
              return (
                <Item
                  key={c.id}
                  onClick={() => {
                    if (!currentCheckpoint.checkpointBrushes[id]) {
                      dispatchCurrentCheckpoint({
                        type: checkpointActions.ADD_CHECKPOINT_BRUSH,
                        data: {
                          id,
                          checkpoint: c,
                        },
                      });

                      mapRef.polygonDraw.addLayer({
                        name: id,
                        color: '#efefef',
                      });
                    }

                    dispatchCurrentCheckpoint({
                      type: checkpointActions.SET_ACTIVE_CLASS,
                      data: id,
                    });
                  }}
                  selected={currentCheckpoint.activeItem === id}
                >
                  <Thumbnail />
                  <ClassHeading size='xsmall'>{c.name}</ClassHeading>
                </Item>
              );
            })}
          </CheckpointSection>
          <ItemList>
            <Heading useAlt>Class List</Heading>
            {Object.values(currentCheckpoint.classes).map((c) => {
              let polygons = get(c, 'polygons.length');
              return (
                <Item
                  key={c.name}
                  onClick={() => {
                    dispatchCurrentCheckpoint({
                      type: checkpointActions.SET_ACTIVE_CLASS,
                      data: c.name,
                    });
                  }}
                  selected={currentCheckpoint.activeItem === c.name}
                >
                  <Thumbnail color={c.color} />
                  <ClassInfoWrapper>
                    <ClassHeading size='xsmall'>{c.name}</ClassHeading>
                    <ClassSamples>
                      {polygons > 0 && (
                        <strong>
                          {polygons} {polygons > 1 ? 'polygons' : 'polygon'}
                        </strong>
                      )}{' '}
                      {polygons > 0 && `selected`}
                    </ClassSamples>
                  </ClassInfoWrapper>

                  <Button useIcon='cog' hideText variation='base-plain'>
                    Options
                  </Button>
                </Item>
              );
            })}
          </ItemList>
        </>
      ) : (
        <PlaceholderMessage>
          Please submit or clear retraining samples before refining results
        </PlaceholderMessage>
      )}
    </ToolsWrapper>
  );
}

RefineModel.propTypes = {
  className: T.string,
  ready: T.bool,
};

export default RefineModel;
