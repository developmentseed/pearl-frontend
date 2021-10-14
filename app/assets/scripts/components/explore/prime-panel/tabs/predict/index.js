import React from 'react';
import T from 'prop-types';
import { ToolsWrapper } from '..//retrain-refine-styles';
import Header from './header';

function Predict({ className, checkpointHasSamples, setShowSelectModelModal }) {
  return (
    <ToolsWrapper className={className}>
      <Header
        checkpointHasSamples={checkpointHasSamples}
        setShowSelectModelModal={setShowSelectModelModal}
      />
    </ToolsWrapper>
  );
}

Predict.propTypes = {
  className: T.string,
  checkpointHasSamples: T.bool,
  setShowSelectModelModal: T.func,
};
export default Predict;
