const apiToken = Cypress.config('apiToken') || 'FAKE_API_TOKEN';

/**
 * Make client look like it has authenticated
 */
Cypress.Commands.add('fakeLogin', (access, flags = {}) => {
  window.localStorage.setItem('useFakeLogin', true);
  window.localStorage.setItem(
    'authState',
    JSON.stringify({
      isLoading: false,
      error: false,
      isAuthenticated: true,
      userAccessLevel: access || 'user',
      apiToken,
      user: {
        name: 'Test User',
        flags,
      },
    })
  );
  window.localStorage.setItem('site-tour', -1);
});
