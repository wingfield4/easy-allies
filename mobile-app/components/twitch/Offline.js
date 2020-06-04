import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';
import Text from '../common/Text';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class Offline extends Component {
  render() {
    const { colors } = this.props;
    return (
      <View style={styles.container}>
        <Text
          style={{
            color: colors.text,
            fontSize: 32,
            marginBottom: 24
          }}
        >
          Easy Allies is offline
        </Text>
        <Icon name="twitch" size={96} color={colors.text} />
        <Text
          style={{
            color: colors.text,
            marginTop: 16,
            textAlign: 'center',
            maxWidth: '75%'
          }}
        >
          Check back later, or view the calendar to see upcoming events!
        </Text>
      </View>
    )
  }
}

export default Offline;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 16
  }
})

