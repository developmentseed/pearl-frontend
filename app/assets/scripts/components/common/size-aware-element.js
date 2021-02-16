'use strict';
import React from 'react';
import { PropTypes as T } from 'prop-types';
import elementResizeEvent from 'element-resize-event';

class SizeAwareElement extends React.Component {
  constructor(props) {
    super(props);
    this.elRef = React.createRef();

    this.width = null;
    this.height = null;

    this.resizeListener = this.resizeListener.bind(this);
  }

  componentDidMount() {
    elementResizeEvent(this.elRef.current, this.resizeListener);
    this.resizeListener();
  }

  getSize() {
    if (!this.elRef.current) return;

    const { clientHeight, clientWidth } = this.elRef.current;
    const {
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
    } = getComputedStyle(this.elRef.current);
    return {
      width: clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight),
      height: clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom),
    };
  }

  resizeListener() {
    const { width, height } = this.getSize();
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
      this.props.onChange({ width, height });
    }
  }

  render() {
    const { element: Element, children, ...rest } = this.props;
    return (
      <Element ref={this.elRef} {...rest}>
        {children}
      </Element>
    );
  }
}

SizeAwareElement.propTypes = {
  onChange: T.func,
  element: T.elementType,
  children: T.node,
};

SizeAwareElement.defaultProps = {
  element: 'div',
  onChange: () => {},
};

export default SizeAwareElement;
