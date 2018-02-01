import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import Toast from 'react-native-root-toast'

import {
  longPressDetected,
  longPressDetected1,
  longPressDetected2,
  longPressDetected3,
  longPressDetected4,
  longPressDetected5,
  longPressDetected6,
  longPressDetected7,
  longPressDetected8,
  longPressDetected9,
} from '../../actions/ValEduActions'

import styles from '../../utils/Styles'

const RNFS = require('react-native-fs')

class MultiDwnld extends Component {
  render() {
    const { dispatch } = this.props
    if (!this.props.longPress) {
      return null
    }
    return (
      <View style={[styles.readOutIcon, { flex: 1, right: 60 }]}>
        {this.props.isImage && this.props.selectedImages.length ?
        <TouchableOpacity
          style={{ alignSelf: 'flex-end', paddingLeft: 30, paddingTop: 10 }}
          onPress={() => {
            const path = RNFS.ExternalStorageDirectoryPath + '/Balagokulam/' + this.props.title
            RNFS.mkdir(path)
            this.props.selectedImages.map((row, index) => {
              const path1 = path + '/' + this.props.title + index + '.png'
              RNFS.downloadFile({ fromUrl: row, toFile: path1 })   
            })
            const toast2 = Toast.show('Images are downloaded', {
              duration: 500,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            })
            dispatch(longPressDetected(false))
            dispatch(longPressDetected1(false))
            dispatch(longPressDetected2(false))
            dispatch(longPressDetected3(false))
            dispatch(longPressDetected4(false))
            dispatch(longPressDetected5(false))
            dispatch(longPressDetected6(false))
            dispatch(longPressDetected7(false))
            dispatch(longPressDetected8(false))
            dispatch(longPressDetected9(false))
          }}
        >
          <Icon name="download" color={this.props.button} size={25} />
        </TouchableOpacity>: null}
      </View>
    )
  }
}

MultiDwnld.propTypes = {
  dispatch: PropTypes.func,
  value: PropTypes.string,
  title: PropTypes.string,
  button: PropTypes.string,
  imageValue: PropTypes.string,
  imageExpand: PropTypes.bool,
  isImage: PropTypes.bool,
  longPress: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    button: state.ValEdu.get('button'),
    imageExpand: state.ValEdu.get('imageExpand'),
    imageValue: state.ValEdu.get('imageValue'),
    title: state.ValEdu.get('title'),
    isImage: state.ValEdu.get('isImage'),
    longPress: state.ValEdu.get('longPress'),
    selectedImages: state.ValEdu.get('selectedImages'),
  }
}

export default connect(mapStateToProps)(MultiDwnld)
