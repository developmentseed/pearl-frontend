import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import { useAuth } from '../../../context/auth';
import {
  showGlobalLoadingMessage,
  hideGlobalLoading,
} from '../../common/global-loading';
import { useParams } from 'react-router';

import toasts from '../../common/toasts';
import { Link } from 'react-router-dom';

export default function UploadModel() {
  const { modelId } = useParams();
  const history = useHistory();

  const { restApiClient, apiToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [model, setModel] = useState(null);

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
              <section>
                <div>Form to be added</div>
              </section>
            </InpageBodyInner>
          </InpageBody>
        </Inpage>
      </PageBody>
    </App>
  );
}
