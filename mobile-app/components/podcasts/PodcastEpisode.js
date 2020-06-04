import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Text from '../common/Text';
import { connect } from 'react-redux';

import podcastImages from '../../utilities/podcastImages';

const { height, width } = Dimensions.get('window');

class PodcastEpisode extends Component {
  render() {
    const { podcastEpisode, colors, position, ...props } = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        {...props}
      >
        <Image
          source={podcastImages[podcastEpisode.podcastId]}
          style={{
            width: width*.3,
            height: width*.3,
            backgroundColor: colors.background
          }}
        />
        {position &&
          <View
            style={{
              left: 4,
              width: width - 8,
              height: 4,
              position: 'absolute',
              bottom: 0,
              zIndex: 1000,
              backgroundColor: colors.caption
            }}
          >
            <View
              style={{
                width: `${position * 100}%`,
                height: '100%',
                backgroundColor: colors.calendar
              }}
            />
          </View>
        }
        <View
          style={{
            ...styles.infoContainer,
            backgroundColor: colors.background
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontSize: 16
            }}
            ellipsizeMode="tail"
            numberOfLines={2}
          >
            {podcastEpisode.title}
          </Text>
          <Text
            style={{
              color: colors.caption,
              fontSize: 12
            }}
            ellipsizeMode="tail"
            numberOfLines={3}
          >
            {podcastEpisode.description}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(PodcastEpisode);;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingTop: 4,
    paddingBottom: 0,
    flexDirection: 'row'
  },
  infoContainer: {
    padding: 8,
    paddingTop: 2,
    flex: 1
  }
})
