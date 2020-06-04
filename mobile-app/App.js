import React, { Component } from 'react';
import {
  AsyncStorage,
  Platform
} from 'react-native';
import { Provider } from 'react-redux';
import TrackPlayer from 'react-native-track-player';

import ColorManager from './components/common/ColorManager';
import Notifications from './components/common/Notifications';
import PodcastProgressTracker from './components/common/PodcastProgressTracker';
import Screens from './components/Screens';
import StatusBar from './components/common/StatusBar';
import store from './utilities/store';
import { db } from './db';

class App extends Component {
  componentDidMount = async () => {
    // TrackPlayer.setupPlayer().then((res) => {
    //   TrackPlayer.updateOptions({
    //     compactCapabilities: [
    //       TrackPlayer.CAPABILITY_PAUSE,
    //       TrackPlayer.CAPABILITY_PLAY,
    //       TrackPlayer.CAPABILITY_STOP,
    //       TrackPlayer.CAPABILITY_JUMP_FORWARD,
    //       TrackPlayer.CAPABILITY_JUMP_BACKWARD,
    //       TrackPlayer.CAPABILITY_SEEK_TO
    //     ],
    //     capabilities: [
    //       TrackPlayer.CAPABILITY_PAUSE,
    //       TrackPlayer.CAPABILITY_PLAY,
    //       TrackPlayer.CAPABILITY_STOP,
    //       TrackPlayer.CAPABILITY_JUMP_FORWARD,
    //       TrackPlayer.CAPABILITY_JUMP_BACKWARD,
    //       TrackPlayer.CAPABILITY_SEEK_TO
    //     ]
    //   })
    // });

    let dbVersion = await AsyncStorage.getItem('dbVersion');

    if(dbVersion !== '1') {
      await AsyncStorage.setItem('dbVersion', '1');
      await db.down();
    }
    await db.up();
  }

  render() {
    return (
      <Provider store={store}>
        <ColorManager />
        {Platform.OS === 'ios' &&
          <Notifications />
        }
        <PodcastProgressTracker />
        <StatusBar />
        <Screens />
      </Provider>
    )
  }
}

export default App;
