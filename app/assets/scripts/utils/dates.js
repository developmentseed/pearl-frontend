/**
 * This function formats a timestamp to a simple UTC string, generally used
 * for displaying timestamps for mosaics.
 */
export function formatTimestampToSimpleUTC(timestamp) {
  const isoString = new Date(timestamp).toISOString();
  const datePart = isoString.split('T')[0];
  const timePart = isoString.split('T')[1].slice(0, 5);
  return `${datePart} ${timePart} UTC`;
}

export function formatTimestampToSimpleUTCDate(timestamp) {
  const isoString = new Date(timestamp).toISOString();
  const datePart = getDatePartFromISOString(isoString);
  return `${datePart}`;
}

export function getDatePartFromISOString(isoString) {
  return isoString.split('T')[0];
}
