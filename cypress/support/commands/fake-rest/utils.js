// Get key/values from query string
export const getQueryElement = (key, url) => {
  const tokens = (url.split('?')[1] || '').split('&');
  const keyValPair = tokens.find((t) => t.includes(key));
  if (keyValPair) {
    return keyValPair.split('=')[1];
  } else {
    return null;
  }
};
