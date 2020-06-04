import axios from 'axios';

const BASE_URL = 'https://disco-glass-214019.appspot.com/api/v1';

export default {
  getYouTubeVideos({ limit, offset, playlistId }) {
    return axios.get(`${BASE_URL}/youtube/playlistItems?playlistId=${playlistId}${limit ? `&limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`)
  },
  getYouTubePlaylists({ limit, offset, channelId }) {
    return axios.get(`${BASE_URL}/youtube/playlists?${channelId ? `&channelId=${channelId}` : ''}${limit ? `&limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`)
  },
  getYouTubeVideo({ videoId }) {
    return axios.get(`${BASE_URL}/youtube/video/${videoId}`);
  },
  getRecentUploads({ offset, limit }) {
    return axios.get(`${BASE_URL}/youtube/recentUploads?${limit ? `&limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`)
  },
  getVideosById({ ids }) {
    return axios.post(`${BASE_URL}/youtube/videosById`, {
      ids
    })
  },
  getCalendarEvents() {
    return axios.get(`${BASE_URL}/calendar`)
  },
  //twitch knows what's up
  getTwitchInfo() {
    return axios.get(`${BASE_URL}/twitch`)
  },
  getTwitchGame(id) {
    return axios.get(`${BASE_URL}/twitch/games/${id}`)
  },
  getTweets({ limit, offset }) {
    return axios.get(`${BASE_URL}/twitter/statuses?${limit ? `&limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`)
  },
  getPodcasts({ limit, offset }) {
    return axios.get(`${BASE_URL}/podcasts/getPodcasts?${limit ? `&limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`)
  },
  getPodcastEpisodes({ limit, offset, podcastId }) {
    return axios.get(`${BASE_URL}/podcasts/getPodcastEpisodes?podcastId=${podcastId}${limit ? `&limit=${limit}` : ''}${offset ? `&offset=${offset}` : ''}`)
  },
  getPodcastEpisode({ id }) {
    return axios.get(`${BASE_URL}/podcasts/getPodcastEpisode/${id}`)
  },
  getPodcastEpisodesById({ ids }) {
    return axios.post(`${BASE_URL}/podcasts/podcastEpisodesById`, {
      ids
    })
  },
  registerDevice({ token }) {
    return axios.post(`${BASE_URL}/notifications/registerDevice`, {
      token
    })
  },
  getDeviceSettings({ token }) {
    return axios.post(`${BASE_URL}/notifications/getDeviceSettings`, {
      token
    })
  },
  updateDeviceSettings({ token, twitchEnabled, podcastEnabled, youtubeEnabled }) {
    return axios.post(`${BASE_URL}/notifications/updateDeviceSettings`, {
      token,
      twitchEnabled,
      podcastEnabled,
      youtubeEnabled
    })
  }
}
