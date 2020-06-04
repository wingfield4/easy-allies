import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import Text from '../common/Text';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

const { height, width } = Dimensions.get('window');

class VideoCard extends Component {
  render() {
    const { colors, index, video, navigation, position, ...props } = this.props;
    console.log(position && position > 0);
    return (
      <TouchableOpacity
        style={styles.container}
        {...props}
        onPress={() => {
          // history.replace(`${history.location.pathname}?itemIndex=${index}`)
          // history.push(`${videoBaseURL}/${video.id}`)
          navigation.navigate('Video', {
            videoId: video.id,
            position
          })
        }}
      >
        <Image
          source={{ uri: video.thumbnailUrl }}
          style={{
            width,
            height: width*.55,
            zIndex: 100
          }}
        />
        {position > 0 && 
          <View
            style={{
              width,
              height: 4,
              position: 'absolute',
              top: width*.55 - 4,
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
        <View style={styles.infoContainer}>
          <View style={styles.titleContainer}>
            <Text
              style={{
                color: colors.text
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {video.title}
            </Text>
            <Text
              style={{
                color: colors.caption,
                fontSize: 12
              }}
            >
              {moment(video.publishedAt).fromNow()}
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
}))(withNavigation(VideoCard));

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    height: width*.55+42
  },
  infoContainer: {
    padding: 8,
    flexDirection: 'row'
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8
  }
})