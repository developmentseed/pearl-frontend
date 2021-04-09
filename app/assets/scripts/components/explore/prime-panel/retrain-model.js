import React from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { Button } from '@devseed-ui/button';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import { actions, useCheckpoint } from '../../../context/checkpoint.js';
import { useMapState } from '../../../context/explore.js';

const ClassList = styled.div`
  display: grid;

  ${PlaceholderMessage} {
    padding: 2rem;
  }

  > ${Heading} {
    padding: 0 1.5rem;
  }
`;

const Class = styled.div`
  display: grid;
  grid-template-columns: min-content auto min-content;
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

  &.add__class {
    padding: ${glsp(0.5)} ${glsp(1.5)};
    // Add Class Button styles. May be removed if this takes on a different onClick configuration
    span {
      display: grid;
      grid-template-columns: min-content auto min-content;
      align-items: center;
      grid-gap: 0 ${glsp(1)};
    }
    ${Heading} {
      margin: 0;
      line-height: 1.5;
    }
  }
  &.placeholder-class:first-child {
    margin-top: ${glsp(2)};
  }

  &:hover {
    ${({ placeholder }) =>
      !placeholder &&
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

const ClassInfoWrapper = styled.div`
  grid-row: 1 / 3;
  grid-column: 2;
  display: flex;
  flex-flow: column;
`;

const ClassHeading = styled(Heading)`
  margin: 0;
  text-align: left;
  background: ${({ placeholder }) =>
    placeholder ? themeVal('color.baseAlphaD') : 'none'};
  width: ${({ placeholder }) => (placeholder ? '10rem' : 'initial')};
  height: ${({ placeholder }) => (placeholder ? '1rem' : 'auto')};
  line-height: 1;
  grid-column: ${(placeholder) => placeholder && '2'};
  grid-row: ${(placeholder) => placeholder && '1 / 3'};
`;

const ClassSamples = styled.p`
  grid-row: 2;
  grid-column: 2;
  font-size: 0.75rem;
`;

const ClassOptions = styled(Button)`
  grid-row: 1 / 3;
`;
const ClassThumbnail = styled.div`
  width: ${glsp(1.5)};
  height: ${glsp(1.5)};
  background: ${({ color }) => color || themeVal('color.baseAlphaD')};
  display: grid;
  justify-content: center;
  align-content: center;
  grid-row: 1 / 3;
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

const Wrapper = styled.div`
  display: grid;
  grid-gap: ${glsp()};
`;

const RetrainTools = styled.section`
  padding: 0 1.5rem;
  ${Button} {
    margin-left: ${glsp(0.25)};
    margin-right: ${glsp()};
    padding: 0.25rem 0.75rem 0.25rem 0.5rem;
    box-shadow: none;
    border: 2px solid ${themeVal('color.primaryAlphaB')};
  }
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
                  selected={currentCheckpoint.activeClass === c.name}
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
      {currentCheckpoint && (
        <Class className='add__class' muted as={Button}>
          <ClassThumbnail useIcon='plus' outline />
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
