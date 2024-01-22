import logger from './logger';

export default async function copyTextToClipboard(newClip) {
  const success = await navigator.clipboard.writeText(newClip).then(
    function () {
      /* clipboard successfully set */
      return true;
    },
    function (err) {
      logger(err);
      /* clipboard write failed */
      return false;
    }
  );
  return success;
}
