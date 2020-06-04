import React, { Component } from 'react';
import {
  SafeAreaView
} from 'react-native';
import { connect } from 'react-redux';

class ScreenContainer extends Component {
  render() {
    const { colors, colorMode, children, style, ...props } = this.props;
    return (
      <SafeAreaView
        style={{
          backgroundColor: colors.pageBackground,
          flex: 1,
          borderBottomWidth: 1,
          borderColor: colors.caption,
          ...style
        }}
        {...props}
      >
        {children}
      </SafeAreaView>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(ScreenContainer);
