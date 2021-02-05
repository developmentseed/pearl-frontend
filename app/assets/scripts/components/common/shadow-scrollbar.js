import React from 'react';
import { PropTypes as T } from 'prop-types';
import styled, { css } from 'styled-components';
import { Scrollbars } from 'react-custom-scrollbars';
import { rgba } from 'polished';

import { themeVal, stylizeFunction } from '../../styles/utils/general';
import { glsp } from '../../styles/utils/theme-values';

const _rgba = stylizeFunction(rgba);

const ScrollWrapper = styled.div`
  position: relative;
`;

const ScrollShadow = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: ${glsp(1.5)};
  pointer-events: none;
  z-index: 1000;

  ${({ position }) => position === 'top'
    ? css`
      top: 0;
    `
    : css`
      bottom: 0;
      transform: scaleY(-1);
    `
  }

  ${({ variation }) => {
    switch (variation) {
      case 'light':
        return css`
          background: linear-gradient(to bottom, ${_rgba('#FFF', 1)} 0%, ${_rgba('#FFF', 0)} 100%);
        `;
      case 'dark':
        return css`
          background: linear-gradient(to bottom, ${_rgba(themeVal('color.primary'), 1)} 0%, ${_rgba(themeVal('color.primary'), 0)} 100%);
        `;
    }
  }}
`;

/**
 * Shadow scrollbar component.
 * Creates a box with custom scrollbars to ensure consistency in all browsers.
 *
 * The <ShadowScrollbar /> supports styled-components and any styles applied to
 * it will be added to the wrapper div.
 *
 * Shadows are automatically added to the top and bottom of the component to
 * indicate that there is content.
 * The variation/existence of the shadows can be controlled to props.
 *
 * @param {string} topShadowVariation The variation for the top shadow.
 *   Setting it to 'none' removes the shadow.
 * @param {string} bottomShadowVariation The variation for the bottom shadow.
 *   Setting it to 'none' removes the shadow.
 */
class ShadowScrollbar extends React.Component {
  constructor (props) {
    super(props);

    this.state = {
      shadowTopOpacity: 1,
      shadowBottomOpacity: 1
    };

    this.handleUpdate = this.handleUpdate.bind(this);
  }

  handleUpdate (values) {
    // If there are no shadows there's no point in doing calculations.
    const {
      topShadowVariation,
      bottomShadowVariation
    } = this.props;

    if (topShadowVariation === 'none' && bottomShadowVariation === 'none') return;

    const { scrollTop, scrollHeight, clientHeight } = values;
    const shadowTopOpacity = (1 / 20) * Math.min(scrollTop, 20);
    const bottomScrollTop = scrollHeight - clientHeight;
    const shadowBottomOpacity =
      (1 / 20) * (bottomScrollTop - Math.max(scrollTop, bottomScrollTop - 20));
    this.setState({
      shadowTopOpacity,
      shadowBottomOpacity
    });
  }

  render () {
    const {
      className,
      topShadowVariation,
      bottomShadowVariation,
      children,
      scrollbarsProps,
      ...rest
    } = this.props;

    const {
      shadowTopOpacity,
      shadowBottomOpacity
    } = this.state;

    // Ensure that it takes up the correct size.
    const scrollbarStyle = { width: '100%', height: '100%' };

    return (
      <ScrollWrapper className={className} {...rest}>
        {topShadowVariation !== 'none' && (
          <ScrollShadow
            variation={topShadowVariation}
            position='top'
            style={{ opacity: shadowTopOpacity }}
          />
        )}
        <Scrollbars
          autoHide
          style={scrollbarStyle}
          onUpdate={this.handleUpdate}
          className='scroll-area'
          {...scrollbarsProps}
        >
          {children}
        </Scrollbars>
        {bottomShadowVariation !== 'none' && (
          <ScrollShadow
            variation={bottomShadowVariation}
            position='bottom'
            style={{ opacity: shadowBottomOpacity }}
          />
        )}
      </ScrollWrapper>
    );
  }
}

ShadowScrollbar.propTypes = {
  className: T.string,
  topShadowVariation: T.string,
  bottomShadowVariation: T.string,
  scrollbarsProps: T.object,
  children: T.node
};

ShadowScrollbar.defaultProps = {
  topShadowVariation: 'light',
  bottomShadowVariation: 'light',
  scrollbarsProps: {}
};

export default ShadowScrollbar;
