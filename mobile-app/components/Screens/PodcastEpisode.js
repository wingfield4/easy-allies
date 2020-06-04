import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import Text from '../common/Text';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Error from '../common/Error';
import Loading from '../common/Loading';
import ProgressBar from '../podcasts/ProgressBar';
import ScreenContainer from '../common/ScreenContainer';
import api from '../../utilities/api';
import { db } from '../../db';
import podcastImages from '../../utilities/podcastImages'

const { height, width } = Dimensions.get('window');

class PodcastEpisode extends Component {
  state = {
    loading: true,
    error: false,
    podcastEpisode: null,
    playing: false,
    initialSeek: false
  }

  play = async () => {
    const { dispatch } = this.props;
    const { podcastEpisode } = this.state;

    dispatch({
      type: 'setTrackId',
      trackId: podcastEpisode.id
    })

    let trackId = await TrackPlayer.getCurrentTrack();

    if(parseInt(trackId, 10) !== podcastEpisode.id) {
      TrackPlayer.setupPlayer().then(async (res) => {
        TrackPlayer.updateOptions({
          compactCapabilities: [
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_JUMP_FORWARD,
            TrackPlayer.CAPABILITY_JUMP_BACKWARD,
            TrackPlayer.CAPABILITY_SEEK_TO
          ],
          capabilities: [
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_JUMP_FORWARD,
            TrackPlayer.CAPABILITY_JUMP_BACKWARD,
            TrackPlayer.CAPABILITY_SEEK_TO
          ]
        })
        TrackPlayer.addEventListener('playback-state', this.handleStateChange);
        await TrackPlayer.reset();

        // Adds a track to the queue
        await TrackPlayer.add({
          id: podcastEpisode.id,
          url: podcastEpisode.mediaUrl,
          title: podcastEpisode.title,
          artist: 'Easy Allies',
          artwork: podcastEpisode.imageUrl
        });
        await TrackPlayer.play();
      })
    }

    
    this.setState({
      playing: true
    }, async () => {
      await TrackPlayer.play();
    })
  }

  pause = () => {
    this.setState({
      playing: false
    }, () => {
      TrackPlayer.pause();
    })
  }

  getPodcastEpisode = async () => {
    const { navigation, trackId } = this.props;
    let id = navigation.getParam('id', null);

    if(trackId) {
      id = trackId;
    }

    let playingTrackId = await TrackPlayer.getCurrentTrack();
    let trackState = await TrackPlayer.getState();
    if(parseInt(playingTrackId, 10) === id && trackState === TrackPlayer.STATE_PLAYING) {
      this.setState({
        playing: true
      })
    }

    api.getPodcastEpisode({ id }).then((res) => {
      this.setState({
        loading: false,
        error: false,
        podcastEpisode: res.data
      }, () => {
        this.play();
      })
    }).catch((err) => {
      this.setState({
        loading: false,
        error: err
      })
    })
  }

  handleStateChange = async ({ state }) => {
    const { initialSeek } = this.state;
    if(state === TrackPlayer.STATE_PLAYING && !initialSeek) {
      const { navigation, trackId } = this.props;

      let id = navigation.getParam('id', null);
      if(trackId) {
        id = trackId;
      }

      let position = await db.getPodcastTimestamp(id);
      let duration = await TrackPlayer.getDuration();

      this.setState({
        initialSeek: true
      })

      await TrackPlayer.seekTo(position*duration);
      await TrackPlayer.play();
    }
  }

  componentDidMount = () => {
    this.getPodcastEpisode();
  }

  jumpForward = async () => {
    let currentPosition = await TrackPlayer.getPosition();
    TrackPlayer.seekTo(currentPosition + 30);
  }

  jumpBackward = async () => {
    let currentPosition = await TrackPlayer.getPosition();
    TrackPlayer.seekTo(currentPosition - 30);
  }

  seekTo = () => {

  }

  render() {
    const { colors } = this.props;
    const { error, loading, podcastEpisode, playing } = this.state;
    return (
      <ScreenContainer colors={colors}>
        {loading &&
          <Loading />
        }
        {error &&
          <Error error={error} />
        }
        {podcastEpisode &&
          <View style={styles.playerContainer}>
            <Image
              source={podcastImages[podcastEpisode.podcastId]}
              style={{
                width: width*.65,
                height: width*.65,
                borderRadius: 8,
                marginBottom: 16
              }}
            />
            <ProgressBar
              podcastEpisode={podcastEpisode}
              onSeek={this.seekTo}
            />
            <ScrollView style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  color: colors.text,
                  marginBottom: 8,
                  textAlign: 'center'
                }}
              >
                {podcastEpisode.title}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.caption,
                  textAlign: 'center'
                }}
              >
                {podcastEpisode.description}
              </Text>
            </ScrollView>
            <View style={styles.controlsContainer}>
              <TouchableOpacity
                onPress={this.jumpBackward}
              >
                <Icon color={colors.text} size={32} name="replay-30" />
              </TouchableOpacity>
              {!playing &&
                <TouchableOpacity
                  onPress={() => this.play()}
                >
                  <Icon color={colors.text} size={48} name="play-arrow" />
                </TouchableOpacity>
              }
              {playing &&
                <TouchableOpacity
                  onPress={() => this.pause()}
                >
                  <Icon color={colors.text} size={48} name="pause" />
                </TouchableOpacity>
              }
              <TouchableOpacity
                onPress={this.jumpForward}
              >
                <Icon color={colors.text} size={32} name="forward-30" />
              </TouchableOpacity>
            </View>
          </View>
        }
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(withNavigation(PodcastEpisode));;

const styles = StyleSheet.create({
  container: {

  },
  controlsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  playerContainer: {
    flex: 1,
    width: '100%',
    padding: 8,
    alignItems: 'center'
  }
})
