import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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
import { formatTimestampToSimpleUTCDate } from '../../../../../../../utils/dates';
import { ProjectMachineContext } from '../../../../../../../fsm/project';
import selectors from '../../../../../../../fsm/project/selectors';
import { format, subDays } from 'date-fns';
import { generateSentinel2L2AMosaic } from '../../../../../../../utils/mosaics';
import { InputSelect } from '../../../../../../common/forms/input-select';
import { StacCollectionType } from '../../../../../../../../types';

const MOSAIC_DATE_RANGE_IN_DAYS = 90;

const FormWrapper = styled.div`
  width: 500px;
`;

export const CreateMosaicForm = ({
  collection,
  setNewMosaic,
  handleMosaicCreation,
}) => {
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );

  const mosaicPresetsOptions = collection.mosaicPresets
    .map((m) => {
      return {
        value: m.name,
        label: m.name,
      };
    })
    .concat({
      value: 'custom',
      label: 'Custom date range',
    });

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
            <FormLabel>Select date range</FormLabel>
          </FormGroupHeader>
          <FormGroupBody>
            <InputSelect
              id='date-range-preset'
              options={mosaicPresetsOptions}
            />
          </FormGroupBody>

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
  collection: StacCollectionType.isRequired,
};
