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
import Table, { TableRow, TableCell, TableRowHeader } from '../common/table';
import Paginator from '../common/paginator';
import copyTextToClipboard from '../../utils/copy-text-to-clipboard';
import toasts from '../common/toasts';
import { downloadShareGeotiff } from '../../utils/share-link';
import { StyledLink } from '../../styles/links';
import { composeMosaicName } from '../../utils/mosaics';
import { useLocation } from 'react-router-dom';

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
  min-height: 8.5rem;
  p {
    padding: ${glsp(0.5)} ${glsp()};
  }
  table {
    border: 1px solid transparent;
    border-color: ${({ twoSharesSelected }) =>
      twoSharesSelected ? themeVal('color.primary') : 'transparent'};
    border-radius: ${themeVal('shape.rounded')};
    border-collapse: separate;
    table-layout: fixed;
    thead {
      display: none;
    }
    tr {
      height: 2.5rem;
    }
    td {
      vertical-align: middle;
    }
    td:first-child,
    td:last-child {
      width: 5.5rem;
    }
  }
`;

const SelectedHeader = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: baseline;
  justify-content: space-between;
  gap: ${glsp()};
`;

const HEADERS = [
  'AOI Name',
  'AOI Size (Km2)',
  'Created',
  'Mosaic',
  'Model',
  'Checkpoint',
  'Classes',
  'Link',
  'Download',
  'Compare',
];

const checkHandler = (compareMaps, setCompareMaps, share) => {
  const shareExistsInCompareArray = compareMaps.some(
    (c) => c.uuid === share.uuid
  );
  // Determine if checked AOI already is selected
  if (shareExistsInCompareArray) {
    // If AOI is already selected, unchecking removes it from the compareMaps array
    let nextCompareMaps = compareMaps.filter((c) => c.uuid !== share.uuid);
    // If one of two AOIs is unchecked, the remaining AOI should be set to the left side AOI
    if (nextCompareMaps.length === 1) {
      nextCompareMaps = [
        { ...nextCompareMaps[0], side: 'left' },
        { side: 'right' },
      ];
    } else if (!nextCompareMaps.length) {
      // If all AOIs are unchecked, reset sides
      nextCompareMaps = [{ side: 'left' }, { side: 'right' }];
    }
    setCompareMaps(nextCompareMaps);
  } else {
    let compareArrayCount = compareMaps.filter((c) => c.uuid).length;
    if (!compareArrayCount) {
      setCompareMaps([{ ...share, side: 'left' }, { side: 'right' }]);
    } else if (compareArrayCount === 1) {
      setCompareMaps([compareMaps[0], { ...share, side: 'right' }]);
    } else {
      return;
    }
  }
};

function RenderRow(share, { restApiClient, compareMaps, setCompareMaps }) {
  const shareLink = `${window.location.origin}/share/${share.uuid}/map`;
  const { aoi, checkpoint, model, timeframe, mosaic } = share;

  return (
    <TableRow key={share.uuid}>
      <TableCell>{aoi.name}</TableCell>
      <TableCell>{formatThousands(tArea(aoi.bounds) / 1e6)}</TableCell>
      <TableCell>{formatDateTime(timeframe.created)}</TableCell>
      <TableCell>
        {composeMosaicName(mosaic.mosaic_ts_start, mosaic.mosaic_ts_end)}
      </TableCell>
      <TableCell>{model.name}</TableCell>
      <TableCell>{checkpoint.name}</TableCell>
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
          hideText
          checked={
            share.uuid &&
            compareMaps.some((compareMap) => compareMap.uuid === share.uuid)
          }
          onChange={() => checkHandler(compareMaps, setCompareMaps, share)}
        >
          Select for comparison
        </FormCheckable>
      </TableCell>
    </TableRow>
  );
}
function RenderSelectedRow(share, { compareMaps, setCompareMaps }) {
  const { side, aoi, checkpoint, model, timeframe, mosaic } = share;
  return (
    <TableRow key={share.uuid || share.side}>
      <TableCell>
        <TableRowHeader>{side}</TableRowHeader>
      </TableCell>
      <TableCell>{aoi?.name || ''}</TableCell>
      <TableCell>
        {timeframe ? formatDateTime(timeframe.created) : ''}
      </TableCell>
      <TableCell>{model?.name || ''}</TableCell>
      <TableCell>{checkpoint?.name || ''}</TableCell>
      <TableCell>
        {mosaic
          ? composeMosaicName(mosaic.mosaic_ts_start, mosaic.mosaic_ts_end)
          : ''}
      </TableCell>
      <TableCell>
        {share.uuid && (
          <Button
            variation='achromic-plain'
            onClick={() => checkHandler(compareMaps, setCompareMaps, share)}
            useIcon='xmark--small'
            hideText
          />
        )}
      </TableCell>
    </TableRow>
  );
}

function ExportedMapsList() {
  const { apiToken } = useAuth();
  const location = useLocation();
  const { uuid } = location.state || 'none';
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shares, setShares] = useState([]);
  const [compareMaps, setCompareMaps] = useState([
    { side: 'left' },
    { side: 'right' },
  ]);
  const { restApiClient } = useAuth();

  useEffect(() => {
    async function fetchShares() {
      if (apiToken) {
        try {
          setIsLoading(true);
          const data = await restApiClient.get(
            `share/?page=${page}&limit=${ITEMS_PER_PAGE}`
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
  const twoSharesSelected = compareMaps.filter((c) => c.uuid).length === 2;

  let preSelectedShare = shares.find((s) => s.uuid === uuid);
  useEffect(() => {
    if (!preSelectedShare) return;
    setCompareMaps([{ ...preSelectedShare, side: 'left' }, { side: 'right' }]);
    window.history.replaceState({}, '');
  }, [preSelectedShare]);

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
            <SelectedSection twoSharesSelected={twoSharesSelected}>
              <SelectedHeader>
                <Heading as='h3' size='small'>
                  Selected AOIs
                </Heading>
                <Button
                  variation='primary-raised-dark'
                  forwardedAs={StyledLink}
                  to={`/compare/${compareMaps[0].uuid}/${compareMaps[1].uuid}`}
                  useIcon='resize-center-horizontal'
                  disabled={!twoSharesSelected}
                >
                  Compare selected
                </Button>
              </SelectedHeader>
              {compareMaps.some((compareMap) => !!compareMap.uuid) ? (
                <Table
                  headers={[' ']}
                  data={compareMaps}
                  renderRow={RenderSelectedRow}
                  extraData={{
                    compareMaps,
                    setCompareMaps,
                  }}
                />
              ) : (
                <p>Select maps from below to compare two areas of interest</p>
              )}
            </SelectedSection>
            {shares &&
              (shares.length ? (
                <>
                  <Heading as='h3' size='small'>
                    All AOIs
                  </Heading>
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
                    setPage={setPage}
                    totalRecords={total}
                    pageSize={ITEMS_PER_PAGE}
                  />
                </>
              ) : (
                <Heading as='h3' size='small'>
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
