import React from 'react';
import { PropTypes as T } from 'prop-types';
import * as Yup from 'yup';
import App from '../../common/app';
import PageHeader from '../../common/page-header';
import { PageBody } from '../../../styles/page';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../../../styles/inpage';
import { Button } from '@devseed-ui/button';
import Table, { TableCell, TableRow } from '../../common/table';

import { Form } from '@devseed-ui/form';
import { FormikInputText } from '../../common/forms/input-text';
import { FieldArray, withFormik } from 'formik';
import toasts from '../../common/toasts';
import logger from '../../../utils/logger';
import { useAuth } from '../../../context/auth';
import { FormikInputSwitch } from '../../common/forms/input-switch';
import { FormikInputSelect } from '../../common/forms/input-select';

const modelTypes = [
  { value: '', label: 'Select a model type' },
  { value: 'random_forest', label: 'random_forest' },
  { value: 'pytorch_example', label: 'pytorch_example' },
  { value: 'pytorch_solar', label: 'pytorch_solar' },
  { value: 'deeplabv3plus', label: 'deeplabv3plus' },
];

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Required.'),
  active: Yup.bool().required('Required.'),
  model_type: Yup.string()
    .oneOf(modelTypes.map((t) => t.value))
    .required('Required.'),
  model_zoom: Yup.number().required().positive().integer().min(1).max(22),
  model_inputshapeX: Yup.number().required().positive().integer().min(1),
  model_inputshapeY: Yup.number().required().positive().integer().min(1),
  model_inputshapeZ: Yup.number().required().positive().integer().min(1),
});

const initialClassValues = {
  name: '',
  color: '',
};

function InnerForm({ handleSubmit, values }) {
  return (
    <Form onSubmit={handleSubmit} style={{ gridGap: '2rem' }}>
      <FormikInputText
        id='name'
        name='name'
        label='Name'
        labelHint='(required)'
        description='Human-readable name of the Model'
        placeholder='Model name'
        autoComplete='off'
        value={values.name}
      />
      <FormikInputSwitch
        id='active'
        name='active'
        label='Active'
        description='Can the model be used for gpu instances'
        checked={values.active}
      />

      <FormikInputSelect
        id='type'
        name='model_type'
        options={modelTypes}
        label='Type'
        labelHint='(required)'
        description='Underlying model type'
      />
      <FormikInputText
        id='model_zoom'
        name='model_zoom'
        label='Zoom'
        labelHint='(required)'
        description='The tile zoom level to run inferences on'
        placeholder='Model zoom'
        autoComplete='off'
        value={values.model_zoom}
      />
      <FormikInputText
        id='model_inputshapeX'
        name='model_inputshapeX'
        label='Input Shape X'
        labelHint='(required)'
        autoComplete='off'
        value={values.model_inputshapeX}
      />
      <FormikInputText
        id='model_inputshapeY'
        name='model_inputshapeY'
        label='Input Shape Y'
        labelHint='(required)'
        autoComplete='off'
        value={values.model_inputshapeY}
      />
      <FormikInputText
        id='model_inputshapeZ'
        name='model_inputshapeZ'
        label='Input Shape Z'
        labelHint='(required)'
        autoComplete='off'
        value={values.model_inputshapeZ}
      />
      <h3>Class Colormap & OpenStreetMap Tag Map</h3>

      <FieldArray
        name='classes'
        render={({ remove, push }) => (
          <>
            <Table
              headers={['Class Name', 'Color']}
              data={values.classes}
              renderRow={(c, extraData, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <FormikInputText
                      id={`classes.${i}.name`}
                      name={`classes.${i}.name`}
                      autoComplete='off'
                      value={values.classes[i]?.name}
                    />
                  </TableCell>
                  <TableCell>
                    <FormikInputText
                      id={`classes.${i}.color`}
                      name={`classes.${i}.color`}
                      autoComplete='off'
                      value={values.classes[i]?.color}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variation='primary-plain'
                      useIcon='trash-bin'
                      size='medium'
                      hideText
                      onClick={() => {
                        remove(i);
                        if (values.classes.length === 1) {
                          push(initialClassValues);
                        }
                      }}
                    >
                      Remove Class
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            />
            <Button
              variation='primary-plain'
              useIcon='plus--small'
              className='add__class'
              size='medium'
              onClick={() => push(initialClassValues)}
            >
              Add Class
            </Button>
          </>
        )}
      />

      <Button
        type='submit'
        size='large'
        variation='primary-raised-dark'
        data-tip='Create Model'
      >
        Submit
      </Button>
    </Form>
  );
}

InnerForm.propTypes = {
  handleSubmit: T.func.isRequired,
  values: T.object.isRequired,
};

const NewModelForm = withFormik({
  mapPropsToValues: () => ({
    name: '',
    active: false,
    model_type: '',
    model_zoom: 16,
    model_inputshapeX: 256,
    model_inputshapeY: 256,
    model_inputshapeZ: 4,
    classes: [{ name: '', color: '' }],
  }),
  validationSchema: FormSchema,
  handleSubmit: (
    { model_inputshapeX, model_inputshapeY, model_inputshapeZ, ...rest },
    { props: { restApiClient }, setSubmitting }
  ) => {
    restApiClient
      .post('model', {
        model_inputshape: [
          model_inputshapeX,
          model_inputshapeY,
          model_inputshapeZ,
        ].map((i) => parseInt(i)),
        meta: {},
        ...rest,
      })
      .then(({ id }) => {
        toasts.success('Model created successfully.');
        history.push(`/admin/models/${id}`);
      })
      .catch((err) => {
        logger(err);
        toasts.error('An error occurred, please try again later.');
      })
      .finally(setSubmitting(false));
  },
})(InnerForm);

export default function NewModel() {
  const { restApiClient } = useAuth();
  return (
    <App pageTitle='Models'>
      <PageHeader />
      <PageBody role='main'>
        <Inpage>
          <InpageHeader>
            <InpageHeaderInner>
              <InpageTitle>Create New Model</InpageTitle>
            </InpageHeaderInner>
          </InpageHeader>
          <InpageBody>
            <InpageBodyInner>
              <section>
                <NewModelForm restApiClient={restApiClient} />
              </section>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </PageBody>
    </App>
  );
}
