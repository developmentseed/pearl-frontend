import React from 'react';
import T from 'prop-types';
import { ToolsWrapper } from '..//retrain-refine-styles';
import Header from './header';

function Predict({ className, checkpointHasSamples }) {
  return (
    <ToolsWrapper className={className}>
      <Header checkpointHasSamples={checkpointHasSamples} />
    </ToolsWrapper>
  );
}

Predict.propTypes = {
  className: T.string,
  checkpointHasSamples: T.bool,
};
export default Predict;
