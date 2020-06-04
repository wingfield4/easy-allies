import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native';

class Loading extends Component {
  render() {
    const { small } = this.props;
    return (
      <View
        style={{
          ...styles.container,
          height: small ? undefined : '100%'
        }}
      >
        <ActivityIndicator />
      </View>
    )
  }
}

export default Loading;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})