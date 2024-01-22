import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { MapContainer, TileLayer } from 'react-leaflet';

import { Heading } from '@devseed-ui/typography';
import { formatTimestampToSimpleUTC } from '../../../../../../../utils/dates';
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
  height: 100%;
`;

const PanelWrapper = styled.div`
  width: 100%;
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
    <PanelWrapper>
      <Heading size='small' as='h4'>
        Create a new mosaic
      </Heading>
      <div>
        Selected date:{' '}
        <input
          type='date'
          value={selectedDate}
          max={format(maxDate, 'yyyy-MM-dd')}
          onChange={handleDateChange}
        />
      </div>
      <div>
        Start timestamp:{' '}
        {selectedTimeframe?.start
          ? formatTimestampToSimpleUTC(selectedTimeframe.start)
          : '-'}
      </div>
      <div>
        End date:{' '}
        {selectedTimeframe?.end
          ? formatTimestampToSimpleUTC(selectedTimeframe.end)
          : '-'}
      </div>
      <div>
        <button type='button' onClick={handleMosaicCreation}>
          Create
        </button>
      </div>
    </PanelWrapper>
  );
};

CreateMosaicForm.propTypes = {
  setNewMosaic: PropTypes.func.isRequired,
  handleMosaicCreation: PropTypes.func.isRequired,
};

const MosaicPreviewMap = ({ mosaicTileUrl }) => {
  const center = [19.22819, -99.995841];
  const zoom = 12;

  return (
    <PanelWrapper>
      <MapContainer center={center} zoom={zoom} style={{ height: '100%' }}>
        {mosaicTileUrl && (
          <TileLayer
            key={mosaicTileUrl}
            url={mosaicTileUrl}
            opacity={MOSAIC_LAYER_OPACITY}
          />
        )}
      </MapContainer>
    </PanelWrapper>
  );
};

MosaicPreviewMap.propTypes = {
  mosaicTileUrl: PropTypes.object,
};

export const CreateMosaicSection = ({ onMosaicCreated, className }) => {
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
        mosaicTileUrl={newMosaic && getMosaicTileUrl(newMosaic)}
      />
    </SectionWrapper>
  );
};

CreateMosaicSection.propTypes = {
  onMosaicCreated: PropTypes.func.isRequired,
  className: PropTypes.string,
};
