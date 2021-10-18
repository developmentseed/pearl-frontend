import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { themeVal } from '@devseed-ui/theme-provider';
import Prose from '../../../../../styles/type/prose';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  h1 {
    grid-column: 1 / -1;
  }
  div.prose {
    grid-column: 1 / -1;
  }
  .warning {
    color: ${themeVal('color.danger')};
  }
  grid-gap: 1rem;
`;

function ImportOSMQA() {
  return (
    <Wrapper>
      <Prose className='prose'>
        By proceeding the current AOI will be populated with samples from{' '}
        <a
          href='https://osmlab.github.io/osm-qa-tiles'
          target='_blank'
          rel='noreferrer'
        >
          OSM QA Tiles
        </a>
        .
      </Prose>
      <Button
        data-cy='import-geojson-samples-button'
        variation='primary-raised-dark'
        size='medium'
        style={{
          gridColumn: '1 / -1',
        }}
      >
        Cancel
      </Button>
      <Button
        data-cy='import-osm-qa-samples-button'
        variation='primary-raised-dark'
        size='medium'
        style={{
          gridColumn: '1 / -1',
        }}
      >
        Proceed
      </Button>
    </Wrapper>
  );
}

ImportOSMQA.propTypes = {};

export default ImportOSMQA;
