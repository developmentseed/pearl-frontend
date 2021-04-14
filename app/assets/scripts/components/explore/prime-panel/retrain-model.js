import React from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { Button } from '@devseed-ui/button';
import InfoButton from '../../common/info-button';
import styled from 'styled-components';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import { actions, useCheckpoint } from '../../../context/checkpoint.js';
import { useMapState } from '../../../context/explore.js';
import {
  ToolsWrapper,
  ClassList,
  Class,
  Thumbnail as ClassThumbnail,
  ClassInfoWrapper,
  ClassHeading,
  ClassSamples,
  ClassOptions,
  ToolBox as RetrainTools,
} from './retrain-refine-styles';

/*
 * Retrain Model
 * @param ready - true when checkpoint exists and we are in RETRAIN mode
 */

function RetrainModel(props) {
  const { ready, className, placeholderMessage } = props;

  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();

  const { setMapMode, mapModes, mapState } = useMapState();

  return (
    <ToolsWrapper className={className}>
      {ready && currentCheckpoint.classes && (
        <>
          <RetrainTools>
            <Heading useAlt>Sample Selection Tools</Heading>
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
                mapState.mode === mapModes.ADD_SAMPLE_POINT
                  ? 'primary-raised-dark'
                  : 'primary-raised-light'
              }
              size='small'
              radius='ellipsoid'
              useIcon='crosshair'
              visuallyDisabled={!currentCheckpoint.activeItem}
              info={!currentCheckpoint.activeItem && 'No active item selected'}
              onClick={() => {
                if (currentCheckpoint.activeItem) {
                  setMapMode(mapModes.ADD_SAMPLE_POINT);
                }
              }}
            >
              Point
            </InfoButton>

            <InfoButton
              variation={
                mapState.mode === mapModes.ERASE_SAMPLE_POLYGON
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
                  setMapMode(mapModes.ERASE_SAMPLE_POLYGON);
                }
              }}
            >
              Erase
            </InfoButton>

            <InfoButton
              variation={
                mapState.mode === mapModes.REMOVE_SAMPLE
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
                  setMapMode(mapModes.REMOVE_SAMPLE);
                }
              }}
            >
              Delete
            </InfoButton>
          </RetrainTools>
          <ClassList>
            <Heading useAlt>Classes</Heading>
            {Object.values(currentCheckpoint.classes).map((c) => {
              let polygons = get(c, 'polygons.length');
              let points = get(c, 'points.coordinates.length');
              return (
                <Class
                  key={c.name}
                  onClick={() => {
                    dispatchCurrentCheckpoint({
                      type: actions.SET_ACTIVE_CLASS,
                      data: c.name,
                    });
                  }}
                  selected={currentCheckpoint.activeItem === c.name}
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

                  <ClassOptions useIcon='cog' hideText variation='base-plain'>
                    Options
                  </ClassOptions>
                </Class>
              );
            })}
            <Class className='add__class' muted as={Button}>
              <ClassThumbnail useIcon='plus' outline />
              <Heading size='xsmall'>Add Class</Heading>
            </Class>
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
              <ClassThumbnail />
              <ClassHeading size='xsmall' placeholder={+true} />
              <ClassThumbnail />
            </Class>
          ))}
          <PlaceholderMessage>{placeholderMessage}</PlaceholderMessage>
        </ClassList>
      )}

      {!ready && currentCheckpoint && (
        <PlaceholderMessage>
          Please submit or clear retraining samples before refining results
        </PlaceholderMessage>
      )}
    </ToolsWrapper>
  );
}

RetrainModel.propTypes = {
  className: T.string,
  placeholderMessage: T.string,
  ready: T.bool,
};
export default RetrainModel;
