import React from 'react';
import styled, { css } from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

import { HeadOptionHeadline } from '../../../../../styles/panel';
import ShadowScrollbar from '../../../../common/shadow-scrollbar';
import { Option, HeadOption } from '../selection-styles';
import { Subheading } from '../../../../../styles/type/heading';
import { useTimeframes } from '../../../../../context/explore';

const TimeframeOption = styled(Option)`
  ${({ disabled }) =>
    disabled &&
    css`
      &:hover {
        background: ${themeVal('color.baseDark')};
        cursor: default;
      }
    `}
`;

function TimeframeSelector() {
  const { setSelectedTimeframe, timeframes } = useTimeframes();

  return (
    <>
      <HeadOption hasSubtitle>
        <HeadOptionHeadline usePadding>
          <Subheading>Timeframes</Subheading>
        </HeadOptionHeadline>
        <ShadowScrollbar
          style={{
            minHeight: '6rem',
            maxHeight: '10rem',
            backgroundColor: '#121826',
            padding: '0.25rem 0',
            margin: '0.75rem 0',
            boxShadow: 'inset 0 -1px 0 0 rgba(240, 244, 255, 0.16)',
          }}
        >
          {timeframes?.length > 0 &&
            timeframes.map((t) => (
              <TimeframeOption
                key={t.id}
                onClick={async () => {
                  await setSelectedTimeframe(t);
                }}
              >
                {t.id}
              </TimeframeOption>
            ))}
        </ShadowScrollbar>
      </HeadOption>
    </>
  );
}

TimeframeSelector.propTypes = {};

export default TimeframeSelector;
