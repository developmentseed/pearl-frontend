import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import {
  useCheckpoint,
  actions as checkpointActions,
} from '../../../../context/checkpoint';
import {
  ToolsWrapper,
  ClassList as ItemList,
  Class as Item,
  Thumbnail,
  ToolBox as RefineTools,
  ClassHeading,
  ClassSamples,
  ClassInfoWrapper,
} from './retrain-refine-styles';
import { Heading } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';
import InfoButton from '../../../common/info-button';
import get from 'lodash.get';
import { glsp } from '@devseed-ui/theme-provider';
import { useMapState, useExploreContext } from '../../../../context/explore';
import { useMapRef } from '../../../../context/map';
import { PlaceholderMessage } from '../../../../styles/placeholder';
import {
  Dropdown,
  DropdownHeader,
  DropdownBody,
  DropdownItem,
} from '../../../../styles/dropdown';
import { Subheading } from '../../../../styles/type/heading';

const CheckpointSection = styled(ItemList)`
  max-height: ${glsp(7.5)};
  overflow-y: scroll;
`;

/*
 * Refine model
 * @param ready - true when checkpoint exists and we are in REFINE mode
 */
function RefineModel(props) {
  const { className, ready } = props;
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const { setMapMode, mapModes, mapState } = useMapState();
  const { mapRef } = useMapRef();

  const { checkpointList: apiCheckpointList } = useExploreContext();

  const initVisibleLength = 4;

  // Brushable checkpoints shown to user
  const [checkpointList, setCheckpointList] = useState([]);

  // Checkpoints shown in dropdown to be added
  const [availableCheckpointList, setAvailableCheckpointList] = useState([]);

  useEffect(() => {
    if (apiCheckpointList) {
      setCheckpointList(apiCheckpointList.slice(0, initVisibleLength));
      setAvailableCheckpointList(apiCheckpointList.slice(initVisibleLength));
    }
  }, [apiCheckpointList]);

  return (
    <ToolsWrapper className={className}>
      {ready ? (
        <>
          <RefineTools>
            <Subheading>Refinement Tools</Subheading>
            <InfoButton
              variation={
                mapState.mode === mapModes.ADD_SAMPLE_FREEHAND
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useIcon='pencil'
              visuallyDisabled={!currentCheckpoint.activeItem}
              info={!currentCheckpoint.activeItem && 'No active item selected'}
              onClick={() => {
                if (currentCheckpoint.activeItem) {
                  setMapMode(mapModes.ADD_SAMPLE_FREEHAND);
                }
              }}
            >
              Draw
            </InfoButton>

            <InfoButton
              variation={
                mapState.mode === mapModes.DELETE_SAMPLES
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useLocalButton
              useIcon='eraser'
              id='eraser-button'
              visuallyDisabled={!currentCheckpoint.activeItem}
              info={
                !currentCheckpoint.activeItem
                  ? 'No active item selected'
                  : 'Draw to erase, click to delete'
              }
              onClick={() => {
                if (currentCheckpoint.activeItem) {
                  setMapMode(mapModes.DELETE_SAMPLES);
                }
              }}
            >
              Erase
            </InfoButton>
          </RefineTools>
          {checkpointList && (
            <CheckpointSection>
              <ItemList>
                <Subheading>Checkpoint List</Subheading>

                {checkpointList.map((c) => {
                  const id = `checkpoint-${c.name}-${c.id}`;
                  return (
                    <Item
                      key={c.id}
                      onClick={() => {
                        if (!currentCheckpoint.checkpointBrushes[id]) {
                          mapRef.freehandDraw.addLayer({
                            name: id,
                            color: '#efefef',
                          });

                          dispatchCurrentCheckpoint({
                            type: checkpointActions.ADD_CHECKPOINT_BRUSH,
                            data: {
                              id,
                              checkpoint: c,
                            },
                          });
                        }

                        dispatchCurrentCheckpoint({
                          type: checkpointActions.SET_ACTIVE_CLASS,
                          data: id,
                        });
                      }}
                      selected={currentCheckpoint.activeItem === id}
                    >
                      <Thumbnail />
                      <Heading size='xsmall'>
                        {c.name} ({c.id})
                      </Heading>
                    </Item>
                  );
                })}

                {availableCheckpointList.length > 0 && (
                  <Dropdown
                    alignment='right'
                    direction='down'
                    triggerElement={(props) => (
                      <Item className='add__class' muted as={Button} {...props}>
                        <Thumbnail useIcon='plus' outline />
                        <Heading size='xsmall'>Add Checkpoint</Heading>
                      </Item>
                    )}
                    className='global__dropdown'
                  >
                    <>
                      <DropdownHeader unshaded>
                        <p>Checkpoints</p>
                      </DropdownHeader>
                      <DropdownBody selectable>
                        {availableCheckpointList.map((ckpt, ind) => (
                          <DropdownItem
                            key={ckpt.id}
                            data-dropdown='click.close'
                            onClick={() => {
                              availableCheckpointList.splice(ind, 1);
                              setCheckpointList([...checkpointList, ckpt]);
                              setAvailableCheckpointList([
                                ...availableCheckpointList.slice(0, ind),
                                ...availableCheckpointList.slice(ind + 1),
                              ]);
                            }}
                          >
                            {ckpt.name} ({ckpt.id})
                          </DropdownItem>
                        ))}
                      </DropdownBody>
                    </>
                  </Dropdown>
                )}
              </ItemList>
            </CheckpointSection>
          )}
          <ItemList>
            <Subheading>Class List</Subheading>
            {Object.values(currentCheckpoint.classes).map((c) => {
              let polygons = get(c, 'polygons.length');
              return (
                <Item
                  key={c.name}
                  onClick={() => {
                    dispatchCurrentCheckpoint({
                      type: checkpointActions.SET_ACTIVE_CLASS,
                      data: c.name,
                    });
                  }}
                  selected={currentCheckpoint.activeItem === c.name}
                >
                  <Thumbnail color={c.color} />
                  <ClassInfoWrapper>
                    <ClassHeading size='xsmall'>{c.name}</ClassHeading>
                    <ClassSamples>
                      {polygons > 0 && (
                        <strong>
                          {polygons} {polygons > 1 ? 'polygons' : 'polygon'}
                        </strong>
                      )}{' '}
                      {polygons > 0 && `selected`}
                    </ClassSamples>
                  </ClassInfoWrapper>

                  <Button useIcon='cog' hideText variation='base-plain'>
                    Options
                  </Button>
                </Item>
              );
            })}
          </ItemList>
        </>
      ) : (
        <PlaceholderMessage>
          Please submit or clear retraining samples before refining results
        </PlaceholderMessage>
      )}
    </ToolsWrapper>
  );
}

RefineModel.propTypes = {
  className: T.string,
  ready: T.bool,
};

export default RefineModel;
