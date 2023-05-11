import {
  hideGlobalLoading,
  showGlobalLoadingMessage,
} from '../components/common/global-loading';
import toasts from '../components/common/toasts';
import copyTextToClipboard from './copy-text-to-clipboard';
import logger from './logger';
import { saveAs } from 'file-saver';

export const getShareLink = (share) =>
  `${window.location.origin}/share/${share.uuid}/map`;

export const copyShareUrlToClipboard = (share) => {
  copyTextToClipboard(getShareLink(share)).then((result) => {
    if (result) {
      toasts.success('URL copied to clipboard');
    } else {
      logger('Failed to copy', result);
      toasts.error('Failed to copy URL to clipboard');
    }
  });
};

export function downloadGeotiff(arrayBuffer, filename) {
  var blob = new Blob([arrayBuffer], {
    type: 'application/x-geotiff',
  });
  saveAs(blob, filename);
}

export const downloadShareGeotiff = async (restApiClient, share) => {
  showGlobalLoadingMessage('Preparing GeoTIFF for Download');
  try {
    const geotiffArrayBuffer = await restApiClient.get(
      `/share/${share.uuid}/download/color`,
      'binary'
    );
    const filename = `${share.uuid}.tiff`;
    downloadGeotiff(geotiffArrayBuffer, filename);
  } catch (error) {
    logger('Error with geotiff download', error);
    toasts.error('Failed to download GeoTIFF');
  }
  hideGlobalLoading();
  return;
};
