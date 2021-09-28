import React, { useState, useEffect, useRef } from 'react';
import T from 'prop-types';
import throttle from 'lodash.throttle';

import { Category, LayersPanelInner } from '../explore/layers-panel';
import { Accordion } from '@devseed-ui/accordion';

function LayersPanel({
  className,
  parentId,
  mapRef,
  active,
  mapLayers,
  setMapLayers,
}) {
  const [position, setPosition] = useState({});

  const parentNodeQuery = document.getElementById(parentId);
  const parentNode = useRef();

  useEffect(() => {
    parentNode.current = parentNodeQuery;
  }, [parentNodeQuery]);

  useEffect(() => {
    function updatePosition() {
      if (parentNode.current) {
        setPosition(parentNode.current.getBoundingClientRect());
      }
    }
    const observer = new ResizeObserver(throttle(updatePosition, 100));

    if (mapRef) {
      observer.observe(mapRef.getContainer());
    }
    return () => mapRef && observer.unobserve(mapRef.getContainer());
  }, [mapRef, parentNode]);

  return (
    <LayersPanelInner
      className={className}
      style={{
        top: position.top || 0,
        left: position.right || 0,
      }}
      show={active}
      data-cy='share-map-layers-panel'
    >
      <Accordion
        className={className}
        allowMultiple
        foldCount={2}
        initialState={[true, true]}
      >
        {
          ({ checkExpanded, setExpanded }) => (
            <>
              <Category
                checkExpanded={() => checkExpanded(0)}
                setExpanded={(v) => setExpanded(0, v)}
                category='Map Layers'
                layers={mapLayers}
                onSliderChange={(layer, value) => {
                  setMapLayers({
                    ...mapLayers,
                    [layer.id]: {
                      ...layer,
                      opacity: value,
                      visible: value > 0,
                    },
                  });
                }}
                onVisibilityToggle={(layer) => {
                  setMapLayers({
                    ...mapLayers,
                    [layer.id]: {
                      ...layer,
                      visible: !layer.visible,
                    },
                  });
                }}
              />
            </>
          )
          /* eslint-disable-next-line react/jsx-curly-newline */
        }
      </Accordion>
    </LayersPanelInner>
  );
}

LayersPanel.propTypes = {
  className: T.string,
  parentId: T.string.isRequired,
  active: T.bool,
  mapLayers: T.object,
  mapRef: T.object,
  setMapLayers: T.func,
};

export default LayersPanel;
