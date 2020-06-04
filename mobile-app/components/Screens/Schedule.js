import React, { Component } from 'react';
import {
  Platform,
  FlatList,
  StyleSheet,
  View
} from 'react-native';
import api from '../../utilities/api';
import { connect } from 'react-redux';
import { withNavigationFocus } from 'react-navigation';

import ScreenContainer from '../common/ScreenContainer';
import EventDay from '../calendar/EventDay';
import Loading from '../common/Loading';
import Error from '../common/Error';
import moment from 'moment';

class Schedule extends Component {
  state = {
    loading: true,
    error: false,
    eventDays: null,
    refreshing: false
  }

  organizeEvents = (events) => {
    let eventDays = [];

    for(let i = 0; i < 31; i++) {
      eventDays.push({
        day: moment().add(i, 'day'),
        events: []
      })
    }

    eventDays.forEach((eventDay) => {
      events.forEach((event) => {
        if(moment(event.start.dateTime).isSame(eventDay.day, 'day')) {
          eventDay.events.push(event);
        }
      })
    })

    eventDays = eventDays.filter((eventDay) => eventDay.events.length > 0);

    eventDays.forEach((eventDay) => {
      eventDay.events.sort((a, b) => {
        if(a.start.dateTime < b.start.dateTime) return -1;
        if(a.start.dateTime > b.start.dateTime) return 1;
        return 0
      })
    })

    this.setState({
      loading: false,
      error: false,
      eventDays,
      refreshing: false
    })
  }

  getSchedule = () => {
    this.setState({
      loading: true
    }, () => {
      api.getCalendarEvents().then((res) => {
        if(res.data && res.data.items && res.data.items.length > 0) {
          this.organizeEvents(res.data.items);
        } else {
          this.setState({
            loading: false,
            error: "No Events Found",
            refreshing: false
          })
        }
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
    this.getSchedule();
  }

  handleRefresh = () => {
    this.setState({
      refreshing: true
    }, () => {
      this.getSchedule();
    })
  }

  render() {
    const { colors, isFocused } = this.props;
    const {
      loading,
      error,
      eventDays,
      refreshing
    } = this.state;
    if(!isFocused && Platform.OS === 'android') {
      console.log('SKJDHFKLSJHDF');
      return (
        <React.Fragment />
      )
    }
    return (
      <ScreenContainer>
        <View style={styles.container}>
          {loading && !refreshing && 
            <Loading />
          }
          {error && !loading && 
            <Error
              error={error}
              onRetry={() => {
                this.getSchedule()
              }}
            />
          }
          {eventDays &&
            <FlatList
              data={eventDays.map((eventDay, index) => ({ key: `${index}`, ...eventDay }))}
              renderItem={({ item }) => (
                <EventDay
                  colors={colors}
                  eventDay={item}
                />
              )}
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
}))(withNavigationFocus(Schedule));

const styles = StyleSheet.create({
  container: {
    paddingLeft: 8,
    paddingRight: 8,
    flex: 1
  }
})
