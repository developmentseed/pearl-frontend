import React, { useState, useEffect } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import InfoButton from '../../components/common/info-button';
import { Heading } from '@devseed-ui/typography';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import InputRange from 'react-input-range';
import { Accordion, AccordionFold as BaseFold } from '@devseed-ui/accordion';
import throttle from 'lodash.throttle';
import { useMapLayers, useUserLayers } from '../../context/map';
import { useCheckpoint } from '../../context/checkpoint';

const Wrapper = styled.div`
  display: grid;
  grid-gap: 1rem;
`;
const LayerWrapper = styled.div`
  display: grid;
  grid-template-columns: 2fr 4fr 1fr 1fr;
  ${Button} {
    place-self: center;
    max-width: ${glsp(1)};
  }
  ${Button}:last-child {
    place-self: center;
    max-width: ${glsp(1)};
    grid-column: 4;
  }
`;

const IconPlaceholder = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${themeVal('color.baseAlphaD')};
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
    padding: ${glsp()} 0;
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
`;

function Layer({ layer, onSliderChange, onVisibilityToggle, info, name }) {
  const [value, setValue] = useState(layer.opacity || 1);
  const [visible, setVisible] = useState(true);
  return (
    <LayerWrapper>
      <IconPlaceholder />
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
        <Wrapper>
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
        </Wrapper>
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
  const { className } = props;

  const { userLayers, setUserLayers } = useUserLayers();
  const { mapLayers } = useMapLayers();
  const { currentCheckpoint } = useCheckpoint();

  useEffect(() => {
    setUserLayers({
      ...userLayers,
      retrainingSamples: {
        ...userLayers.retrainingSamples,
        active: currentCheckpoint && currentCheckpoint.retrain_geoms,
      },
    });
  }, [currentCheckpoint && currentCheckpoint.retrain_geoms]);

  return (
    <div className={className}>
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
    </div>
  );
}

LayersPanel.propTypes = {
  className: T.string,
};

export default LayersPanel;
