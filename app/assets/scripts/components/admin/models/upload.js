import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import logger from '../../../utils/logger';
import App from '../../common/app';
import PageHeader from '../../common/page-header';
import { Button } from '@devseed-ui/button';
import { FormHelperMessage } from '@devseed-ui/form';
import { PageBody } from '../../../styles/page';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../../../styles/inpage';
import { useAuth } from '../../../context/auth';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '../../common/global-loading';
import { useParams } from 'react-router';

import toasts from '../../common/toasts';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { media } from '@devseed-ui/theme-provider';
import { InputFile } from '../../common/forms/input-file';

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

export default function UploadModel() {
  const { modelId } = useParams();
  const history = useHistory();

  const { restApiClient, apiToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState(null);

  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    async function fetchModel() {
      if (apiToken) {
        setIsLoading(true);
        showGlobalLoadingMessage('Loading model...');
        try {
          const data = await restApiClient.getModel(modelId);

          // Redirect to upload if model file is present
          if (!data.storage) {
            setModel(data);
          } else {
            history.push(`/admin/models/${modelId}`);
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

  const handleUpload = (e) => {
    const [inputFile] = e.currentTarget.files;

    if (inputFile.type !== 'application/zip') {
      setError('Must be a zipfile.');
      setFile(null);
    } else {
      setFile(inputFile);
    }
  };

  return (
    <App pageTitle='Model'>
      <PageHeader />
      <PageBody role='main'>
        <Inpage>
          <InpageHeader>
            <InpageHeaderInner>
              <InpageTitle>
                <Link to='/admin/models'>Models</Link> / {model.name} / Upload
                Model
              </InpageTitle>
            </InpageHeaderInner>
          </InpageHeader>
          <InpageBody>
            <InpageBodyInner>
              <FormWrapper>
                <InputFile
                  id='files'
                  name='files'
                  accept='.zip'
                  onChange={handleUpload}
                />
                {error && (
                  <FormHelperMessage invalid>{error}</FormHelperMessage>
                )}
                <Button
                  type='submit'
                  size='small'
                  variation='primary-raised-dark'
                  visuallyDisabled={error || !file}
                  onClick={() => {
                    showGlobalLoadingMessage('Uploading file...');
                    restApiClient
                      .uploadFile(`model/${modelId}/upload`, file)
                      .then(() => {
                        toasts.success('Model file uploaded successfully.');
                        history.push(`/admin/models/${modelId}`);
                      })
                      .catch((err) => {
                        logger(err);
                        toasts.error(
                          'An error occurred, please try again later.'
                        );
                      })
                      .finally(() => hideGlobalLoading());
                  }}
                >
                  Submit
                </Button>
              </FormWrapper>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </PageBody>
    </App>
  );
}
