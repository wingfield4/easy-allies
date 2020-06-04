import React, { Component } from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import Text from '../common/Text';
import moment from 'moment';
import Icon from 'react-native-vector-icons';

class EventDay extends Component {
  render() {
    const { colors, eventDay } = this.props;
    return (
      <View
        style={{
          ...styles.container,
          borderColor: colors.caption
        }}
      >
        <View
          style={{
            ...styles.header,
            backgroundColor: colors.background
          }}
        >
          <Text
            style={{
              ...styles.title,
              color: colors.text
            }}
          >
            {moment(eventDay.day).format('dddd, MMMM Do')}
          </Text>
        </View>
        <View
          style={{
            ...styles.eventsContainer,

          }}
        >
          {eventDay.events.map((event, index) => (
            <View
              key={index}
              style={{
                marginBottom: 8
              }}
            >
              <Text
                style={{
                  color: colors.calendar,
                  fontSize: 16
                }}
              >
                {event.summary}
              </Text>
              <Text
                style={{
                  color: colors.text
                }}
              >
                {`${moment(event.start.dateTime).format('ha')} `}
                {!moment(event.end.dateTime).isSame(moment(event.start.dateTime), 'hour') && `- ${moment(event.end.dateTime).format('ha')} `}
                on {event.location}
              </Text>
              <Text
                style={{
                  color: colors.caption,
                  fontSize: 12
                }}
              >
                {event.description}
              </Text>
            </View>
          ))}
        </View>
      </View>
    )
  }
}

export default EventDay;

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    borderRadius: 0,
    borderWidth: 1
  },
  eventsContainer: {
    padding: 8
  },
  header: {
    padding: 8,
    borderRadius: 0
  },
  title: {
    fontSize: 16
  }
})