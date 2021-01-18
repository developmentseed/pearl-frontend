import React, { useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { render } from 'react-dom';

import GlobalStyles from './styles/global';

// Root component.
function Root() {
  useEffect(() => {
    // Hide the welcome banner.
    const banner = document.querySelector('#welcome-banner');
    banner.classList.add('dismissed');
    setTimeout(() => banner.remove(), 500);
  }, []);

  return (
    <ThemeProvider theme={{}}>
      <GlobalStyles />
      <h1>Microsoft LULC</h1>
      <p>AI assisted LULC</p>
    </ThemeProvider>
  );
}

render(<Root />, document.querySelector('#app-container'));
