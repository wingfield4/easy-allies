import React, { Component } from 'react';
import {
  View
} from 'react-native';
import TrackPlayer from 'react-native-track-player';

import { db } from '../../db';

class PodcastProgressTracker extends Component {
  updateTimestamp = async () => {
    let duration = await TrackPlayer.getDuration();
    let position = await TrackPlayer.getPosition();
    let trackId = await TrackPlayer.getCurrentTrack();

    if(duration && position && trackId) {
      await db.updatePodcastTimestamp({
        podcastEpisodeId: trackId,
        position: position/duration
      })
    }
    
    setTimeout(this.updateTimestamp, 5000);
  }

  componentDidMount = async () => {
    this.updateTimestamp();
  }

  render() {
    return (
      <View />
    )
  }
}

export default PodcastProgressTracker;
