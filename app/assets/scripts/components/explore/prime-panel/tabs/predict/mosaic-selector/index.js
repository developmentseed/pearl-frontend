import React, { useMemo, useState } from 'react';
import { useAoi } from '../../../../../../context/aoi';
import { useMosaics } from '../../../../../../context/global';
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

  const { mosaics } = useMosaics();

  const { aoiGeometry } = useAoi();
  const { selectedImagerySource, selectedMosaic } = useImagerySource();
  const [showSelectMosaicModal, setShowSelectMosaicModal] = useState(false);

  const availableMosaics = useMemo(() => {
    if (selectedImagerySource && mosaics.isReady && !mosaics.hasError) {
      return mosaics.data.filter(
        (m) => m.imagery_source_id === selectedImagerySource.id
      );
    } else {
      [];
    }
  }, [selectedImagerySource, mosaics]);

  // Define selector state (enabled/label)
  const selectorState = useMemo(() => {
    if (!isAuthenticated) {
      return {
        enabled: false,
        label: 'Login to select model',
      };
    } else if (selectedMosaic) {
      return {
        enabled: true,
        label: selectedMosaic.name,
      };
    } else if (!mosaics.isReady) {
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
    } else if (availableMosaics.length === 0) {
      return {
        enabled: false,
        label: 'No mosaics available',
      };
    } else {
      return {
        enabled: true,
        label: 'Select a mosaic',
      };
    }
  }, [
    isAuthenticated,
    mosaics,
    aoiGeometry,
    selectedMosaic,
    selectedImagerySource,
    availableMosaics,
  ]);

  return (
    <>
      <MosaicSelectorModal
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
