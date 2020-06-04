import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
import { withNavigation, NavigationActions } from 'react-navigation';

import logoBanner from '../../assets/logoTextBannerCropped.png';
import logoBannerDark from '../../assets/logoTextBannerCroppedDark.png';

const { width } = Dimensions.get('window');

class Header extends Component {
  render() {
    const { colors, colorMode, navigation, trackId } = this.props;
    return (
      <SafeAreaView
        style={{
          ...styles.container,
          backgroundColor: colors.background,
          borderColor: colors.text
        }}
      >
        <View
          style={{
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: 'row',
            padding: 8,
            width: '100%'
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              width: 56
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.dispatch(NavigationActions.back())}
            >
              <Icon name="arrow-left" size={24} color={colors.text} />
            </TouchableOpacity>
            {trackId &&
              <TouchableOpacity
                style={{
                  marginLeft: 8
                }}
                onPress={() => {
                  navigation.navigate('NowPlaying', {
                    trackId
                  });
                }}
              >
                <Icon name="headphones" size={24} color={colors.calendar} />
              </TouchableOpacity>
            }
            {!trackId &&
              <View
                style={{
                  marginLeft: 8
                }}
              >
                <Icon name="headphones" size={24} color={colors.caption} />
              </View>
            }
          </View>
          {colorMode === 'light' &&
            <Image
              source={logoBannerDark}
              style={{
                height: 24,
                flex: 1
              }}
              resizeMode="contain"
            />
          }
          {colorMode === 'dark' &&
            <Image
              source={logoBanner}
              style={{
                height: 24,
                flex: 1
              }}
              resizeMode="contain"
            />
          }
          <View
            style={{
              flexDirection: 'row',
              width: 56
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: 8
              }}
              onPress={() => {
                navigation.navigate('About');
              }}
            >
              <Icon name="information-outline" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Settings');
              }}
            >
              <Icon name="settings" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode,
  trackId: state.trackId
}))(withNavigation(Header));

const styles = StyleSheet.create({
  container: {
    width,
    borderBottomWidth: 1
  }
})
