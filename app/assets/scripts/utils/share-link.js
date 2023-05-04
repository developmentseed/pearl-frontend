import toasts from '../components/common/toasts';
import copyTextToClipboard from './copy-text-to-clipboard';
import logger from './logger';

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
