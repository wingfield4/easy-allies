import React, { Component } from 'react';
import {
  Dimensions,
  Linking,
  Platform,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import Text from '../common/Text';
import YouTube from 'react-native-youtube';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import ScreenContainer from '../common/ScreenContainer';
import api from '../../utilities/api';
import { db } from '../../db';

const { height, width } = Dimensions.get('window');

class Video extends Component {
  state = {
    loading: true,
    error: false,
    video: null,
    duration: null,
    offset: 0,
    widthOffset: 0
  }

  componentDidMount = () => {
    const { navigation } = this.props;

    let videoId = navigation.getParam('videoId', null)
    api.getYouTubeVideo({ videoId }).then((res) => {
      this.setState({
        loading: false,
        error: false,
        video: res.data.description ? res.data : null
      })
    }).catch((err) => {
      this.setState({
        loading: false,
        error: err
      })
    })
  }

  onReady = () => {
    this.updateTimestamp();
    if(Platform.OS === 'android') {
      this.seekToPosition();
    }
    setTimeout(() => {
      this.setState({
        offset: -1
      })
    }, 500);
  }

  updateTimestamp = async () => {
    let { video, duration } = this.state;

    if(!duration && Platform.OS === 'android' && this.youtubeVideo) {
      duration = await this.youtubeVideo.duration();
    }

    if(video && this.youtubeVideo && duration) {
      let position = await this.youtubeVideo.currentTime();
      
      await db.updateTimestamp({
        videoId: video.id,
        position: position/duration
      })
    }

    setTimeout(this.updateTimestamp, 5000);
  }

  onProgress = async (e) => {
    const { duration } = this.state;

    if(!duration) {
      let duration = e.duration;
      
      this.setState({
        duration
      }, () => {
        this.seekToPosition();
      })
    }
  }

  seekToPosition = async () => {
    const { navigation } = this.props;
    let { duration } = this.state;

    if(!duration && Platform.OS === 'android' && this.youtubeVideo) {
      duration = await this.youtubeVideo.duration();
    }

    //let position = navigation.getParam('position', null);
    let videoId = navigation.getParam('videoId', null);
    let position = await db.getTimestamp(videoId);
    
    if(position && duration && this.youtubeVideo) {
      this.youtubeVideo.seekTo(duration*position);
    }
  }

  openInYoutube = async () => {
    const { navigation } = this.props;

    let position = await this.youtubeVideo.currentTime();
    let videoId = navigation.getParam('videoId', null)

    if(position) {
      Linking.openURL(`https://www.youtube.com/video/${videoId}?t=${position}s`)
    } else {
      Linking.openURL(`https://www.youtube.com/video/${videoId}`)
    }
  }

  changeFullScreen = () => {
    const { widthOffset } = this.state;

    this.setState({
      widthOffset: widthOffset === 0 ? -1 : 0
    })
  }

  render() {
    const { colors, navigation, isFocused } = this.props;
    const {
      loading,
      error,
      video,
      offset,
      widthOffset
    } = this.state;

    let videoId = navigation.getParam('videoId', null);

    return (
      <ScreenContainer>
        <View style={styles.container}>
          <View
            style={{
              width,
              height: width*.5625,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <YouTube
              controls={1}
              videoId={videoId}
              play={true}
              origin="http://www.youtube.com"
              style={{
                width: width - 2 + widthOffset,
                height: (width - 2)*.5625 + offset
              }}
              apiKey=""
              ref={youtubeVideo => this.youtubeVideo = youtubeVideo}
              onReady={this.onReady}
              onProgress={this.onProgress}
              resumePlayAndroid={false}
              onError={(err) => {
                console.log('err', err);
              }}
              onChangeState={() => this.changeFullScreen()}
              onChangeFullscreen={() => this.changeFullScreen()}
            />
          </View>
          {video &&
            <ScrollView
              style={{
                width: '100%',
                flex: 1,
                padding: 8
              }}
            >
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: 16
                }}
              >
                <TouchableOpacity
                  style={{
                    ...styles.button,
                    backgroundColor: colors.background
                  }}
                  onPress={this.openInYoutube}
                >
                  <Text
                    style={{
                      color: colors.text
                    }}
                  >
                    Open in YouTube
                  </Text>
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  color: colors.text
                }}
              >
                {video.description}
              </Text>
              <View style={{ height: 32 }}/>
            </ScrollView>
          }
        </View>
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(withNavigation(Video));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  button: {
    marginTop: 16,
    width: '80%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  }
})
