export function inRange(value, min, max, exclusive) {
  if (!exclusive) {
    return min <= value && value <= max;
  } else {
    return min < value && value < max;
  }
}

/**
 * Delays the execution in x milliseconds.
 *
 * @param {int} millis Milliseconds
 */
export function delay(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

/**
 * Performs a request to the given url returning the response in json format
 * or throwing an error.
 *
 * @param {string} url Url to query
 * @param {object} options Options for fetch
 */
export async function fetchJSON(url, options) {
  let response;
  options = options || {};
  const format = options.format || 'json';
  let data;
  try {
    response = await fetch(url, options);
    if (format === 'json') {
      data = await response.json();
    } else if (format === 'binary') {
      data = await response.arrayBuffer();
    } else {
      data = await response.text();
    }

    if (response.status >= 400) {
      const err = new Error(data.message);
      err.statusCode = response.status;
      err.data = data;
      throw err;
    }

    return { body: data, headers: response.headers };
  } catch (error) {
    error.statusCode = response ? response.status || null : null;
    throw error;
  }
}
