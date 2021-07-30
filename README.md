# LULC Front-end

Web application for Microsoft Land Use and Land Classification (LULC) project.

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
After installing the projects there will be 3 main files:

- `local.js` - Used only for local development. On production this file should not exist or be empty.
- `staging.js`
- `production.js`

The `production.js` file serves as base and the other 2 will override it as needed:

- `staging.js` will be loaded whenever the env variable `DS_ENV` is set to staging.
- `local.js` will be loaded if it exists.

The following options must be set: (The used file will depend on the context):

- `value` - Description

Example:

```javascript
module.exports = {
  value: 'some-value'
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

## Test

The app is using cypress to perform end-to-end testing. New tests should be added to `cypress/integrations/*.spec.js`.

Start the front-end in testing mode:

```sh
yarn run serve:testing
```

Run tests:

```sh
yarn run cy:run
```

## Develop with Cypress Dashboard

Start the dashboard: `yarn cy:open`.

Copy config file `testing.js` to `local.js` and run `yarn serve`. This will enable live reload on Cypress Dashboard.

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
