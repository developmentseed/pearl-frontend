import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  useCheckpoint,
  checkpointModes,
  actions as checkpointActions,
} from '../../../context/checkpoint';
import {
  ClassList,
  Class,
  Thumbnail,
  ToolBox as RefineTools,
} from './retrain-refine-styles';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import get from 'lodash.get';
import { glsp } from '@devseed-ui/theme-provider';
import { useMapState } from '../../../context/explore.js';

const Wrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};
`;

function RefineModel(props) {
  const { className } = props;
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const { setMapMode, mapModes, mapState } = useMapState();

  return (
    <Wrapper className={className}>
      {currentCheckpoint && currentCheckpoint.mode === checkpointModes.REFINE && (
        <>
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
          <ClassList>
            {Object.values(currentCheckpoint.classes).map((c) => (
              <Class
                key={c.name}
                onClick={() => {
                  dispatchCurrentCheckpoint({
                    type: checkpointActions.SET_ACTIVE_CLASS,
                    data: c.name,
                  });
                }}
                selected={currentCheckpoint.activeClass === c.name}
              >
                <Thumbnail color={c.color} />
                <Heading size='xsmall'>
                  {c.name} (
                  {get(c, 'points.coordinates.length', 0) +
                    get(c, 'polygons.length', 0)}{' '}
                  samples)
                  {currentCheckpoint.activeClass === c.name ? ' (Active)' : ''}
                </Heading>

                <Button useIcon='cog' hideText variation='base-plain'>
                  Options
                </Button>
              </Class>
            ))}
          </ClassList>
        </>
      )}
    </Wrapper>
  );
}

RefineModel.propTypes = {
  className: T.string,
};

export default RefineModel;
