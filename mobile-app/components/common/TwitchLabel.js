import React, { Component } from 'react';
import {
  View
} from 'react-native';
import Text from './Text';
import { connect } from 'react-redux';
import api from '../../utilities/api';

class TwitchStatus extends Component {
  state = {
    isLive: false
  }

  checkStatus = () => {
    api.getTwitchInfo().then((res) => {
      this.setState({
        isLive: res.data && Boolean(res.data.startedAt)
      })
    }).catch((err) => {
      this.setState({
        isLive: false
      })
    })

    setTimeout(this.checkStatus, 10000);
  }

  componentDidMount = () => {
    this.checkStatus();
  }

  render() {
    const { colors, tintColor, ...props } = this.props;
    const { isLive } = this.state;

    return (
      <View>
        {isLive &&
          <View
            style={{
              width: '100%',
              alignItems: 'center'
            }}
          >
            <View
              style={{
                width: 44,
                height: 16,
                borderRadius: 8,
                backgroundColor: colors.calendar,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'white'
              }}
            >
              <Text
                style={{
                  color: 'white',
                  fontSize: 12
                }}
              >
                LIVE
              </Text>
            </View>
          </View>
        } 
        {!isLive &&
          <Text
            style={{
              color: tintColor,
              fontSize: 12,
              textAlign: 'center'
            }}
          >
            Twitch
          </Text>
        }
      </View>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(TwitchStatus);
