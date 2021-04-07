import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  useCheckpoint,
  actions as checkpointActions,
} from '../../../context/checkpoint';
import {
  ClassList as ItemList,
  Class as Item,
  Thumbnail,
  ToolBox as RefineTools,
} from './retrain-refine-styles';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import InfoButton from '../../common/info-button';
import get from 'lodash.get';
import { glsp } from '@devseed-ui/theme-provider';
import { useMapState, useExploreContext } from '../../../context/explore.js';
import { useMapRef } from '../../../context/map';
import { PlaceholderMessage } from '../../../styles/placeholder';

const Wrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};
`;
const Section = styled.section``;

const CheckpointSection = styled(Section)`
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
    <Wrapper className={className}>
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
                mapState.mode === mapModes.REMOVE_SAMPLE
                  ? 'primary-raised-dark'
                  : 'primary-raised-light'
              }
              size='small'
              radius='ellipsoid'
              useIcon='xmark'
              visuallyDisabled={!currentCheckpoint.activeItem}
              info={!currentCheckpoint.activeItem && 'No active item selected'}
              onClick={() => {
                if (currentCheckpoint.activeItem) {
                  setMapMode(mapModes.REMOVE_SAMPLE);
                }
              }}

            >
              Delete
            </InfoButton>
          </RefineTools>
          <CheckpointSection>
            <Heading useAlt>Checkpoint List</Heading>
            <ItemList>
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
                    <Heading size='xsmall'>
                      {c.name}
                      {currentCheckpoint.activeItem === id ? ' (Active)' : ''}
                    </Heading>
                  </Item>
                );
              })}
            </ItemList>
          </CheckpointSection>
          <Section>
            <Heading useAlt>Class List</Heading>
            <ItemList>
              {Object.values(currentCheckpoint.classes).map((c) => (
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
                  <Heading size='xsmall'>
                    {c.name} (
                    {get(c, 'points.coordinates.length', 0) +
                      get(c, 'polygons.length', 0)}{' '}
                    samples)
                    {currentCheckpoint.activeItem === c.name ? ' (Active)' : ''}
                  </Heading>

                  <Button useIcon='cog' hideText variation='base-plain'>
                    Options
                  </Button>
                </Item>
              ))}
            </ItemList>
          </Section>
        </>
      ) : (
        <PlaceholderMessage>
          Please submit or clear retraining samples before refining results
        </PlaceholderMessage>
      )}
    </Wrapper>
  );
}

RefineModel.propTypes = {
  className: T.string,
  ready: T.bool,
};

export default RefineModel;
