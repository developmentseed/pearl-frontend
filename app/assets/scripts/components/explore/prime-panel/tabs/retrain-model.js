import React, { useState } from 'react';
import T from 'prop-types';
import get from 'lodash.get';
import { Button } from '@devseed-ui/button';
import { ChromePicker } from 'react-color';
import InfoButton from '../../../common/info-button';
import { PlaceholderMessage } from '../../../../styles/placeholder.js';
import { actions, useCheckpoint } from '../../../../context/checkpoint.js';
import { useMapState } from '../../../../context/explore.js';
import {
  Dropdown,
  DropdownHeader,
  DropdownItem,
  DropdownTrigger,
} from '../../../../styles/dropdown';
import {
  ToolsWrapper,
  ClassList,
  Class,
  Thumbnail as ClassThumbnail,
  ClassInfoWrapper,
  ClassHeading,
  ClassSamples,
  ToolBox as RetrainTools,
  AddClassButton,
  PickerStyles,
  PickerDropdownBody,
  PickerDropdownItem,
  PickerDropdownFooter,
} from './retrain-refine-styles';
import { FormInput } from '@devseed-ui/form';
import ImportSamplesModal from '../../map/import-sample-modal';
import { Subheading } from '../../../../styles/type/heading';
import { useAoi } from '../../../../context/aoi';
import { useApiMeta } from '../../../../context/api-meta';

/*
 * Retrain Model
 * @param ready - true when checkpoint exists and we are in RETRAIN mode
 */

