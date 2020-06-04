import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Text from '../common/Text';

const { height, width } = Dimensions.get('window');

class PlaylistCard extends Component {
  render() {
    const { colors, index, playlist, navigation, ...props } = this.props;
    return (
      <TouchableOpacity
        style={{
          ...styles.container
        }}
        {...props}
        onPress={() => {
          navigation.navigate('Playlist', {
            playlistId: playlist.id
          })
        }}
      >
        <Image
          source={{ uri: playlist.thumbnailUrl }}
          style={{
            width: width*.4,
            height: width*.4*.55,
            backgroundColor: colors.background
          }}
        />
        <View
          style={{
            ...styles.infoContainer,
            backgroundColor: colors.background
          }}
        >
          <View style={styles.titleContainer}>
            <Text
              style={{
                color: colors.text,
                fontSize: 16
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {playlist.title}
            </Text>
            <Text
              style={{
                color: colors.caption,
                fontSize: 12
              }}
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {playlist.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(withNavigation(PlaylistCard));

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 4,
    paddingBottom: 0,
    flexDirection: 'row'
  },
  infoContainer: {
    padding: 8,
    paddingTop: 4,
    flexDirection: 'row',
    flex: 1
  },
  titleContainer: {
    flex: 1
  }
})