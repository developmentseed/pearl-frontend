import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import tArea from '@turf/area';

import { Button } from '@devseed-ui/button';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { FormCheckable } from '@devseed-ui/form';

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
import { StyledLink } from '../../styles/links';
import { composeMosaicName } from '../compare-map';

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

const SelectedSection = styled.section`
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp()};
  table {
    border: 2px solid ${themeVal('color.primary')};
    border-radius: ${themeVal('shape.rounded')};
    border-collapse: separate;
  }
`;

const SelectedHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  gap: ${glsp()};
`;

const HEADERS = [
  'AOI Name',
  'Created',
  'AOI Size (Km2)',
  'Model',
  'Checkpoint',
  'Mosaic',
  'Classes',
  'Link',
  'Download',
  'Compare',
];

function RenderRow(share, { restApiClient, compareMaps, setCompareMaps }) {
  const shareLink = `${window.location.origin}/share/${share.uuid}/map`;
  const { aoi, checkpoint, model, timeframe, mosaic } = share;

  return (
    <TableRow key={share.uuid}>
      <TableCell>{aoi.name}</TableCell>
      <TableCell>{formatDateTime(timeframe.created)}</TableCell>
      <TableCell>{formatThousands(tArea(aoi.bounds) / 1e6)}</TableCell>
      <TableCell>{model.name}</TableCell>
      <TableCell>{checkpoint.name}</TableCell>
      <TableCell>
        {composeMosaicName(mosaic.mosaic_ts_start, mosaic.mosaic_ts_end)}
      </TableCell>
      <TableCell>{timeframe.classes.length}</TableCell>
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
      <TableCell>
        <FormCheckable
          type='checkbox'
          name={`select-compare-${share.uuid}`}
          id={`select-compare-${share.uuid}`}
          checked={compareMaps.some(
            (compareMap) => compareMap.uuid === share.uuid
          )}
          onChange={() => {
            compareMaps.some((compareMap) => compareMap.uuid === share.uuid)
              ? setCompareMaps(
                  compareMaps.filter(
                    (compareMap) => compareMap.uuid != share.uuid
                  )
                )
              : compareMaps.length < 2 &&
                setCompareMaps([...compareMaps, share]);
          }}
        />
      </TableCell>
    </TableRow>
  );
}
function RenderSelectedRow(compareMap, { compareMaps, setCompareMaps }) {
  const { aoi, checkpoint, model, timeframe, mosaic } = compareMap;
  return (
    <TableRow key={compareMap.uuid}>
      <TableCell>{aoi.name}</TableCell>
      <TableCell>{formatDateTime(timeframe.created)}</TableCell>
      <TableCell>{model.name}</TableCell>
      <TableCell>{checkpoint.name}</TableCell>
      <TableCell>
        {composeMosaicName(mosaic.mosaic_ts_start, mosaic.mosaic_ts_end)}
      </TableCell>
      <TableCell>
        <FormCheckable
          type='checkbox'
          name={`select-compare-${compareMap.uuid}`}
          id={`select-compare-${compareMap.uuid}`}
          checked={compareMaps.some((map) => map.uuid === compareMap.uuid)}
          onChange={() => {
            compareMaps.some((map) => map.uuid === compareMap.uuid)
              ? setCompareMaps(
                  compareMaps.filter((map) => map.uuid != compareMap.uuid)
                )
              : compareMaps.length < 2 &&
                setCompareMaps([...compareMaps, compareMap]);
          }}
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
  const [compareMaps, setCompareMaps] = useState([]);
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
            {!!compareMaps.length && (
              <SelectedSection>
                <SelectedHeader>
                  <Heading as='h3' size='xsmall'>
                    Selected AOIs
                  </Heading>
                  <Button
                    variation='primary-raised-dark'
                    forwardedAs={StyledLink}
                    to={`/compare/${compareMaps[0]?.uuid}/${compareMaps[1]?.uuid}`}
                    useIcon='resize-center-horizontal'
                    disabled={compareMaps.length < 2}
                  >
                    Compare selected
                  </Button>
                </SelectedHeader>
                <Table
                  headers={[' ']}
                  data={compareMaps}
                  renderRow={RenderSelectedRow}
                  extraData={{
                    compareMaps,
                    setCompareMaps,
                  }}
                />
              </SelectedSection>
            )}
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
                      compareMaps,
                      setCompareMaps,
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
                <Heading size='small'>
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
