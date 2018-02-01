import React, { Component, PropTypes } from 'react'
import YouTube from 'react-native-youtube'
import { View } from 'react-native'
import { connect } from 'react-redux'
import Orientation from 'react-native-orientation'
import AudioPlayer from 'react-native-play-audio'
import {
  audioPlay,
} from '../actions/ValEduActions'
// import { ReactNativeAudioStreaming } from 'react-native-audio-streaming'

class VideoPlayer extends Component {
  constructor(props) {
    super(props) 
    this.state = {height: 199}
  }

  componentWillUnmount() {
    Orientation.unlockAllOrientations()
  }
  render() {
    return (
      <View>
        <YouTube
          videoId={this.props.video}
          play={false}
          fullscreen={false}
          loop={false}
          onReady={() => {
            setTimeout(() => {
              this.setState({height: 200})
            }, 200)
          }}
          onChangeState={(e) => {
            if(e.state == 'playing') {
              AudioPlayer.stop()
              this.props.dispatch(audioPlay(false))           
            }
          }}
          onError={(e) => {
            // alert(e.nativeEvent.error)
          }}
          style={{ width: 320, height: this.state.height, alignSelf: 'center' }}
          apiKey="AIzaSyCOOscfwpYUbO7PkG1gsop40PCUZmCjkVA"
        />
      </View>
    )
  }
}

VideoPlayer.propTypes = {
  video: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    video: state.ValEdu.get('video'),
  }
}

export default connect(mapStateToProps)(VideoPlayer)
