import React, { Component } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

import Animate from './Animate';
import BackDrop from './BackDrop';

let instance = null;
let uniqueId = 0;

class Modal extends Component {
  state = {
    modals: [],
  }

  componentWillMount() {
    if (instance !== null) {
      throw new Error('There must be only one instance of a Modal mounted on the app');
    }
    instance = this;
  }

  componentWillUnmount() {
    instance = null;
  }

  async show(ModalComponent, backDropColor, autoHide = true, animation = null) {
    // console.log('Modal is', ModalComponent);
    // eslint-disable-next-line no-plusplus
    const id = ++uniqueId;

    return new Promise((resolve) => {
      this.setState({
        modals: this.state.modals.concat({
          id,
          props: {
            ModalComponent,
            driver: new Animated.Value(0),
            backDropColor,
            animation: animation || Modal.defaultAnimation,
            autoHide,
            onShow: () => resolve(id),
          },
        }),
      });
    });
  }

  async hide(id) {
    return new Promise((resolve) => {
      const modal = this.state.modals.find(m => m.id === id);
      if (!modal) {
        resolve(false);
        return;
      }

      modal.props.animation(modal.props.driver, 0).start(() => {
        this.setState({
          modals: this.state.modals.filter(m => m.id !== id),
        }, () => resolve(true));
      });
    });
  }

  renderModal = ({ id, props }) => (
    <BackDrop key={id} {...props} hide={() => this.hide(id)} />
  );

  render() {
    const { modals } = this.state;
    if (modals.length === 0) {
      return null;
    }

    return (
      <View style={StyleSheet.absoluteFill}>
        { modals.map(this.renderModal) }
      </View>
    );
  }
}

// Use spring animation as default animation
Modal.defaultAnimation = (value, toValue) => Animated.spring(value, {
  toValue,
  useNativeDriver: true,
});

Modal.show = async (ModalComponent, backDropColor, autoHide = true, animation = null) => {
  if (instance === null) {
    throw new Error('No Modal instance mounted yet.');
  }

  return instance.show(ModalComponent, backDropColor, autoHide, animation);
};

Modal.Animate = Animate;

export default Modal;
