import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import {
  useCheckpoint,
  checkpointModes,
  actions as checkpointActions,
} from '../../../context/checkpoint';
import { ClassList, Class, Thumbnail } from './retrain-refine-styles';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import get from 'lodash.get';
import { glsp } from '@devseed-ui/theme-provider';

const Wrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};
`;

function RefineModel(props) {
  const { className } = props;
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  return (
    <Wrapper className={className}>
      {currentCheckpoint && currentCheckpoint.mode === checkpointModes.REFINE && (
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
      )}
    </Wrapper>
  );
}

export default RefineModel;
