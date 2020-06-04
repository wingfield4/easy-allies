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

class Podcast extends Component {
  render() {
    const { podcast, colors, ...props } = this.props;
    return (
      <TouchableOpacity
        style={styles.container}
        {...props}
      >
        <Image
          source={podcastImages[podcast.id]}
          style={{
            width: width*.3,
            height: width*.3,
            backgroundColor: colors.background
          }}
        />
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
          >
            {podcast.title}
          </Text>
          <Text
            style={{
              color: colors.caption,
              fontSize: 12
            }}
            ellipsizeMode="tail"
            numberOfLines={4}
          >
            {podcast.summary}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(Podcast);;

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
