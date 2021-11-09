import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { themeVal } from '@devseed-ui/theme-provider';
import Prose from '../../../../../styles/type/prose';
import {
  useCheckpoint,
  actions as checkpointActions,
} from '../../../../../context/checkpoint';
import { Modal } from '@devseed-ui/modal';
import {
  Dropdown,
  DropdownBody,
  DropdownItem,
  DropdownTrigger,
} from '../../../../../styles/dropdown';

export const defaultClassTagmaps = [
  {
    name: 'Water / Wetland',
    color: '#0000FF',
    tagmap: [
      { key: 'landuse', value: 'reservoir' },
      { key: 'landuse', value: 'pond' },
      { key: 'leisure', value: 'swimming_area' },
      { key: 'leisure', value: 'swimming_pool' },
      { key: 'natural', value: 'bay' },
      { key: 'natural', value: 'water' },
      { key: 'natural', value: 'riverbank' },
      { key: 'natural', value: 'coastline' },
      { key: 'amenity', value: 'fountain' },
      { key: 'waterway', value: 'river' },
      { key: 'waterway', value: 'riverbank' },
      { key: 'waterway', value: 'stream' },
    ],
  },

  {
    name: 'Structure',
    color: '#f76f73',
    tagmap: [
      { key: 'building', value: '.*' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'pub' },
      { key: 'amenity', value: 'restaurant' },
      { key: 'amenity', value: 'school' },
      { key: 'amenity', value: 'university' },
      { key: 'amenity', value: 'animal_shelter' },
      { key: 'amenity', value: 'arts_centre' },
      { key: 'amenity', value: 'bank' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'brothel' },
      { key: 'amenity', value: 'cafe' },
      { key: 'amenity', value: 'car_rental' },
      { key: 'amenity', value: 'car_wash' },
      { key: 'amenity', value: 'casino' },
      { key: 'amenity', value: 'cinema' },
      { key: 'amenity', value: 'clinic' },
      { key: 'amenity', value: 'college' },
      { key: 'amenity', value: 'community_centre' },
      { key: 'amenity', value: 'courthouse' },
      { key: 'amenity', value: 'crematorium' },
      { key: 'amenity', value: 'crypt' },
      { key: 'amenity', value: 'dentist' },
      { key: 'amenity', value: 'dive_centre' },
      { key: 'amenity', value: 'driving_school' },
      { key: 'amenity', value: 'embassy' },
      { key: 'amenity', value: 'fast_food' },
      { key: 'amenity', value: 'ferry_terminal' },
      { key: 'amenity', value: 'fire_station' },
      { key: 'amenity', value: 'food_court' },
      { key: 'amenity', value: 'fuel' },
      { key: 'amenity', value: 'grave_yard' },
      { key: 'amenity', value: 'gym' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'internet_cafe' },
    ],
  },
  {
    name: 'Water',
    color: '#0000FF',
    tagmap: [
      { key: 'landuse', value: 'reservoir' },
      { key: 'landuse', value: 'pond' },
      { key: 'leisure', value: 'swimming_area' },
      { key: 'leisure', value: 'swimming_pool' },
      { key: 'natural', value: 'bay' },
      { key: 'natural', value: 'water' },
      { key: 'natural', value: 'riverbank' },
      { key: 'natural', value: 'coastline' },
      { key: 'amenity', value: 'fountain' },
      { key: 'waterway', value: 'river' },
      { key: 'waterway', value: 'riverbank' },
      { key: 'waterway', value: 'stream' },
    ],
  },
  {
    name: 'No Data',
    color: '#62a092',
    tagmap: [],
  },
  {
    name: 'Impervious Road',
    color: '#0218a2',
    tagmap: [
      { key: 'highway', value: '.*' },
      { key: 'amenity', value: 'parking' },
      { key: 'parking', value: 'surface' },
    ],
  },
  {
    name: 'Emergent Wetlands',
    color: '#008000',
    tagmap: [
      { key: 'natural', value: 'mud' },
      { key: 'natural', value: 'wetland' },
    ],
  },
  {
    name: 'Impervious Surface',
    color: '#ffb703',
    tagmap: [
      { key: 'building', value: '.*' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'pub' },
      { key: 'amenity', value: 'restaurant' },
      { key: 'amenity', value: 'school' },
      { key: 'amenity', value: 'university' },
      { key: 'amenity', value: 'animal_shelter' },
      { key: 'amenity', value: 'arts_centre' },
      { key: 'amenity', value: 'bank' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'brothel' },
      { key: 'amenity', value: 'cafe' },
      { key: 'amenity', value: 'car_rental' },
      { key: 'amenity', value: 'car_wash' },
      { key: 'amenity', value: 'casino' },
      { key: 'amenity', value: 'cinema' },
      { key: 'amenity', value: 'clinic' },
      { key: 'amenity', value: 'college' },
      { key: 'amenity', value: 'community_centre' },
      { key: 'amenity', value: 'courthouse' },
      { key: 'amenity', value: 'crematorium' },
      { key: 'amenity', value: 'crypt' },
      { key: 'amenity', value: 'dentist' },
      { key: 'amenity', value: 'dive_centre' },
      { key: 'amenity', value: 'driving_school' },
      { key: 'amenity', value: 'embassy' },
      { key: 'amenity', value: 'fast_food' },
      { key: 'amenity', value: 'ferry_terminal' },
      { key: 'amenity', value: 'fire_station' },
      { key: 'amenity', value: 'food_court' },
      { key: 'amenity', value: 'fuel' },
      { key: 'amenity', value: 'grave_yard' },
      { key: 'amenity', value: 'gym' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'internet_cafe' },
    ],
  },
  {
    name: 'Built Environment',
    color: '#ffb703',
    tagmap: [
      { key: 'building', value: '.*' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'pub' },
      { key: 'amenity', value: 'restaurant' },
      { key: 'amenity', value: 'school' },
      { key: 'amenity', value: 'university' },
      { key: 'amenity', value: 'animal_shelter' },
      { key: 'amenity', value: 'arts_centre' },
      { key: 'amenity', value: 'bank' },
      { key: 'amenity', value: 'bar' },
      { key: 'amenity', value: 'brothel' },
      { key: 'amenity', value: 'cafe' },
      { key: 'amenity', value: 'car_rental' },
      { key: 'amenity', value: 'car_wash' },
      { key: 'amenity', value: 'casino' },
      { key: 'amenity', value: 'cinema' },
      { key: 'amenity', value: 'clinic' },
      { key: 'amenity', value: 'college' },
      { key: 'amenity', value: 'community_centre' },
      { key: 'amenity', value: 'courthouse' },
      { key: 'amenity', value: 'crematorium' },
      { key: 'amenity', value: 'crypt' },
      { key: 'amenity', value: 'dentist' },
      { key: 'amenity', value: 'dive_centre' },
      { key: 'amenity', value: 'driving_school' },
      { key: 'amenity', value: 'embassy' },
      { key: 'amenity', value: 'fast_food' },
      { key: 'amenity', value: 'ferry_terminal' },
      { key: 'amenity', value: 'fire_station' },
      { key: 'amenity', value: 'food_court' },
      { key: 'amenity', value: 'fuel' },
      { key: 'amenity', value: 'grave_yard' },
      { key: 'amenity', value: 'gym' },
      { key: 'amenity', value: 'hospital' },
      { key: 'amenity', value: 'internet_cafe' },
    ],
  },
  {
    name: 'Tree',
    color: '#80FF80',
    tagmap: [
      { key: 'natural', value: 'tree' },
      { key: 'natural', value: 'tree_row' },
      { key: 'natural', value: 'wood' },
      { key: 'landuse', value: 'forest' },
    ],
  },
  {
    name: 'Shrubland',
    color: '#806060',
    tagmap: [
      { key: 'landuse', value: 'scrub' },
      { key: 'natural', value: 'fell' },
      { key: 'natural', value: 'grassland' },
      { key: 'natural', value: 'heath' },
      { key: 'natural', value: 'scrub' },
    ],
  },
  {
    name: 'Barren',
    color: '#027fdc',
    tagmap: [
      { key: 'natural', value: 'beach' },
      { key: 'natural', value: 'sand' },
      { key: 'natural', value: 'shingle' },
      { key: 'natural', value: 'bare_rock' },
      { key: 'natural', value: 'scree' },
      { key: 'natural', value: 'glacier' },
    ],
  },
  {
    name: 'Low Vegetation',
    color: '#07c4c5',
    tagmap: [],
  },
  {
    name: 'Tundra',
    color: '#ffffff',
    tagmap: [],
  },
  {
    name: 'Mountain',
    color: '#a4afbf',
    tagmap: [],
  },
];

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
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const activeClass = currentCheckpoint && currentCheckpoint.activeItem;

  const [selectedClass, setSelectedClass] = useState(null);

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
            Target class:
            <Dropdown
              selectable
              triggerElement={(triggerProps) => (
                <DropdownTrigger
                  title='View Help Options'
                  className='help-trigger'
                  size='medium'
                  {...triggerProps}
                >
                  {selectedClass || activeClass}
                </DropdownTrigger>
              )}
            >
              <DropdownBody>
                {Object.values(currentCheckpoint.classes).map(({ name }) => (
                  <DropdownItem
                    key={name}
                    data-dropdown='click.close'
                    active={name === activeClass}
                    onClick={() => setSelectedClass(name)}
                  >
                    {selectedClass}
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
              dispatchCurrentCheckpoint({
                type: checkpointActions.SET_OSM_TAGMAP,
                data: {
                  name: selectedClass || activeClass,
                  tagmap:
                    defaultClassTagmaps.find((c) => c.name === activeClass)
                      ?.tagmap || [],
                },
              });
              setSelectedClass(null);
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
