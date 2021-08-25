import React from 'react';
import T from 'prop-types';
import { PlaceholderMessage } from '../../../../styles/placeholder.js';
import { ToolsWrapper } from './retrain-refine-styles.js';

function RunPrediction({ message }) {
  return (
    <ToolsWrapper>
      <PlaceholderMessage>{message}</PlaceholderMessage>
    </ToolsWrapper>
  );
}

RunPrediction.propTypes = {
  message: T.string,
};
export default RunPrediction;
