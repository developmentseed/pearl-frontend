import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { Heading } from '@devseed-ui/typography';
import { toTitleCase } from '../../utils/format';
const List = styled.ol`
  display: grid;
  grid-gap: 0.25rem;
  li {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: 1fr 4fr;
    align-items: center;
    h1 {
      margin: 0;
    }
  }
  ${Heading} {
    letter-spacing: ${({ useAlt }) => useAlt && '0.5px'};
  }
`;

function DetailsList(props) {
  const { details } = props;
  return (
    <List>
      {Object.entries(details).map(([key, value]) => (
        <li key={key}>
          <>
            <Heading useAlt>{toTitleCase(key)}</Heading>
            {React.isValidElement(value) ? value : <p>{value}</p>}
          </>
        </li>
      ))}
    </List>
  );
}

DetailsList.propTypes = {
  details: T.object,
};

export default DetailsList;
