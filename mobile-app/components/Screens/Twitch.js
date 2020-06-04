import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet
} from 'react-native';
import { connect } from 'react-redux';

import Offline from '../twitch/Offline';
import Info from '../twitch/Info';
import Error from '../common/Error';
import Loading from '../common/Loading';
import api from '../../utilities/api';
import ScreenContainer from '../common/ScreenContainer';

class Twitch extends Component {
  state = {
    loading: true,
    error: false,
    info: null,
    openWebView: false
  }

  getTwitchInfo = () => {
    api.getTwitchInfo().then((res) => {
      this.setState({
        loading: false,
        error: false,
        info: res.data
      })
    }).catch((err) => {
      this.setState({
        loading: false,
        error: err,
        info: null
      })
    })

    setTimeout(this.getTwitchInfo, 10000);
  }

  componentDidMount = () => {
    this.getTwitchInfo();
  }

  render() {
    const { colors } = this.props;
    const {
      loading,
      error,
      info
    } = this.state;
    return (
      <ScreenContainer>
        <ScrollView contentContainerStyle={styles.container}>
          {!loading && (!info || !info.startedAt) &&
            <Offline colors={colors} />
          }
          {info && info.startedAt &&
            <Info
              info={info}
              colors={colors}
            />
          }
          {loading && 
            <Loading />
          }
        </ScrollView>
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(Twitch);

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
