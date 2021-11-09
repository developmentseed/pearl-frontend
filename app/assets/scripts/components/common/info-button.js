import React from 'react';
import T from 'prop-types';
import { Button } from '@devseed-ui/button';
import { LocalButton } from '../../styles/local-button';
import { StyledTooltip } from './tooltip';

export const InfoButton = React.forwardRef((props, ref) => {
  const { info, id, useIcon, width, useLocalButton } = props;
  const ButtonType = useLocalButton ? LocalButton : Button;
  return (
    <>
      <ButtonType
        ref={ref}
        data-cy={props['data-cy']}
        useIcon={useIcon || 'circle-information'}
        data-tip
        data-for={id}
        className='info-button'
        info={info || null}
        {...props}
      >
        {props.children}
      </ButtonType>
      {info && (
        <StyledTooltip width={width} id={id} place='bottom' effect='float'>
          {info}
        </StyledTooltip>
      )}
    </>
  );
});

InfoButton.displayName = 'InfoButton';
InfoButton.propTypes = {
  info: T.oneOfType([T.string, T.bool]),
  id: T.string,
  children: T.node,
  useIcon: T.oneOfType([T.string, T.array]),
  useLocalButton: T.bool,
  width: T.string,
  'data-cy': T.string,
};

export default InfoButton;
