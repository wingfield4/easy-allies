import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player'
import Text from '../common/Text';
import { connect } from 'react-redux';

import Loading from '../common/Loading';
import PodcastEpisode from './PodcastEpisode';
import ScreenContainer from '../common/ScreenContainer';

class NowPlaying extends Component {
  state = {
    loading: false,
    trackId: null
  }

  getTrackId = async () => {
    let trackId = await TrackPlayer.getCurrentTrack();

    if(trackId) {
      this.setState({
        trackId: parseInt(trackId, 10)
      })
    }

    setTimeout(this.getTrackId, 2000);
  }

  componentDidMount = () => {
    this.getTrackId();
  }

  render() {
    const { colors } = this.props;
    const { loading, trackId } = this.state;
    return (
      <React.Fragment>
        {loading &&
          <ScreenContainer colors={colors}>
            <Loading />
          </ScreenContainer>
        }
        {!loading && !trackId &&
          <ScreenContainer colors={colors}>
            <Text
              style={{
                fontSize: 24,
                color: colors.text,
                textAlign: 'center',
                marginTop: 16
              }}
            >
              Nothing is currently playing!
            </Text>
          </ScreenContainer>
        }
        {trackId &&
          <PodcastEpisode
            colors={colors}
            trackId={trackId}
          />
        }
      </React.Fragment>
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(NowPlaying);;
