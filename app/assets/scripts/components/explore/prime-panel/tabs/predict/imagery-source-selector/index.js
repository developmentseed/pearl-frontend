import bboxPolygon from '@turf/bbox-polygon';
import booleanWithin from '@turf/boolean-within';
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
import { ImagerySourceSelectorModal } from './modal';

export function ImagerySourceSelector() {
  const isAuthenticated = true;

  const { aoiGeometry } = useAoi();
  const { imagerySources } = useMosaics();
  const { selectedImagerySource } = useImagerySource();

  const [
    showSelectImagerySourceModal,
    setShowSelectImagerySourceModal,
  ] = useState(false);

  // Define selector state (enabled/label)
  const selectorState = useMemo(() => {
    if (!isAuthenticated) {
      return {
        enabled: false,
        label: 'Login to select imagery source',
      };
    } else if (!imagerySources.isReady) {
      return {
        enabled: false,
        label: 'Loading...',
      };
    } else if (imagerySources.data.length === 0) {
      return {
        enabled: false,
        label: 'No imagery sources available.',
      };
    } else if (!aoiGeometry) {
      return {
        enabled: false,
        label: 'Please define an AOI first',
      };
    } else if (!selectedImagerySource) {
      return {
        enabled: true,
        label: 'Select an imagery source',
      };
    } else {
      return {
        enabled: true,
        label: selectedImagerySource.name,
      };
    }
  }, [isAuthenticated, imagerySources, aoiGeometry, selectedImagerySource]);

  const availableImagerySources = useMemo(() => {
    if (
      imagerySources.isReady &&
      imagerySources.data?.length > 0 &&
      aoiGeometry
    ) {
      // If imagery source has bounds prop defined, check if AOI is contained
      return imagerySources?.data.filter((m) =>
        m.bounds ? booleanWithin(aoiGeometry, bboxPolygon(m.bounds)) : true
      );
    } else {
      return [];
    }
  }, [imagerySources, aoiGeometry]);

  return (
    <>
      <ImagerySourceSelectorModal
        showSelectImagerySourceModal={showSelectImagerySourceModal}
        setShowSelectImagerySourceModal={setShowSelectImagerySourceModal}
        availableImagerySources={availableImagerySources}
      />
      <HeadOption>
        <HeadOptionHeadline usePadding>
          <Subheading>Imagery Source</Subheading>
        </HeadOptionHeadline>
        <SubheadingStrong
          onClick={() => {}}
          title={aoiGeometry ? 'Select Imagery Source' : 'An AOI is required'}
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
                setShowSelectImagerySourceModal(true);
              }}
              title='Select Imagery ImagerySource'
            >
              Edit Imagery ImagerySource Selection
            </EditButton>
          </HeadOptionToolbar>
        )}
      </HeadOption>
    </>
  );
}
