import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
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
import { Heading } from '@devseed-ui/typography';
import logger from '../../../utils/logger';

import toasts from '../../common/toasts';
import Table, { TableCell, TableRow } from '../../common/table';
import { Link } from 'react-router-dom';

export default function ViewModel() {
  const { modelId } = useParams();
  const history = useHistory();

  const { restApiClient, apiToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState(null);
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
              <section>
                <h3>Model Details</h3>
                <div>Name: {model.name}</div>
                <div>Active: {model.active ? 'true' : 'false'}</div>
                <div>Type: {model.model_type}</div>
                <div>Zoom: {model.model_zoom}</div>
                <div>Input Shape: {model.model_inputshape}</div>
                <div>Bounds: {model.bounds?.join(', ')}</div>
              </section>
              {model.meta && (
                <section>
                  <h3>Model Metadata</h3>
                  <div>Area: {model.meta.name}</div>
                  <div>Imagery: {model.meta.imagery}</div>
                  <div>Imagery Resolution: {model.meta.imagery_resolution}</div>
                  <div>Global F1 Score: {model.meta.f1_weighted}</div>
                  <div>Label Sources: {model.meta.label_sources}</div>
                </section>
              )}
              <section>
                <h3>Class Colormap & OpenStreetMap Tag Map</h3>
                {model.classes?.length ? (
                  <>
                    <Table
                      headers={['Class Name', 'Color', 'OSM Tags (optional)']}
                      data={model.classes}
                      renderRow={(c) => (
                        <TableRow key={c.name}>
                          <TableCell>{c.name}</TableCell>
                          <TableCell>{c.color}</TableCell>
                          <TableCell>TBA</TableCell>
                        </TableRow>
                      )}
                      hoverable
                    />
                  </>
                ) : (
                  <Heading>No classes found.</Heading>
                )}
              </section>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </PageBody>
    </App>
  );
}
