import React, { Component } from 'react';
import { Platform } from 'react-native';
import { withNavigationFocus } from 'react-navigation';

import Video from '../youtube/Video';

class VideoContainer extends Component {
  render() {
    const { isFocused, ...props } = this.props;
    //re-renders on tab change or YouTube breaks on android
    return (
      <React.Fragment>
        {(isFocused || Platform.OS === 'ios') &&
          <Video {...props} />
        }
      </React.Fragment>
    )
  }
}

export default withNavigationFocus(VideoContainer);