import React from 'react';
import { Animated, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';

// const ViewStylePropTypes = require('ViewStylePropTypes');

const Animate = ({ style, children }, { modalDriver }) => {
  const animatedStyle = typeof style === 'function' ? style(modalDriver) : style;
  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

Animate.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  style: PropTypes.oneOfType([
    PropTypes.func,
    ViewPropTypes.style,
  ]).isRequired,
};

Animate.contextTypes = {
  modalDriver: PropTypes.instanceOf(Animated.Value),
};

export default Animate;