function RetrainModel(props) {
  const { ready, className, placeholderMessage } = props;

  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();

  const { setMapMode, mapModes, mapState } = useMapState();

  const [addClassColor, setAddClassColor] = useState('#000000');

  const [addClassName, setAddClassName] = useState('');

  const [importSamplesModalRevealed, setImportSamplesModalRevealed] = useState(
    false
  );

  const { aoiArea } = useAoi();
  const { apiLimits } = useApiMeta();

  const isBatchArea =
    aoiArea && apiLimits && aoiArea > apiLimits['live_inference'];

  return (
    <ToolsWrapper className={className}>
      {!isBatchArea && ready && currentCheckpoint.classes && (
        <>
          <RetrainTools>
            <ImportSamplesModal
              setRevealed={setImportSamplesModalRevealed}
              revealed={importSamplesModalRevealed}
            />
            <Subheading>Sample Selection Tools</Subheading>
            <InfoButton
              data-cy='retrain-draw-polygon'
              variation={
                mapState.mode === mapModes.ADD_SAMPLE_POLYGON
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useIcon='pencil'
              visuallyDisabled={!currentCheckpoint.activeItem}
              info={!currentCheckpoint.activeItem && 'No active item selected'}
              onClick={() => {
                if (
                  currentCheckpoint.activeItem &&
                  mapState.mode !== mapModes.ADD_SAMPLE_POLYGON
                ) {
                  setMapMode(mapModes.ADD_SAMPLE_POLYGON);
                }
              }}
            >
              Polygon
            </InfoButton>
            <InfoButton
              data-cy='retrain-draw-freehand'
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
              Free Hand
            </InfoButton>
            <InfoButton
              data-cy='add-point-sample-button'
              variation={
                mapState.mode === mapModes.ADD_SAMPLE_POINT
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useIcon='crosshair'
              visuallyDisabled={!currentCheckpoint.activeItem}
              info={!currentCheckpoint.activeItem && 'No active item selected'}
              onClick={() => {
                if (currentCheckpoint.activeItem) {
                  setMapMode(mapModes.ADD_SAMPLE_POINT);
                }
              }}
            >
              Point
            </InfoButton>

            <InfoButton
              data-cy='eraser-button'
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
            <InfoButton
              id='open-upload-samples-modal-button'
              data-cy='open-upload-samples-modal-button'
              variation={
                importSamplesModalRevealed
                  ? 'primary-raised-dark'
                  : 'primary-plain'
              }
              size='small'
              radius='ellipsoid'
              useLocalButton
              useIcon='upload'
              visuallyDisabled={!currentCheckpoint.activeItem}
              info='Upload samples as GeoJSON'
              onClick={() => setImportSamplesModalRevealed(true)}
            >
              Upload
            </InfoButton>
          </RetrainTools>
          <ClassList>
            <Subheading>Classes</Subheading>
            {Object.values(currentCheckpoint.classes).map((c) => {
              let polygons = get(c, 'polygons.length');
              let points = get(c, 'points.coordinates.length');
              return (
                <Class
                  key={c.name}
                  data-cy={`${c.name}-class-button`}
                  onClick={() => {
                    dispatchCurrentCheckpoint({
                      type: actions.SET_ACTIVE_CLASS,
                      data: c.name,
                    });
                  }}
                  selected={currentCheckpoint.activeItem === c.name}
                >
                  <ClassThumbnail color={c.color} />
                  <ClassInfoWrapper>
                    <ClassHeading size='xsmall'>{c.name}</ClassHeading>
                    <ClassSamples>
                      {polygons > 0 && (
                        <strong>
                          {polygons} {polygons > 1 ? 'polygons' : 'polygon'}
                        </strong>
                      )}
                      {points > 0 && polygons > 0 && ` | `}
                      {points > 0 && (
                        <strong>
                          {points} {points > 1 ? 'points' : 'point'}
                        </strong>
                      )}{' '}
                      {(polygons > 0 || points > 0) &&
                        `selected since last retrain`}
                    </ClassSamples>
                  </ClassInfoWrapper>
                </Class>
              );
            })}
            <Dropdown
              alignment='center'
              direction='up'
              triggerElement={(props) => (
                <AddClassButton
                  as={DropdownTrigger}
                  variation='primary-plain'
                  useIcon='plus--small'
                  title='Open dropdown'
                  className='add__class'
                  size='medium'
                  {...props}
                >
                  Add Class
                </AddClassButton>
              )}
              className='add-class__dropdown'
            >
              <>
                <DropdownHeader>
                  <p>New Class</p>
                </DropdownHeader>
                <PickerDropdownBody>
                  <PickerDropdownItem nonhoverable as='div'>
                    <label htmlFor='addClassName'>Class Name</label>
                    <FormInput
                      id='addClassName'
                      value={addClassName}
                      onChange={(e) => {
                        setAddClassName(e.target.value);
                      }}
                    />
                  </PickerDropdownItem>
                  <PickerDropdownItem nonhoverable as='div'>
                    <label>Label Color</label>
                    <ChromePicker
                      disableAlpha={true}
                      color={addClassColor}
                      width='100%'
                      styles={PickerStyles}
                      onChangeComplete={(color) => {
                        setAddClassColor(color.hex);
                      }}
                    />
                  </PickerDropdownItem>
                </PickerDropdownBody>
                <PickerDropdownFooter>
                  <DropdownItem nonhoverable data-dropdown='click.close'>
                    Cancel
                  </DropdownItem>
                  <DropdownItem nonhoverable data-dropdown='click.close'>
                    <Button
                      variation='primary-plain'
                      onClick={() => {
                        dispatchCurrentCheckpoint({
                          type: actions.ADD_CLASS,
                          data: {
                            name: addClassName,
                            color: addClassColor,
                          },
                        });
                        setAddClassName('');
                        setAddClassColor('#1CE1CE');
                      }}
                    >
                      Save
                    </Button>
                  </DropdownItem>
                </PickerDropdownFooter>
              </>
            </Dropdown>
          </ClassList>
        </>
      )}

      {(!currentCheckpoint || isBatchArea || (!ready && currentCheckpoint)) &&
        placeholderMessage && (
          <ClassList>
            {[1, 2, 3].map((i) => (
              // +true workaround
              // Styled components will try to pass true to the DOM element
              // assing a + casts it to int which is logically equivalent
              // but does not cause the DOM error
              <Class key={i} placeholder={+true} className='placeholder-class'>
                <ClassThumbnail />
                <ClassHeading size='xsmall' placeholder={+true} />
              </Class>
            ))}
            <PlaceholderMessage>{placeholderMessage}</PlaceholderMessage>
          </ClassList>
        )}
    </ToolsWrapper>
  );
}

RetrainModel.propTypes = {
  className: T.string,
  placeholderMessage: T.string,
  ready: T.oneOfType([T.bool, T.object]),
};
export default RetrainModel;