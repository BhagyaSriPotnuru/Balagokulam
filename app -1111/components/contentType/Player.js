import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import AudioPlayer from 'react-native-play-audio'
import { connect } from 'react-redux'
import styles from '../../utils/Styles'
import Colors from '../../utils/Colors'
import {
  audioPlay,
} from '../../actions/ValEduActions'

class Player extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentTime: 0,
    }
  }

  componentWillUnmount() {
    this.props.dispatch(audioPlay(false))
    AudioPlayer.stop()
  }

  render() {
    return (
      <View style={{alignItems: 'center', flex: 1}}>
      {!this.state.currentTime && this.props.playAudio ?
        <ActivityIndicator color={this.props.navBar} style={{padding: 10}}/> :
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
        {this.props.playAudio ?
          <TouchableOpacity
            style={{padding: 7}}                   
            onPress={() => {
              this.props.dispatch(audioPlay(false))
              AudioPlayer.pause()
            }}
          >
            <Icon name="pause-circle-o" size={30} color={this.props.navBar} />              
          </TouchableOpacity> :
          <TouchableOpacity
            style={{padding: 7}}
            onPress={() => {
              try {
                this.props.dispatch(audioPlay(true))
                AudioPlayer.prepare(this.props.audio, () => {
                  AudioPlayer.play()  
                  AudioPlayer.getDuration((duration) => {
                    setTimeout(() => {
                      this.props.dispatch(audioPlay(false))
                    }, Math.round(duration)*1000) 
                  })              
                  setInterval(() => {                
                    AudioPlayer.getCurrentTime((currentTime) => {
                      this.setState({currentTime})                   
                    })
                  }, 1000)                        
                })
                
              } catch(e) {}
            }}
          >
            <Icon name="play-circle-o" size={30} color={this.props.navBar} />             
          </TouchableOpacity> }
          <TouchableOpacity
            style={{padding: 7}}                   
            onPress={() => {             
              this.props.dispatch(audioPlay(false))
              AudioPlayer.stop() 
            }}
          >
            <Icon name="stop-circle-o" size={30} color={this.props.navBar} />
          </TouchableOpacity>
        </View>
        }
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    audio: state.ValEdu.get('audio'),
    reach: state.ValEdu.get('reach'),
    navBar: state.ValEdu.get('navBar'),
    playAudio: state.ValEdu.get('playAudio'),
  }
}

export default connect(mapStateToProps)(Player)
