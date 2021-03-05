import React from 'react';
import T from 'prop-types';
import ReactTooltip from 'react-tooltip';
import { Button } from '@devseed-ui/button';
import styled from 'styled-components';
const StyledTooltip = styled(ReactTooltip)`
  width: ${({ width }) => width || 'auto'};
  /* Z index set to 1000 to go over shadow scroll bar
   * which has z-index 1000 */
  z-index: 1001;
`;

function InfoButton(props) {
  const { info, id, useIcon, width } = props;
  return (
    <>
      <Button
        useIcon={useIcon || 'circle-information'}
        data-tip
        data-for={id}
        className='info-button'
        {...props}
      >
        {props.children}
      </Button>
      {info && (
        <StyledTooltip width={width} id={id} place='bottom' effect='float'>
          {info}
        </StyledTooltip>
      )}
    </>
  );
}

InfoButton.propTypes = {
  info: T.string,
  id: T.string,
  children: T.node,
  useIcon: T.oneOfType([T.string, T.array]),
  width: T.string,
};

export default InfoButton;
