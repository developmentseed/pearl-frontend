import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import PageHeader from '../common/page-header';
import toasts from '../common/toasts';
import { PageBody } from '../../styles/page';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useParams } from 'react-router-dom';
import App from '../common/app';
import config from '../../config';
import { useAuth } from '../../context/auth';
import logger from '../../utils/logger';
import { panelSkin } from '../../styles/skins';
import {
  ClassList,
  Class,
  Thumbnail as ClassThumbnail,
  ClassHeading,
} from '../explore/prime-panel/retrain-refine-styles';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';

const { restApiEndpoint } = config;

const ClassLegend = styled(ClassList)`
  ${panelSkin};
  position: absolute;
  bottom: ${glsp(4)};
  right: ${glsp(4)};
  padding: ${glsp(2)} ${glsp(2.5)} ${glsp(2)} ${glsp(1.5)};
  grid-gap: ${glsp()};
  z-index: 99997;
  max-width: 16rem;
  overflow: hidden;

  > ${Heading} {
    padding: 0;
    margin: 0;
  }
  ${Class} {
    grid-template-columns: 1rem minmax(10px, 1fr);
    padding: 0;
    min-height: 0;
  }
  ${ClassThumbnail} {
    width: ${glsp()};
    height: ${glsp()};
    border: 1px solid ${themeVal('color.baseAlphaD')};
  }
`;

const classStub = [
  {
    color: '#4afe90',
    name: 'Trees',
  },
  {
    color: '#0090f0',
    name: 'Water',
  },
  {
    color: '#ff0000',
    name: 'Structure',
  },
  {
    color: '#fea800',
    name: 'Impervious Road',
  },
];

function AoiMap() {
  const { uuid } = useParams();
  const [mapRef, setMapRef] = useState(null);
  const { restApiClient } = useAuth();
  const [tileUrl, setTileUrl] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (!mapRef) return;
      try {
        const tileJSON = await restApiClient.getTileJSONFromUUID(uuid);
        setTileUrl(`${restApiEndpoint}${tileJSON.tiles[0]}`);
        const bounds = [
          [tileJSON.bounds[3], tileJSON.bounds[0]],
          [tileJSON.bounds[1], tileJSON.bounds[2]],
        ];
        mapRef.fitBounds(bounds);
      } catch (error) {
        logger(error);
        toasts.error('Could not load AOI map');
      }
    }
    fetchData();
  }, [uuid, mapRef, tileUrl]);

  let leafletLayer;
  if (tileUrl) {
    leafletLayer = <TileLayer url={tileUrl} />;
  } else {
    leafletLayer = null;
  }

  return (
    <App pageTitle='AOI Map'>
      <PageHeader />
      <PageBody role='main'>
        <MapContainer
          style={{ height: '100%' }}
          whenCreated={(m) => {
            setMapRef(m);
          }}
        >
          {leafletLayer}
        </MapContainer>
        <ClassLegend>
          <Heading useAlt>LULC Classes</Heading>
          {classStub.map((c) => (
            <Class key={c.name} noHover>
              <ClassThumbnail color={c.color} />
              <ClassHeading size='xsmall'>{c.name}</ClassHeading>
            </Class>
          ))}
        </ClassLegend>
      </PageBody>
    </App>
  );
}

export default AoiMap;
