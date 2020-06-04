import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import api from '../../utilities/api';
import Error from '../common/Error';
import Loading from '../common/Loading';
import VideoCard from '../youtube/VideoCard';
import { db } from '../../db';

const { width } = Dimensions.get('window');

class VideoList extends Component {
  state = {
    loading: true,
    error: false,
    videos: null,
    refreshing: false,
    fullyLoaded: false,
    limit: 20,
    refreshed: false,
  }

  getVideos = () => {
    const { type, navigation } = this.props;
    const { videos, refreshing } = this.state;
    let { limit } = this.state;

    let playlistId = navigation.getParam('playlistId', null);

    if(playlistId) {
      api.getYouTubeVideos({
        offset: videos && !refreshing ? videos.length : 0,
        limit,
        playlistId
      }).then((res) => {
        this.setState({
          loading: false,
          error: false,
          refreshing: false,
          videos: !refreshing && videos ? videos.concat(res.data.rows) : res.data.rows,
          fullyLoaded: res.data.rows.length + (videos ? videos.length : 0) >= res.data.count
        })
      }).catch((err) => {
        this.setState({
          loading: false,
          refreshing: false,
          error: err
        })
      })
    } else {
      api.getRecentUploads({
        offset: videos && !refreshing ? videos.length : 0,
        limit
      }).then((res) => {
        this.setState({
          loading: false,
          error: false,
          refreshing: false,
          videos: !refreshing && videos ? videos.concat(res.data.rows) : res.data.rows,
          fullyLoaded: res.data.rows.length + (videos ? videos.length : 0) >= res.data.count
        })
      }).catch((err) => {
        this.setState({
          loading: false,
          refreshing: false,
          error: err
        })
      })
    }
  }

  componentDidMount = async () => {
    let timestamps = await db.getTimestamps();
    this.setState({
      timestamps
    }, () => {
      this.getVideos();
    })
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
      offset: 0
    }, () => {
      this.setState({
        refreshed: true
      }, () => {
        this.getVideos();
      })
    })
  }

  getPosition = (id) => {
    const { timestamps } = this.state;

    if(timestamps && timestamps.length > 0) {
      for(let i = 0; i < timestamps.length; i++) {
        if(timestamps[i].videoId === id) {
          return timestamps[i].position;
        }
      }
    }
    return null;
  }

  render() {
    const { colors, videoBaseURL } = this.props;
    const {
      loading,
      error,
      videos,
      refreshing,
      fullyLoaded
    } = this.state;

    return (
      <View>
        {loading &&
          <Loading />
        }
        {error &&
          <Error
            onRetry={() => {
              this.setState({
                loading: true
              }, () => {
                this.getVideos();
              })
            }}
          />
        }
        <FlatList
          ref={flatList => this.flatList = flatList}
          data={videos && videos.map((video, index) => ({ key: `${index}`, ...video }))}
          renderItem={({ item }) => (
            <VideoCard
              index={item.key}
              colors={colors}
              video={item}
              position={this.getPosition(item.id)}
            />
          )}
          onRefresh={this.handleRefresh}
          refreshing={refreshing}
          onEndReached={() => {
            if(videos && !fullyLoaded) {
              this.getVideos()
            }
          }}
          onEndReachedThreshold={.5}
          getItemLayout={(data, index) => ({
            length: (width*.55)+58, 
            offset: ((width*.55)+58) * index,
            index
          })}
        />
      </View>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(withNavigation(VideoList));
