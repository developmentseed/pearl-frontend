import bboxPolygon from '@turf/bbox-polygon';
import booleanWithin from '@turf/boolean-within';
import React, { useMemo, useState } from 'react';
import { useAoi } from '../../../../../context/aoi';
import { EditButton } from '../../../../../styles/button';
import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../styles/panel';
import {
  Subheading,
  SubheadingStrong,
} from '../../../../../styles/type/heading';
import { MosaicSelectorModal } from './mosaic-selector-modal';

export function MosaicSelector() {
  const isAuthenticated = true;

  const { aoiGeometry } = useAoi();
  const [selectedMosaic, setSelectedMosaic] = useState(null);
  const [showSelectMosaicModal, setShowSelectMosaicModal] = useState(false);

  // Mimic a hook returning a mosaics list
  const mosaicList = {
    status: 'success',
    isReady: true,
    hasError: false,
    fetch: () => {},
    data: [
      {
        id: 'naip.latest',
        tilejson: '2.2.0',
        name: 'NAIP',
        version: '1.0.0',
        scheme: 'xyz',
        tiles: [
          'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/87b72c66331e136e088004fba817e3e8/WebMercatorQuad/{z}/{x}/{y}@1x?assets=image&asset_bidx=image%7C1%2C2%2C3&collection=naip',
        ],
        minzoom: 0,
        maxzoom: 24,
        bounds: [-180, -85.0511287798066, 180, 85.0511287798066],
        center: [0, 0, 0],
      },
      {
        id: 'sentinel',
        tilejson: '2.2.0',
        name: 'Sentinel',
        version: '1.0.0',
        scheme: 'xyz',
        tiles: [
          'https://planetarycomputer.microsoft.com/api/data/v1/mosaic/tiles/82ebdc445544365e45be4db6d22536ec/%7Bz%7D/%7Bx%7D/%7By%7D?assets=B04&assets=B03&assets=B02&color_formula=Gamma+RGB+3.2+Saturation+0.8+Sigmoidal+RGB+25+0.35&collection=sentinel-2-l2a',
        ],
        minzoom: 0,
        maxzoom: 24,
        bounds: [-180, -85.0511287798066, 180, 0],
        center: [0, 0, 0],
      },
    ],
  };

  // Selector label can assume different values depending on state variables, we
  // use useMemo hook to avoid computing it on every render.
  const selectorLabel = useMemo(() => {
    if (!isAuthenticated) {
      return 'Login to select model';
    } else if (!mosaicList.isReady) {
      return 'Loading...';
    } else if (mosaicList.data.length === 0) {
      return 'No mosaics available.';
    } else if (!aoiGeometry) {
      return 'Please define an AOI first';
    } else if (!selectedMosaic) {
      return 'Select a mosaic';
    } else {
      return selectedMosaic.name;
    }
  }, [isAuthenticated, mosaicList, aoiGeometry, selectedMosaic]);

  const availableMosaics = useMemo(() => {
    if (mosaicList.isReady && mosaicList.data?.length > 0 && aoiGeometry) {
      return mosaicList?.data.filter((m) =>
        booleanWithin(aoiGeometry, bboxPolygon(m.bounds))
      );
    } else {
      return [];
    }
  }, [mosaicList, aoiGeometry]);

  return (
    <>
      <MosaicSelectorModal
        setSelectedMosaic={setSelectedMosaic}
        showSelectMosaicModal={showSelectMosaicModal}
        setShowSelectMosaicModal={setShowSelectMosaicModal}
        availableMosaics={availableMosaics}
      />
      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Base Mosaic</Subheading>
        </HeadOptionHeadline>
        <SubheadingStrong
          onClick={() => {}}
          title={aoiGeometry ? 'Select Mosaic' : 'An AOI is required'}
          disabled={!aoiGeometry}
        >
          {selectorLabel}
        </SubheadingStrong>
        <HeadOptionToolbar>
          <EditButton
            useIcon='swap-horizontal'
            id='select-mosaic-trigger'
            onClick={() => {
              setShowSelectMosaicModal(true);
            }}
            title='Select Mosaic'
          >
            Edit Mosaic Selection
          </EditButton>
        </HeadOptionToolbar>
      </HeadOption>
    </>
  );
}
