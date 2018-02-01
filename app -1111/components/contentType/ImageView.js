import React, { Component, PropTypes } from 'react'
import {
  ScrollView,
  View,
  Image,
  Dimensions,
  TouchableHighlight,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../../utils/Styles'
import {
  isExpand,
  imageChange,
  addImage,
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

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class ImageView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedImages: [],
    }
  }
  
  render() {
    let src1 = null
    let src2 = null
    let src3 = null
    let src4 = null
    let src5 = null
    let src6 = null
    let img1 = null
    let img2 = null
    let img3 = null
    let singleImage = null
    let ViewImages
    if (this.props.imageList) {
      if (this.props.imageList.length == 1) {
        this.props.imageList.map((row, i) => {
          singleImage = row.imageUrl
        })
 /*       let width
        let height
        Image.getSize('data:image/jpeg;base64,' + singleImage, (width, height) => {
          width = width
          height = height
        })*/
        ViewImages =
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            this.props.dispatch(isExpand(true))
            this.props.dispatch(imageChange(singleImage))
          }}>
          <Image
            source={{ uri: singleImage }}
            style={{
              flex: 1,
              height: 200,
              resizeMode: 'contain',
            }}
          />
        </TouchableHighlight>
      } else {
      this.props.imageList.map((row, i) => {
        if (row.imagePosition === '1a') {
          src1 = row.imageUrl
        } else if (row.imagePosition === '1b') {
          src2 = row.imageUrl
        } else if (row.imagePosition === '1') {
          img1 = row.imageUrl
        } else if (row.imagePosition === '2a') {
          src3 = row.imageUrl
        } else if (row.imagePosition === '2b') {
          src4 = row.imageUrl
        } else if (row.imagePosition === '2') {
          img2 = row.imageUrl
        } else if (row.imagePosition === '3a') {
          src5 = row.imageUrl
        } else if (row.imagePosition === '3b') {
          src6 = row.imageUrl
        } else if (row.imagePosition === '3') {
          img3 = row.imageUrl
        }
      })
     
      ViewImages =
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          
            <View style={styles.spaceContainer}>
            { src1 ?
              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => {
                  if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                    !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                    !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                    !this.props.longPress9) {
                    this.setState({selectedImages: []})
                  }
                  if(this.props.longPress && !this.props.longPress1) {
                    this.state.selectedImages.push(src1)
                    this.props.dispatch(addImage(this.state.selectedImages))
                  } else {
                    this.state.selectedImages.splice(this.state.selectedImages.indexOf(src1), 1);
                    this.props.dispatch(addImage(this.state.selectedImages))
                  }

                  if(this.props.longPress) {
                    this.props.dispatch(longPressDetected1(!this.props.longPress1))
                  } else {
                      this.props.dispatch(isExpand(true))
                      this.props.dispatch(imageChange(src1))
                  }
                  if(!this.state.selectedImages.length) {
                    this.props.dispatch(longPressDetected(false))
                    this.props.dispatch(longPressDetected1(false))
                  }
                }}
                onLongPress={() => {
                  if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                    !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                    !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                    !this.props.longPress9) {
                    this.setState({selectedImages: []})
                  }
                  if (!this.props.longPress1) {
                    this.state.selectedImages.push(src1)
                    this.props.dispatch(addImage(this.state.selectedImages))
                  } else {
                  this.state.selectedImages.splice(this.state.selectedImages.indexOf(src1), 1);
                  this.props.dispatch(addImage(this.state.selectedImages))
                  }
                  this.props.dispatch(longPressDetected(true))
                  this.props.dispatch(longPressDetected1(!this.props.longPress1))
                }}>
                <Image
                  source={{ uri: src1 }}
                  style={{
                    height: 160,
                    width: width > height ? height/2 - 20 : width/2-20,
                    resizeMode: 'stretch',
                  }}
                >
                {this.props.longPress1 ?
                  <View style={styles.check}>
                    <Icon name="check-circle" color="white" size={20} />
                  </View> : null }
                </Image>
              </TouchableHighlight> : null }

              {src2 ? 

              <TouchableHighlight
                underlayColor="transparent"
                onPress={() => {
                  if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                    !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                    !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                    !this.props.longPress9) {
                    this.setState({selectedImages: []})
                  }             
                  if (this.props.longPress && !this.props.longPress2) {
                    this.state.selectedImages.push(src2)
                    this.props.dispatch(addImage(this.state.selectedImages))
                  } else {
                    this.state.selectedImages.splice(this.state.selectedImages.indexOf(src2), 1);
                    this.props.dispatch(addImage(this.state.selectedImages))
                  }
                  if (this.props.longPress) {
                    this.props.dispatch(longPressDetected2(!this.props.longPress2))
                  } else {
                      this.props.dispatch(isExpand(true))
                      this.props.dispatch(imageChange(src2))
                  }
                  if (!this.state.selectedImages.length) {
                    this.props.dispatch(longPressDetected(false))
                    this.props.dispatch(longPressDetected2(false))
                  }
                }}
                onLongPress={() => {
                  if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                    !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                    !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                    !this.props.longPress9) {
                    this.setState({selectedImages: []})
                  }
                  if (!this.props.longPress2) {
                    this.state.selectedImages.push(src2)
                    this.props.dispatch(addImage(this.state.selectedImages))
                  } else {
                    this.state.selectedImages.splice(this.state.selectedImages.indexOf(src2), 1);
                    this.props.dispatch(addImage(this.state.selectedImages))
                  }
                  this.props.dispatch(longPressDetected(true))
                  this.props.dispatch(longPressDetected2(!this.props.longPress2))
                  
                }}>
                <Image
                  source={{ uri: src2 }}
                  style={{
                    height: 160,
                    resizeMode: 'stretch',
                    width: width > height ? height/2 - 20 : width/2-20,
                  }}
                >
                  {this.props.longPress2 ?
                  <View style={styles.check}>
                    <Icon name="check-circle" color="white" size={20} />
                  </View> : null }
                </Image>
              </TouchableHighlight> : null }
            </View>
          { img1 ? 
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => {
              if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                !this.props.longPress9) {
                this.setState({selectedImages: []})
              }          
              if (this.props.longPress && !this.props.longPress3) {
                this.state.selectedImages.push(img1)
                this.props.dispatch(addImage(this.state.selectedImages))
              } else {
                this.state.selectedImages.splice(this.state.selectedImages.indexOf(img1), 1);
                this.props.dispatch(addImage(this.state.selectedImages))
              }              
              if (this.props.longPress) {
                this.props.dispatch(longPressDetected3(!this.props.longPress3))
              } else {
                  this.props.dispatch(isExpand(true))
                  this.props.dispatch(imageChange(img1))
              }
              if(!this.state.selectedImages.length) {
                this.props.dispatch(longPressDetected(false))
                this.props.dispatch(longPressDetected3(false))
              }
            }}
            style={{ marginTop: 10 }}
            onLongPress={() => {
              if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                !this.props.longPress9) {
                this.setState({selectedImages: []})
              }
              if (!this.props.longPress3) {
                this.state.selectedImages.push(img1)
                this.props.dispatch(addImage(this.state.selectedImages))
              } else {
                this.state.selectedImages.splice(this.state.selectedImages.indexOf(img1), 1);
                this.props.dispatch(addImage(this.state.selectedImages))
              }
              this.props.dispatch(longPressDetected(true))
              this.props.dispatch(longPressDetected3(!this.props.longPress3))
              
            }}>
            <Image
              source={{ uri: img1 }}
              style={{
                height: 160,
                resizeMode: 'stretch',
                width: width > height ? height - 40 : width-40,
              }}
            >
            {this.props.longPress3 ?
            <View style={styles.check}>
                <Icon name="check-circle" color="white" size={20} />
              </View> : null }
            </Image>
          </TouchableHighlight> : null}

          <View style={[styles.spaceContainer, { marginTop: 10 }]}>
          { src3 ?
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                  !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                  !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                  !this.props.longPress9) {
                  this.setState({selectedImages: []})
                }            
                if (this.props.longPress && !this.props.longPress4) {
                  this.state.selectedImages.push(src3)
                  this.props.dispatch(addImage(this.state.selectedImages))
                } else {
                  this.state.selectedImages.splice(this.state.selectedImages.indexOf(src3), 1);
                  this.props.dispatch(addImage(this.state.selectedImages))
                }
                if(this.props.longPress) {
                  this.props.dispatch(longPressDetected4(!this.props.longPress4))
                } else {
                    this.props.dispatch(isExpand(true))
                    this.props.dispatch(imageChange(src3))
                }
                if(!this.state.selectedImages.length) {
                  this.props.dispatch(longPressDetected(false))
                  this.props.dispatch(longPressDetected4(false))
                }
              }}
              onLongPress={() => {
                if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                  !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                  !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                  !this.props.longPress9) {
                  this.setState({selectedImages: []})
                }
                if (!this.props.longPress4) {
                  this.state.selectedImages.push(src3)
                  this.props.dispatch(addImage(this.state.selectedImages))
                } else {
                  this.state.selectedImages.splice(this.state.selectedImages.indexOf(src3), 1);
                  this.props.dispatch(addImage(this.state.selectedImages))
                }
                this.props.dispatch(longPressDetected(true))
                this.props.dispatch(longPressDetected4(!this.props.longPress4))                
              }}>
              <Image
                source={{ uri: src3 }}
                style={{
                  height: 160,
                  width: width > height ? height/2 - 20 : width/2-20,
                  resizeMode: 'stretch',
                }}
              >
              {this.props.longPress4 ?
              <View style={styles.check}>
                <Icon name="check-circle" color="white" size={20} />
              </View> : null }
              </Image>
            </TouchableHighlight> : null }
            {src4 ?
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                  !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                  !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                  !this.props.longPress9) {
                  this.setState({selectedImages: []})
                }                
                if (this.props.longPress && !this.props.longPress5) {
                  this.state.selectedImages.push(src4)
                  this.props.dispatch(addImage(this.state.selectedImages))
                } else {
                  this.state.selectedImages.splice(this.state.selectedImages.indexOf(src4), 1)
                  this.props.dispatch(addImage(this.state.selectedImages))
                }
                if (this.props.longPress) {
                  this.props.dispatch(longPressDetected5(!this.props.longPress5))
                } else {
                    this.props.dispatch(isExpand(true))
                    this.props.dispatch(imageChange(src4))
                }
                if (!this.state.selectedImages.length) {
                  this.props.dispatch(longPressDetected(false))
                  this.props.dispatch(longPressDetected5(false))
                }
              }}
              onLongPress={() => {
                if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                  !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                  !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                  !this.props.longPress9) {
                  this.setState({selectedImages: []})
                }
                if (!this.props.longPress5) {
                  this.state.selectedImages.push(src4)
                  this.props.dispatch(addImage(this.state.selectedImages))
                } else {
                  this.state.selectedImages.splice(this.state.selectedImages.indexOf(src4), 1)
                  this.props.dispatch(addImage(this.state.selectedImages))
                }
                this.props.dispatch(longPressDetected(true))
                this.props.dispatch(longPressDetected5(!this.props.longPress5))
              }}>
              <Image
                source={{ uri: src4 }}
                style={{
                  height: 160,
                  width: width > height ? height/2 - 20 : width/2-20,
                  resizeMode: 'stretch',
                }}
              >
              {this.props.longPress5 ?
                <View style={styles.check}>
                  <Icon name="check-circle" color="white" size={20} />
                </View> : null }
              </Image>
            </TouchableHighlight> : null }
          </View>

          { img2 ?
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => {
              if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                !this.props.longPress9) {
                this.setState({selectedImages: []})
              }             
              if (this.props.longPress && !this.props.longPress6) {
                this.state.selectedImages.push(img2)
                this.props.dispatch(addImage(this.state.selectedImages))
              } else {
                this.state.selectedImages.splice(this.state.selectedImages.indexOf(img2), 1)
                this.props.dispatch(addImage(this.state.selectedImages))         
              }
              if (this.props.longPress) {
                this.props.dispatch(longPressDetected6(!this.props.longPress6))
              } else {
                  this.props.dispatch(isExpand(true))
                  this.props.dispatch(imageChange(img2))
              }
              if (!this.state.selectedImages.length) {
                this.props.dispatch(longPressDetected(false))
                this.props.dispatch(longPressDetected1(false))
              }
            }}
            style={{ marginTop: 10 }}
            onLongPress={() => {
              if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                !this.props.longPress9) {
                this.setState({selectedImages: []})
              }
              if (!this.props.longPress6) {
                this.state.selectedImages.push(img2)
                this.props.dispatch(addImage(this.state.selectedImages))   
              } else {
                this.state.selectedImages.splice(this.state.selectedImages.indexOf(img2), 1)
                this.props.dispatch(addImage(this.state.selectedImages))   
              }
              this.props.dispatch(longPressDetected(true))
              this.props.dispatch(longPressDetected6(!this.props.longPress6))
              
            }}>
            <Image
              source={{ uri: img2 }}
              style={{
                height: 160,
                width: width > height ? height - 40 : width-40,
                resizeMode: 'stretch',
              }}
            >
            {this.props.longPress6 ?
              <View style={styles.check}>
                <Icon name="check-circle" color="white" size={20} />
              </View> : null }
            </Image>
          </TouchableHighlight> : null }

          <View style={[styles.spaceContainer, { marginTop: 10 }]}>
          {src5 ?
            <TouchableHighlight
              underlayColor="transparent"
              onPress={() => {
                if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                  !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                  !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                  !this.props.longPress9) {
                  this.setState({selectedImages: []})
                }              
                if (this.props.longPress && !this.props.longPress7) {
                  this.state.selectedImages.push(src5)
                  this.props.dispatch(addImage(this.state.selectedImages))   
                } else {
                  this.state.selectedImages.splice(this.state.selectedImages.indexOf(src5), 1)
                  this.props.dispatch(addImage(this.state.selectedImages))   
                }
                if(this.props.longPress) {
                  this.props.dispatch(longPressDetected7(!this.props.longPress7))
                } else {
                    this.props.dispatch(isExpand(true))
                    this.props.dispatch(imageChange(src5))
                }
                if (!this.state.selectedImages.length) {
                  this.props.dispatch(longPressDetected(false))
                  this.props.dispatch(longPressDetected7(false))
                }
              }}
              onLongPress={() => {
                if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                  !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                  !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                  !this.props.longPress9) {
                  this.setState({selectedImages: []})
                }
                if (!this.props.longPress7) {
                  this.state.selectedImages.push(src5)
                  this.props.dispatch(addImage(this.state.selectedImages))   
                } else {
                  this.state.selectedImages.splice(this.state.selectedImages.indexOf(src5), 1)
                  this.props.dispatch(addImage(this.state.selectedImages))   
                }
                this.props.dispatch(longPressDetected(true))
                this.props.dispatch(longPressDetected7(!this.props.longPress7))
                
              }}>
              <Image
                source={{ uri: src5 }}
                style={{
                  height: 160,
                  width: width > height ? height/2 - 20 : width/2-20,
                  resizeMode: 'stretch',
                }}
              >
              {this.props.longPress7 ?
                <View style={styles.check}>
                  <Icon name="check-circle" color="white" size={20} />
                </View> : null }
              </Image>
            </TouchableHighlight> : null }
            {src6 ?
            <TouchableHighlight
              onPress={() => {
                if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                  !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                  !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                  !this.props.longPress9) {
                  this.setState({selectedImages: []})
                }               
                if (this.props.longPress && !this.props.longPress8) {
                  this.state.selectedImages.push(src6)
                  this.props.dispatch(addImage(this.state.selectedImages))   
                } else {
                  this.state.selectedImages.splice(this.state.selectedImages.indexOf(src6), 1)
                  this.props.dispatch(addImage(this.state.selectedImages))   
                }
                if (this.props.longPress) {
                  this.props.dispatch(longPressDetected8(!this.props.longPress8))
                } else {
                    this.props.dispatch(isExpand(true))
                    this.props.dispatch(imageChange(src6))
                }    
                if (!this.state.selectedImages.length) {
                  this.props.dispatch(longPressDetected(false))
                  this.props.dispatch(longPressDetected8(false))
                }           
              }}
              underlayColor="transparent"
              onLongPress={() => {
                if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                  !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                  !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                  !this.props.longPress9) {
                  this.setState({selectedImages: []})
                }
                if (!this.props.longPress8) {
                  this.state.selectedImages.push(src6)
                  this.props.dispatch(addImage(this.state.selectedImages))   
                } else {
                this.state.selectedImages.splice(this.state.selectedImages.indexOf(src6), 1)
                this.props.dispatch(addImage(this.state.selectedImages))   
              }
                this.props.dispatch(longPressDetected(false))
                this.props.dispatch(longPressDetected8(!this.props.longPress8))
               
              }}>
              <Image
                source={{ uri: src6 }}
                style={{
                  height: 160,
                  width: width > height ? height/2 - 20 : width/2-20,
                  resizeMode: 'stretch',
                }}
              >
              {this.props.longPress8 ?
                <View style={styles.check}>
                  <Icon name="check-circle" color="white" size={20} />
                </View> : null }
              </Image>
            </TouchableHighlight>: null }
          </View>

          { img3 ? 
          <TouchableHighlight
            underlayColor="transparent"
            onPress={() => {
              if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                !this.props.longPress9) {
                this.setState({selectedImages: []})
              }          
              if (this.props.longPress && !this.props.longPress9) {
                this.state.selectedImages.push(img3)
                this.props.dispatch(addImage(this.state.selectedImages))   

              } else {
                this.state.selectedImages.splice(this.state.selectedImages.indexOf(img3), 1)
                this.props.dispatch(addImage(this.state.selectedImages))   
              }
              if (this.props.longPress) {
                this.props.dispatch(longPressDetected9(!this.props.longPress9))
              } else {
                  this.props.dispatch(isExpand(true))
                  this.props.dispatch(imageChange(img3))
              }
              if (!this.state.selectedImages.length) {
                this.props.dispatch(longPressDetected(false))
                this.props.dispatch(longPressDetected9(false))
              }    
            }}
            style={{ marginTop: 10 }}
            onLongPress={() => {
              if(!this.props.longPress && !this.props.longPress1 && !this.props.longPress2 &&
                !this.props.longPress3 && !this.props.longPress4 && !this.props.longPress5 &&
                !this.props.longPress6 && !this.props.longPress7 && !this.props.longPress8 &&
                !this.props.longPress9) {
                this.setState({selectedImages: []})
              }
              if (!this.props.longPress9) {
                this.state.selectedImages.push(img3)
                this.props.dispatch(addImage(this.state.selectedImages))
              } else {
                this.state.selectedImages.splice(this.state.selectedImages.indexOf(img3), 1)
                this.props.dispatch(addImage(this.state.selectedImages))
              }
              this.props.dispatch(longPressDetected(true))
              this.props.dispatch(longPressDetected9(!this.props.longPress9))
            }}>
            <Image
              source={{ uri: img3 }}
              style={{
                height: 160,
                width: width > height ? height - 40 : width-40,
                resizeMode: 'stretch',
              }}
            >
            {this.props.longPress9 ?
              <View style={styles.check}>
                <Icon name="check-circle" color="white" size={20} />
              </View> : null}
            </Image>
          </TouchableHighlight> : null }
        </View>
      }
    }
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        { this.props.reach != 'NONE' && this.props.imageList != '' ?
          <View style={{ marginBottom: 10 }}>
            {ViewImages}
          </View> :
          null
        }
      </ScrollView>
    )
  }
}

