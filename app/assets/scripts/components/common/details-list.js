import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { Heading } from '@devseed-ui/typography';
import { toTitleCase } from '../../utils/format';
import { Subheading } from '../../styles/type/heading';
const List = styled.ol`
  display: grid;
  grid-gap: 0.25rem;
  li {
    display: grid;
    grid-gap: 1rem;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    h1 {
      margin: 0;
    }
  }
  ${Heading} {
    letter-spacing: ${({ useAlt }) => useAlt && '0.5px'};
  }
  dd {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

function DetailsList(props) {
  const { details } = props;
  return (
    <List>
      {Object.entries(details).map(([key, value]) => (
        <li key={key}>
          <>
            <Subheading>{toTitleCase(key)}</Subheading>
            {React.isValidElement(value) ? value : <dd>{value}</dd>}
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
