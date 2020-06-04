import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  Switch,
  View
} from 'react-native';
import { connect } from 'react-redux';
import ScreenContainer from '../common/ScreenContainer';

class Settings extends Component {
  render() {
    const { colorMode, colors, dispatch } = this.props;
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <View
            style={{
              ...styles.switchContainer,
              borderColor: colors.text
            }}
          >
            <Text
              style={{
                color: colors.text
              }}
            >
              Enable Dark Mode
            </Text>
            <Switch
              value={colorMode === 'dark'}
              onValueChange={() => {
                dispatch({ type: colorMode === 'dark' ? 'setLightColors' : 'setDarkColors'});
              }}
            />
          </View>
        </View>
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(Settings);

const styles = StyleSheet.create({
  container: {
    padding: 8
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    padding: 8
  }
})
