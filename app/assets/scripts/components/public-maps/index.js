import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tArea from '@turf/area';

import { Button } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

import { useAuth } from '../../context/auth';
import { formatDateTime, formatThousands } from '../../utils/format';
import logger from '../../utils/logger';

import { PageBody } from '../../styles/page';
import {
  Inpage,
  InpageHeader,
  InpageHeaderInner,
  InpageHeadline,
  InpageTitle,
  InpageBody,
  InpageBodyInner,
} from '../../styles/inpage';

import App from '../common/app';
import PageHeader from '../common/page-header';
import Table, { TableRow, TableCell } from '../common/table';
import Paginator from '../common/paginator';
import copyTextToClipboard from '../../utils/copy-text-to-clipboard';
import toasts from '../common/toasts';
import { downloadShareGeotiff } from '../../utils/share-link';

const ITEMS_PER_PAGE = 20;

export const SharesBody = styled(InpageBodyInner)`
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: auto 1fr;
  grid-gap: ${glsp()};
  padding-top: 0;
`;

export const SharesHeadline = styled(InpageHeadline)`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const HEADERS = [
  'AOI Name',
  'AOI Size (Km2)',
  'Mosaic',
  'Checkpoint',
  'Classes',
  'Created',
  'Link',
  'Download',
];

function RenderRow(share, { restApiClient }) {
  const shareLink = `${window.location.origin}/share/${share.uuid}/map`;
  const { aoi, timeframe, mosaic } = share;

  return (
    <TableRow key={aoi.id}>
      <TableCell>{aoi.name}</TableCell>
      <TableCell>{formatThousands(tArea(aoi.bounds) / 1e6)}</TableCell>
      <TableCell>{mosaic?.name}</TableCell>
      <TableCell>{timeframe.checkpoint_id}</TableCell>
      <TableCell>{timeframe.classes.length}</TableCell>
      <TableCell>{formatDateTime(timeframe.created)}</TableCell>
      <TableCell>
        <Button
          variation='primary-plain'
          useIcon='clipboard'
          hideText
          onClick={() => {
            copyTextToClipboard(shareLink).then((result) => {
              if (result) {
                toasts.success('URL copied to clipboard');
              } else {
                logger('Failed to copy', result);
                toasts.error('Failed to copy URL to clipboard');
              }
            });
          }}
        />
      </TableCell>
      <TableCell>
        <Button
          variation='primary-plain'
          useIcon='download'
          hideText
          onClick={() => downloadShareGeotiff(restApiClient, share)}
        />
      </TableCell>
    </TableRow>
  );
}

function ExportedMapsList() {
  const { apiToken } = useAuth();

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shares, setShares] = useState([]);

  const { restApiClient } = useAuth();

  useEffect(() => {
    async function fetchShares() {
      if (apiToken) {
        try {
          setIsLoading(true);
          const data = await restApiClient.get(
            `share/?page=${page - 1}&limit=${ITEMS_PER_PAGE}`
          );
          setTotal(data.total);
          setShares(data.shares);
        } catch (error) {
          logger(error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchShares();
  }, [apiToken, page]);

  return (
    <>
      <Inpage>
        <InpageHeader>
          <InpageHeaderInner>
            <SharesHeadline>
              <InpageTitle>Public Maps</InpageTitle>
            </SharesHeadline>
          </InpageHeaderInner>
        </InpageHeader>
        <InpageBody>
          <SharesBody>
            {shares &&
              (shares.length ? (
                <>
                  <Table
                    headers={HEADERS}
                    data={shares}
                    renderRow={RenderRow}
                    extraData={{
                      restApiClient,
                      shares,
                      setShares,
                    }}
                  />
                  <Paginator
                    currentPage={page}
                    gotoPage={setPage}
                    totalItems={total}
                    itemsPerPage={ITEMS_PER_PAGE}
                  />
                </>
              ) : (
                <Heading>
                  {isLoading
                    ? 'Loading AOIs...'
                    : 'There are no published AOIs.'}
                </Heading>
              ))}
          </SharesBody>
        </InpageBody>
      </Inpage>
    </>
  );
}

function ExportedMaps() {
  return (
    <App pageTitle='ExportedMaps'>
      <PageHeader />
      <PageBody role='main'>
        <ExportedMapsList />
      </PageBody>
    </App>
  );
}

export default ExportedMaps;
