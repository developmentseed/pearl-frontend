import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { themeVal } from '@devseed-ui/theme-provider';
import Prose from '../../../../../styles/type/prose';
import {
  useCheckpoint,
  actions as checkpointActions,
} from '../../../../../context/checkpoint';
import { defaultClassTagmaps } from '../../../../common/map/osm-qa-layer';

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

function ImportOSMQA({ setModalRevealed }) {
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const activeClass = currentCheckpoint && currentCheckpoint.activeItem;
  return (
    <Wrapper>
      <Prose className='prose'>
        Target class: <strong>{activeClass}</strong>
      </Prose>
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
        onClick={() => {
          setModalRevealed(false);
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
        onClick={() => {
          dispatchCurrentCheckpoint({
            type: checkpointActions.SET_OSM_TAGMAP,
            data: {
              name: activeClass,
              tagmap:
                defaultClassTagmaps.find((c) => c.name === activeClass)
                  ?.tagmap || [],
            },
          });
          setModalRevealed(false);
        }}
      >
        Proceed
      </Button>
    </Wrapper>
  );
}

ImportOSMQA.propTypes = {
  setModalRevealed: T.func,
};

export default ImportOSMQA;
