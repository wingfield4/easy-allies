import React, { Component } from 'react';
import {
  Text as RNText,
  StyleSheet
} from 'react-native';

class Text extends Component {
  render() {
    const { style, children, ...props } = this.props;
    return (
      <RNText
        style={{
          ...styles.text,
          ...style
        }}
        {...props}
      >
        {children}
      </RNText>
    )
  }
}

export default Text;

const styles = StyleSheet.create({
  text: {

  }
})
