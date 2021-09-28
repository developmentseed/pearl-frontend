const FAKE_API_TOKEN = 'FAKE_API_TOKEN';

/**
 * Make client look like it has authenticated
 */
Cypress.Commands.add('fakeLogin', () => {
  window.localStorage.setItem('useFakeLogin', true);
  window.localStorage.setItem(
    'authState',
    JSON.stringify({
      isLoading: false,
      error: false,
      isAuthenticated: true,
      apiToken: FAKE_API_TOKEN,
      user: {
        name: 'Test User',
      },
    })
  );
  window.localStorage.setItem('site-tour', -1);
});
