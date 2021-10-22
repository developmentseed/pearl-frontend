import React from 'react';
import T from 'prop-types';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Subheading } from '../../styles/type/heading';
import { Heading } from '@devseed-ui/typography';
import Prose from '../../styles/type/prose';
import { themeVal } from '@devseed-ui/theme-provider';
import { useTour } from '../../context/explore';

const Inner = styled.div`
  background: ${themeVal('color.surface')};
  color: ${themeVal('color.base')};
  width: ${({ media }) => (media ? '50vw' : '20rem')};
  max-width: 60rem;
  padding: 1rem;
  display: grid;
  grid-template-rows: ${({ media }) =>
    media ? 'auto max-content max-content auto' : '1fr 3fr auto'};
  grid-gap: 1rem;
`;

const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;

  ${Heading} {
    margin: 0;
  }
`;

const TourMedia = styled.img`
  max-width: 100%;
  margin: 0 auto;
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
    <Inner {...tooltipProps} media={step.media}>
      <Header>
        <Heading size='small'>{step.title}</Heading>
        <Subheading id='tour-progress'>
          {index + 1} / {size}
        </Subheading>
      </Header>
      {step.media && <TourMedia src={step.media} />}
      <Prose>{step.content}</Prose>
      <Footer>
        <Button {...closeProps} useIcon={['xmark', 'after']}>
          Close
        </Button>
        <Controls columns={index > 0 ? 2 : 1}>
          {index > 0 && (
            <Button
              {...backProps}
              variation='base-plain'
              useIcon={['arrow-left', 'after']}
              id='tour-back-btn'
            >
              Back
            </Button>
          )}
          <Button
            {...primaryProps}
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
  const { steps } = props;
  const { tourStep, setTourStep } = useTour();

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
        // disableOverlay
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
  steps: T.array,
};

export default Tour;
