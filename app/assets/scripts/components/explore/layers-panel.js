import React from 'react';
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
const Layer = styled.div`
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
    a {
      padding: ${glsp(0.5)} 0;
    }
  }
  & ~ & {
    margin-top: ${glsp(2)};
  }
`;

function Category({ checkExpanded, setExpanded, category, layers }) {
  return (
    <AccordionFold
      id={`${category}-fold`}
      title={category}
      isFoldExpanded={checkExpanded()}
      setFoldExpanded={setExpanded}
      renderBody={() => (
        <Wrapper>
          {layers.map((layer) => (
            <Layer key={`${layer.category}-${layer.name}`}>
              <IconPlaceholder />
              <SliderWrapper>
                <Heading as='h4' size='xsmall'>{layer.name}</Heading>
                <InputRange
                  onChange={() => 1}
                  value={50}
                  formatLabel={() => null}
                  minValue={0}
                  maxValue={100}
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
              <Button
                variation='base-plain'
                size='small'
                hideText
                useIcon='eye'
              >
                Info
              </Button>
            </Layer>
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
};

function LayersPanel(props) {
  const { layers, className } = props;

  const categorizedLayers = layers.reduce((cats, layer) => {
    if (!cats[layer.category]) {
      cats[layer.category] = [];
    }
    cats[layer.category].push(layer);
    return cats;
  }, {});

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
          ({ checkExpanded, setExpanded }) =>
            Object.entries(categorizedLayers).map(([cat, layers], index) => (
              <Category
                key={cat}
                checkExpanded={() => checkExpanded(index)}
                setExpanded={(v) => setExpanded(index, v)}
                category={cat}
                layers={layers}
              />
            ))
          /* eslint-disable-next-line react/jsx-curly-newline */
        }
      </Accordion>
    </div>
  );
}

LayersPanel.propTypes = {
  layers: T.array,
  className: T.string,
};

export default LayersPanel;
