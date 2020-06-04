import React, { Component } from 'react';
import {
  Platform,
  View,
  StatusBar as RNStatusBar
} from 'react-native';
import { connect } from 'react-redux';

class StatusBar extends Component {
  render() {
    const { colorMode } = this.props;
    return (
      <View>
        {Platform.OS === 'ios' &&
          <RNStatusBar barStyle={colorMode === 'dark' ? 'light-content' : 'dark-content'} />
        }
      </View>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(StatusBar);
