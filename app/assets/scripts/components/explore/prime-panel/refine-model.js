import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  useCheckpoint,
  checkpointModes,
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
import get from 'lodash.get';
import { glsp } from '@devseed-ui/theme-provider';
import { useMapState, useExploreContext } from '../../../context/explore.js';

const Wrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};
`;
const Section = styled.section``;

const CheckpointSection = styled(Section)`
  max-height: ${glsp(7.5)};
  overflow-y: scroll;
`;

function RefineModel(props) {
  const { className } = props;
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const { setMapMode, mapModes, mapState } = useMapState();

  const { checkpointList } = useExploreContext();

  return (
    <Wrapper className={className}>
      {currentCheckpoint && currentCheckpoint.mode === checkpointModes.REFINE && (
        <>
          <CheckpointSection>
            <ItemList>
              {checkpointList.map((c) => (
                <Item key={c.id}>
                  <Thumbnail />
                  <Heading size='xsmall'>{c.name}</Heading>
                </Item>
              ))}
            </ItemList>
          </CheckpointSection>
          <Section>
            <RefineTools>
              <Heading useAlt>Refinement Tools</Heading>
              <Button
                variation={
                  mapState.mode === mapModes.ADD_SAMPLE_POLYGON
                    ? 'primary-raised-dark'
                    : 'primary-raised-light'
                }
                size='small'
                radius='ellipsoid'
                useIcon='pencil'
                onClick={() => setMapMode(mapModes.ADD_SAMPLE_POLYGON)}
              >
                Draw
              </Button>
              <Button
                variation={
                  mapState.mode === mapModes.REMOVE_SAMPLE
                    ? 'primary-raised-dark'
                    : 'primary-raised-light'
                }
                size='small'
                radius='ellipsoid'
                useIcon='xmark'
                onClick={() => setMapMode(mapModes.REMOVE_SAMPLE)}
              >
                Delete
              </Button>
            </RefineTools>
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
                    {currentCheckpoint.activeItem === c.name
                      ? ' (Active)'
                      : ''}
                  </Heading>

                  <Button useIcon='cog' hideText variation='base-plain'>
                    Options
                  </Button>
                </Item>
              ))}
            </ItemList>
          </Section>
        </>
      )}
    </Wrapper>
  );
}

RefineModel.propTypes = {
  className: T.string,
};

export default RefineModel;
