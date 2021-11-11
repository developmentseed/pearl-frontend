import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

export const StyledTooltip = styled(ReactTooltip)`
  &.__react_component_tooltip {
    width: ${({ width }) => width || 'auto'};
    /* Z index set to 1000 to go over shadow scroll bar
   * which has z-index 1000 */
    z-index: 1001;
  }
`;
