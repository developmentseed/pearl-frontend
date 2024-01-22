import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { MapContainer, TileLayer } from 'react-leaflet';

import { Heading } from '@devseed-ui/typography';
import {
  Form,
  FormGroup,
  FormGroupHeader,
  FormGroupBody,
  FormLabel,
  FormInput,
} from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { glsp, themeVal, rgba } from '@devseed-ui/theme-provider';
import { formatTimestampToSimpleUTCDate } from '../../../../../../../utils/dates';
import { ProjectMachineContext } from '../../../../../../../fsm/project';
import selectors from '../../../../../../../fsm/project/selectors';
import toasts from '../../../../../../common/toasts';
import { format, subDays } from 'date-fns';
import {
  generateSentinel2L2AMosaic,
  getMosaicTileUrl,
} from '../../../../../../../utils/mosaics';
import { MOSAIC_LAYER_OPACITY } from '../../../../../../../fsm/project/constants';

const MOSAIC_DATE_RANGE_IN_DAYS = 90;

const SectionWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  gap: ${glsp()};
  height: 100%;
`;

const FormWrapper = styled.div`
  width: 300px;
`;

const MapPreviewWrapper = styled.div`
  width: 100%;
`;

const MapPreviewPlaceholder = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  border: ${themeVal('layout.border')} solid
    ${rgba(themeVal('color.base'), 0.16)};
  border-radius: ${themeVal('shape.rounded')};
  justify-content: center;
`;

const CreateMosaicForm = ({ setNewMosaic, handleMosaicCreation }) => {
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);

  const maxDate = subDays(new Date(), MOSAIC_DATE_RANGE_IN_DAYS);
  const handleDateChange = async (event) => {
    setSelectedDate(event.target.value);

    const selectedDateUTCStart = new Date(event.target.value).getTime();
    const selectedDateUTCEnd = selectedDateUTCStart + 90 * 24 * 60 * 60 * 1000;

    const newTimeframe = {
      start: selectedDateUTCStart,
      end: selectedDateUTCEnd,
    };
    const newMosaic = await generateSentinel2L2AMosaic({
      startTime: newTimeframe.start,
      endTime: newTimeframe.end,
      imagerySourceId: currentImagerySource?.id,
    });
    setNewMosaic(newMosaic);
    setSelectedTimeframe(newTimeframe);
  };

  return (
    <FormWrapper>
      <Form>
        <Heading size='small' as='h4'>
          Custom mosaic filters
        </Heading>

        <FormGroup>
          <FormGroupHeader>
            <FormLabel>Start date:</FormLabel>{' '}
          </FormGroupHeader>
          <FormGroupBody>
            <FormInput
              type='date'
              value={selectedDate}
              max={format(maxDate, 'yyyy-MM-dd')}
              onChange={handleDateChange}
            />
          </FormGroupBody>
        </FormGroup>
        <FormGroup>
          <FormGroupHeader>
            <FormLabel>End date:</FormLabel>{' '}
          </FormGroupHeader>
          <FormInput
            type='date'
            value={
              selectedTimeframe?.end
                ? formatTimestampToSimpleUTCDate(selectedTimeframe.end)
                : ''
            }
            disabled
          />
        </FormGroup>
        <Button
          variation='primary-raised-dark'
          size='medium'
          useIcon='tick--small'
          type='button'
          onClick={handleMosaicCreation}
          style={{
            gridColumn: '1 / -1',
          }}
        >
          Create Mosaic
        </Button>
      </Form>
    </FormWrapper>
  );
};

CreateMosaicForm.propTypes = {
  setNewMosaic: PropTypes.func.isRequired,
  handleMosaicCreation: PropTypes.func.isRequired,
};

const MosaicPreviewMap = ({
  mosaicTileUrl,
  initialMapCenter,
  initialMapZoom,
}) => {
  return (
    <MapPreviewWrapper>
      {mosaicTileUrl && initialMapZoom && initialMapCenter ? (
        <MapContainer
          center={initialMapCenter}
          zoom={initialMapZoom}
          style={{ height: '100%' }}
        >
          <TileLayer
            key={mosaicTileUrl}
            url={mosaicTileUrl}
            opacity={MOSAIC_LAYER_OPACITY}
            attribution='&copy; Copernicus Sentinel'
          />
        </MapContainer>
      ) : (
        <MapPreviewPlaceholder>
          <span>Set date to display map preview</span>
        </MapPreviewPlaceholder>
      )}
    </MapPreviewWrapper>
  );
};

MosaicPreviewMap.propTypes = {
  mosaicTileUrl: PropTypes.string,
  initialMapZoom: PropTypes.number,
  initialMapCenter: PropTypes.array,
};

export const CreateMosaicSection = ({
  onMosaicCreated,
  className,
  initialMapZoom,
  initialMapCenter,
}) => {
  const [newMosaic, setNewMosaic] = useState(null);

  const actorRef = ProjectMachineContext.useActorRef();
  const apiClient = ProjectMachineContext.useSelector(
    ({ context }) => context.apiClient
  );

  const handleMosaicCreation = async () => {
    if (!newMosaic) {
      return;
    }

    try {
      const mosaic = await apiClient.post('mosaic', newMosaic);
      const { mosaics: mosaicsList } = await apiClient.get('mosaic');
      onMosaicCreated();
      actorRef.send({
        type: 'Mosaic was selected',
        data: { mosaic, mosaicsList },
      });
    } catch (error) {
      toasts.error('Error creating mosaic');
    }
  };

  return (
    <SectionWrapper className={className}>
      <CreateMosaicForm
        onMosaicCreated={onMosaicCreated}
        setNewMosaic={setNewMosaic}
        handleMosaicCreation={handleMosaicCreation}
      />
      <MosaicPreviewMap
        initialMapZoom={initialMapZoom}
        initialMapCenter={initialMapCenter}
        mosaicTileUrl={newMosaic && getMosaicTileUrl(newMosaic)}
      />
    </SectionWrapper>
  );
};

CreateMosaicSection.propTypes = {
  onMosaicCreated: PropTypes.func.isRequired,
  className: PropTypes.string,
  initialMapZoom: PropTypes.number,
  initialMapCenter: PropTypes.array,
};
