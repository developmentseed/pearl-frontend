import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled from 'styled-components';
import history from '../../../history';
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
  InpageTagline,
  InpageHeadline,
  InpageTitleWrapper,
} from '../../../styles/inpage';
import { Button } from '@devseed-ui/button';
import Table, { TableCell, TableRow } from '../../common/table';

import { Form as BaseForm } from '@devseed-ui/form';
import { media, themeVal } from '@devseed-ui/theme-provider';
import { FormikInputText } from '../../common/forms/input-text';
import { FieldArray, withFormik } from 'formik';
import toasts from '../../common/toasts';
import logger from '../../../utils/logger';
import { useAuth } from '../../../context/auth';
import { FormikInputSelect } from '../../common/forms/input-select';
import { FormikInputColor } from '../../common/forms/input-color';
import { StyledLink } from '../../../styles/links';

const modelTypes = [
  { value: '', label: 'Select a model type' },
  { value: 'random_forest', label: 'random_forest' },
  { value: 'pytorch_example', label: 'pytorch_example' },
  { value: 'pytorch_solar', label: 'pytorch_solar' },
  { value: 'deeplabv3plus', label: 'deeplabv3plus' },
];

const FormWrapper = styled.section`
  display: grid;
  ${media.mediumUp`
    grid-template-columns: minmax(36rem, 1fr) 1fr;
    > * {
      grid-column: 1;
    }
  `}
  p {
    margin-bottom: 2rem;
  }
`;

const Form = styled(BaseForm)`
  grid-template-columns: minmax(1px, 1fr);
  grid-gap: 2rem;
  fieldset {
    display: grid;
    grid-template-rows: auto;
    grid-gap: 2rem;
    padding: 1rem;
    border-radius: 0.25rem;
    border: 1px solid ${themeVal('color.baseAlphaC')};
  }
`;

function validOsmTagString() {
  return this.matches(
    /^([a-zA-Z0-9]+=[a-zA-Z0-9]+,)*([a-zA-Z0-9]+=[a-zA-Z0-9]+)$/,
    {
      message:
        'OSM tags should be specified in the format of key1=value1,key2=value2...',
      excludeEmptyStrings: true,
    }
  );
}
Yup.addMethod(Yup.string, 'validOsmTagString', validOsmTagString);

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
  meta: Yup.object().shape({
    description: Yup.string().required('Required.'),
    imagery: Yup.string().required('Required.'),
    imagery_resolution: Yup.string().required('Required.'),
    f1_weighted: Yup.number().required('Required.'),
    label_sources: Yup.string().required('Required.'),
  }),
  classes: Yup.array()
    .min(1)
    .of(
      Yup.object().shape({
        name: Yup.string().required('Required.'),
        color: Yup.string().required('Required.'),
        f1_score: Yup.number().required('Required.'),
        distribution: Yup.number().required('Required.'),
        osmtag: Yup.string().validOsmTagString(),
      })
    ),
});

const initialClassValues = {
  name: '',
  color: '',
  f1_score: '',
  distribution: '',
};

