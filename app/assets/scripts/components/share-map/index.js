import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import PageHeader from '../common/page-header';
import toasts from '../common/toasts';
import { PageBody } from '../../styles/page';
import { MapContainer, TileLayer } from 'react-leaflet';
import GlobalContext from '../../context/global';

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
} from '../explore/prime-panel/tabs/retrain-refine-styles';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import { Heading } from '@devseed-ui/typography';
import { Subheading } from '../../styles/type/heading';

const { restApiEndpoint, tileUrlTemplate } = config;

const ClassLegend = styled(ClassList)`
  ${panelSkin};
  position: absolute;
  bottom: ${glsp(2)};
  right: ${glsp(2)};
  padding: ${glsp(0.75)} ${glsp(2.5)} ${glsp(1)} ${glsp(1.5)};
  grid-gap: ${glsp()};
  z-index: 99997;
  width: 16rem;
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
  ${ClassHeading} {
    white-space: normal;
  }
  ${ClassThumbnail} {
    width: ${glsp()};
    height: ${glsp()};
    border: 1px solid ${themeVal('color.baseAlphaD')};
  }
`;

function ShareMap() {
  const { uuid } = useParams();
  const [mapRef, setMapRef] = useState(null);
  const { restApiClient } = useAuth();
  const [tileUrl, setTileUrl] = useState(null);
  const [classes, setClasses] = useState([]);
  const { mosaicList } = useContext(GlobalContext);
  const mosaics = mosaicList.isReady() ? mosaicList.getData().mosaics : null;
  const mosaic = mosaics && mosaics.length > 0 ? mosaics[0] : null;

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
        const aoiData = await restApiClient.getAOIFromUUID(uuid);
        setClasses(aoiData.classes);
      } catch (error) {
        logger(error);
        toasts.error('Could not load AOI map');
      }
    }
    fetchData();
  }, [uuid, mapRef, tileUrl]);

  let predictionLayer;
  if (tileUrl) {
    predictionLayer = <TileLayer url={tileUrl} />;
  }

  let mosaicLayer;
  if (mosaic) {
    mosaicLayer = (
      <TileLayer url={tileUrlTemplate.replace('{LAYER_NAME}', mosaic)} />
    );
  }

  return (
    <App pageTitle='AOI Map'>
      <PageHeader />
      <PageBody role='main'>
        <MapContainer
          style={{ height: '100%' }}
          whenCreated={(m) => setMapRef(m)}
        >
          {mosaicLayer}
          {predictionLayer}
        </MapContainer>
        <ClassLegend>
          <Subheading>LULC Classes</Subheading>
          {classes.length > 1
            ? classes.map((c) => (
                <Class key={c.name} noHover>
                  <ClassThumbnail color={c.color} />
                  <ClassHeading size='xsmall'>{c.name}</ClassHeading>
                </Class>
              ))
            : [1, 2, 3].map((i) => (
                <Class
                  key={i}
                  placeholder={+true}
                  className='placeholder-class'
                >
                  <ClassThumbnail />
                  <ClassHeading size='xsmall' placeholder={+true} />
                </Class>
              ))}
        </ClassLegend>
      </PageBody>
    </App>
  );
}

export default ShareMap;
