import React, { Component } from 'react';
import {
  createBottomTabNavigator,
  createMaterialTopTabNavigator,
  createStackNavigator,
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Text from '../common/Text';

import About from './About';
import ContinueWatching from './ContinueWatching';
import NowPlaying from './NowPlaying';
import Settings from './Settings';
import Playlist from './Playlist';
import PodcastHistory from './PodcastHistory';
import Podcasts from './Podcasts';
import Podcast from './Podcast';
import PodcastEpisode from './PodcastEpisode';
import Schedule from './Schedule';
import Shows from './Shows';
import Twitch from './Twitch';
import TwitchWebView from './TwitchWebView';
import Twitter from './Twitter';
import Video from './Video';
import YouTube from './YouTube';

import BottomTabs from '../common/BottomTabs';
import TopTabs from '../common/TopTabs';
import TwitchLabel from '../common/TwitchLabel';
import colors from '../../utilities/colors';
import myNavigationOptions from '../../utilities/myNavigationOptions';

const ShowsStack = () => createStackNavigator({
  Shows,
  Playlist
}, {
  defaultNavigationOptions: () => ({
    header: null
  })
})

const RecentUploadsStack = () => createStackNavigator({
  YouTube
}, {
  defaultNavigationOptions: () => ({
    header: null
  })
})

const ContinueWatchingStack = () => createStackNavigator({
  ContinueWatching
}, {
  defaultNavigationOptions: () => ({
    header: null
  })
})

const YouTubeTabsStack = () => createMaterialTopTabNavigator({
  "Recent": RecentUploadsStack(),
  "Shows": ShowsStack(),
  "History": ContinueWatchingStack()
}, {
  tabBarComponent: (props) => <TopTabs {...props} />,
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state;
      if(routeName === 'Recent Uploads') {
        return <Icon name="youtube" size={24} color={tintColor} />
      } else {
        return <Icon name="video" size={24} color={tintColor} />
      }
    }
  })
})

const YouTubeStack = () => createStackNavigator({
  Home: YouTubeTabsStack(),
  Video
}, {
  defaultNavigationOptions: () => ({
    header: null
  })
})

const TwitchStack = () => createStackNavigator({
  Home: Twitch,
  WebView: TwitchWebView
}, {
  defaultNavigationOptions: () => ({
    header: null
  })
})

const ScheduleStack = () => createStackNavigator({
  Home: Schedule
}, {
  defaultNavigationOptions: () => ({
    header: null
  })
})

const TwitterStack = () => createStackNavigator({
  Home: Twitter
}, {
  defaultNavigationOptions: () => ({
    header: null
  })
})

const PodcastShowsStack = () => createStackNavigator({
  Podcasts,
  Podcast
}, {
  defaultNavigationOptions: () => ({
    header: null
  })
})

const PodcastTabsStack = () => createMaterialTopTabNavigator({
  "Shows": PodcastShowsStack(),
  "History": PodcastHistory
}, {
  tabBarComponent: (props) => <TopTabs {...props} />
})

const PodcastsStack = () => createStackNavigator({
  Home: PodcastTabsStack(),
  PodcastEpisode,
  NowPlaying
}, {
  defaultNavigationOptions: () => ({
    header: null
  })
});

const TabsStack = () => createBottomTabNavigator({
  Schedule: ScheduleStack(),
  Twitter: TwitterStack(),
  Twitch: {
    screen: TwitchStack(),
    navigationOptions: {
      tabBarLabel: (props) => (
        <TwitchLabel {...props} />
      )
    }
  },
  Podcasts: PodcastsStack(),
  YouTube: YouTubeStack(),
}, {
  tabBarComponent: (props) => <BottomTabs {...props} />,
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      const { routeName } = navigation.state;
      if(routeName === 'YouTube') {
        return <Icon name="youtube" size={24} color={tintColor} />
      } else if(routeName === 'Twitch') {
        return <Icon name="twitch" size={24} color={tintColor} />
      } else if(routeName === 'Schedule') {
        return <Icon name="calendar" size={24} color={tintColor} />
      } else if (routeName === "Twitter") {
        return <Icon name="twitter" size={24} color={tintColor} />
      } else {
        return <Icon name="podcast" size={24} color={tintColor} />
      }
    }
  })
});

const MainStack = () => createStackNavigator({
  MainHome: {
    screen: TabsStack()
  },
  About,
  Settings
}, {
  defaultNavigationOptions: () => myNavigationOptions()
})

const navigation = props => createAppContainer(MainStack());

export default navigation();