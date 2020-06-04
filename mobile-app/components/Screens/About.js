import React, { Component } from 'react';
import {
  Dimensions,
  Linking,
  Image,
  Platform,
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';

import banner from '../../assets/banner.png';
import logoBannerCropped from '../../assets/logoBannerCropped.png';
import logoBannerCroppedDark from '../../assets/logoBannerCroppedDark.png';
import ScreenContainer from '../common/ScreenContainer';
const { width, height } = Dimensions.get('window');

class About extends Component {
  render() {
    const { colors, colorMode } = this.props;
    return (
      <ScreenContainer>
        <ScrollView
          contentContainerStyle={styles.container}
        >
          <Image
            source={banner}
            style={{
              width,
              height: width*.36,
              margin: -8,
              marginBottom: 8
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'center'
            }}
          >
            <TouchableOpacity
              onPress={() => Linking.openURL('https://www.twitter.com/EasyAllies')}
              style={styles.icon}
            >
              <Icon
                name="twitter"
                size={72}
                color={colors.text}
                style={{ marginBottom: Platform.OS === 'ios' ? -12 : -8 }}
              />
              <Text
                style={{
                  color: colors.text,
                }}
              >
                Twitter
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://www.patreon.com/EasyAllies')}
              style={styles.icon}
            >
              <Icon
                name="patreon"
                size={72}
                color={colors.text}
                style={{ marginBottom: Platform.OS === 'ios' ? -12 : -8 }}
              />
              <Text
                style={{
                  color: colors.text,
                }}
              >
                Patreon
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://twitch.tv/easyallies')}
              style={styles.icon}
            >
              <Icon
                name="twitch"
                size={72}
                color={colors.text}
                style={{ marginBottom: Platform.OS === 'ios' ? -12 : -8 }}
              />
              <Text
                style={{
                  color: colors.text,
                }}
              >
                Twitch
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://youtube.com/easyallies')}
              style={styles.icon}
            >
              <Icon
                name="youtube"
                size={72}
                color={colors.text}
                style={{ marginBottom: Platform.OS === 'ios' ? -12 : -8 }}
              />
              <Text
                style={{
                  color: colors.text,
                }}
              >
                YouTube
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icon}
              onPress={() => Linking.openURL("https://shop.spreadshirt.com/easyallies")}
            >
              <Icon
                name="store"
                size={72}
                color={colors.text}
                style={{ marginBottom: Platform.OS === 'ios' ? -12 : -8 }}
              />
              <Text
                style={{
                  color: colors.text,
                }}
              >
                Merch
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 16,
              marginBottom: 16
            }}
            onPress={() => Linking.openURL("https://easyallies.com")}
          >
            {colorMode === 'dark' &&
              <Image
                source={logoBannerCropped}
                style={{
                  width: width*.8,
                  height: width*.8*.1509
                }}
              />
            }
            {colorMode === 'light' &&
              <Image
                source={logoBannerCroppedDark}
                style={{
                  width: width*.8,
                  height: width*.8*.1509
                }}
              />
            }
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: colors.caption,
              ...styles.divider
            }}
          />
          <Text
            style={{
              ...styles.text,
              color: colors.caption
            }}
          >
            This unofficial Easy Allies app was created by David Wingfield as a convenient way to stay up-to-date on Easy Allies content. 
            This app does not collect any information from users. It is provided free of charge with no advertisements. 
            If you enjoy the app and would like to show your support, become a Patron of the Easy Allies and we'll call it even.
          </Text>
        </ScrollView>
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(About);

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: 'center'
  },
  divider: {
    marginTop: 8,
    marginBottom: 8,
    height: 1,
    width: '80%'
  },
  icon: {
    margin: 8,
    alignItems: 'center'
  },
  text: {
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 12
  }
})
