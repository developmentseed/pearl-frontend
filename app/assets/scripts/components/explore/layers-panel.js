import React from 'react';
import T from 'prop-types';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Heading } from '@devseed-ui/typography';
import { themeVal, glsp } from '@devseed-ui/theme-provider';
import InputRange from 'react-input-range';

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

function LayersPanel(props) {
  const { layers, className } = props;
  return (
    <Wrapper className={className}>
      {layers.map((layer) => (
        <Layer key={layer.name}>
          <IconPlaceholder />
          <SliderWrapper>
            <Heading size='xsmall'>{layer.name}</Heading>
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
          <Button variation='base-plain' size='small' hideText useIcon='eye'>
            Info
          </Button>
        </Layer>
      ))}
    </Wrapper>
  );
}

LayersPanel.propTypes = {
  layers: T.array,
  className: T.string,
};

export default LayersPanel;
