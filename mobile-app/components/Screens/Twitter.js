import React, { Component } from 'react';
import {
  Platform,
  FlatList,
  Text,
  StyleSheet,
  View
} from 'react-native';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

import ScreenContainer from '../common/ScreenContainer';
import Tweet from '../twitter/Tweet';
import Error from '../common/Error';
import Loading from '../common/Loading';
import api from '../../utilities/api';

class Twitter extends Component {
  state = {
    loading: true,
    error: false,
    tweets: null,
    limit: 20,
    offset: 0,
    totalItems: null,
    refreshing: false
  }

  getTweets = () => {
    const { limit, offset, tweets, refreshing } = this.state;

    this.setState({
      loading: true
    }, () => {
      api.getTweets({ limit, offset }).then((res) => {
        this.setState({
          loading: false,
          error: false,
          tweets: !refreshing && tweets ? tweets.concat(res.data.rows) : res.data.rows,
          offset: offset + res.data.rows.length,
          totalItems: res.data.count,
          refreshing: false
        })
      }).catch((err) => {
        this.setState({
          loading: false,
          error: err,
          refreshing: false
        })
      })
    })
  }

  componentDidMount = () => {
    this.getTweets();
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true,
      offset: 0
    }, () => {
      this.getTweets();
    })
  }

  render() {
    const { colors, isFocused } = this.props;
    const { loading, error, tweets, totalItems, refreshing } = this.state;
    if(!isFocused && Platform.OS === 'android') {
      console.log('SKJDHFKLSJHDF');
      return (
        <React.Fragment />
      )
    }
    return (
      <ScreenContainer>
        <View style={styles.container}>
          {loading && !tweets &&
            <Loading />
          }
          {error &&
            <Error
              error={error}
              onRetry={() => {
                this.getTweets();
              }}
            />
          }
          {tweets &&
            <FlatList
              data={tweets.map((tweet, index) => ({ key: `${index}`, ...tweet }))}
              renderItem={({ item }) => (
                <Tweet
                  colors={colors}
                  tweet={item}
                />
              )}
              onEndReached={() => {
                if(tweets.length < totalItems) {
                  this.getTweets();
                }
              }}
              onEndReachedThreshold={.5}
              onRefresh={this.handleRefresh}
              refreshing={refreshing}
            />
          }
        </View>
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(withNavigationFocus(Twitter));

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
    flex: 1
  }
})
