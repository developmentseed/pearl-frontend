import React, { useState } from 'react';
import { Button } from '@devseed-ui/button';
import styled, { css } from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

const ClassList = styled.div`
  display: grid;
  grid-gap: ${glsp(1)};
`;

const Class = styled.div`
  display: grid;
  grid-template-columns: min-content auto;
  grid-gap: ${glsp(1)};
  padding: ${glsp(0.5)};
  ${Heading} {
    margin: 0;
    align-self: center;
  }
  :hover {
    cursor: pointer;
    background-color: ${themeVal('color.baseAlphaC')};
  }
  ${({ selected }) =>
    selected &&
    css`
      background-color: ${themeVal('color.baseAlphaC')};
    `};
`;
const Thumbnail = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${({ color }) => color};
`;

const Wrapper = styled.div`
  display: grid;
  grid-gap: ${glsp(1)};
`;

function RetrainModel(props) {
  const { classList } = props;
  const [selectedClass, setSelectedClass] = useState({});
  return (
    <Wrapper>
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
          </Class>
        ))}
      </ClassList>
    </Wrapper>
  );
}

RetrainModel.propTypes = {};
export default RetrainModel;
