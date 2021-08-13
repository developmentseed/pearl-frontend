import React, { useState, useEffect, useRef } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import InfoButton from '../../components/common/info-button';
import { Heading } from '@devseed-ui/typography';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import InputRange from 'react-input-range';
import { Accordion, AccordionFold as BaseFold } from '@devseed-ui/accordion';
import throttle from 'lodash.throttle';
import {
  useMapLayers,
  useUserLayers,
  useLayersPanel,
  useMapRef,
} from '../../context/map';
import { useMapState } from '../../context/explore';
import { useCheckpoint } from '../../context/checkpoint';

const LayersPanelInner = styled.div`
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
  box-shadow: ${themeVal('boxShadow.ElevationB')};
  z-index: 1;
`;
const LayersWrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
  padding: ${glsp(1)} 0;
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

function Layer({ layer, onSliderChange, onVisibilityToggle, info, name }) {
  const [value, setValue] = useState(layer.opacity || 1);
  const [visible, setVisible] = useState(true);
  return (
    <LayerWrapper>
      <SliderWrapper>
        <Heading as='h4' size='xsmall'>
          {name}
        </Heading>
        <InputRange
          onChange={throttle((v) => {
            setValue(v);
            onSliderChange(layer, v);
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

function Category({
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
  return (
    <AccordionFold
      id={`${category}-fold`}
      title={category}
      isFoldExpanded={checkExpanded()}
      setFoldExpanded={setExpanded}
      renderBody={() => (
        <LayersWrapper>
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

function LayersPanel(props) {
  const { className, parentId } = props;

  const { mapState, mapModes } = useMapState();
  const disabled = mapState.mode === mapModes.EDIT_AOI_MODE;

  const { userLayers, setUserLayers } = useUserLayers();
  const { showLayersPanel } = useLayersPanel();
  const { mapLayers } = useMapLayers();
  const { mapRef } = useMapRef();
  const { currentCheckpoint } = useCheckpoint();

  const [position, setPosition] = useState({});

  const parentNodeQuery = document.getElementById(parentId);
  const parentNode = useRef();

  useEffect(() => {
    parentNode.current = parentNodeQuery;
  }, [parentNodeQuery]);

  useEffect(() => {
    setUserLayers({
      ...userLayers,
      retrainingSamples: {
        ...userLayers.retrainingSamples,
        active: currentCheckpoint && currentCheckpoint.retrain_geoms,
      },
    });
  }, [currentCheckpoint && currentCheckpoint.retrain_geoms]);

  React.useEffect(() => {
    function updatePosition() {
      //setSearchResultTop(searchBarReference.current.getBoundingClientRect().bottom);
      if (parentNode.current) {
        setPosition(parentNode.current.getBoundingClientRect());
      }
    }
    const observer = new ResizeObserver(throttle(updatePosition, 100));

    if (mapRef) {
      //mapRef.getContainer().addEventListener('resize', updatePosition);
      observer.observe(mapRef.getContainer());
    }
    return () => mapRef && observer.unobserver(mapRef.getContainer());
  }, [mapRef, parentNode]);

  if (!parentNode) {
    return null;
  }

  //return ReactDOM.createPortal(
  return (
    <LayersPanelInner
      className={className}
      show={!disabled && showLayersPanel}
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
                layers={userLayers}
                onSliderChange={(layer, value) => {
                  setUserLayers({
                    ...userLayers,
                    [layer.id]: {
                      ...layer,
                      opacity: value,
                    },
                  });
                }}
                onVisibilityToggle={(layer) => {
                  setUserLayers({
                    ...userLayers,
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
    </LayersPanelInner> /*,
    parentNode*/
  );
}

LayersPanel.propTypes = {
  className: T.string,
  parentId: T.string.isRequired,
};

export default LayersPanel;
