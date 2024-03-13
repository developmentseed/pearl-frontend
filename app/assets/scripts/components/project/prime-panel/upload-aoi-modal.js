import React, { useState } from 'react';
import T from 'prop-types';
import bbox from '@turf/bbox';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { themeVal } from '@devseed-ui/theme-provider';
import { Modal } from '@devseed-ui/modal';
import geojsonValidation from 'geojson-validation';

import Prose from '../../../styles/type/prose';
import { FauxFileDialog } from '../../common/faux-file-dialog';
import logger from '../../../utils/logger';
import { inRange } from '../../../utils/utils';
import getFeatureArea from '@turf/area';
import get from 'lodash.get';
import { ProjectMachineContext } from '../../../fsm/project';
import selectors from '../../../fsm/project/selectors';
import config from '../../../config';

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

function UploadAoiModal() {
  const actorRef = ProjectMachineContext.useActorRef();
  const uploadAoiModal = ProjectMachineContext.useSelector(
    selectors.uploadAoiModal
  );
  const apiLimits = ProjectMachineContext.useSelector(selectors.apiLimits);

  const [file, setFile] = useState(null);
  const [warning, setWarning] = useState(null);
  const onFileSelect = async (uploadedFile) => {
    try {
      // Check if file extension
      const filename = uploadedFile.name;
      if (!filename.endsWith('.json') && !filename.endsWith('.geojson')) {
        setWarning(`Invalid file extension, please upload a valid file.`);
        return;
      }

      // Parse JSON
      const geojson = JSON.parse(await uploadedFile.text());

      // Validate with geojson-validation module
      if (!geojsonValidation.valid(geojson)) {
        setWarning(`GeJSON is not valid, please upload a valid file.`);
        return;
      }

      // Check for a FeatureCollection
      if (geojson.type !== 'FeatureCollection') {
        setWarning(
          'GeoJSON must be of FeatureCollection type, please upload a valid file.'
        );
        return;
      }

      // Check and handle the CRS property in the GeoJSON.
      const crs = get(geojson, 'crs.properties.name');
      if (crs && crs !== 'urn:ogc:def:crs:OGC:1.3:CRS84') {
        setWarning(
          'GeoJSON file contains a non-standard CRS. Please upload a file using the default CRS (WGS84).'
        );
        return;
      } else {
        delete geojson.crs; // Safely remove the CRS property if it exists or is the default.
      }

      // The first feature in the GeoJSON file should contain the AOI geometry
      const aoiGeometry = get(geojson, 'features[0].geometry');
      const bounds = bbox(geojson);
      const totalArea = getFeatureArea(geojson);

      if (isNaN(totalArea) || totalArea === 0) {
        // Area should be bigger than zero, abort import
        setWarning(
          'File is empty or does not conform a valid area, please upload another file.'
        );
        setFile(null);
        return;
      } else if (totalArea < config.minimumAoiArea) {
        // Area should be larger than minimum live_inference, abort import
        setWarning('Area is too small, please upload a larger area.');
        setFile(null);
        return;
      } else if (
        inRange(totalArea, apiLimits.live_inference, apiLimits.max_inference)
      ) {
        // If area is bigger than apiLimits.live_inference, show warning and proceed import
        setWarning('Due to area size live inference will not be available.');
      } else if (totalArea > apiLimits.max_inference) {
        // Area should be lower than max_inference, abort import
        setWarning('Area is too large, please upload another file.');
        setFile(null);
        return;
      } else if (geojson.features.length > 1) {
        setWarning(`GeoJSON file must contain a single feature.`);
        return;
      } else if (!geojsonValidation.isPolygon(aoiGeometry)) {
        setWarning(
          `GeoJSON file must contain a feature of type 'Polygon' (MultiPolygon and other types are not supported).`
        );
        return;
      } else {
        // Area is ok, clear warning
        setWarning(null);
      }

      // File is ok, allow importing
      setFile({ name: filename, bounds, totalArea, aoiGeometry });
    } catch (error) {
      logger(error);
      setWarning(
        'An unexpected error occurred, please upload a valid GeoJSON file or try again later.'
      );
    }
  };

  return (
    <Modal
      id='import-aoi-modal'
      size='small'
      revealed={uploadAoiModal.revealed}
      title='Upload an AOI'
      onCloseClick={() => {
        actorRef.send('Close upload AOI modal');
        setFile(null);
        setWarning(null);
      }}
      content={
        <Wrapper>
          {!file && (
            <Prose className='prose'>
              The GeoJSON reference system must be WGS 1984 (SRID:4326). Once
              imported, the bounding box containing all features in the file
              will be set as an AOI.
            </Prose>
          )}
          <FauxFileDialog
            name='image-file'
            data-cy='aoi-upload-input'
            onFileSelect={onFileSelect}
          >
            {(fieProps) =>
              !file && (
                <Button
                  data-cy='select-aoi-file-button'
                  variation='primary-raised-light'
                  size='medium'
                  useIcon='upload'
                  style={{
                    gridColumn: '2 / 1',
                  }}
                  {...fieProps}
                >
                  Select GeoJSON file
                </Button>
              )
            }
          </FauxFileDialog>
          {file && (
            <>
              <div className='prose'>
                <strong>Selected file: </strong>
                {file.name}
              </div>
              <div className='prose'>
                <strong>MinX: </strong>
                {file.bounds[0]}
              </div>
              <div className='prose'>
                <strong>MinY: </strong>
                {file.bounds[1]}
              </div>
              <div className='prose'>
                <strong>MaxX: </strong>
                {file.bounds[2]}
              </div>
              <div className='prose'>
                <strong>MaxY: </strong>
                {file.bounds[3]}
              </div>
            </>
          )}
          {warning && (
            <div data-cy='import-aoi-warning-text' className='prose warning'>
              {warning}
            </div>
          )}
          <Button
            data-cy='import-aoi-button'
            variation='primary-raised-dark'
            size='medium'
            useIcon='tick'
            visuallyDisabled={!file}
            disabled={!file}
            style={{ gridColumn: '1 / -1' }}
            onClick={() => {
              actorRef.send({
                type: 'Uploaded valid AOI file',
                data: {
                  aoi: {
                    name: file.name,
                    area: file.totalArea,
                    geojson: file.aoiGeometry,
                  },
                },
              });
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

UploadAoiModal.propTypes = {
  revealed: T.bool,
  setRevealed: T.func,
  onImport: T.func,
  apiLimits: T.object,
  mosaicMeta: T.object,
};

export { UploadAoiModal };
