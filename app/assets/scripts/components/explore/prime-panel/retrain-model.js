import React from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import { actions, useCheckpoint } from '../../../context/checkpoint.js';
import { useMapState } from '../../../context/explore.js';
import {
  ClassList,
  Class,
  Thumbnail,
  ToolBox as RetrainTools,
} from './retrain-refine-styles';

const Wrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};
`;

function RetrainModel(props) {
  const { className, placeholderMessage } = props;

  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();

  const { setMapMode, mapModes, mapState } = useMapState();

  return (
    <Wrapper className={className}>
      {currentCheckpoint && currentCheckpoint.classes && (
        <>
          <RetrainTools>
            <Heading useAlt>Sample Selection Tools</Heading>
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
                mapState.mode === mapModes.ADD_SAMPLE_POINT
                  ? 'primary-raised-dark'
                  : 'primary-raised-light'
              }
              size='small'
              radius='ellipsoid'
              useIcon='crosshair'
              onClick={() => setMapMode(mapModes.ADD_SAMPLE_POINT)}
            >
              Point
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
          </RetrainTools>
          <ClassList>
            <Heading useAlt>Classes</Heading>
            {Object.values(currentCheckpoint.classes).map((c) => (
              <Class
                key={c.name}
                onClick={() => {
                  dispatchCurrentCheckpoint({
                    type: actions.SET_ACTIVE_CLASS,
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

      {!currentCheckpoint && placeholderMessage && (
        <ClassList>
          {[1, 2, 3].map((i) => (
            // +true workaround
            // Styled components will try to pass true to the DOM element
            // assing a + casts it to int which is logically equivalent
            // but does not cause the DOM error
            <Class key={i} placeholder={+true} className='placeholder-class'>
              <Thumbnail />
              <Heading size='xsmall' />
              <Button disabled size='small' variation='base-raised-semidark' />
            </Class>
          ))}
          <PlaceholderMessage>{placeholderMessage}</PlaceholderMessage>
        </ClassList>
      )}
      {currentCheckpoint && (
        <Class className='add__class' muted as={Button}>
          <Thumbnail useIcon='plus' outline />
          <Heading size='xsmall'>Add Class</Heading>
        </Class>
      )}
    </Wrapper>
  );
}

RetrainModel.propTypes = {
  className: T.string,
  placeholderMessage: T.string,
};
export default RetrainModel;
