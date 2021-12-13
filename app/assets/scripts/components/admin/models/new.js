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
import { Form, FormInput } from '@devseed-ui/form';
// import { FormikInputSelect } from '../../../common/forms/input-select';
// import { FormikInputTextarea } from '../../common/forms/input-textarea';
import { FormikInputText } from '../../common/forms/input-text';
import { withFormik } from 'formik';
import toasts from '../../common/toasts';
import logger from '../../../utils/logger';
import { useAuth } from '../../../context/auth';
import styled from 'styled-components';
import { FormikInputSwitch } from '../../common/forms/input-switch';

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Required.'),
});

function InnerForm({ handleSubmit }) {
  return (
    <Form onSubmit={handleSubmit} style={{ gridGap: '2rem' }}>
      <FormikInputText
        id='name'
        name='name'
        label='Name'
        placeholder='Model name'
        required
        autoComplete='off'
      />
      <FormikInputSwitch
        id='active'
        name='active'
        label='Active'
        required
        autoComplete='off'
      />

      {/* <FormikInputSelect
        id='type'
        name='type'
        options={orgTypes}
        label='Type'
        labelHint='(required)'
        description='Your organization type'
      />
      <FormikInputTextarea
        id='description'
        name='description'
        label='Description'
        labelHint='(optional)'
        placeholder='Please describe your organization'
        description='Organization description.' 
      /> */}
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
};

const NewModelForm = withFormik({
  mapPropsToValues: () => ({
    name: '',
  }),
  validationSchema: FormSchema,
  handleSubmit: ({ name }, { props: { apiClient }, setSubmitting }) => {
    apiClient
      .post('org', {
        name,
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
  const { apiClient } = useAuth();
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
              <div>
                Please provide details for the model. You will be able to upload
                the model once details are saved.
              </div>
              <section>
                <NewModelForm apiClient={apiClient} />
              </section>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </PageBody>
    </App>
  );
}
