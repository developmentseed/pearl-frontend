import React, { useContext } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';
import { PlaceholderMessage } from '../../../styles/placeholder.js';
import { CheckpointContext, actions } from '../../../context/checkpoint.js';

const ClassList = styled.div`
  display: grid;
  grid-gap: ${glsp(0.5)};

  ${PlaceholderMessage} {
    padding: 2rem;
  }
`;

const Class = styled.div`
  display: grid;
  grid-template-columns: min-content auto min-content;
  grid-gap: ${glsp(1)};
  padding-bottom: ${({ placeholder }) => placeholder && glsp()};
  align-items: ${({ placeholder }) => (placeholder ? 'stretch' : 'center')};
  background: none;
  border: none;
  outline: none;
  ${Heading} {
    margin: 0;
    align-self: center;
    text-align: left;
    background: ${({ placeholder }) =>
      placeholder ? themeVal('color.baseAlphaD') : 'none'};
    width: ${({ placeholder }) => (placeholder ? '10rem' : 'initial')};
    height: ${({ placeholder }) => (placeholder ? '1rem' : 'auto')};
    line-height: 1;
  }

  ${({ muted }) =>
    muted &&
    css`
      color: ${themeVal('color.baseAlphaE')};
      border-color: ${themeVal('color.baseAlphaE')};
    `};
  &.add__class {
    transition: all 0.16s ease-out 0s;
    padding: ${glsp(0.5)} 0;
    span {
      display: grid;
      grid-template-columns: min-content auto min-content;
      grid-gap: ${glsp(1)};
    }
    :hover {
      color: ${themeVal('color.base')};
    }
  }
`;
const Thumbnail = styled.div`
  width: ${glsp(1.5)};
  height: ${glsp(1.5)};
  background: ${({ color }) => color || themeVal('color.baseAlphaD')};
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

const Wrapper = styled.div`
  display: grid;
  grid-gap: ${glsp(0.5)};
`;

function RetrainModel(props) {
  const { className, placeholderMessage } = props;

  const { currentCheckpoint, dispatchCurrentCheckpoint } = useContext(
    CheckpointContext
  );

  return (
    <Wrapper className={className}>
      <Heading useAlt>Classes</Heading>
      <ClassList>
        {currentCheckpoint &&
          currentCheckpoint.classes &&
          Object.values(currentCheckpoint.classes).map((c) => (
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
                {c.name}
                {currentCheckpoint.activeClass === c.name ? ' (Active)' : ''}
              </Heading>

              <Button useIcon='cog' hideText variation='base-plain'>
                Options
              </Button>
            </Class>
          ))}

        {!currentCheckpoint && placeholderMessage && (
          <>
            {[1, 2, 3].map((i) => (
              // +true workaround
              // Styled components will try to pass true to the DOM element
              // assing a + casts it to int which is logically equivalent
              // but does not cause the DOM error
              <Class key={i} placeholder={+true}>
                <Thumbnail />
                <Heading size='xsmall' />
                <Button
                  disabled
                  size='small'
                  variation='base-raised-semidark'
                />
              </Class>
            ))}
            <PlaceholderMessage>{placeholderMessage}</PlaceholderMessage>
          </>
        )}
      </ClassList>
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
  classList: T.array,
  className: T.string,
  placeholderMessage: T.string,
};
export default RetrainModel;
