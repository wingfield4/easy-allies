import React, { Component } from 'react';
import {
  AsyncStorage,
  View
} from 'react-native';
import { connect } from 'react-redux';

class ColorManager extends Component {

  componentDidMount = async () => {
    const { dispatch } = this.props;
    let colorMode = await AsyncStorage.getItem('colorMode');
    
    if(colorMode) {
      dispatch({ type: colorMode === 'dark' ? 'setDarkColors' : 'setLightColors'});
    } else {
      await AsyncStorage.setItem('colorMode', 'dark');
    }
  }

  render() {
    return (
      <View />
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(ColorManager);
