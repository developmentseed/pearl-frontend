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
import { PageBody } from '../../../styles/page';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '../../common/global-loading';
import Table, { TableRow, TableCell } from '../../common/table';
import logger from '../../../utils/logger';
import { Link } from 'react-router-dom';
import toasts from '../../common/toasts';

const HEADERS = ['Name', 'Created', 'Active', 'Ready', 'Action'];

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
function renderRow(model, { deleteModel, activateModel }) {
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
            if (!model.active && model.storage) {
              activateModel(model.id);
            }
          }}
        />
      </TableCell>
      <TableCell>{model.storage && <BooleanIcon value={true} />}</TableCell>
      <TableCell>
        {!model.active && (
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
        )}
      </TableCell>
    </TableRow>
  );
}

export default function ModelIndex() {
  const { apiToken } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [models, setModels] = useState([]);

  const { restApiClient } = useAuth();

  async function fetchModels() {
    if (apiToken) {
      try {
        showGlobalLoadingMessage('Loading models...');
        const data = await restApiClient.get(`model/?active=all&storage=all`);
        setModels(data.models);
      } catch (error) {
        logger(error);
      } finally {
        hideGlobalLoading();
        setIsLoading(false);
      }
    }
  }

  async function deleteModel(modelId) {
    try {
      await restApiClient.deleteModel(modelId);
      toasts.success('Model successfully deleted.');
      fetchModels();
    } catch (err) {
      logger('Failed to delete project', err);
      toasts.error('Failed to delete project.', err);
    }
  }

  async function activateModel(modelId) {
    try {
      await restApiClient.patch(`model/${modelId}`, { active: true });
      toasts.success('Model successfully activated.');
      fetchModels();
    } catch (err) {
      logger('Failed to activate project', err);
      toasts.error('Failed to activate project.', err);
    }
  }

  useEffect(() => {
    fetchModels();
  }, [apiToken]);

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
                        renderRow(m, { deleteModel, activateModel })
                      }
                      hoverable
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
      </PageBody>
    </App>
  );
}
