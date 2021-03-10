import React from 'react';
import T from 'prop-types';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Subheading } from '../../styles/type/heading';
import { Heading } from '@devseed-ui/typography';
import Prose from '../../styles/type/prose';
import { themeVal } from '@devseed-ui/theme-provider';

const steps = [
  {
    title: 'Select area',
    target: '#edit-aoi-trigger',
    content: 'Select aoi',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
  {
    title: 'Select model',
    target: '#select-model-trigger',
    content: 'Select model',
    disableBeacon: true,
    placement: 'right',
    spotlightClicks: true,
  },
];

const Inner = styled.div`
  background: ${themeVal('color.baseLight')};
  width: 20rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: 1fr 3fr auto;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  ${Heading} {
    margin: 0;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 0.5rem;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ columns }) => columns}, 1fr);
  gap: 0.5rem;
`;

const TourTooltip = ({
  index,
  size,
  step,
  backProps,
  closeProps,
  primaryProps,
  tooltipProps,
}) => {
  return (
    <Inner {...tooltipProps}>
      <Header>
        <Heading>{step.title}</Heading>
        <Subheading id='tour-progress'>
          {index + 1} / {size}
        </Subheading>
      </Header>
      <Prose>{step.content}</Prose>
      <Footer>
        <Button {...closeProps} size='small' useIcon={['xmark', 'after']}>
          Close
        </Button>
        <Controls columns={index > 0 ? 2 : 1}>
          {index > 0 && (
            <Button
              {...backProps}
              size='small'
              variation='base-plain'
              useIcon={['arrow-left', 'after']}
              id='tour-back-btn'
            >
              Back
            </Button>
          )}
          <Button
            {...primaryProps}
            size='small'
            variation='primary-raised-dark'
            useIcon={index < size - 1 ? ['arrow-right', 'after'] : null}
            id='tour-next-btn'
          >
            {index === size - 1 ? 'Finish' : 'Next'}
          </Button>
        </Controls>
      </Footer>
    </Inner>
  );
};

TourTooltip.propTypes = {
  index: T.number,
  size: T.number,
  step: T.object,
  backProps: T.object,
  closeProps: T.object,
  primaryProps: T.object,
  tooltipProps: T.object,
};

function Tour(props) {
  const { tourStep, setTourStep } = props;
  return (
    <>
      <Joyride
        continuous={true}
        run={tourStep >= 0}
        steps={steps}
        stepIndex={tourStep}
        showProgress={true}
        tooltipComponent={TourTooltip}
        floaterProps={{ disableAnimation: true }}
        disableOverlay
        callback={(state) => {
          const { action, index, type, status } = state;
          if (tourStep >= 0) {
            if (
              type === EVENTS.STEP_AFTER ||
              type === EVENTS.TARGET_NOT_FOUND
            ) {
              setTourStep(index + (action === ACTIONS.PREV ? -1 : 1));
            } else if (action === ACTIONS.CLOSE || status === STATUS.FINISHED) {
              setTourStep(-1);
            }
          }
        }}
      />
    </>
  );
}

Tour.propTypes = {
  tourStep: T.number,
  setTourStep: T.func,
};

export default Tour;
