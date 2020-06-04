import React, { Component } from 'react';
import { PushNotificationIOS, View } from 'react-native';
import { connect } from 'react-redux';
import api from '../../utilities/api';

class Notifications extends Component {
  componentDidMount = () => {
    const { dispatch } = this.props;

    PushNotificationIOS.addEventListener('register', token => {
      api.registerDevice({ token });
      dispatch({
        type: 'setDeviceToken',
        token
      });
    })

    PushNotificationIOS.addEventListener('registrationError', registrationError => {
      console.log(registrationError, '--')
    })

    // PushNotificationIOS.addEventListener('notification', function(notification) {
    //   if (!notification) {
    //     return
    //   }
    //   history.push('/twitch');
    // })

    PushNotificationIOS.getInitialNotification().then(notification => {
      if (!notification) {
        return
      }
      //navigation.navigate('Twitch');
    })
    
    PushNotificationIOS.requestPermissions()
  }

  render() {
    return (
      <View />
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode,
  deviceToken: state.deviceToken
}))(Notifications);
