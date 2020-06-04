import { createStore, combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createEncryptor from 'redux-persist-transform-encrypt';
import storage from 'redux-persist/lib/storage'
import colors from './colors';

const encryptor = createEncryptor({
  secretKey: '27OMjfMmL54I40D6',
  onError: function(error) {
    console.log('error', error);
  }
})

const setColors = (state, action) => {
  if(!state) return colors.dark;

  switch (action.type) {
    case 'setLightColors':
      return colors.light;
    case 'setDarkColors':
      return colors.dark;
    default:
      return state;
  }
}

const setColorMode = (state, action) => {
  if(!state) return 'dark';

  switch (action.type) {
    case 'setLightColors':
      return 'light';
    case 'setDarkColors':
      return 'dark';
    default:
      return state;
  }
}

const setTrackId = (state, action) => {
  if(typeof(state) === 'undefined') return null;

  switch (action.type) {
    case 'setTrackId':
      return action.trackId;
    default:
      return state;
  }
}

const baseSetDeviceToken = (state, action) => {
  if(typeof(state) === 'undefined') return null;

  switch (action.type) {
    case 'setDeviceToken':
      return action.token;
    default:
      return state;
  }
}

const setDeviceToken = persistReducer(
  {
    key: 'deviceToken',
    storage,
    transforms: [encryptor]
  },
  baseSetDeviceToken
)

export default createStore(combineReducers({
  colors: setColors,
  colorMode: setColorMode,
  trackId: setTrackId,
  deviceToken: setDeviceToken
}));
