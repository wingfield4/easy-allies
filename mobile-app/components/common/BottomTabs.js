import React, { Component } from 'react';
import { BottomTabBar } from 'react-navigation-tabs';
import { connect } from 'react-redux';

class BottomTabs extends Component {
  render() {
    const { colors, ...props } = this.props;
    return (
      <BottomTabBar
        {...props}
        style={{
          backgroundColor: colors.background
        }}
        activeTintColor={colors.calendar}
      />
    )
  }
}

export default connect(state => ({
  colors: state.colors
}))(BottomTabs);
