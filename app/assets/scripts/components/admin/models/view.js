import React, { useEffect, useState } from 'react';
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
import { Heading } from '@devseed-ui/typography';

import toasts from '../../common/toasts';
import Table, { TableCell, TableRow } from '../../common/table';

export default function ViewModel() {
  const { modelId } = useParams();

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
          setModel(data);
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
              <InpageTitle>{model.name}</InpageTitle>
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
                      headers={['Class Name', 'Color', 'OSM Tags (options)']}
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
