import React, { useState } from 'react';
import { Heading } from '@devseed-ui/typography';
import { formatTimestampToSimpleUTC } from '../../../../../../../utils/dates';
import { ProjectMachineContext } from '../../../../../../../fsm/project';
import selectors from '../../../../../../../fsm/project/selectors';
import toasts from '../../../../../../common/toasts';

const baseSentinelMosaic = {
  params: {
    assets: ['B04', 'B03', 'B02', 'B08'],
    rescale: '0,10000',
    collection: 'sentinel-2-l2a',
  },
  imagery_source_id: 2,
  ui_params: {
    assets: ['B04', 'B03', 'B02'],
    collection: 'sentinel-2-l2a',
    color_formula: 'Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35',
  },
};

export const CreateMosaicSection = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeframe, setSelectedTimeframe] = useState(null);

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

    const newMosaic = {
      ...baseSentinelMosaic,
      imagery_source_id: currentImagerySource.id,
      name: `Sentinel-2 ${selectedDate}`,
      mosaic_ts_start: selectedTimeframe.start,
      mosaic_ts_end: selectedTimeframe.end,
    };

    try {
      const mosaic = await apiClient.post('mosaic', newMosaic);
      alert(JSON.stringify(mosaic, null, 2));
    } catch (error) {
      toasts.error('Error creating mosaic');
    }
  };

  return (
    <>
      <Heading size='small' as='h4'>
        Create a new mosaic
      </Heading>
      <div>
        Selected date:{' '}
        <input type='date' value={selectedDate} onChange={handleDateChange} />
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
    </>
  );
};
