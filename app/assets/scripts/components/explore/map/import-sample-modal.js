import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import { Button } from '@devseed-ui/button';
import Prose from '../../../styles/type/prose';
import { FauxFileDialog } from '../../common/faux-file-dialog';
import toasts from '../../common/toasts';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  h1 {
    grid-column: 1 / -1;
  }
  div.prose {
    grid-column: 1 / -1;
  }
  grid-gap: 1rem;
`;

function ImportSamplesModal({ revealed, setRevealed }) {
  const [warning, setWarning] = useState(null);
  const [file, setFile] = useState(null);

  const onFileSelect = async (uploadedFile) => {
    try {
      // Check if file type is JSON
      const validFileTypes = ['application/geo+json', 'application/json'];
      if (!validFileTypes.includes(uploadedFile.type)) {
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

      // Init import payload
      const payload = {
        points: [],
        polygons: [],
        other: 0,
      };

      // Get supported features
      geojson.features.forEach((f) => {
        if (f.geometry.type === 'Point') {
          payload.points = payload.points.concat(f);
        } else if (f.geometry.type === 'Polygon') {
          payload.polygons = payload.polygons.concat(f);
        } else {
          payload.other = payload.other + 1;
        }
      });

      // Set warning if unsupported features are found
      const plural = payload.other > 1 ? 's were' : 'was';
      setWarning(
        payload.other > 0 &&
          `${payload.other} invalid or unsupported feature${plural} found and discarded.`
      );

      setFile(uploadedFile);
    } catch (error) {
      toasts.error(
        'An error occurred, please upload a valid GeoJSON file or try again later.'
      );
      setFile(null);
    }
  };

  return (
    <Modal
      id='import-sample-modal'
      size='small'
      revealed={revealed}
      title='Upload Retraining Samples'
      onCloseClick={() => setRevealed(false)}
      content={
        <Wrapper>
          <Prose className='prose'>
            Upload a pre-processed retraining sample set in .geojson format.
            Select a file, than identify the existing class for the feature
            collection&apos;s points and polygons. The uploaded retraining can
            then be submitted to the model to retrain
          </Prose>
          <FauxFileDialog
            name='image-file'
            data-cy='samples-upload-input'
            onFileSelect={onFileSelect}
          >
            {(fieProps) => (
              <Button
                data-cy='select-samples-file-button'
                variation='primary-raised-light'
                size='medium'
                useIcon='upload'
                style={{
                  gridColumn: '2 / 1',
                }}
                {...fieProps}
              >
                {!file ? 'Select file' : 'Upload another file'}
              </Button>
            )}
          </FauxFileDialog>
          {file && <div>{file.name}</div>}
          {warning && <div>{warning}</div>}
          <Button
            data-cy='import-samples-button'
            variation='primary-raised-light'
            size='medium'
            useIcon='tick'
            visuallyDisabled={!file}
            style={{
              gridColumn: '2 / 1',
            }}
            onClick={() => {
              toasts.info('File import not available yet');
              setRevealed(false);
            }}
          >
            Import
          </Button>
        </Wrapper>
      }
    />
  );
}

ImportSamplesModal.propTypes = {
  revealed: T.bool,
  setRevealed: T.func,
};
export default ImportSamplesModal;
