import React, { useState } from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import collecticon from '@devseed-ui/collecticons';

const ClassList = styled.div`
  display: grid;
  grid-gap: ${glsp(0.5)};
`;

const Class = styled.div`
  display: grid;
  grid-template-columns: min-content auto min-content;
  grid-gap: ${glsp(1)};
  padding: 0;
  align-items: center;
  background: none;
  border: none;
  outline: none;
  ${Heading} {
    margin: 0;
    align-self: center;
    text-align: left;
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
  background: ${({ color }) => color};
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
  const { classList, className } = props;
  const [selectedClass, setSelectedClass] = useState({});
  return (
    <Wrapper className={className}>
      <Heading useAlt>Classes</Heading>
      <ClassList>
        {classList.map((c) => (
          <Class
            key={c.name}
            onClick={() => {
              setSelectedClass(c);
            }}
            selected={c.name === selectedClass.name}
          >
            <Thumbnail color={c.color} />
            <Heading size='xsmall'>{c.name}</Heading>

            <Button useIcon='cog' hideText variation='base-plain'>
              Options
            </Button>
          </Class>
        ))}
      </ClassList>

      <Class className='add__class' muted as={Button}>
        <Thumbnail useIcon='plus' outline />
        <Heading size='xsmall'>Add Class</Heading>
      </Class>
    </Wrapper>
  );
}

RetrainModel.propTypes = {
  classList: T.array,
  className: T.string,
};
export default RetrainModel;
