import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableOpacity,
  Platform,
  CameraRoll,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Share from 'react-native-share'
import RNFetchBlob from 'react-native-fetch-blob'
import Toast from 'react-native-root-toast'
import styles from '../../utils/Styles'

const RNFS = require('react-native-fs')
let imagePath = null
let shareOptions

class ImageFooter extends Component {
  componentDidMount = () => {
    try {
      if(this.props.reach != 'NONE') {
        RNFetchBlob
        .config({ 
          fileCache : true 
        })
        .fetch('GET', this.props.imageValue)
        .then((resp) => {
          imagePath = resp.path()
          return resp.readFile('base64')
        })
        .then((base64Data) => {                   
          shareOptions = {
            title: 'Balagokulam',
            url: "data:image/png;base64," + base64Data,
            message: this.props.title +
                      '\n \n Shared via "Balagokulam - Seekho Sikhao" App \n https://play.google.com/store/apps/details?id=com.valueeducation',
            subject: this.props.title,
          }
          return RNFS.unlink(imagePath) 
        }).catch((e) => {
          shareOptions = {
            title: 'Balagokulam',
            message: this.props.title +
                      '\n \n Shared via "Balagokulam - Seekho Sikhao" App \n https://play.google.com/store/apps/details?id=com.valueeducation',
            subject: this.props.title,
          }
          // alert(JSON.stringify(e))
        })
      } else {
        shareOptions = {
          title: 'Balagokulam',
          message: this.props.title +
                    '\n \n Shared via "Balagokulam - Seekho Sikhao" App \n https://play.google.com/store/apps/details?id=com.valueeducation',
          subject: this.props.title,
        }
      }
    } catch(e) {
      // alert('error' + e)
    }
  }
  render() {
    if (!this.props.imageExpand) {
      return null
    }
    return (
      <View
        style={[
          { flex: 1, paddingHorizontal: 20, paddingBottom: 10 },
          styles.readOutIcon,
          styles.spaceContainer]}
      >
      {this.props.isImage ?
        <TouchableOpacity
          style={{ paddingRight: 20, paddingTop: 20 }}
          onPress={() => {
            const uri = this.props.imageValue
            if (Platform.OS === 'ios') {
              const promise = CameraRoll.saveToCameraRoll(uri)
              promise.then((result) => {
                const toast2 = Toast.show('Image is saved to CameraRoll', {
                  duration: 500,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                });
              }).catch((error) => {
                // alert('save failed ' + error)
              })
            } else {
              let path = RNFS.ExternalStorageDirectoryPath + '/Balagokulam'
              RNFS.mkdir(path)
              path = path + '/' + this.props.title + Math.floor((Math.random() * 8)) + '.png'
              let result = RNFS.downloadFile({fromUrl: uri, toFile: path})           
              result.promise.then(() => {
                const toast3 = Toast.show('Image is saved to Internal Storage', {
                  duration: 500,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                });
              })
              .catch((err) => {
                // alert(err.message)
              })
            } }
          }
        >
          <Icon name="download" color="rgba(255, 255, 255, 0.7)" size={25} />
        </TouchableOpacity>: null}
      {this.props.isImage ?
        <TouchableOpacity
          style={{ paddingLeft: 20, paddingTop: 20 }}
          onPress={() => {       
            Share.open(shareOptions).then((info) => {
            }).catch((err) => {
              // alert(err)
            })
          }}>
          <Icon name="share-alt" color="rgba(255, 255, 255, 0.7)" size={25} />
        </TouchableOpacity>: null }
      </View>
    )
  }
}

ImageFooter.propTypes = {
  dispatch: PropTypes.func,
  value: PropTypes.string,
  title: PropTypes.string,
  button: PropTypes.string,
  imageValue: PropTypes.string,
  imageExpand: PropTypes.bool,
  isImage: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    button: state.ValEdu.get('button'),
    imageExpand: state.ValEdu.get('imageExpand'),
    imageValue: state.ValEdu.get('imageValue'),
    title: state.ValEdu.get('title'),
    isImage: state.ValEdu.get('isImage'),
    reach: state.ValEdu.get('reach'),
  }
}

export default connect(mapStateToProps)(ImageFooter)
