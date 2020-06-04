import React, { Component } from 'react';
import {
  Dimensions,
  View,
  StyleSheet
} from 'react-native';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';

import ScreenContainer from '../common/ScreenContainer'

const { height, width } = Dimensions.get('window');

class Player extends Component {
  render() {
    const { colorMode } = this.props;
    return (
      <ScreenContainer>
        <View
          style={{
            width,
            height: '100%'
          }}
        >
          <WebView
            source={{
              html: `
              <html>
                <head>
                  <meta name="viewport" content="initial-scale=0.9, maximum-scale=0.9">
                </head>
                <body>
                  <!-- Add a placeholder for the Twitch embed -->
                  <div id="twitch-embed" style="margin: -8px; height: 100%; padding: 0px; position: absolute; width: 100%;"></div>

                  <!-- Load the Twitch embed script -->
                  <script src="https://embed.twitch.tv/embed/v1.js"></script>

                  <!-- Create a Twitch.Embed object that will render within the "twitch-embed" root element. -->
                  <script type="text/javascript">
                    new Twitch.Embed("twitch-embed", {
                      width: '100%',
                      height: '100%',
                      channel: "easyallies",
                      allowfullscreen: true,
                      chat: 'mobile',
                      theme: '${colorMode}'
                    });
                  </script>
                </body>
              </html>
              `
            }}
            allowsInlineMediaPlayback={true}
            style={styles.container}
            scalesPageToFit={false}
            bounces={false}
            mediaPlaybackRequiresUserAction={false}
            scrollEnabled={false}
          />
        </View>
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(Player);

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%'
  }
})
