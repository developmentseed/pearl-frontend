import React, { useState } from 'react';
import { Button } from '@devseed-ui/button';
import { Modal } from '../common/custom-modal';

import styled from 'styled-components';

import { themeVal, glsp } from '@devseed-ui/theme-provider';

const ShortcutsWrapper = styled.dl`
  display: grid;
  grid-template-columns: min-content 1fr;
  align-items: baseline;
  justify-content: space-between;
  grid-gap: ${glsp()};
`;
const Shortcut = styled.dt`
  background: ${themeVal('color.background')};
  border: 1px solid ${themeVal('color.primaryAlphaB')};
  font-weight: ${themeVal('type.heading.weight')};
  text-align: center;
  min-width: ${glsp(1.75)};
  justify-self: flex-start;
  padding: ${glsp(0.125)} ${glsp(0.5)};
`;

// TODO Reinstate commented shortcuts

export const ShortcutHelp = () => {
  const [displayShortcutsModal, setDisplayShortcutsModal] = useState(false);

  return (
    <>
      <Button
        useIcon='keyboard'
        variation='primary-plain'
        hideText
        title='Show keyboard shortcuts'
        onClick={() => setDisplayShortcutsModal(true)}
      />
      <Modal
        id='keyboard-shortcuts-modal'
        title='Keyboard Shortcuts'
        closeButton={true}
        revealed={displayShortcutsModal}
        size='small'
        onCloseClick={() => setDisplayShortcutsModal(false)}
        onOverlayClick={() => setDisplayShortcutsModal(false)}
        content={
          <ShortcutsWrapper>
            {/* <Shortcut>l</Shortcut>
            <dd>Open layers tray</dd> */}
            <Shortcut>a</Shortcut>
            <dd>Set prediction layer opacity to 0%</dd>
            <Shortcut>s</Shortcut>
            <dd>Decrease prediction layer opacity by 1%</dd>
            <Shortcut>d</Shortcut>
            <dd>Increase prediction layer opacity by 1%</dd>
            <Shortcut>f</Shortcut>
            <dd>Set prediction layer opacity to 100%</dd>
            {/* <Shortcut>Esc</Shortcut>
            <dd>Cancel polygons in progress when drawing</dd> */}
            <Shortcut>Space</Shortcut>
            <dd>Pan map</dd>
            {/* <Shortcut>k</Shortcut>
            <dd>Open shortcuts help</dd> */}
          </ShortcutsWrapper>
        }
      />
    </>
  );
};
