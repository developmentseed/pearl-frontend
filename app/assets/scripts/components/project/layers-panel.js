import React, { useState, useEffect, useRef } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import { Button } from '@devseed-ui/button';
import InfoButton from '../common/info-button';
import { Heading } from '@devseed-ui/typography';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import InputRange from 'react-input-range';
import { Accordion, AccordionFold as BaseFold } from '@devseed-ui/accordion';
import throttle from 'lodash.throttle';
// import { useMapLayers, useUserLayers, useMapRef } from '../../context/map';
// import { useMapState, useShortcutState } from '../../context/explore';
// import { actions as shortcutActions } from '../../context/explore/shortcuts';
// import { useCheckpoint } from '../../context/checkpoint';
import { round } from '../../utils/format';

export const LayersPanelInner = styled.div`
  opacity: ${({ show }) => (show ? 1 : 0)};
  display: ${({ show }) => !show && 'none'};
  min-width: 16rem;
  transition: opacity 0.16s ease 0s;
  padding: 1.5rem;
  overflow-y: hidden;
  overflow-x: auto;
  margin-left: 1rem;
  position: fixed;
  background: ${themeVal('color.surface')};
  box-shadow: ${themeVal('boxShadow.elevationB')};
  z-index: 400;
`;
const LayersWrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  padding: ${glsp(1)} 0;

  ${({ isFoldExpanded }) =>
    !isFoldExpanded &&
    css`
      pointer-events: none;
    `};
`;
const LayerWrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  grid-gap: ${glsp(2)};
  ${Button} {
    place-self: center;
    max-width: ${glsp(1)};
  }
  ${Button}:last-child {
    place-self: center;
    max-width: ${glsp(1)};
    grid-column: 2;
  }
`;

const SliderWrapper = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr;
  grid-gap: 0.5rem;
  ${Heading} {
    grid-row: 1;
    margin: 0;
  }
`;

const AccordionFold = styled(BaseFold)`
  background: unset;
  header {
    a {
      padding: ${glsp(0.5)} 0;
      h1 {
        text-transform: uppercase;
        font-size: 0.875rem;
        letter-spacing: 0.5px;
        opacity: 0.64;
      }
    }
  }
  > div {
    overflow: unset;
  }
`;

export function Layer({
  layer,
  onSliderChange,
  onVisibilityToggle,
  info,
  name,
}) {
  const [value, setValue] = useState(layer.opacity || 1);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (layer.opacity !== value) {
      setValue(layer.opacity);
    }
  }, [layer.opacity]);

  return (
    <LayerWrapper data-cy={name} data-opacity={round(value, 2)}>
      <SliderWrapper>
        <Heading as='h4' size='xsmall'>
          {name}
        </Heading>
        <InputRange
          onChange={throttle((v) => {
            setValue(v);
            onSliderChange(layer, v);
            if (v > 0) setVisible(true);
          }, 500)}
          value={value}
          formatLabel={() => null}
          minValue={0}
          maxValue={1}
          step={0.05}
        />
      </SliderWrapper>

      {info && (
        <InfoButton
          variation='base-plain'
          size='small'
          hideText
          useIcon='circle-information'
          info={info}
        >
          Info
        </InfoButton>
      )}
      <Button
        variation='base-plain'
        size='small'
        hideText
        useIcon={visible ? 'eye' : 'eye-disabled'}
        onClick={() => {
          setVisible(!visible);
          onVisibilityToggle(layer, !visible, value);
        }}
      >
        Info
      </Button>
    </LayerWrapper>
  );
}

Layer.propTypes = {
  layer: T.object,
  onSliderChange: T.func,
  onVisibilityToggle: T.func,
  info: T.string,
  name: T.string,
};

export function Category({
  checkExpanded,
  setExpanded,
  category,
  layers,
  onSliderChange,
  onVisibilityToggle,
}) {
  if (!Object.values(layers).find((f) => f.active)) {
    return null;
  }
  const isFoldExpanded = checkExpanded();
  return (
    <AccordionFold
      id={`${category}-fold`}
      title={category}
      isFoldExpanded={isFoldExpanded}
      setFoldExpanded={setExpanded}
      renderBody={() => (
        <LayersWrapper isFoldExpanded={isFoldExpanded}>
          {Object.entries(layers)
            .filter(([, layer]) => layer.active)
            .map(([key, layer]) => (
              <Layer
                key={`${category}-${layer.name || key}`}
                name={layer.name || key}
                layer={layer}
                onSliderChange={onSliderChange}
                onVisibilityToggle={onVisibilityToggle}
                info={layer.info}
              />
            ))}
        </LayersWrapper>
      )}
    />
  );
}

Category.propTypes = {
  checkExpanded: T.func,
  setExpanded: T.func,
  category: T.string,
  layers: T.object,
  onSliderChange: T.func,
  onVisibilityToggle: T.func,
};

function LayersPanel({
  className,
  parentId,
  mapRef,
  active,
  mapLayers,
  setMapLayers,
}) {

  // const { mapState, mapModes } = useMapState();
  // const disabled = mapState.mode === mapModes.EDIT_AOI_MODE;

  // const { userLayers: baseUserLayers, setUserLayers } = useUserLayers();
  // // const { shortcutState, dispatchShortcutState } = useShortcutState();

  // const userLayers = {
  //   ...baseUserLayers,
  //   predictions: {
  //     ...baseUserLayers.predictions,
  //     // opacity: shortcutState.predictionLayerOpacity,
  //   },
  // };

  // const { mapLayers } = useMapLayers();
  // const { mapRef } = useMapRef();
  // const { currentCheckpoint } = useCheckpoint();

  // const [position, setPosition] = useState({});

  // const parentNodeQuery = document.getElementById(parentId);
  // const parentNode = useRef();

  // useEffect(() => {
  //   parentNode.current = parentNodeQuery;
  // }, [parentNodeQuery]);

  // useEffect(() => {
  //   setUserLayers({
  //     ...userLayers,
  //     retrainingSamples: {
  //       ...userLayers.retrainingSamples,
  //       active: currentCheckpoint && currentCheckpoint.retrain_geoms,
  //     },
  //   });
  // }, [currentCheckpoint && currentCheckpoint.retrain_geoms]);

  // useEffect(() => {
  //   function updatePosition() {
  //     if (parentNode.current) {
  //       setPosition(parentNode.current.getBoundingClientRect());
  //     }
  //   }
  //   const observer = new ResizeObserver(throttle(updatePosition, 100));

  //   if (mapRef) {
  //     observer.observe(mapRef.getContainer());
  //   }
  //   return () => mapRef && observer.unobserve(mapRef.getContainer());
  // }, [mapRef, parentNode]);

  // if (!parentNode) {
  //   return null;
  // }
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
      show={active}
      style={{
        top: position.top || 0,
        left: position.right || 0,
      }}
      data-cy='layers-panel'
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
                category='User Layers'
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

              <Category
                checkExpanded={() => checkExpanded(1)}
                setExpanded={(v) => setExpanded(1, v)}
                category='Map Layers'
                layers={mapLayers}
                onSliderChange={(layer, value) => {
                  layer.layer.setOpacity(value);
                }}
                onVisibilityToggle={(layer, value, sliderValue) => {
                  if (value) {
                    layer.layer.setOpacity(sliderValue);
                  } else {
                    layer.layer.setOpacity(0);
                  }
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
};

export default LayersPanel;
