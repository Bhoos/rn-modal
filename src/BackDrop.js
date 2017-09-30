import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Animated, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';

class BackDrop extends Component {
  getChildContext() {
    return {
      modalDriver: this.props.driver,
    };
  }

  componentDidMount() {
    const { animation, driver, onShow } = this.props;
    animation(driver, 1).start(() => {
      onShow();
    });
  }

  onBackDropPressed = () => {
    const { autoHide, hide } = this.props;
    if (autoHide) {
      hide();
      return;
    }

    if (this.modal && this.modal.onBackDropPressed) {
      this.modal.onBackDropPressed(hide);
    }
  }

  hide = () => {
    this.container.setNativeProps({
      pointerEvents: 'none',
    });

    this.props.hide();
  }

  render() {
    // console.log('Rendering ')
    const { driver, backDropColor, ModalComponent } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.onBackDropPressed}>
        <View ref={(node) => { this.container = node; }} style={StyleSheet.absoluteFill}>
          { backDropColor &&
            <Animated.View
              style={[StyleSheet.absoluteFill, {
                backgroundColor: backDropColor,
                opacity: driver,
              }]}
            /> }
          <ModalComponent ref={(node) => { this.modal = node; }} hide={this.hide} />
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

BackDrop.childContextTypes = {
  modalDriver: PropTypes.instanceOf(Animated.Value).isRequired,
};

BackDrop.propTypes = {
  animation: PropTypes.func.isRequired,
  driver: PropTypes.instanceOf(Animated.Value).isRequired,
  onShow: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired,
  autoHide: PropTypes.bool.isRequired,
  backDropColor: PropTypes.string,
  ModalComponent: PropTypes.func.isRequired,
};

BackDrop.defaultProps = {
  backDropColor: null,
};

export default BackDrop;
