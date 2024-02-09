import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { Button } from '@devseed-ui/button';
import collecticon from '@devseed-ui/collecticons';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../../../styles/inpage';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { StyledNavLink } from '../../../styles/links';
import { useAuth } from '../../../context/auth';
import { formatDateTime } from '../../../utils/format';
import App from '../../common/app';
import { FormSwitch } from '@devseed-ui/form';
import PageHeader from '../../common/page-header';
import Paginator from '../../common/paginator';
import { Modal } from '@devseed-ui/modal';
import { ModalWrapper } from '../../common/modal-wrapper';
import { PageBody } from '../../../styles/page';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '../../common/global-loading';
import Table, { TableRow, TableCell } from '../../common/table';
import logger from '../../../utils/logger';
import { Link } from 'react-router-dom';
import toasts from '../../common/toasts';

// Controls the size of each page
const ITEMS_PER_PAGE = 10;

const HEADERS = ['Name', 'Created', 'Active', 'File Uploaded', 'Action'];

export const ModelsBody = styled(InpageBodyInner)`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto 1fr;
  grid-gap: ${glsp()};
  padding-top: 0;
`;

export const BooleanIcon = styled.div`
  ${({ value }) =>
    css`
      &::before {
        ${value ? collecticon('tick--small') : collecticon('xmark--small')}
      }
    `}
`;

export const ModelsHeadline = styled(InpageHeadline)`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

// Render single models row
function renderRow(model, { deleteModel, toggleModelActivation }) {
  return (
    <TableRow key={model.id}>
      <TableCell>
        <StyledNavLink to={`/admin/models/${model.id}`}>
          {model.name}
        </StyledNavLink>
      </TableCell>
      <TableCell>{formatDateTime(model.created)}</TableCell>
      <TableCell>
        <FormSwitch
          hideText
          checked={model.active}
          onChange={() => {
            if (!model.storage) {
              toasts.error(
                'Please upload a model file before activating this model.'
              );
            } else {
              toggleModelActivation();
            }
          }}
        />
      </TableCell>
      <TableCell>{model.storage && <BooleanIcon value={true} />}</TableCell>
      <TableCell>
        <Button
          variation='primary-plain'
          useIcon='trash-bin'
          size='medium'
          hideText
          onClick={() => {
            deleteModel(model.id);
          }}
        >
          Remove Model
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function ModelIndex() {
  const { apiToken } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [models, setModels] = useState([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(null);
  const [modelToDelete, setModelToDelete] = useState(null);

  const { restApiClient } = useAuth();

  async function fetchModels() {
    if (apiToken) {
      try {
        showGlobalLoadingMessage('Loading models...');
        const data = await restApiClient.get(
          `model/?active=all&storage=all&page=${page}&limit=${ITEMS_PER_PAGE}`
        );
        setTotal(data.total);
        setModels(data.models);
      } catch (error) {
        logger(error);
      } finally {
        hideGlobalLoading();
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchModels();
  }, [apiToken, page]);

  return (
    <App pageTitle='Models'>
      <PageHeader />
      <PageBody role='main'>
        <Inpage>
          <InpageHeader>
            <InpageHeaderInner>
              <ModelsHeadline>
                <InpageTitle>
                  <Link to='/admin/models'>Models</Link>
                </InpageTitle>
                <Button
                  forwardedAs={StyledNavLink}
                  to='/admin/models/new'
                  variation='primary-plain'
                  size='large'
                  useIcon='plus'
                  title='Start a new model'
                >
                  New Model
                </Button>
              </ModelsHeadline>
            </InpageHeaderInner>
          </InpageHeader>
          <InpageBody>
            <ModelsBody>
              {models &&
                (models.length ? (
                  <>
                    <Table
                      headers={HEADERS}
                      data={models}
                      renderRow={(m) =>
                        renderRow(m, {
                          deleteModel: () => setModelToDelete(m),
                          toggleModelActivation: async () => {
                            try {
                              await restApiClient.patch(`model/${m.id}`, {
                                active: !m.active,
                              });
                              toasts.success(
                                `Model successfully ${
                                  m.active ? 'disabled' : 'activated'
                                }.`
                              );
                              fetchModels();
                            } catch (err) {
                              logger('Failed to update the model', err);
                              toasts.error('Failed to update the model.', err);
                            }
                          },
                        })
                      }
                      hoverable
                    />
                    <Paginator
                      currentPage={page}
                      setPage={setPage}
                      totalRecords={total}
                      pageSize={ITEMS_PER_PAGE}
                    />
                  </>
                ) : (
                  <Heading>
                    {isLoading ? 'Loading Models...' : 'No models found.'}
                  </Heading>
                ))}
            </ModelsBody>
          </InpageBody>
        </Inpage>
        <Modal
          id='confirm-delete-model-modal'
          data-cy='confirm-delete-model-modal'
          revealed={modelToDelete !== null}
          onOverlayClick={() => setModelToDelete(null)}
          onCloseClick={() => setModelToDelete(null)}
          title='Delete Model'
          size='small'
          content={
            <ModalWrapper>
              <div>
                Are you sure you want to delete model {modelToDelete?.name}?
              </div>
              <Button
                data-cy='cancel-model-delete'
                variation='base-plain'
                size='medium'
                useIcon='xmark'
                onClick={() => {
                  setModelToDelete(null);
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
                    await restApiClient.deleteModel(modelToDelete.id);
                    toasts.success('Model successfully deleted.');
                    fetchModels();
                  } catch (err) {
                    logger('Failed to delete model', err);
                    if (err.statusCode === 403) {
                      toasts.error(
                        'Model is being used in other projects and can not be deleted.',
                        err
                      );
                    } else {
                      toasts.error('Failed to delete model.', err);
                    }
                  }
                  setModelToDelete(null);
                }}
              >
                Delete Model
              </Button>
            </ModalWrapper>
          }
        />
      </PageBody>
    </App>
  );
}
