import React, { useEffect, useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { themeVal } from '@devseed-ui/theme-provider';
import Prose from '../../../../../styles/type/prose';
import {
  useCheckpoint,
  actions as checkpointActions,
} from '../../../../../context/checkpoint';
import { useModel } from '../../../../../context/model';

import { Modal } from '@devseed-ui/modal';
import {
  Dropdown,
  DropdownBody,
  DropdownItem,
  DropdownTrigger,
} from '../../../../../styles/dropdown';

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

function ApplyOsmModal({ revealed, setRevealed }) {
  const { selectedModel } = useModel();
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const activeClass = currentCheckpoint && currentCheckpoint.activeItem;

  const [selectedClass, setSelectedClass] = useState(activeClass);

  useEffect(() => {
    setSelectedClass(activeClass);
  }, [activeClass]);

  return (
    <Modal
      id='apply-osm-modal'
      size='small'
      revealed={revealed}
      title='Apply OpenStreetMap Data'
      onCloseClick={() => setRevealed(false)}
      content={
        <Wrapper>
          <Prose className='prose'>
            Target class:{'  '}
            <Dropdown
              selectable
              triggerElement={(triggerProps) => (
                <DropdownTrigger
                  title='List OSM Tag options'
                  className='help-trigger'
                  size='medium'
                  variation='primary-plain'
                  useIcon={['chevron-down--small', 'after']}
                  {...triggerProps}
                >
                  {selectedClass}
                </DropdownTrigger>
              )}
            >
              <DropdownBody>
                {selectedModel?.osmtag?.map(({ name }) => (
                  <DropdownItem
                    key={name}
                    data-dropdown='click.close'
                    active={name === selectedClass}
                    onClick={() => setSelectedClass(name)}
                  >
                    {name}
                  </DropdownItem>
                ))}
              </DropdownBody>
            </Dropdown>
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
            data-cy='apply-osm-button'
            variation='primary-raised-dark'
            size='medium'
            style={{
              gridColumn: '1 / -1',
            }}
            onClick={() => {
              const selectedTagmap = selectedModel.osmtag.find(
                (c) => c.name === selectedClass
              );
              dispatchCurrentCheckpoint({
                type: checkpointActions.SET_OSM_TAGMAP,
                data: {
                  name: selectedClass,
                  tagmap: selectedTagmap.tags || [],
                },
              });
              setRevealed(false);
            }}
          >
            Proceed
          </Button>
          <Button
            variation='danger-raised-dark'
            size='medium'
            style={{
              gridColumn: '1 / -1',
            }}
            onClick={() => {
              setRevealed(false);
            }}
          >
            Cancel
          </Button>
        </Wrapper>
      }
    />
  );
}

ApplyOsmModal.propTypes = {
  revealed: T.bool,
  setRevealed: T.func,
};

export default ApplyOsmModal;