function InnerForm({ handleSubmit, values }) {
  return (
    <Form onSubmit={handleSubmit}>
      <fieldset>
        <legend>
          <h3>Model Details</h3>
        </legend>
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
          type='number'
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
          type='number'
          label='Input Shape X'
          labelHint='(required)'
          autoComplete='off'
          value={values.model_inputshapeX}
        />
        <FormikInputText
          id='model_inputshapeY'
          name='model_inputshapeY'
          type='number'
          label='Input Shape Y'
          labelHint='(required)'
          autoComplete='off'
          value={values.model_inputshapeY}
        />
        <FormikInputText
          id='model_inputshapeZ'
          name='model_inputshapeZ'
          type='number'
          label='Input Shape Z'
          labelHint='(required)'
          autoComplete='off'
          value={values.model_inputshapeZ}
        />
      </fieldset>
      <fieldset>
        <legend>
          <h3>Model Metadata</h3>
        </legend>
        <FormikInputText
          id='meta.description'
          name='meta.description'
          label='Description'
          labelHint='(required)'
          autoComplete='off'
          value={values.meta.description}
        />
        <FormikInputText
          id='meta.imagery'
          name='meta.imagery'
          label='Imagery'
          labelHint='(required)'
          autoComplete='off'
          value={values.meta.imagery}
        />
        <FormikInputText
          id='meta.imagery_resolution'
          name='meta.imagery_resolution'
          label='Imagery Resolution'
          labelHint='(required)'
          autoComplete='off'
          value={values.meta.imagery_resolution}
        />
        <FormikInputText
          id='meta.f1_weighted'
          name='meta.f1_weighted'
          type='number'
          label='Global F1 Score'
          labelHint='(required)'
          autoComplete='off'
          value={values.meta.f1_weighted}
        />
        <FormikInputText
          id='meta.label_sources'
          name='meta.label_sources'
          label='Label Sources'
          labelHint='(required)'
          autoComplete='off'
          value={values.meta.label_sources}
        />
      </fieldset>
      <fieldset>
        <legend>
          <h3>Class Colormap & OpenStreetMap Tags</h3>
        </legend>
        <FieldArray
          name='classes'
          render={({ remove, push }) => (
            <>
              <Table
                headers={[
                  'Class Name',
                  'Color',
                  'F1 Score',
                  'Distribution',
                  'OSM Tags',
                ]}
                data={values.classes}
                renderRow={(c, extraData, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <FormikInputText
                        id={`classes.${i}.name`}
                        name={`classes.${i}.name`}
                        hideHeader
                        autoComplete='off'
                        value={values.classes[i]?.name}
                      />
                    </TableCell>
                    <TableCell>
                      <FormikInputColor
                        id={`classes.${i}.color`}
                        name={`classes.${i}.color`}
                        hideHeader
                        autoComplete='off'
                        value={values.classes[i]?.color}
                      />
                    </TableCell>
                    <TableCell>
                      <FormikInputText
                        id={`classes.${i}.f1_score`}
                        name={`classes.${i}.f1_score`}
                        type='number'
                        hideHeader
                        autoComplete='off'
                        value={values.classes[i]?.f1_score}
                      />
                    </TableCell>
                    <TableCell>
                      <FormikInputText
                        id={`classes.${i}.distribution`}
                        name={`classes.${i}.distribution`}
                        type='number'
                        hideHeader
                        autoComplete='off'
                        value={values.classes[i]?.distribution}
                      />
                    </TableCell>
                    <TableCell>
                      <FormikInputText
                        id={`classes.${i}.osmtag`}
                        name={`classes.${i}.osmtag`}
                        hideHeader
                        autoComplete='off'
                        value={values.classes[i]?.osmtag}
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
      </fieldset>
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
    meta: {
      description: '',
      imagery: '',
      imagery_resolution: '',
      f1_weighted: '',
      label_sources: '',
    },
    classes: [
      { name: '', color: '#fff', f1_score: '', distribution: '', osmtag: '' },
    ],
  }),
  validationSchema: FormSchema,
  handleSubmit: (
    {
      model_inputshapeX,
      model_inputshapeY,
      model_inputshapeZ,
      classes,
      meta,
      ...rest
    },
    { props: { restApiClient }, setSubmitting }
  ) => {
    const payload = {
      model_inputshape: [
        model_inputshapeX,
        model_inputshapeY,
        model_inputshapeZ,
      ],
      classes: classes.map(({ name, color }) => ({ name, color })),
      meta: {
        ...meta,
        f1_score: classes.reduce(
          (a, c) => ({ ...a, [c.name]: c.f1_score }),
          {}
        ),
        class_distribution: classes.reduce(
          (a, c) => ({ ...a, [c.name]: c.distribution }),
          {}
        ),
      },
      ...rest,
    };

    // Check if any tagmap is defined before adding to payload
    if (classes.filter((c) => c.osmtag).length > 0) {
      payload.tagmap = classes.reduce((a, c, i) => {
        a[i] = c.osmtag.split(',').map((tag) => {
          const [key, value] = tag.split('=');
          return { key, value };
        });
        return a;
      }, {});
    }

    restApiClient
      .post('model', payload)
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
              <InpageHeadline>
                <InpageTagline>
                  <StyledLink to='/admin/models'>Models</StyledLink>
                </InpageTagline>
                <InpageTitleWrapper>
                  <InpageTitle>New Model</InpageTitle>
                </InpageTitleWrapper>
              </InpageHeadline>
            </InpageHeaderInner>
          </InpageHeader>
          <InpageBody>
            <InpageBodyInner>
              <FormWrapper>
                <h3>Submitting new models</h3>
                <p>
                  Add new model details, including available metadata and class
                  colors, on this page. After successfully submitting the model
                  information, you can upload the model file on the next page.
                </p>
                <NewModelForm restApiClient={restApiClient} />
              </FormWrapper>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </PageBody>
    </App>
  );
}
