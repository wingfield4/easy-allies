import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Linking,
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Text from '../common/Text';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

const { height, width } = Dimensions.get('window');

class Info extends Component {
  render() {
    const { info, colors, navigation, ...props } = this.props;
    return (
      <View style={styles.container}>
        {/* <Text
          style={{
            color: colors.text,
            fontSize: 32,
            marginBottom:16
          }}
        >
          Easy Allies is Online!
        </Text> */}
        <Image
          source={{ uri: info.thumbnailUrl.replace('{width}',480).replace('{height}', 270)}}
          style={{
            width: width*.9,
            height: width*.9*.5625,
            borderWidth: 1,
            borderColor: colors.caption
          }}
        />
        <View
          style={{
            ...styles.infoContainer,
            borderColor: colors.caption,
            backgroundColor: colors.background
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 16
            }}
          >
            {info.title}
          </Text>
          <Text
            style={{
              color: colors.text,
              marginTop: 16
            }}
          >
            Streaming {info.gameTitle ? `${info.gameTitle} ` : ''}for {info.viewerCount} viewers
          </Text>
        </View>
        <TouchableOpacity
          style={{
            ...styles.button,
            backgroundColor: colors.success
          }}
          onPress={() => {
            //history.push('/twitch/webView');
            navigation.navigate('WebView');
          }}
        >
          <Text
            style={{
              color: 'white'
            }}
          >
            View in App
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            Linking.openURL("https://twitch.tv/easyallies");
          }}
        >
          <Text
            style={{
              color: 'white'
            }}
          >
            Open in Twitch
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(withNavigation(Info));

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
    paddingTop: 16,
  },
  button: {
    width: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6441a5',
    padding: 8,
    height: 40,
    marginTop: 16
  },
  infoContainer: {
    borderWidth: 1,
    padding: 8,
    width: width*.9,
    marginTop: 16
  }
})