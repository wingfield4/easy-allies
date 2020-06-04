import React, { Component } from 'react';
import {
  AsyncStorage,
  PushNotificationIOS,
  StyleSheet,
  Switch,
  View
} from 'react-native';
import Text from '../common/Text';
import { connect } from 'react-redux';

import Loading from '../common/Loading';
import ScreenContainer from '../common/ScreenContainer';
import api from '../../utilities/api';

class Settings extends Component {
  state = {
    twitch: false,
    podcast: false,
    youtube: false,
    loading: true,
    notificationsEnabled: false
  }

  componentDidMount = () => {
    const { deviceToken } = this.props;
    if(deviceToken) {
      api.getDeviceSettings({ token: deviceToken }).then((res) => {
        this.setState({
          podcast: res.data.podcastEnabled,
          youtube: res.data.youtubeEnabled,
          twitch: res.data.twitchEnabled,
          notificationsEnabled: true,
          loading: false
        })
      }).catch((err) => {
        this.setState({
          loading: false
        })
      })
    } else {
      this.setState({
        loading: false
      })
    }
  }

  updateSettings = () => {
    const { deviceToken } = this.props;
    const {
      twitch,
      podcast,
      youtube
    } = this.state;
    
    api.updateDeviceSettings({
      token: deviceToken,
      twitchEnabled: twitch,
      podcastEnabled: podcast,
      youtubeEnabled: youtube
    })
  }

  handleTwitch = (value) => {
    this.setState({
      twitch: value
    }, () => {
      this.updateSettings();
    })
  }

  handlePodcast = (value) => {
    this.setState({
      podcast: value
    }, () => {
      this.updateSettings();
    })
  }

  handleYoutube = (value) => {
    this.setState({
      youtube: value
    }, () => {
      this.updateSettings();
    })
  }

  render() {
    const { colorMode, colors, dispatch } = this.props;
    const {
      twitch,
      podcast,
      youtube,
      loading,
      notificationsEnabled
    } = this.state;
    return (
      <ScreenContainer>
        <View style={styles.container}>
          <View
            style={{
              ...styles.sectionContainer,
              //backgroundColor: colors.background,
              borderColor: colors.caption
            }}
          >
            <Text
              style={{
                color: colors.text,
                margin: 8,
                textAlign: 'center',
                fontSize: 16
              }}
            >
              App Settings
            </Text>
            <View
              style={{
                ...styles.switchContainer,
                borderColor: colors.caption
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
                  AsyncStorage.setItem('colorMode', colorMode === 'dark' ? 'light' : 'dark');
                  dispatch({ type: colorMode === 'dark' ? 'setLightColors' : 'setDarkColors'});
                }}
              />
            </View>
          </View>

          <View
            style={{
              ...styles.sectionContainer,
              //backgroundColor: colors.background,
              borderColor: colors.caption
            }}
          >
            <Text
              style={{
                color: colors.text,
                margin: 8,
                textAlign: 'center',
                fontSize: 16
              }}
            >
              Notification Settings
            </Text>
            <React.Fragment>
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
                  Live on Twitch
                </Text>
                <Switch
                  value={twitch}
                  onValueChange={(value) => {
                    this.handleTwitch(value);
                  }}
                  disabled={loading || !notificationsEnabled}
                />
              </View>
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
                  New Podcast
                </Text>
                <Switch
                  value={podcast}
                  onValueChange={(value) => {
                    this.handlePodcast(value);
                  }}
                  disabled={loading || !notificationsEnabled}
                />
              </View>
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
                  New YouTube Video
                </Text>
                <Switch
                  value={youtube}
                  onValueChange={(value) => {
                    this.handleYoutube(value);
                  }}
                  disabled={loading || !notificationsEnabled}
                />
              </View>
            </React.Fragment>
          </View>
          {!loading && !notificationsEnabled &&
            <Text
              style={{
                color: colors.caption,
                fontSize: 12,
                textAlign: 'center'
              }}
            >
              To change notification settings, please enable notifications for this application in your device's settings.
            </Text>
          }
        </View>
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode,
  deviceToken: state.deviceToken
}))(Settings);

const styles = StyleSheet.create({
  container: {
    padding: 8
  },
  sectionContainer: {
    borderWidth: 1,
    marginBottom: 8
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8
  }
})
