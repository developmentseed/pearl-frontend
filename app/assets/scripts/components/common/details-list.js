import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { Heading } from '@devseed-ui/typography';
import { toTitleCase } from '../../utils/format';
const List = styled.ol`
  li {
    display: grid;
    grid-gap: 0.5rem;
    grid-template-columns: 1fr 2fr;
    h1 {
      margin: 0;
    }
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
