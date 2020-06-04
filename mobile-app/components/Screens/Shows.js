import React, { Component } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import PlaylistCard from '../archive/PlaylistCard';
import Loading from '../common/Loading';
import Error from '../common/Error';
import api from '../../utilities/api';
import ScreenContainer from '../common/ScreenContainer';

const { width, height } = Dimensions.get('window');

class Shows extends Component {
  state = {
    loading: true,
    error: false,
    playlists: null,
    totalItems: 0,
    limit: 150,
    offset: 0,
    searchText: '',
    submittedText: ''
  }

  getPlaylists = () => {
    const { playlists, limit } = this.state;

    api.getYouTubePlaylists({
      offset: playlists ? playlists.length : 0,
      limit
    }).then((res) => {
      this.setState({
        loading: false,
        error: false,
        playlists: playlists ? playlists.concat(res.data.rows) : res.data.rows,
        totalItems: res.data.count
      })
    }).catch((err) => {
      this.setState({
        loading: false,
        error: err
      })
    })
  }

  componentDidMount = () => {
    this.getPlaylists();
  }

  render() {
    const { colors } = this.props;
    const {
      loading,
      error,
      playlists,
      refreshing,
      searchText,
      submittedText
    } = this.state;

    return (
      <ScreenContainer>
        <View
          style={{
            borderColor: colors.caption,
            borderWidth: 1,
            flexDirection: 'row',
            width,
            padding: 4
          }}
        >
          <Icon size={20} color={colors.caption} name="magnify" />
          <TextInput
            style={{
              width: '100%',
              paddingLeft: 8,
              paddingRight: 8,
              padding: 0,
              margin: 0,
              color: colors.text,
              flex: 1,
              fontSize: 14,
              borderWidth: 0
            }}
            onChangeText={(searchText) => this.setState({ searchText })}
            value={searchText}
            placeholder="Search..."
            placeholderTextColor={colors.caption}
            onBlur={() => {
              this.setState({
                submittedText: searchText
              })
            }}
            autoCapitalize='none'
            autoCorrect={false}
          />
          <TouchableOpacity
            onPress={() => {
              this.setState({
                searchText: '',
                submittedText: ''
              })
            }}
          >
            <Icon size={20} color={colors.caption} name="close" />
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          {loading &&
            <Loading />
          }
          {error &&
            <Error
              onRetry={() => {
                this.setState({
                  loading: true
                }, () => {
                  this.getPlaylists();
                })
              }}
            />
          }
          <FlatList
            ref={flatList => this.flatList = flatList}
            data={playlists && 
              playlists
              .filter((playlist) => playlist.title.toLowerCase().includes(submittedText.toLowerCase()))
              .map((playlist, index) => ({ key: `${index}`, ...playlist }))
            }
            renderItem={({ item }) => (
              <PlaylistCard
                index={item.key}
                colors={colors}
                playlist={item}
              />
            )}
            onEndReached={() => {
              if(playlists) {
                this.getPlaylists();
              }
            }}
            onEndReachedThreshold={.5}
            // getItemLayout={(data, index) => ({
            //   length: (width*.55)+58, 
            //   offset: ((width*.55)+58) * index,
            //   index
            // })}
          />
        </View>
      </ScreenContainer>
    )
  }
}

export default connect(state => ({
  colors: state.colors,
  colorMode: state.colorMode
}))(Shows);

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  text: {
    
  }
})
