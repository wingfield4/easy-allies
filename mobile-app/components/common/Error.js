import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from './Text';
import { connect } from 'react-redux';

class Error extends Component {
  render() {
    const {
      colors,
      error,
      onRetry
    } = this.props;
    return (
      <View style={styles.container}>
        <Text
          style={{
            color: colors.text,
            fontSize: 20
          }}
        >
          {typeof error === 'string' &&
            error
          }
          {typeof error !== 'string' &&
            'Oops! Something has gone wrong.'
          }
        </Text>
        {onRetry &&
          <TouchableOpacity
            onPress={onRetry}
            style={{
              marginTop: 32,
              height: 56,
              width: 56,
              borderRadius: 28,
              paddingTop: Platform.OS === 'android' ? 0 : 6,
              backgroundColor: colors.background,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon name="refresh" color={colors.text} size={40} />
          </TouchableOpacity>
        }
      </View>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(Error);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    paddingTop: 16
  }
})