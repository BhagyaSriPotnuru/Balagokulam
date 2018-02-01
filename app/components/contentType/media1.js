import React, { Component, PropTypes } from 'react'
import {
  ScrollView,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import Carousel from 'react-native-carousel'
import { Player, ReactNativeAudioStreaming } from 'react-native-audio-streaming'
import styles from '../../utils/Styles'
import Colors from '../../utils/Colors'
import VideoPlayer from '../VideoPlayer'
import {
  changeVideo,
  changeAudio,
} from '../../actions/ValEduActions'

let currentVideo
let currentAudio

class Media extends Component {

  getNextVideo = (position) => {
    if (this.props.videos) {
      if (this.props.videos[position]) {
        currentVideo = this.props.videos[position].split('v=')[1]
        const ampersandPosition = currentVideo.indexOf('&')
        if (ampersandPosition != -1) {
          currentVideo = currentVideo.substring(0, ampersandPosition)
        }
        this.props.dispatch(changeVideo(currentVideo))
      }
    }
  }

  getNextAudio = (position) => {
    ReactNativeAudioStreaming.stop()
    if (this.props.audios) {
      if (this.props.audios[position]) {
        currentAudio = this.props.audios[position]
        this.props.dispatch(changeAudio(currentAudio))
      }
    }
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.container, paddingHorizontal:0, paddingBottom: 0}]}>
        {this.props.reach != 'NONE' && this.props.mediaList != '' ?
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={true}         
          >
            <View style={[styles.tabContent, { backgroundColor: this.props.tabcontent, borderColor: this.props.statusBar}]}>
              { this.props.videoTitles != '' ?
              <View>
                <VideoPlayer />
                <Carousel
                  indicatorColor={this.props.button}
                  indicatorSize={35}
                  indicatorSpace={30}
                  inactiveIndicatorColor={Colors.textColor}
                  animate={false}
                  onPageChange={this.getNextVideo}
                  indicatorOffset={-10}
                >
                {this.props.videoTitles}                  
                </Carousel>
              </View>
              : null }

              { this.props.audioTitles != '' ?
              <View>
                <Player url={this.props.audio} />
                <Carousel
                  indicatorColor={this.props.button}
                  indicatorSize={35}
                  indicatorSpace={30}
                  inactiveIndicatorColor={Colors.textColor}
                  animate={false}
                  onPageChange={this.getNextAudio}
                  indicatorOffset={-10}
                >
                {this.props.audioTitles}                  
                </Carousel>
              </View> : null }
            </View>
          </ScrollView> : null }
      </View>
    )
  }
}

Media.propTypes = {
  dispatch: PropTypes.func,
  video: PropTypes.string,
  audio: PropTypes.string,
  title: PropTypes.string,
  success: PropTypes.bool,
  isVideo: PropTypes.bool,
  navBar: PropTypes.string,
  button: PropTypes.string,
  videos: PropTypes.array,
  container: PropTypes.string,
  tabcontent: PropTypes.string,
  statusBar: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    isVideo: state.ValEdu.get('isVideo'),
    title: state.ValEdu.get('title'),
    success: state.ValEdu.get('success'),
    navBar: state.ValEdu.get('navBar'),
    button: state.ValEdu.get('button'),
    audio: state.ValEdu.get('audio'),
    reach: state.ValEdu.get('reach'),
    container: state.ValEdu.get('container'),
    tabcontent: state.ValEdu.get('tabcontent'),
    statusBar: state.ValEdu.get('statusBar'),
  }
}

export default connect(mapStateToProps)(Media)
