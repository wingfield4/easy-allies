import React, { Component } from 'react';
import {
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import Error from '../common/Error';
import Loading from '../common/Loading';
import PodcastEpisode from '../podcasts/PodcastEpisode';
import ScreenContainer from '../common/ScreenContainer';
import api from '../../utilities/api';
import { db } from '../../db';

class Podcast extends Component {
  state = {
    loading: true,
    refreshing: false,
    error: false,
    podcastEpisodes: null,
    limit: 20,
    fullyLoaded: false
  }

  getPodcastEpisodes = async () => {
    const { navigation } = this.props;
    const { limit, podcastEpisodes, refreshing } = this.state;

    let podcastId = navigation.getParam('podcastId', null);

    let podcastTimestamps = await db.getPodcastTimestamps();

    api.getPodcastEpisodes({
      limit,
      offset: podcastEpisodes && !refreshing ? podcastEpisodes.length : 0,
      podcastId
    }).then((res) => {
      this.setState({
        refreshing: false,
        loading: false,
        error: false,
        podcastEpisodes: podcastEpisodes && !refreshing ? podcastEpisodes.concat(res.data.rows) : res.data.rows,
        fullyLoaded: podcastEpisodes ? (res.data.rows.length + podcastEpisodes.length) >= res.data.count : false,
        podcastTimestamps
      })
    }).catch((err) => {
      this.setState({
        refresing: false,
        loading: false,
        error: err
      })
    })
  }

  componentDidMount = () => {
    this.getPodcastEpisodes();
  }

  loadNextPage = () => {
    this.getPodcastEpisodes();
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this.getPodcastEpisodes();
    })
  }

  getPosition = (id) => {
    const { podcastTimestamps } = this.state;

    if(podcastTimestamps) {
      for(let i = 0; i < podcastTimestamps.length; i++) {
        if(podcastTimestamps[i].podcastEpisodeId === id) {
          return podcastTimestamps[i].position;
        }
      }
    }
    return null;
  }

  render() {
    const { colors, navigation, ...props } = this.props;
    const { loading, error, podcastEpisodes, refreshing, fullyLoaded } = this.state;

    return (
      <ScreenContainer colors={colors}>
        {loading && 
          <Loading />
        }
        {error &&
          <Error error={error} />
        }
        {podcastEpisodes &&
          <FlatList
            ref={flatList => this.flatList = flatList}
            data={podcastEpisodes && podcastEpisodes.map((podcastEpisode, index) => ({ key: `${index}`, ...podcastEpisode }))}
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
            onEndReached={() => {
              if(podcastEpisodes && !fullyLoaded) {
                this.loadNextPage()
              }
            }}
            onEndReachedThreshold={.5}
          />
        }
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(withNavigation(Podcast));;

const styles = StyleSheet.create({
  container: {

  }
})
