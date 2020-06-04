import React, { Component } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  View
} from 'react-native';
import Text from '../common/Text';
import TrackPlayer from 'react-native-track-player';
import { connect } from 'react-redux';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');
const barWidth = width*.65;

class ProgressBar extends TrackPlayer.ProgressComponent {
  state = {
    trackId: null,
    position: 0,
    duration: 0,
    gestureActive: false
  }

  _lastOffset = { x: 0 };
  _translateX = new Animated.Value(0);
  _onPanGestureEvent = Animated.event([{nativeEvent: {translationX: this._translateX}}]);
  _onHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._lastOffset.x += event.nativeEvent.translationX;
      this._translateX.setOffset(this._lastOffset.x);
      this._translateX.setValue(0);

      const { trackId, podcastEpisode } = this.props;
      const { duration } = this.state;
      if(trackId === podcastEpisode.id) {
        let percent = this._lastOffset.x/barWidth
        TrackPlayer.seekTo(percent*duration);
      } else {
        this._translateX.setOffset(0);
      }
    } 
    
    if(event.nativeEvent.state === State.ACTIVE) {
      this.setState({
        gestureActive: true
      })
    } else {
      this.setState({
        gestureActive: false
      })
    }
  };

  formatTime = (time) => {
    const { position, duration, gestureActive } = this.state;
    //while we're at it, keep our gesture offset up-to-date
    if(!gestureActive) {
      this._lastOffset.x = (position/duration)*barWidth;
      this._translateX.setOffset((position/duration)*barWidth);
    }

    let totalSeconds = parseInt(time, 10);
    let hours   = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
    let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

    if (hours < 10) hours = `0${hours}`
    if (minutes < 10) minutes = `0${minutes}`
    if (seconds < 10) seconds = `0${seconds}`
    return `${hours}:${minutes}:${seconds}`;
  }

  render() {
    const { colors, podcastEpisode, trackId } = this.props;
    const { duration, position, gestureActive } = this.state;

    return (
      <View
        style={{
          width: barWidth
        }}
      >
        <View
          style={{
            width: '100%',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginBottom: 6
          }}
        >
          {trackId === podcastEpisode.id && duration !== 0 &&
            <React.Fragment>
              <Text
                style={{
                  color: colors.caption,
                  fontSize: 14
                }}
              >
                {this.formatTime(position)}
              </Text>
              <Text
                style={{
                  color: colors.caption,
                  fontSize: 14
                }}
              >
                {this.formatTime(duration)}
              </Text>
            </React.Fragment>
          }
        </View>
        <View
          style={{
            ...styles.container
          }}
        >
          <View
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: 4,
              borderRadius: 2,
              width: barWidth,
              backgroundColor: colors.caption
            }}
          />
          {trackId === podcastEpisode.id &&
            <React.Fragment>
              <View
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: 4,
                  borderRadius: 2,
                  width: this.getProgress()*barWidth,
                  backgroundColor: colors.text
                }}
              />
            </React.Fragment>
          }
          <PanGestureHandler
            onGestureEvent={this._onPanGestureEvent}
            onHandlerStateChange={this._onHandlerStateChange}
          >
            <Animated.View
              style={[{
                //position: 'absolute',
                //left: trackId === podcastEpisode.id ? this.getProgress()*width*.75 - 5 : -5,
                //left: -6,
                top: -6,
                backgroundColor: colors.text,
                height: 16,
                width: 16,
                borderRadius: 8,
                borderColor: colors.text
              }, {
                transform: [
                  {
                    translateX: gestureActive ? Animated.add(this._translateX, new Animated.Value(0)).interpolate({
                      inputRange: [-5000, 0, barWidth-5, 5000],
                      outputRange: [0, 0, barWidth-5, barWidth-5],
                    }) : trackId === podcastEpisode.id ? this.getProgress()*barWidth - 5 : -5
                  }
                ]
              }]}
            />
          </PanGestureHandler>
        </View>
      </View>
    );
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode,
  trackId: state.trackId
}))(ProgressBar);

const styles = StyleSheet.create({
  container: {
    width: barWidth,
    height: 4,
    borderRadius: 2,
    marginBottom: 8
  }
})
