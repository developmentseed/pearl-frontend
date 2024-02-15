import { format, addMonths, isBefore } from 'date-fns';

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

export function formatMosaicDateRange(startTimestamp, endTimestamp) {
  return `${format(startTimestamp, 'MMM dd, yyyy')} - ${format(
    endTimestamp,
    'MMM dd, yyyy'
  )}`;
}

export function formatTimeframeLabel(
  startTimestamp,
  endTimestamp,
  checkpointId
) {
  return `${format(startTimestamp, 'MMM dd, yyyy')} - ${format(
    endTimestamp,
    'MMM dd, yyyy'
  )} (${checkpointId ? `Ckpt. ${checkpointId}` : 'Base Model'})`;
}

export function getDatePartFromISOString(isoString) {
  return isoString.split('T')[0];
}

// This function generates an array of quarters between two dates, starting from
// March.
export function generateQuartersInBetweenDates(startDate1, startDate2) {
  // Ensure startDate1 is the earlier date
  let start = new Date(startDate1 < startDate2 ? startDate1 : startDate2);
  const end = new Date(startDate1 < startDate2 ? startDate2 : startDate1);

  const quarters = [];
  while (isBefore(start, end)) {
    // Calculate the end of the quarter
    const endOfQuarter = addMonths(start, 2);
    // Create quarter object with label and timestamps
    const quarter = {
      label: `${format(start, 'MMM')} - ${format(endOfQuarter, 'MMM, yyyy')}`,
      startTimestamp: start.toISOString(),
      endTimestamp: endOfQuarter.toISOString(),
    };
    // Add the quarter object to the list
    quarters.push(quarter);
    // Move to the next quarter by setting start to the month after endOfQuarter
    start = addMonths(start, 3);
  }

  return quarters;
}
