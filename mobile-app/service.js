import TrackPlayer from 'react-native-track-player';

import { db } from './db';

module.exports = async function() {
  // This service needs to be registered for the module to work
// but it will be used later in the "Receiving Events" section

  TrackPlayer.addEventListener('remote-play', () => TrackPlayer.play());

  TrackPlayer.addEventListener('remote-pause', async () => {
    let duration = await TrackPlayer.getDuration();
    let position = await TrackPlayer.getPosition();
    let trackId = await TrackPlayer.getCurrentTrack();

    if(duration && position && trackId) {
      await db.updatePodcastTimestamp({
        podcastEpisodeId: trackId,
        position: position/duration
      })
    }

    TrackPlayer.pause();
  });

  TrackPlayer.addEventListener('remote-stop', async () => {
    let duration = await TrackPlayer.getDuration();
    let position = await TrackPlayer.getPosition();
    let trackId = await TrackPlayer.getCurrentTrack();

    if(duration && position && trackId) {
      await db.updatePodcastTimestamp({
        podcastEpisodeId: trackId,
        position: position/duration
      })
    }

    TrackPlayer.destroy()
  });

  TrackPlayer.addEventListener('remote-seek', ({ position }) => TrackPlayer.seekTo(position));

  TrackPlayer.addEventListener('remote-jump-forward', async ({ interval }) => {
    let currentPosition = await TrackPlayer.getPosition();
    TrackPlayer.seekTo(currentPosition + interval);
  });

  TrackPlayer.addEventListener('remote-jump-backward', async ({ interval }) => {
    let currentPosition = await TrackPlayer.getPosition();
    TrackPlayer.seekTo(currentPosition - interval);
  });
}