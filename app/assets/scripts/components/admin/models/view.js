import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { ModalWrapper } from '../../common/modal-wrapper';
import App from '../../common/app';
import PageHeader from '../../common/page-header';
import { PageBody } from '../../../styles/page';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageTitle,
  InpageToolbar,
  InpageBody,
  InpageBodyInner,
} from '../../../styles/inpage';
import { useAuth } from '../../../context/auth';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '../../common/global-loading';
import { useParams } from 'react-router';
import logger from '../../../utils/logger';

import toasts from '../../common/toasts';
import Table, { TableCell, TableRow } from '../../common/table';
import { Link } from 'react-router-dom';
const ModelInformation = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  grid-gap: ${glsp()};

  .details {
    grid-column: 1 / 3;
  }
  .meta {
    grid-column: 3 / -1;
  }
  .tags {
    grid-column: 1 / 4;
    grid-template-columns: 1fr;
  }
`;
const ModelSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  .heading {
    grid-column: 1 / -1;
  }
  ${Heading} {
    margin: 0;
  }
`;
const ColorSwatch = styled.div`
  ${({ background }) =>
    background &&
    css`
      background: ${background}!important;
    `}
  height: ${glsp(2)};
  padding: ${glsp(0.1)};
  outline: 1px solid ${themeVal('color.baseLight')};
`;

export default function ViewModel() {
  const { modelId } = useParams();
  const history = useHistory();

  const { restApiClient, apiToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState(null);
  const [osmTags, setOsmTags] = useState(null);
  const [deleteModel, setDeleteModel] = useState(null);

  useEffect(() => {
    async function fetchModel() {
      if (apiToken) {
        setIsLoading(true);
        showGlobalLoadingMessage('Loading model...');
        try {
          const data = await restApiClient.getModel(modelId);

          // Redirect to upload if model file is not present
          if (data?.storage) {
            setModel(data);
          } else {
            history.push(`/admin/models/${modelId}/upload`);
          }
        } catch (err) {
          toasts.error('Model not found.');
          setIsLoading(false);
          hideGlobalLoading();
          history.push('/admin/models');
          return;
        }
        hideGlobalLoading();
        setIsLoading(false);
      }
    }
    fetchModel();
  }, [apiToken]);

  useEffect(() => {
    async function getTags() {
      if (model?.id) {
        setIsLoading(true);
        showGlobalLoadingMessage('Loading model...');
        try {
          const tags = await restApiClient.getModelOsmTags(model.id);
          setOsmTags(tags);
        } catch (err) {
          toasts.error('Osm tags could not be retrieved');
        }
        setIsLoading(false);
        hideGlobalLoading();
      }
    }
    getTags();
  }, [model]);

  if (isLoading || !model) {
    return null;
  }

  return (
    <App pageTitle='Model'>
      <PageHeader />
      <PageBody role='main'>
        <Inpage>
          <InpageHeader>
            <InpageHeaderInner>
              <InpageTitle>
                <Link to='/admin/models'>Models</Link> / {model.name}
              </InpageTitle>
              <InpageToolbar>
                {model.active && (
                  <Button
                    variation='danger-plain'
                    data-cy='delete-model-button'
                    title='Delete Model'
                    useIcon='trash-bin'
                    onClick={async () => setDeleteModel(modelId)}
                  >
                    Delete Model
                  </Button>
                )}

                <Modal
                  id='confirm-delete-model-modal'
                  data-cy='confirm-delete-model-modal'
                  revealed={deleteModel}
                  onOverlayClick={() => setDeleteModel(null)}
                  onCloseClick={() => setDeleteModel(null)}
                  title='Delete Model'
                  size='small'
                  content={
                    <ModalWrapper>
                      <div>Are you sure you want to delete this model?</div>
                      <Button
                        data-cy='cancel-model-delete'
                        variation='base-plain'
                        size='medium'
                        useIcon='xmark'
                        onClick={() => {
                          setDeleteModel(null);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        data-cy='confirm-model-delete'
                        variation='danger-raised-dark'
                        size='medium'
                        useIcon='tick'
                        onClick={async () => {
                          try {
                            await restApiClient.deleteModel(modelId);
                            toasts.success('Model successfully deleted.');
                            history.push(`/admin/models`);
                          } catch (err) {
                            logger('Failed to delete model', err);
                            toasts.error('Failed to delete model.', err);
                          }
                          setDeleteModel(null);
                        }}
                      >
                        Delete Model
                      </Button>
                    </ModalWrapper>
                  }
                />
              </InpageToolbar>
            </InpageHeaderInner>
          </InpageHeader>
          <InpageBody>
            <InpageBodyInner>
              <ModelInformation>
                <ModelSection className='details'>
                  <Heading className='heading' size='small'>
                    Model Details
                  </Heading>
                  <Heading useAlt>Name </Heading>
                  <div>{model.name}</div>
                  <Heading useAlt>Active </Heading>
                  <div>{model.active ? 'true' : 'false'}</div>
                  <Heading useAlt>Type</Heading>
                  <div>{model.model_type}</div>
                  <Heading useAlt>Zoom</Heading>
                  <div>{model.model_zoom}</div>
                  <Heading useAlt>Input Shape </Heading>
                  <div>{model.model_inputshape}</div>
                  <Heading useAlt>Bounds</Heading>
                  <div>{model.bounds?.join(', ')}</div>
                </ModelSection>
                {model.meta && (
                  <ModelSection className='meta'>
                    <Heading className='heading' size='small'>
                      Model Metadata
                    </Heading>
                    <Heading useAlt>Area</Heading>
                    <div>{model.meta.name}</div>
                    <Heading useAlt>Imagery</Heading>
                    <div>{model.meta.imagery}</div>
                    <Heading useAlt>Imagery Resolution</Heading>
                    <div>{model.meta.imagery_resolution}</div>
                    <Heading useAlt>Global F1 Score</Heading>
                    <div>{model.meta.f1_weighted}</div>
                    <Heading useAlt>Label Sources</Heading>
                    <div>{model.meta.label_sources}</div>
                  </ModelSection>
                )}
                <ModelSection className='tags'>
                  <h3>Class Colormap & OpenStreetMap Tag Map</h3>
                  {model.classes?.length ? (
                    <>
                      <Table
                        headers={['Class Name', 'Color', 'OSM Tags (optional)']}
                        data={model.classes}
                        renderRow={(c, _, i) => (
                          <TableRow key={c.name}>
                            <TableCell>{c.name}</TableCell>
                            <TableCell>
                              <ColorSwatch background={c.color} />
                            </TableCell>
                            <TableCell>
                              {osmTags
                                ? osmTags.tagmap[i]
                                    .map((t) => t.value)
                                    .join(', ')
                                : 'N/A'}
                            </TableCell>
                          </TableRow>
                        )}
                        hoverable
                      />
                    </>
                  ) : (
                    <Heading>No classes found.</Heading>
                  )}
                </ModelSection>
              </ModelInformation>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </PageBody>
    </App>
  );
}
