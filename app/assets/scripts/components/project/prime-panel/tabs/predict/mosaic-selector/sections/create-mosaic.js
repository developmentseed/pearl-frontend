import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Heading } from '@devseed-ui/typography';
import { formatTimestampToSimpleUTC } from '../../../../../../../utils/dates';
import { ProjectMachineContext } from '../../../../../../../fsm/project';
import selectors from '../../../../../../../fsm/project/selectors';
import toasts from '../../../../../../common/toasts';
import { format, subDays } from 'date-fns';
import { generateSentinel2L2AMosaic } from '../../../../../../../utils/mosaics';

const MOSAIC_DATE_RANGE_IN_DAYS = 90;

export const CreateMosaicSection = ({ onMosaicCreated, className }) => {
  const actorRef = ProjectMachineContext.useActorRef();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);

  const maxDate = subDays(new Date(), MOSAIC_DATE_RANGE_IN_DAYS);

  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );
  const apiClient = ProjectMachineContext.useSelector(
    ({ context }) => context.apiClient
  );

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);

    const selectedDateUTCStart = new Date(event.target.value).getTime();
    const selectedDateUTCEnd = selectedDateUTCStart + 90 * 24 * 60 * 60 * 1000;

    setSelectedTimeframe({
      start: selectedDateUTCStart,
      end: selectedDateUTCEnd,
    });
  };

  const handleMosaicCreate = async () => {
    if (!selectedTimeframe) {
      alert('Select a date!');
      return;
    }

    const newMosaic = await generateSentinel2L2AMosaic({
      startTime: selectedTimeframe.start,
      endTime: selectedTimeframe.end,
      imagerySourceId: currentImagerySource?.id,
    });

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
    <div className={className}>
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
        <button type='button' onClick={handleMosaicCreate}>
          Create
        </button>
      </div>
    </div>
  );
};

CreateMosaicSection.propTypes = {
  onMosaicCreated: PropTypes.func.isRequired,
  className: PropTypes.string,
};
