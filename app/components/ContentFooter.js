import React, { Component, PropTypes } from 'react'
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Share from 'react-native-share'
import Tts from 'react-native-tts'
import RNFetchBlob from 'react-native-fetch-blob'
import {
  readThought,
} from '../actions/ValEduActions'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'
import MultiDwnld from './contentType/MultiDwnld'

const RNFS = require('react-native-fs')
Tts.setDefaultLanguage('en-IN')
let imagePath = null
let url
let shareOptions

class ContentFooter extends Component {
  componentDidMount = () => {
    Tts.addEventListener('tts-finish', this.stopSpeak )
  }

  stopSpeak = (e) => {
    const { dispatch } = this.props
    dispatch(readThought(false))
  }

  onSpeak = () => {
    const { dispatch } = this.props
    if(this.props.isEngThought && this.props.isEngStory) {
      if(!this.props.thoughtReading){
        dispatch(readThought(true))
        Tts.speak(this.props.value)
      } else{
        dispatch(readThought(false))
        Tts.stop()
      }
    }
  }
  
  render() {
    return (
      <View>
        {this.props.value ?
          <View style={[{flex: 1}, styles.readOutIcon, styles.spaceContainer]}>
            <TouchableOpacity
              style={{paddingRight: 30, paddingTop: 10}}
              onPress={this.onSpeak}
            >
            { this.props.isEngThought && this.props.isEngStory ?
              <View>
              {this.props.thoughtReading ? 
              <Icon name="volume-up" color={this.props.button} size={25} /> :
              <Icon name="volume-off" color={this.props.button} size={25} /> }
              </View>
              : <Icon name="microphone-slash" color={this.props.button} size={20} />
            }
            </TouchableOpacity>
            <MultiDwnld />
            <TouchableOpacity
              style={{paddingLeft: 30, paddingTop: 10}}
              onPress={() => {
                try {
                  let mediaUrls = ''                              
                  if(this.props.mediaList != '') {
                    this.props.mediaList.map((row, index) => {          
                      mediaUrls = mediaUrls + '\n' + row.media             
                    })
                    mediaUrls = '\n \n Media:' + mediaUrls
                  }
                  if(this.props.image != '' && this.props.reach != 'NONE') {
                    RNFetchBlob
                    .config({ 
                      fileCache : true 
                    })
                    .fetch('GET', this.props.image)
                    .then((resp) => {
                      imagePath = resp.path()
                      return resp.readFile('base64')
                    })
                    .then((base64Data) => {                            
                      url = "data:image/png;base64," + base64Data
                      shareOptions = {
                        title: 'Balagokulam',
                        message: this.props.title + ': \n \n' + this.props.value + mediaUrls +
                                  '\n \n Shared via "Balagokulam - Seekho Sikhao" App \n https://play.google.com/store/apps/details?id=com.valueeducation',
                        url,
                        subject: this.props.title,
                      }
                      return RNFS.unlink(imagePath) 
                    }).catch((e) => {
                      shareOptions = {
                        title: 'Balagokulam',
                        message: this.props.title + ': \n \n' + this.props.value + mediaUrls +
                                  '\n \n Shared via "Balagokulam - Seekho Sikhao" App \n https://play.google.com/store/apps/details?id=com.valueeducation',
                        subject: this.props.title,
                      }
                    })
                  } else {
                    shareOptions = {
                      title: 'Balagokulam',
                      message: this.props.title + ': \n \n' + this.props.value + mediaUrls +
                                '\n \n Shared via "Balagokulam - Seekho Sikhao" App \n https://play.google.com/store/apps/details?id=com.valueeducation',
                      subject: this.props.title,
                    }
                  }
                  setTimeout(() => {
                    Share.open(shareOptions).then((info) => {

                    }).catch((err) => {
                      // console.log(err)
                    })
                  }, 1200)
                } catch(e) {
                  // alert(JSON.stringify(e))
                }
              }}>             
              <Icon name="share-alt" color={this.props.button} size={25} />              
            </TouchableOpacity>
          </View> : null
        }
      </View> 
    )
  }
}

ContentFooter.propTypes = {
  dispatch: PropTypes.func,
  value: PropTypes.string,
  title: PropTypes.title,
  button: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    button: state.ValEdu.get('button'),
    thoughtReading: state.ValEdu.get('thoughtReading'),
    value: (state.ValEdu.get('thought') ? state.ValEdu.get('thought') : '') + (state.ValEdu.get('story') ? '\n' + state.ValEdu.get('story') : ''),
    title: state.ValEdu.get('title'),
    isEngThought: state.ValEdu.get('isEngThought'),
    isEngStory: state.ValEdu.get('isEngStory'),
    image: state.ValEdu.get('image'),
    reach: state.ValEdu.get('reach'),
  }
}
export default connect(mapStateToProps)(ContentFooter)
