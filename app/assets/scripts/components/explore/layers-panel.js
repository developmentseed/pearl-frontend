import React, { useState } from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import InfoButton from '../../components/common/info-button';
import { Heading } from '@devseed-ui/typography';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import InputRange from 'react-input-range';
import { Accordion, AccordionFold as BaseFold } from '@devseed-ui/accordion';
import throttle from 'lodash.throttle';

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

function Layer({ layer, onSliderChange, onVisibilityToggle, info, name}) {
  const [value, setValue] = useState(1);
  const [visible, setVisible] = useState(true);
  return (
    <LayerWrapper>
      <IconPlaceholder />
      <SliderWrapper>
        <Heading as='h4' size='xsmall'>
          {name}
        </Heading>
        <InputRange
          onChange={(v) => {
            setValue(v);
            onSliderChange(layer, v);
          }}
          value={value}
          formatLabel={() => null}
          minValue={0}
          maxValue={1}
          step={0.1}
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
          onVisibilityToggle(layer, !visible);
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
};

function Category({
  checkExpanded,
  setExpanded,
  category,
  layers,
  onSliderChange,
  onVisibilityToggle,
}) {
  return (
    <AccordionFold
      id={`${category}-fold`}
      title={category}
      isFoldExpanded={checkExpanded()}
      setFoldExpanded={setExpanded}
      renderBody={() => (
        <Wrapper>
          {Object.entries(layers).map(([key, layer]) => (
            <Layer
              key={`${category}-${layer.name || key}`}
              name={layer.name || key } 
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
  layers: T.array,
  onSliderChange: T.func,
  onVisibilityToggle: T.func,
};

function LayersPanel(props) {
  const {
    mapLayers,
    userLayers,
    className,
    onSliderChange,
    onVisibilityToggle,
    onPredictionLayerVisibilityToggle,
    setPredictionLayerOpacity,
    predictionReady,
  } = props;



  return (
    <div className={className}>
      <Accordion
        className={className}
        allowMultiple
        foldCount={2}
        initialState={[
          true,
          true
        ]}
      >
        {
          ({ checkExpanded, setExpanded }) => (
            <>
              <Category
                checkExpanded={() => {
                  return checkExpanded(0)
                }}
                setExpanded={() => {
                  return setExpanded(0)
                }}
                category='User Layers'
                layers={userLayers}
                onSliderChange={onSliderChange}
                onVisibilityToggle={onVisibilityToggle}
              />

              <Category
                checkExpanded={() => {
                  return checkExpanded(1)
                }}
                setExpanded={() => {
                  return setExpanded(1)
                }}
                category='Base Satellite Imagery'
                layers={mapLayers}
                onSliderChange={onSliderChange}
                onVisibilityToggle={onVisibilityToggle}
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
  onVisibilityToggle: T.func,
  setPredictionLayerOpacity: T.func,
  onPredictionLayerVisibilityToggle: T.func,
  predictionReady: T.bool,
};

export default LayersPanel;
