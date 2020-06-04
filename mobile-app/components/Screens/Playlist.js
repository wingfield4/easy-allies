import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';

import VideoList from '../youtube/VideoList';
import ScreenContainer from '../common/ScreenContainer';

class Playlist extends Component {
  render() {
    const { navigation } = this.props;
    let playlistId = navigation.getParam('playlistId', null)
    return (
      <ScreenContainer>
        <VideoList
          playlistId={playlistId}
        /> 
      </ScreenContainer>
    )
  }
}

export default withNavigation(Playlist);
