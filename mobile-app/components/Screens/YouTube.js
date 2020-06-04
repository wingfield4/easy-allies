import React, { Component } from 'react';

import VideoList from '../youtube/VideoList';
import ScreenContainer from '../common/ScreenContainer';

class YouTube extends Component {
  render() {
    return (
      <ScreenContainer>
        <VideoList />
      </ScreenContainer>
    )
  }
}

export default YouTube;
