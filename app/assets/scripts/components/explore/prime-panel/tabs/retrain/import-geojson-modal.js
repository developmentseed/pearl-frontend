import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { themeVal } from '@devseed-ui/theme-provider';
import Prose from '../../../../../styles/type/prose';
import { Modal } from '@devseed-ui/modal';
import { FauxFileDialog } from '../../../../common/faux-file-dialog';
import toasts from '../../../../common/toasts';
import {
  actions as checkpointActions,
  useCheckpoint,
} from '../../../../../context/checkpoint';
import { useMapRef } from '../../../../../context/map';

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

function ImportGeojsonModal({ revealed, setRevealed }) {
  const [warning, setWarning] = useState(null);
  const [file, setFile] = useState(null);
  const { currentCheckpoint, dispatchCurrentCheckpoint } = useCheckpoint();
  const { mapRef } = useMapRef();

  const onFileSelect = async (uploadedFile) => {
    try {
      // Check if file extension
      const filename = uploadedFile.name;
      if (!filename.endsWith('.json') && !filename.endsWith('.geojson')) {
        toasts.error(`Invalid file type, please upload a GeoJSON file.`);
        return;
      }

      // Parse JSON
      const geojson = JSON.parse(await uploadedFile.text());

      // Check for a FeatureCollection
      if (geojson.type !== 'FeatureCollection') {
        toasts.error('GeoJSON must be of FeatureCollection type.');
        return;
      }

      // Drop the crs property if it exists. This will prevent the GeoJSON from
      // being rejected. All geojson should be considered as using the
      // default CRS (WGS84).
      if (geojson.crs) {
        delete geojson.crs;
      }

      // Init import payload
      const payload = {
        points: [],
        polygons: [],
        other: 0,
      };

      // Get supported features
      geojson.features.forEach((f) => {
        if (f.geometry.type === 'Point') {
          payload.points = payload.points.concat([f.geometry.coordinates]);
        } else if (f.geometry.type === 'Polygon') {
          payload.polygons = payload.polygons.concat(f.geometry);
        } else {
          payload.other = payload.other + 1;
        }
      });

      // Set warning if unsupported features are found
      const plural = payload.other > 1 ? 's were' : ' was';
      setWarning(
        payload.other > 0 &&
          `${payload.other} invalid or unsupported feature${plural} found and discarded.`
      );

      setFile({
        name: filename,
        payload,
      });
    } catch (error) {
      toasts.error(
        'An error occurred, please upload a valid GeoJSON file or try again later.'
      );
      setFile(null);
    }
  };

  const importFile = () => {
    const activeClass = currentCheckpoint.classes[currentCheckpoint.activeItem];

    // Update layers on free hand draw
    mapRef.freehandDraw.setLayerPolygons({
      ...currentCheckpoint.classes,
      [currentCheckpoint.activeItem]: {
        ...activeClass,
        polygons: activeClass.polygons.concat(file.payload.polygons),
      },
    });

    dispatchCurrentCheckpoint({
      type: checkpointActions.ADD_CLASS_SAMPLES,
      data: {
        name: currentCheckpoint.activeItem,
        points: file.payload.points,
        polygons: file.payload.polygons,
      },
    });
  };

  return (
    <Modal
      id='import-samples-modal'
      size='small'
      revealed={revealed}
      title='Upload Retraining Samples'
      onCloseClick={() => setRevealed(false)}
      content={
        <Wrapper>
          <Prose className='prose'>
            Target class: <strong>{currentCheckpoint.activeItem}</strong>
          </Prose>
          <Prose className='prose'>
            Upload training sample data in .geojson format.
          </Prose>
          <Prose className='prose'>
            Select a GeoJSON file with FeatureCollection of Points and Polygons.
            Once imported, these can be submitted to the model to retrain.
          </Prose>
          <FauxFileDialog
            name='image-file'
            data-cy='samples-upload-input'
            onFileSelect={onFileSelect}
          >
            {(fieProps) =>
              !file && (
                <Button
                  data-cy='select-samples-geojson-button'
                  variation='primary-raised-light'
                  size='medium'
                  useIcon='upload'
                  style={{
                    gridColumn: '2 / 1',
                  }}
                  {...fieProps}
                >
                  Select file to upload
                </Button>
              )
            }
          </FauxFileDialog>
          {file && (
            <div className='prose'>
              <strong>Selected: </strong>
              {file.name}
            </div>
          )}
          {warning && <div className='prose warning'>{warning}</div>}
          <Button
            data-cy='import-samples-geojson-button'
            variation='primary-raised-dark'
            size='medium'
            useIcon='tick'
            visuallyDisabled={!file}
            disabled={!file}
            style={{
              gridColumn: '1 / -1',
            }}
            onClick={() => {
              importFile();
              setRevealed(false);
              setFile(null);
              setWarning(null);
            }}
          >
            Import
          </Button>
        </Wrapper>
      }
    />
  );
}

ImportGeojsonModal.propTypes = {
  revealed: T.bool,
  setRevealed: T.func,
};
export default ImportGeojsonModal;
