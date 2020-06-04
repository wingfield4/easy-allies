import React, { Component } from 'react';
import {
  FlatList,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigation, withNavigationFocus } from 'react-navigation';

import Error from '../common/Error';
import Loading from '../common/Loading';
import PodcastEpisode from '../podcasts/PodcastEpisode';
import ScreenContainer from '../common/ScreenContainer';
import api from '../../utilities/api';
import { db } from '../../db';

class PodcastHistory extends Component {
  state = {
    loading: true,
    error: false,
    podcastEpisodes: null,
    podcastTimestamps: null,
    refreshing: false
  }

  getPodcastEpisodes = async () => {
    let podcastTimestamps = await db.getPodcastTimestamps();

    if(podcastTimestamps) {
      this.setState({
        loading: true
      }, () => {
        api.getPodcastEpisodesById({
          ids: podcastTimestamps.map((podcastTimestamp) => podcastTimestamp.podcastEpisodeId)
        }).then((res) => {
          if(res.data.length > 0) {
            this.setState({
              loading: false,
              error: false,
              podcastEpisodes: res.data,
              refreshing: false,
              podcastTimestamps
            })
          } else {
            this.setState({
              loading: false,
              error: "Your History is Empty!",
              podcastEpisodes: null,
              refreshing: false,
              podcastTimestamps
            })
          }
        }).catch((err) => {
          this.setState({
            loading: false,
            error: err,
            refreshing: false,
            podcastTimestamps
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
    this.getPodcastEpisodes();
  }

  componentDidUpdate = (prevProps) => {
    const { isFocused } = this.props;
    if(isFocused && !prevProps.isFocused) {
      this.getPodcastEpisodes();
    }
  }

  getPosition = (id) => {
    const { podcastTimestamps } = this.state;

    for(let i = 0; i < podcastTimestamps.length; i++) {
      if(podcastTimestamps[i].podcastEpisodeId === id) {
        return podcastTimestamps[i].position;
      }
    }
    return null;
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this.getPodcastEpisodes();
    })
  }

  render() {
    const { colors, navigation } = this.props;
    const { loading, error, podcastEpisodes, refreshing } = this.state;
    return (
      <ScreenContainer>
        {loading &&
          <Loading />
        }
        {error &&
          <Error
            error={error}
            onRetry={() => {
              this.getPodcastEpisodes();
            }}
          />
        }
        {podcastEpisodes &&
          <FlatList
            ref={flatList => this.flatList = flatList}
            data={podcastEpisodes.map((podcastEpisode, index) => ({ key: `${index}`, ...podcastEpisode }))}
            renderItem={({ item }) => (
              <PodcastEpisode
                index={item.key}
                colors={colors}
                podcastEpisode={item}
                onPress={() => {
                  navigation.navigate('PodcastEpisode', {
                    id: item.id,
                    position: this.getPosition(item.id)
                  })
                }}
                position={this.getPosition(item.id)}
              />
            )}
            onRefresh={this.handleRefresh}
            refreshing={refreshing}
          />
        }
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(withNavigation(withNavigationFocus(PodcastHistory)));
