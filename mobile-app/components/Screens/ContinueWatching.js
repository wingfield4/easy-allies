import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import { withNavigationFocus } from 'react-navigation';
import Text from '../common/Text';
import { connect } from 'react-redux';

import Error from '../common/Error';
import Loading from '../common/Loading';
import ScreenContainer from '../common/ScreenContainer';
import VideoCard from '../youtube/VideoCard';
import api from '../../utilities/api';
import { db } from '../../db';

class ContinueWatching extends Component {
  state = {
    loading: true,
    error: false,
    videos: null,
    refreshing: false
  }

  getVideos = async () => {
    let timestamps = await db.getTimestamps();
    //alert(JSON.stringify(timestamps));

    if(timestamps) {
      this.setState({
        loading: true
      }, () => {
        api.getVideosById({
          ids: timestamps.map((timestamp) => timestamp.videoId)
        }).then((res) => {
          if(res.data.length > 0) {
            this.setState({
              loading: false,
              error: false,
              videos: res.data,
              refreshing: false,
              timestamps
            })
          } else {
            this.setState({
              loading: false,
              error: "Your History is Empty!",
              videos: null,
              refreshing: false,
              timestamps
            })
          }
        }).catch((err) => {
          this.setState({
            loading: false,
            error: err,
            refreshing: false
          })
        })
      })
    } else {
      this.setState({
        loading: false,
        error: "Your History is Empty!",
        refreshing: false
      })
    }
  }

  componentDidMount = () => {
    this.getVideos();
  }

  componentDidUpdate = (prevProps) => {
    const { isFocused } = this.props;
    if(isFocused && !prevProps.isFocused) {
      this.getVideos();
    }
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this.getVideos();
    })
  }

  getPosition = (id) => {
    const { timestamps } = this.state;

    for(let i = 0; i < timestamps.length; i++) {
      if(timestamps[i].videoId === id) {
        return timestamps[i].position;
      }
    }
    return null;
  }

  render() {
    const { colors } = this.props;
    const { loading, error, videos, refreshing, timestamps } = this.state;
    return (
      <ScreenContainer>
        {loading &&
          <Loading />
        }
        {error &&
          <Error
            error={error}
            onRetry={() => {
              this.getVideos();
            }}
          />
        }
        {videos &&
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
            // getItemLayout={(data, index) => ({
            //   length: (width*.55)+58, 
            //   offset: ((width*.55)+58) * index,
            //   index
            // })}
          />
        }
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(withNavigationFocus(ContinueWatching));