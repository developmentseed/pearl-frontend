import React, { useMemo, useState } from 'react';
import { useAoi } from '../../../../../../context/aoi';
import { useImagerySource } from '../../../../../../context/imagery-sources';
import { EditButton } from '../../../../../../styles/button';
import {
  HeadOption,
  HeadOptionHeadline,
  HeadOptionToolbar,
} from '../../../../../../styles/panel';
import {
  Subheading,
  SubheadingStrong,
} from '../../../../../../styles/type/heading';
import { MosaicSelectorModal } from './modal';

export function MosaicSelector() {
  const isAuthenticated = true;

  const { aoiGeometry } = useAoi();
  const {
    imagerySources,
    selectedImagerySource,
    selectedImagerySourceMosaics,
    selectedMosaic,
  } = useImagerySource();
  const [showSelectMosaicModal, setShowSelectMosaicModal] = useState(false);

  // Define selector state (enabled/label)
  const selectorState = useMemo(() => {
    if (!isAuthenticated) {
      return {
        enabled: false,
        label: 'Login to select model',
      };
    } else if (!imagerySources.isReady) {
      return {
        enabled: false,
        label: 'Loading...',
      };
    } else if (!aoiGeometry) {
      return {
        enabled: false,
        label: 'Please define an AOI first',
      };
    } else if (!selectedImagerySource) {
      return {
        enabled: false,
        label: 'Please select an imagery source first',
      };
    } else if (selectedImagerySourceMosaics.length === 0) {
      return {
        enabled: false,
        label: 'No mosaics available',
      };
    } else if (!selectedMosaic) {
      return {
        enabled: true,
        label: 'Select a mosaic',
      };
    } else {
      return {
        enabled: true,
        label: selectedMosaic.name,
      };
    }
  }, [
    isAuthenticated,
    imagerySources,
    aoiGeometry,
    selectedMosaic,
    selectedImagerySource,
    selectedImagerySourceMosaics,
  ]);

  return (
    <>
      <MosaicSelectorModal
        showSelectMosaicModal={showSelectMosaicModal}
        setShowSelectMosaicModal={setShowSelectMosaicModal}
      />
      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Base Mosaic</Subheading>
        </HeadOptionHeadline>
        <SubheadingStrong
          onClick={() => {}}
          title={aoiGeometry ? 'Select Imagery Mosaic' : 'An AOI is required'}
          disabled={!aoiGeometry}
        >
          {selectorState.label}
        </SubheadingStrong>
        {selectorState.enabled && (
          <HeadOptionToolbar>
            <EditButton
              useIcon='swap-horizontal'
              id='select-mosaic-trigger'
              onClick={() => {
                setShowSelectMosaicModal(true);
              }}
              title='Select Imagery Mosaic'
            >
              Edit Mosaic Selection
            </EditButton>
          </HeadOptionToolbar>
        )}
      </HeadOption>
    </>
  );
}