ImageView.propTypes = {
  dispatch: PropTypes.func,
  title: PropTypes.string,
  success: PropTypes.bool,
  isImage: PropTypes.bool,
  imageExpand: PropTypes.bool,
  navBar: PropTypes.string,
  button: PropTypes.string,
  readOut: PropTypes.bool,
  saveSubscription: PropTypes.func,
  longPress1: PropTypes.bool,
  longPress2: PropTypes.bool,
  longPress3: PropTypes.bool,
  longPress4: PropTypes.bool,
  longPress5: PropTypes.bool,
  longPress6: PropTypes.bool,
  longPress7: PropTypes.bool,
  longPress8: PropTypes.bool,
  longPress9: PropTypes.bool,
  longPress: PropTypes.bool,
  reach: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    isImage: state.ValEdu.get('isImage'),
    title: state.ValEdu.get('title'),
    navBar: state.ValEdu.get('navBar'),
    button: state.ValEdu.get('button'),
    success: state.ValEdu.get('success'),
    imageExpand: state.ValEdu.get('imageExpand'),
    imageValue: state.ValEdu.get('imageValue'),
    readOut: state.ValEdu.get('readOut'),
    longPress: state.ValEdu.get('longPress'),
    longPress1: state.ValEdu.get('longPress1'),
    longPress2: state.ValEdu.get('longPress2'),
    longPress3: state.ValEdu.get('longPress3'),
    longPress4: state.ValEdu.get('longPress4'),
    longPress5: state.ValEdu.get('longPress5'),
    longPress6: state.ValEdu.get('longPress6'),
    longPress7: state.ValEdu.get('longPress7'),
    longPress8: state.ValEdu.get('longPress8'),
    longPress9: state.ValEdu.get('longPress9'),
    reach: state.ValEdu.get('reach'),
  }
}

export default connect(mapStateToProps)(ImageView)
