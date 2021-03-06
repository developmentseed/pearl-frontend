<h1 align=center>PEARL Frontend</h1>

Web application for Planetary Computer Land Cover Mapping platform. For the API and infrastructure, see [pearl-backend](https://github.com/developmentseed/pearl-backend).

## Installation and Usage

The steps below will walk you through setting up your own instance of the project.

### Install Project Dependencies

To set up the development environment for this website, you'll need to install the following on your system:

- [Node](http://nodejs.org/) (see [.nvmrc](./.nvmrc)) (To manage multiple node versions we recommend [nvm](https://github.com/creationix/nvm))
- [Yarn](https://yarnpkg.com/) package manager

### Install Application Dependencies

If you use [`nvm`](https://github.com/creationix/nvm), activate the desired Node version:

```sh
nvm install
```

Install Node modules:

```sh
yarn install
```

### Usage

#### Config files

All the config files can be found in `app/assets/scripts/config`.
After installing the following files will be available:

- `base.js`: default configuration for all environments
- `cypress.js`: configuration used when running Cypress specs
- `production.js`, `testing.js`, `staging.js`: deployment environments
- `local.js`: Used only for local development, will override any of previous files. On production this file should not exist or be empty

The following options must be set: (The used file will depend on the context):

- `value` - Description

Example:

```javascript
module.exports = {
  value: 'some-value',
};
```

#### Dependencies

This project uses components from the DevSeed UI Library. Library collecticons are included and can be used in both library and local components. The gulp file still runs a task to compile compile local icons. To add a custom icon, add to `icons/collecticons` and import `collecticon` from `./app/scripts/styles/collecticons/index.js`.

#### Starting the app

```sh
yarn serve
```

Compiles the javascript and launches the server making the site available at `http://localhost:9000/`
The system will watch files and execute tasks whenever one of them changes.
The site will automatically refresh since it is bundled with livereload.

## Local Testing with Cypress

The app is using Cypress to perform end-to-end testing. New tests should be added to `cypress/integrations/*.spec.js`.

Start the front-end for Cypress testing:

```sh
yarn serve:cypress
```

Run tests:

```sh
yarn cy:run
```

This the method used in CI for PR/merge checks.

## Develop with Cypress Dashboard and auto-reload

This should be the easiest method for developing locally. Start the app with
auto-reload:

```sh
yarn serve
```

Open Cypress dashboard: `yarn cy:open`.

To use a different API, please add REST and Websocket URLs to `config/local.js`.

## Stress test an live API

By default, Cypress will use mocked API endpoints for testing. Please do the
follow steps to run automate testing using a live API:

1. Start the app using `testing` API with `yarn serve:testing`
2. Visit http://localhost:9000
3. Login to the website, following Auth0 workflow
4. Open developer tools, visit a protected route and collect your API Token by
   inspecting request headers to the API
5. Add `apiToken` property to `config/local.json` with value collected
6. Start Cypress Dashboard in "stress" mode: `yarn cy:open:stress`

Please refer to instructions in [cypress/integration/stress-live-api.spec.js]() file
for more details on this testing approach.

To run test against an API other than `testing`, replace the first step with:

- Update `config/local.json` with target API URLs (REST and Websocket)
- Start front-end server: `yarn serve`

## Deployment

To prepare the app for deployment run:

```sh
yarn build
```

or

```sh
yarn stage
```

This will package the app and place all the contents in the `dist` directory.
The app can then be run by any web server.

## License

[MIT](LICENSE)
