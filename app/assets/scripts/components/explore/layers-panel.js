import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import InputRange from 'react-input-range';
import { Accordion, AccordionFold as BaseFold } from '@devseed-ui/accordion';

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
`;

const IconPlaceholder = styled.div`
  width: 3rem;
  height: 3rem;
  background: ${themeVal('color.base')};
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

function Layer({ layer, onSliderChange }) {
  const [value, setValue] = useState(1);
  return (
    <LayerWrapper>
      <IconPlaceholder />
      <SliderWrapper>
        <Heading as='h4' size='xsmall'>
          {layer.name}
        </Heading>
        <InputRange
          onChange={(v) => {
            setValue(v);
            onSliderChange(layer.name, v);
          }}
          value={value}
          formatLabel={() => null}
          minValue={0}
          maxValue={1}
          step={0.1}
        />
      </SliderWrapper>
      <Button
        variation='base-plain'
        size='small'
        hideText
        useIcon='circle-information'
      >
        Info
      </Button>
      <Button variation='base-plain' size='small' hideText useIcon='eye'>
        Info
      </Button>
    </LayerWrapper>
  );
}

Layer.propTypes = {
  layer: T.object,
  onSliderChange: T.func,
};

function Category({
  checkExpanded,
  setExpanded,
  category,
  layers,
  onSliderChange,
}) {
  return (
    <AccordionFold
      id={`${category}-fold`}
      title={category}
      isFoldExpanded={checkExpanded()}
      setFoldExpanded={setExpanded}
      renderBody={() => (
        <Wrapper>
          {layers.map((layer) => (
            <Layer
              key={`${category}-${layer.name}`}
              layer={layer}
              onSliderChange={onSliderChange}
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
  layers: T.array,
  onSliderChange: T.func,
};

function LayersPanel(props) {
  const { layers, baseLayerNames, className, onSliderChange } = props;

  const categorizedLayers = layers.reduce((cats, layer) => {
    if (!cats[layer.category]) {
      cats[layer.category] = [];
    }
    cats[layer.category].push(layer);
    return cats;
  }, {});

  const baseLayers = baseLayerNames.map((n) => ({
    name: n,
  }));

  return (
    <div className={className}>
      <Accordion
        className={className}
        allowMultiple
        foldCount={Object.keys(categorizedLayers).length}
        initialState={[
          true,
          ...Object.keys(categorizedLayers)
            .slice(1)
            .map(() => false),
        ]}
      >
        {
          ({ checkExpanded, setExpanded }) => (
            <>
              {Object.entries(categorizedLayers).map(([cat, layers], index) => (
                <Category
                  key={cat}
                  checkExpanded={() => checkExpanded(index)}
                  setExpanded={(v) => setExpanded(index, v)}
                  category={cat}
                  layers={layers}
                  onSliderChange={onSliderChange}
                />
              ))}
              <Category
                checkExpanded={() => {
                  return checkExpanded(Object.keys(categorizedLayers).length);
                }}
                setExpanded={(v) => {
                  return setExpanded(Object.keys(categorizedLayers).length, v);
                }}
                category='Base Satellite Imagery'
                layers={baseLayers}
                onSliderChange={onSliderChange}
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
  layers: T.array,
  className: T.string,
  baseLayerNames: T.array,
  onSliderChange: T.func,
};

export default LayersPanel;
