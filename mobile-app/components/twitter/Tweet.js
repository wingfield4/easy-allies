import React, { Component } from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Text from '../common/Text';

class Tweet extends Component {

  render() {
    const { tweet, colors, ...props } = this.props;

    let tweetInfo;
    if(tweet.retweetText) {
      tweetInfo = {
        name: tweet.retweetUserName,
        screenName: tweet.retweetUserScreenName,
        retweetedBy: tweet.userName,
        profileImage: tweet.retweetUserProfileImageUrl,
        text: tweet.retweetText,
        postedFromNow: moment(new Date(tweet.createdAt)).fromNow()
      }
    } else {
      tweetInfo = {
        name: tweet.userName,
        screenName: tweet.userScreenName,
        retweetedBy: null,
        profileImage: tweet.userProfileImageUrl,
        text: tweet.text,
        postedFromNow: moment(new Date(tweet.createdAt)).fromNow()
      }
    }

    return (
      <TouchableOpacity
        style={{
          ...styles.container,
          backgroundColor: colors.background
        }}
        onPress={() => {
          Linking.openURL(`https://twitter.com/${tweet.userScreenName}/status/${tweet.tweetId}`)
        }}
      >
        <View
          style={{ width: 60 }}
        >
          <Image
            style={{
              height: 48,
              width: 48,
              borderRadius: 24
            }}
            source={{ uri: tweetInfo.profileImage }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text
            }}
          >
            {tweetInfo.name}{' '}
            <Text
              style={{ ...styles.link, color: colors.calendar }}
              onPress={() => Linking.openURL(`https://twitter.com/${tweet.userScreenName}`)}
            >
              @{tweetInfo.screenName}
            </Text>
          </Text>
          {tweetInfo.retweetedBy &&
            <Text
              style={{
                color: colors.text,
                fontSize: 12,
                fontStyle: 'italic'
              }}
            >
              <Icon name="twitter-retweet" size={12} color={colors.text} />
              {' '}Retweeted by {tweetInfo.retweetedBy}
            </Text>
          }
          <Text
            style={{
              color: colors.text,
              marginTop: 8
            }}
          >
            {tweetInfo.text}
          </Text>
          <Text
            style={{
              color: colors.caption,
              fontSize: 12,
              marginTop: 8
            }}
          >
            {tweetInfo.postedFromNow}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }
}

export default Tweet;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 8,
    marginTop: 8,
    flexDirection: 'row'
  },
  link: {
    textDecorationLine: 'underline'
  }
})
