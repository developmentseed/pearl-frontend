import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Formik } from 'formik';

import { Button } from '@devseed-ui/button';
import {
  Form,
  FormGroup,
  FormGroupBody,
  FormGroupHeader,
  FormInput,
  FormLabel,
} from '@devseed-ui/form';

import {
  generateQuartersInBetweenDates,
  getDatePartFromISOString,
} from '../../../../../../../utils/dates';
import { generateSentinel2L2AMosaic } from '../../../../../../../utils/mosaics';

import { ProjectMachineContext } from '../../../../../../../fsm/project';
import selectors from '../../../../../../../fsm/project/selectors';

import { InputSelect } from '../../../../../../common/forms/input-select';
import FormGroupStructure from '../../../../../../common/forms/form-group-structure';

const FormWrapper = styled.div`
  width: 500px;
`;

export const CreateMosaicForm = ({
  acquisitionStart,
  acquisitionEnd,
  setNewMosaic,
  handleMosaicCreation,
}) => {
  const currentImagerySource = ProjectMachineContext.useSelector(
    selectors.currentImagerySource
  );

  const availableQuarters = generateQuartersInBetweenDates(
    acquisitionStart,
    acquisitionEnd
  ).reverse();

  const defaultQuarter = availableQuarters[0];

  const initialFormValues = defaultQuarter
    ? {
        dateRange: defaultQuarter.label,
        startDate: getDatePartFromISOString(defaultQuarter.startTimestamp),
        endDate: getDatePartFromISOString(defaultQuarter.endTimestamp),
      }
    : {
        dateRange: 'custom',
        startDate: '',
        endDate: '',
      };

  const mosaicPresetsOptions = [
    {
      value: 'custom',
      label: 'Custom date range',
    },
    ...availableQuarters.map(({ label }) => ({
      value: label,
      label: `${label}`,
    })),
  ];

  const handleDateChange = async (startDate, endDate) => {
    const selectedDateUTCStart = new Date(startDate).getTime();
    const selectedDateUTCEnd = new Date(endDate).getTime();

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
  };

  // Generate first map preview on mount
  useEffect(() => {
    if (defaultQuarter) {
      handleDateChange(
        defaultQuarter.startTimestamp,
        defaultQuarter.endTimestamp
      );
    }
  }, []);

  return (
    <FormWrapper>
      <Formik initialValues={initialFormValues}>
        {({ setFieldValue, values }) => (
          <Form>
            <div>All mosaics from Planetary Computer, &lt;10% cloud cover</div>
            <FormGroup>
              <FormGroupHeader>
                <FormLabel>Select date range</FormLabel>
              </FormGroupHeader>
              <FormGroupBody>
                <InputSelect
                  id='date-range-preset'
                  options={mosaicPresetsOptions}
                  value={values.dateRange}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFieldValue('dateRange', value);
                    if (value !== 'custom') {
                      const selectedQuarter = availableQuarters.find(
                        (quarter) => quarter.label === value
                      );
                      handleDateChange(
                        selectedQuarter.startTimestamp,
                        selectedQuarter.endTimestamp
                      );
                      setFieldValue(
                        'startDate',
                        getDatePartFromISOString(selectedQuarter.startTimestamp)
                      );
                      setFieldValue(
                        'endDate',
                        getDatePartFromISOString(selectedQuarter.endTimestamp)
                      );
                    }
                  }}
                />
              </FormGroupBody>
            </FormGroup>
            <p style={{ textAlign: 'center' }}>Or</p>
            <FormGroup>
              <FormGroupHeader>
                <FormLabel>Start date:</FormLabel>{' '}
              </FormGroupHeader>
              <FormGroupBody>
                <FormInput
                  type='date'
                  id='startDate'
                  name='startDate'
                  value={values.startDate}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFieldValue('startDate', value);
                    setFieldValue('dateRange', 'custom');
                    handleDateChange(
                      new Date(value).getTime(),
                      new Date(values.endDate).getTime()
                    );
                  }}
                  min={getDatePartFromISOString(acquisitionStart)}
                  max={getDatePartFromISOString(acquisitionEnd)}
                />
              </FormGroupBody>
            </FormGroup>
            <FormGroup>
              <FormGroupStructure
                label='End Date:'
                description='End date automatically set to 90 days following start date'
              >
                <FormInput
                  type='date'
                  id='endDate'
                  name='endDate'
                  disabled
                  value={values.endDate}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFieldValue('endDate', value);
                    setFieldValue('dateRange', 'custom');
                    handleDateChange(
                      new Date(values.startDate).getTime(),
                      new Date(value).getTime()
                    );
                  }}
                />
              </FormGroupStructure>
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
        )}
      </Formik>
    </FormWrapper>
  );
};

CreateMosaicForm.propTypes = {
  setNewMosaic: PropTypes.func.isRequired,
  handleMosaicCreation: PropTypes.func.isRequired,
  acquisitionStart: PropTypes.string.isRequired,
  acquisitionEnd: PropTypes.string.isRequired,
};
