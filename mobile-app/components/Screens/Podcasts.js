import React, { Component } from 'react';
import {
  FlatList
} from 'react-native';
import ScreenContainer from '../common/ScreenContainer';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux';

import Error from '../common/Error';
import Loading from '../common/Loading';
import Podcast from '../podcasts/Podcast';
import api from '../../utilities/api';

class Podcasts extends Component {
  state = {
    loading: true,
    error: false,
    podcasts: null
  }

  getPodcasts = () => {
    this.setState({
      loading: true
    }, () => {
      api.getPodcasts({}).then((res) => {
        this.setState({
          loading: false,
          error: false,
          podcasts: res.data.rows
        })
      }).catch((err) => {
        this.setState({
          loading: false,
          error: err
        })
      })
    })
  }

  componentDidMount = () => {
    this.getPodcasts();
  }

  render() {
    const { colors, navigation, ...props } = this.props;
    const { loading, error, podcasts } = this.state;
    return (
      <ScreenContainer colors={colors} {...props}>
        {loading &&
          <Loading />
        }
        {error &&
          <Error
            error={error}
            onRetry={() => {
              this.getPodcasts();
            }}
          />
        }
        {podcasts &&
          <FlatList
            ref={flatList => this.flatList = flatList}
            data={podcasts && podcasts.map((podcast, index) => ({ key: `${index}`, ...podcast }))}
            renderItem={({ item }) => (
              <Podcast
                index={item.key}
                colors={colors}
                podcast={item}
                onPress={() => {
                  navigation.navigate('Podcast', {
                    podcastId: item.id
                  })
                }}
              />
            )}
          />
        }
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(withNavigation(Podcasts));
