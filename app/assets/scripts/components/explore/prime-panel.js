import React, { useState } from 'react';
import Panel from '../common/panel';
import styled from 'styled-components';
import { themeVal, glsp } from '@devseed-ui/theme-provider';

import { Button } from '@devseed-ui/button';
import { PanelBlock, PanelBlockHeader } from '../common/panel-block';
import { Subheading } from '../../styles/type/heading';

const SubheadingStrong = styled.strong`
  color: ${themeVal('color.base')};
`;

export const HeadOption = styled.div`
  & ~ & {
    padding-top: ${glsp(0.5)};
  }
  &:last-of-type {
    box-shadow: 0px 1px 0px 0px ${themeVal('color.baseAlphaB')};
    padding-bottom: ${glsp(0.5)};
  }
`;

export const HeadOptionHeadline = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  & > :first-child {
    min-width: 5rem;
  }
`;

export const EditButton = styled(Button).attrs({
  variation: 'base-plain',
  size: 'small',
  useIcon: 'pencil',
  hideText: true,
})`
  opacity: 50%;
  margin-left: auto;
`;

function PrimePanel() {
  const [selectedModel, setSelectedModel] = useState(null);

  return (
    <Panel
      collapsible
      direction='left'
      initialState={true}
      bodyContent={
        <PanelBlock>
          <PanelBlockHeader>
            <HeadOptionHeadline>
              <Subheading>Model: </Subheading>
              <Subheading variation='primary'>
                <SubheadingStrong>
                  {selectedModel || 'Select Model'}
                </SubheadingStrong>
              </Subheading>
              <EditButton
                onClick={function () {
                  setSelectedModel('CB Starter 123');
                }}
                title='Edit Model'
              >
                Edit Model Selection
              </EditButton>
            </HeadOptionHeadline>
          </PanelBlockHeader>
        </PanelBlock>
      }
    />
  );
}

export default PrimePanel;
