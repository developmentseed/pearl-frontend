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
import { ProjectMachineContext } from '../../../context/project-xstate';

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

const selectors = {
  uploadAoiModal: (state) => state.context.uploadAoiModal,
  apiLimits: (state) => state.context.apiLimits,
};

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

      // According to the latest GeoJSON spec, alternative coordinate systems
      // should not be used unless in very exceptional cases. See:
      // https://datatracker.ietf.org/doc/html/rfc7946#section-4
      if (geojson.crs) {
        setWarning(
          `GeoJSON 'crs' property is not supported, please remove it and use WGS 84 coordinate reference system.`
        );
        return;
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
        // } else if (
        //   // If mosaic bounds is available, check if geojson is contained
        //   mosaicMeta.data?.bounds &&
        //   !booleanWithin(bboxPolygon(bounds), bboxPolygon(mosaicMeta.data.bounds))
        // ) {
        //   setWarning(
        //     'Area is out of imagery bounds. Please upload another file.'
        //   );
        //   return;
      } else if (totalArea > apiLimits.max_inference) {
        // Area should be lower than max_inference, abort import
        setWarning('Area is too large, please upload another file.');
        setFile(null);
        return;
      } else if (
        inRange(totalArea, apiLimits.live_inference, apiLimits.max_inference)
      ) {
        // If area is bigger than apiLimits.live_inference, show warning and proceed import
        setWarning('Due to area size live inference will not be available.');
      } else if (
        geojson.features.length !== 1 ||
        !geojsonValidation.isPolygon(aoiGeometry)
      ) {
        setWarning(`GeoJSON file must contain a single Polygon.`);
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
      onCloseClick={() => actorRef.send('Close upload AOI modal')}
      content={
        <Wrapper>
          {!file && (
            <Prose className='prose'>
              Once imported, the bounding box containing all features in the
              file will be set as an AOI.
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
            onClick={() =>
              actorRef.send({
                type: 'Uploaded valid AOI file',
                data: {
                  aoi: {
                    name: file.name,
                    area: file.totalArea,
                    geojson: file.aoiGeometry,
                  },
                },
              })
            }
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