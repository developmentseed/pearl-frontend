import { interceptHostname, interceptUrl, interceptApiRoute } from './utils';

import apiIndex from '../mock-api-routes/fixtures/index.json';
import apiHealth from '../mock-api-routes/fixtures/health.json';
import imageryIndex from '../mock-api-routes/fixtures/imagery.json';
import mosaicIndex from '../mock-api-routes/fixtures/mosaic/index.json';
import mosaicNaipLatest from '../mock-api-routes/fixtures/mosaic/naip.latest.json';
import mosaicPostResponse from '../mock-api-routes/fixtures/mosaic/post-response.json';

const restApiEndpoint = Cypress.config('restApiEndpoint');

Cypress.Commands.add('mockCommonApiRoutes', () => {
  // OSM Tiles
  ['a', 'b', 'c'].forEach((subdomain) => {
    interceptHostname(`${subdomain}.tile.openstreetmap.org`, {
      fixture: 'tiles/osm-tile.png',
    });
  });

  // Fake Imagery Layer
  interceptUrl('https://tiles.lulc.ds.io/**', 'GET', {
    fixture: 'tiles/imagery-tile.png',
  });

  // API Health
  interceptUrl(`${restApiEndpoint}/health`, 'GET', apiHealth);

  // API Limits
  interceptApiRoute('', 'GET', apiIndex);

  // Mosaic
  interceptApiRoute('mosaic', 'POST', mosaicPostResponse, 'postMosaic');
  interceptApiRoute('mosaic/naip.latest', 'GET', mosaicNaipLatest);

  // Geocoder
  interceptUrl(
    'https://dev.virtualearth.net/REST/v1/Locations/*?*',
    'GET',
    { fixture: 'geocoder/dc.json' },
    'reverseGeocodeCity'
  );
  interceptUrl(
    'https://dev.virtualearth.net/REST/v1/Locations/40.36315736436661,-77.7938461303711?*',
    'GET',
    { fixture: 'geocoder/rural.json' },
    'reverseGeocodeRural'
  );

  // Planetary Computer
  interceptUrl(
    'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/register',
    'POST',
    { fixture: 'planetary-computer/data/mosaic/register.json' },
    'registerPlanetaryComputerMosaic'
  );
  interceptUrl(
    'https://planetarycomputer.microsoft.com/api/stac/v1/collections/sentinel-2-l2a',
    'GET',
    { fixture: 'planetary-computer/stac/collections/sentinel-2-l2a.json' },
    'getPlanetaryComputerSentinel2Collection'
  );

  // Imagery and Mosaic
  interceptApiRoute('imagery', 'GET', imageryIndex);
  interceptApiRoute('mosaic', 'GET', mosaicIndex);
});
