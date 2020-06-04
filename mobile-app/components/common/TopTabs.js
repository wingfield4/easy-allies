import React, { Component } from 'react';
import { MaterialTopTabBar } from 'react-navigation-tabs';
import { connect } from 'react-redux';

class BottomTabs extends Component {
  render() {
    const { colors, ...props } = this.props;
    return (
      <MaterialTopTabBar
        {...props}
        style={{
          backgroundColor: colors.background
        }}
        activeTintColor={colors.calendar}
        inactiveTintColor={colors.caption}
        upperCaseLabel={false}
        indicatorStyle={{
          backgroundColor: colors.calendar
        }}
      />
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(BottomTabs);
