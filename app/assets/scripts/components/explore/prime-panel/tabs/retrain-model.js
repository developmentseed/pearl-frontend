import React, { useState } from 'react';
import T from 'prop-types';
import get from 'lodash.get';

import InfoButton from '../../../common/info-button';
import { PlaceholderMessage } from '../../../../styles/placeholder.js';
import { actions, useCheckpoint } from '../../../../context/checkpoint.js';
import { useMapState } from '../../../../context/explore';
import { useSessionStatus } from '../../../../context/explore';
import { Dropdown, DropdownTrigger } from '../../../../styles/dropdown';
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
} from './retrain-refine-styles';

import { Subheading } from '../../../../styles/type/heading';
import { useAoi } from '../../../../context/aoi';
import { useApiLimits } from '../../../../context/global';
import EditClass from './edit-class';
import ImportGeojsonModal from './retrain/import-geojson-modal';
import ApplyOsmModal from './retrain/apply-osm-modal';

/*
 * Retrain Model
 * @param ready - true when checkpoint exists and we are in RETRAIN mode
 */

function RetrainModel(props) {
  const { className, placeholderMessage } = props;
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const { setMapMode, mapModes, mapState } = useMapState();
  const { sessionStatus } = useSessionStatus();
  const isLoading = ['loading-project', 'retraining'].includes(
    sessionStatus.mode
  );

  const [importSamplesModalRevealed, setImportSamplesModalRevealed] = useState(
    false
  );
  const [osmModalRevealed, setOsmModalRevealed] = useState(false);
  const { aoiArea } = useAoi();
  const { apiLimits } = useApiLimits();

  const isBatchArea =
    aoiArea && apiLimits && aoiArea > apiLimits['live_inference'];

  return (
    <ToolsWrapper className={className}>
      {!isBatchArea &&
        !isLoading &&
        currentCheckpoint &&
        currentCheckpoint.classes && (
          <>
            <RetrainTools>
              <ImportGeojsonModal
                setRevealed={setImportSamplesModalRevealed}
                revealed={importSamplesModalRevealed}
              />
              <ApplyOsmModal
                setRevealed={setOsmModalRevealed}
                revealed={osmModalRevealed}
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
                useLocalButton
                useIcon='polygon'
                visuallyDisabled={!currentCheckpoint.activeItem}
                info={
                  !currentCheckpoint.activeItem && 'No active item selected'
                }
                onClick={() => {
                  if (
                    currentCheckpoint.activeItem &&
                    mapState.mode !== mapModes.ADD_SAMPLE_POLYGON
                  ) {
                    setMapMode(mapModes.ADD_SAMPLE_POLYGON);
                  } else if (
                    mapState.mode === mapModes.ADD_SAMPLE_POLYGON &&
                    currentCheckpoint.activeItem
                  ) {
                    setMapMode(mapModes.BROWSE_MODE);
                  }
                }}
                className={
                  mapState.mode == mapModes.ADD_SAMPLE_POLYGON && 'active'
                }
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
                info={
                  !currentCheckpoint.activeItem && 'No active item selected'
                }
                onClick={() => {
                  if (
                    currentCheckpoint.activeItem &&
                    mapState.mode !== mapModes.ADD_SAMPLE_FREEHAND
                  ) {
                    setMapMode(mapModes.ADD_SAMPLE_FREEHAND);
                  } else if (mapState.mode === mapModes.ADD_SAMPLE_FREEHAND) {
                    setMapMode(mapModes.BROWSE_MODE);
                  }
                }}
                className={
                  mapState.mode == mapModes.ADD_SAMPLE_FREEHAND && 'active'
                }
              >
                Freehand
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
                info={
                  !currentCheckpoint.activeItem && 'No active item selected'
                }
                onClick={() => {
                  if (
                    currentCheckpoint.activeItem &&
                    mapState.mode !== mapModes.ADD_SAMPLE_POINT
                  ) {
                    setMapMode(mapModes.ADD_SAMPLE_POINT);
                  } else if (mapState.mode === mapModes.ADD_SAMPLE_POINT) {
                    setMapMode(mapModes.BROWSE_MODE);
                  }
                }}
                className={
                  mapState.mode == mapModes.ADD_SAMPLE_POINT && 'active'
                }
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
                  if (
                    currentCheckpoint.activeItem &&
                    mapState.mode !== mapModes.DELETE_SAMPLES
                  ) {
                    setMapMode(mapModes.DELETE_SAMPLES);
                  } else if (mapState.mode === mapModes.DELETE_SAMPLES) {
                    setMapMode(mapModes.BROWSE_MODE);
                  }
                }}
                className={
                  mapState.mode === mapModes.DELETE_SAMPLES && 'active'
                }
              >
                Erase
              </InfoButton>
              <InfoButton
                id='open-import-samples-modal-button'
                data-cy='open-import-samples-modal-button'
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
                info='Import samples from GeoJSON file'
                onClick={() => {
                  setImportSamplesModalRevealed(true);
                }}
              >
                Import GeoJSON
              </InfoButton>
              <InfoButton
                id='open-osm-modal-button'
                data-cy='open-osm-modal-button'
                variation={
                  osmModalRevealed ? 'primary-raised-dark' : 'primary-plain'
                }
                size='small'
                radius='ellipsoid'
                useLocalButton
                useIcon='brand-osm'
                visuallyDisabled={!currentCheckpoint.activeItem}
                info='Apply OpenStreetMap features as samples'
                onClick={() => {
                  setOsmModalRevealed(true);
                }}
              >
                Apply OpenStreetMap
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
                <EditClass />
              </Dropdown>
            </ClassList>
          </>
        )}

      {(isLoading || placeholderMessage) && (
        <ClassList>
          {isLoading && !isBatchArea ? (
            [1, 2, 3].map((i) => (
              // +true workaround
              // Styled components will try to pass true to the DOM element
              // assing a + casts it to int which is logically equivalent
              // but does not cause the DOM error
              <Class key={i} placeholder={+true} className='placeholder-class'>
                <ClassThumbnail />
                <ClassHeading size='xsmall' placeholder={+true} />
              </Class>
            ))
          ) : (
            <></>
          )}
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
