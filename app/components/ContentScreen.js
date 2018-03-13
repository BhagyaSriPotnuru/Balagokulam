import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  AsyncStorage,
  StatusBar,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  BackAndroid,
  Alert,
  ScrollView,
  WebView,
} from 'react-native'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Toast from 'react-native-root-toast'
import Tts from 'react-native-tts'
import Carousel from 'react-native-carousel-control'
import Modal from 'react-native-simple-modal'
import AudioPlayer from 'react-native-play-audio'
// import { ReactNativeAudioStreaming } from 'react-native-audio-streaming'
import Spinner from 'react-native-loading-spinner-overlay'
import SQLite from 'react-native-sqlite-storage'
import { getRefreshToken } from './refreshToken'
import http from '../utils/Http'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'
import ContentScreenNavBar from './ContentScreenNavBar'
import ContentFooter from './ContentFooter'
import ImageView from './contentType/ImageView'
import ImageFooter from './contentType/ImageFooter'
import {
  contentInfo,
  dateChange,
  readThought,
  readStory,
  changeVideo,
  changeAudio,
  isExpand,
  startSpinner,
  stopSpinner,
  isEnStory,
  isEnThought,
  shareImage,
} from '../actions/ValEduActions'

let i = 0
let contentRows = []
let token
let userId
let videos
let videoTitles
let audios
let audioTitles
let db
let isCacheCreated
let previousDate
let index1
let index2

GoogleAnalytics.setTrackerId('UA-81365729-4')
GoogleAnalytics.setDispatchInterval(10)
GoogleAnalytics.trackScreenView('Home')

class ContentScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contentList: null,
      imageList: null,
      position: null,
      mediaList: null,
      page: 0,
      title: '',
      mediaType: '',
    }
    db = SQLite.openDatabase({
      name: 'test.db',
      createFromLocation: "~balagokulam.db",
      location: 'Library',
    }, () => {
      // console.log('db opened')
      }, (e) => {
      // console.log('error' + JSON.stringify(e))
    })
  }

  componentDidMount = () => {
    // alert(this.props.date)
    const { dispatch } = this.props
    dispatch(contentInfo('', null, '', null, null))   
    this.getContentListByDate()
    BackAndroid.addEventListener('hardwareBackPress', this.onBackPress)
  }

  componentWillUnmount = () => {
    this.props.dispatch(readThought(false))
    this.props.dispatch(readStory(false))
    Tts.stop()
    // ReactNativeAudioStreaming.stop()
  }

  onBackPress = () => {
    this.props.dispatch(isExpand(false))
  }

  getContentListByDate = async () => {
    const { dispatch } = this.props
    dispatch(startSpinner())
    dispatch(readThought(false))
    dispatch(readStory(false))
    let contentList = []
    Tts.stop()
    const date = this.props.date
    let day = date.getDate()
    if (day < 10) {
      day = '0' + day
    }
    let month = date.getMonth() + 1
    if (month < 10) {
      month = '0' + month
    }
    const year = date.getFullYear()
    const contentDate = year + '-' + month + '-' + day
    let dateQuery = 'select createdOn,count(*) from record_title_data ' +
      'where date(createdOn)=\'' + contentDate + '\' ' + 'group by date(createdOn)'
    let recordQuery = 'select rtd.record_title_id as tId,rtd.title as title,rtd.createdOn as createdOn,story,thought,image '+
      'from (select * from record_title_data where date(createdOn)=\''+contentDate+'\') as rtd '+
      'inner join record_data on record_data.record_id=rtd.record_title_id '+
      'order by rtd.record_title_id desc'
    let imageQuery = 'select image as imageUrl,image_position as imagePosition from images where fk_record_id=?'
    let mediaQuery = 'select media, media_title as mediaTitle, media_type as mediaType from media where fk_record_id=?'

    try {
      isCacheCreated = await AsyncStorage.getItem('cacheCreated')
      isCacheCreated = JSON.parse(isCacheCreated)
      if(isCacheCreated) {
        db.transaction((tx) => {
          tx.executeSql(dateQuery, [], (tx, results) => {
            if (results.rows.length > 0) {
              tx.executeSql(recordQuery, [], (tx, results) => {
                for (let i = 0; i < results.rows.length; i++) {
                  let row = results.rows.item(i)
                  row.imageList = []
                  row.mediaList = []
                  tx.executeSql(mediaQuery, [row.tId], (tx, mediaResults) => {
                    for (index2 = 0; index2 < mediaResults.rows.length; index2++) {
                      row.mediaList.push(mediaResults.rows.item(index2))
                    }
                  }, this.errorCreation)

                  tx.executeSql(imageQuery, [row.tId], (tx, imageResults) => {
                    for (index1 = 0; index1 < imageResults.rows.length; index1++) {
                      row.imageList.push(imageResults.rows.item(index1))
                    }
                  }, this.errorCreation)

                  contentList.push(row)
                  if(this.props.titleId === row.tId) {
                    this.setState({position: i})
                  }
                }
                this.setState({contentList: contentList})
                contentRows = contentList
                if(this.state.position > contentRows.length - 1) {
                  this.setState({position: contentRows.length - 1})
                }
                setTimeout(() => {
                  this.getContentByDate(this.state.position)
                },100) 
              }, this.errorCreation)
            } else {
              this.fetchContentListByDate(contentDate)
            }
          }, this.errorCreation)
        })
      } else {
        this.fetchContentListByDate(contentDate)
      }
    } catch(e) {}
  } 

  errorCreation = () => {
    // console.log('error' + JSON.stringify(e))
  }

  fetchContentListByDate = async (contentDate) => {
    const { dispatch } = this.props
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      if (this.props.reach === 'NONE') {
        /*if(previousDate != null){
          const date = new Date(previousDate)           
          dispatch(dateChange(date))
        }*/
        dispatch(contentInfo(null, null, null, null, null))
        dispatch(stopSpinner())
        this.setState({contentList: [], imageList: [], mediaList: []})
        Alert.alert(
          'Balagokulam - Seekho Sikhao',
          'You are offline. Please Connect to internet to view this story',
          [
            { text: 'OK'},
          ]
        )
      } else {
        http('fetchContentListByDate', {userId, date: contentDate}, 'POST', token)
        .then((response) => {
          if(response.Message) {
            getRefreshToken()
            this.getContentListByDate()          
          } else if(!response.isActive) {
            AsyncStorage.multiRemove(['theme', 'tablesUpdated', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage','phoneNumber'])
            Actions.welcome()
          } else if(response.status && response.contentList) {
            // alert(JSON.stringify(response))
            this.setState({contentList: response.contentList})
            contentRows = response.contentList
            if(contentRows) {
              for(i = 0; i < contentRows.length; i++) {
                if(this.props.titleId === contentRows[i].tId) {
                  this.setState({position: i})
                }
              }
            }
            if(this.state.position > contentRows.length - 1) {
              this.setState({position: contentRows.length - 1})
            }
            this.getContentByDate(this.state.position)
          } else {
            // console.log('no Data found')
            dispatch(contentInfo(null, null, null, null, null))
            dispatch(stopSpinner())
            this.setState({contentList: [], imageList: [], mediaList: []})
          }
        })
        .catch((error) => {
          // console.log('no Data found')
          dispatch(contentInfo(null, null, null, null, null))
          dispatch(stopSpinner())
          this.setState({contentList: [], imageList: [], mediaList: []})
        })
      }
    } catch(e) {

    }
  }

  getContentByDate = (position) => {
    const { dispatch } = this.props
    this.refs.scrollview && this.refs.scrollview.scrollTo({ y: 0 })
    try {
      dispatch(isEnThought(true))
      dispatch(isEnStory(true))
      dispatch(readThought(false))
      dispatch(readStory(false))
      Tts.stop()
      this.setState({imageList: [], mediaList: []})
      this.setState({position})
      let data = contentRows[position]
      videos = []
      videoTitles = []
      audios = []
      audioTitles = []
      if(data) {
        const thought = data.thought
        const imageList = data.imageList
        const story = data.story        
        const title = data.title
        let mediaList = data.mediaList
        if (data.imageList != '') {
          data.imageList.map((r, i) => {
            if(i == 0) {
              dispatch(shareImage(r.imageUrl))
            }
          })
        } else{
          dispatch(shareImage(''))
        }
        if (data.mediaList != '') {
          data.mediaList.map((r, i) => {
            if(i == 0) {
              this.setState({title: r.mediaTitle, mediaType: r.mediaType})
            }
            if(r.mediaType == 'video') {
              videos.push(r.media)
              videoTitles.push(<Text style={[styles.textColor, {fontSize: 13, alignSelf: 'center', marginTop: 10}]}>{r.mediaTitle}</Text>)
            }
            if(r.mediaType == 'audio') {
              audios.push(r.media)
              audioTitles.push(<Text style={[styles.textColor, {fontSize: 13, alignSelf: 'center', marginTop: 10}]}>{r.mediaTitle}</Text>)
            }
          })
        }
        if(videos != '') {
          let currentVideo
          if(videos[0]) {
            currentVideo = videos[0].split('v=')[1]
            let ampersandPosition = currentVideo.indexOf('&')
            if(ampersandPosition != -1) {
              currentVideo = currentVideo.substring(0, ampersandPosition)
            }
          }
          if(currentVideo) {    
            dispatch(changeVideo(currentVideo))
          }
        }   
        if(audios != '') {
          let currentAudio
          if(audios[0]) {
            currentAudio = audios[0]
          }
          if(currentAudio) {    
            dispatch(changeAudio(currentAudio))
          }
        }
        
        GoogleAnalytics.trackEvent('recordView', '' + data.title + '')
        this.setState({imageList: data.imageList, mediaList: data.mediaList})
        dispatch(contentInfo(thought, imageList, story, mediaList, title))       
        let charCode
        let charCode1
        let i = 0
        if(thought) {
          for (i = 0; i < thought.length; i++ ) {
            charCode = thought.charCodeAt(i)
            if(charCode > 1999 && charCode < 3000) {
              dispatch(isEnThought(false))
              break
            }
          }
        }
        if(story) {
          for (i = 0; i < story.length; i++ ) {
            charCode1 = story.charCodeAt(i)
            if(charCode1 > 1999 && charCode1 < 3000) {
              dispatch(isEnStory(false))
              break
            }            
          }
        }       
      }
      dispatch(stopSpinner())      
    } catch(error) {
      alert(error)
    }
  }

  dateChange = (date) => {
    try {
      previousDate = this.props.date
      const datec = new Date(date)
      const { dispatch } = this.props
      dispatch(dateChange(datec))
      setTimeout(() => {
        this.getContentListByDate()
      },0)
    } catch (e) {}
  }

  decrementDate = () => {
    try {
      previousDate = this.props.date
      const date = new Date(this.props.date)
      date.setDate(date.getDate() - 1)
      const { dispatch } = this.props
      dispatch(dateChange(date))
      setTimeout(() => {
        this.getContentListByDate()
      },0) 
    } catch(e) {}
  }

  incrementDate = () => {
    try {
      previousDate = this.props.date
      const date = new Date(this.props.date)
      date.setDate(date.getDate() + 1)
      const { dispatch } = this.props
      dispatch(dateChange(date))
      setTimeout(() => {
        this.getContentListByDate()
      },0)
    } catch(e) {}
  }

  saveSubscription = async () => {   
    try {
      userId = await AsyncStorage.getItem('userId')
      token = await AsyncStorage.getItem('token')  
      let data = {
        userId,
        thoughtSubscribed: this.props.isThought,
        imageSubscribed: this.props.isImage,
        storySubscribed: this.props.isStory,
        videoSubscribed: this.props.isVideo,  
      }
      if(this.props.reach === 'NONE') {

      } else {
        http('updateUserSubscription', data, 'POST', token)
        .then((response) => {
           // alert( 'response' + JSON.stringify(response))
            if(response.Message) {
              getRefreshToken()
              this.saveSubscription()
            } else if (!response.isActive) {
              AsyncStorage.multiRemove(['theme', 'tablesUpdated', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
              Actions.welcome()
            } else if (response.status) {
            let toast = Toast.show('Content type updated successfully', {
              duration: 500,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          } else {
             // alert('error')
          }
        })
        .catch((error) => {
          // alert(error)
        })
      }
    } catch(e) { }
  } 

  render() {
    let story = this.props.story
    let rows = []
    if(this.state.contentList) {
      rows = this.state.contentList.map((r, i) => {
        return (
          <Text numberOfLines={1} style={[styles.textColor, {color: Colors.title,fontSize: 18}]}>{r.title}</Text>
        )
      })
    }  
    
    return (
      <View style={[styles.container, { backgroundColor: this.props.container, paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }]}>
        <StatusBar
          backgroundColor={this.props.imageExpand ? 'black' : this.props.statusBar}
          barStyle="light-content"
        />
          <ContentScreenNavBar
            decrementDate={this.decrementDate}
            incrementDate={this.incrementDate}
            dateChange={this.dateChange}
            onSearchClick={this.onSearchClick}
            date={this.props.date}
          />
          {this.state.position !== null ?
            <Carousel
              pageStyle={{
                backgroundColor: this.props.titleCarousel,
                borderRadius: 5,
                justifyContent:'center',
                alignItems:'center',
                height: 40,
                marginBottom: 0,
                paddingHorizontal: 5,
              }}
              onPageChange={this.getContentByDate}
               currentPage={this.state.position}
               initialPage={this.state.position}
            >
             {rows}
            </Carousel> : <View />
          }       

          <View style={[styles.tabContent, { marginTop: 10, backgroundColor: this.props.tabcontent, borderColor: this.props.statusBar }]}>
           { story && (story.substring(0,4) === "Http" || story.substring(0,4) === "http") ?
             this.props.reach === 'NONE' ?
              <Text style={[styles.textColor, {color: this.props.button, marginBottom: 10}]}>
                You are offline. Please connect to internet to view the form.
              </Text> : 
              <WebView
                source={{uri: story}}
              /> 
            :
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={true}
              style={{marginBottom: 35}}
              ref="scrollview"
              showsVerticalScrollIndicator={true}
            >
            { this.props.success ?
              <View>
                {!this.props.thought && !this.props.story && this.state.mediaList == '' && this.state.imageList == '' ?
                <Text style={styles.textColor}>
                  Story is not available
                </Text> : null}
                {this.props.reach === 'NONE' && (this.state.mediaList != '' || this.state.imageList != '') ?
                  <Text style={[styles.textColor, {color: this.props.button, marginBottom: 10}]}>
                  You are offline. Please connect to internet to view images & media
                  </Text> : null
                }
                <ImageView imageList={this.state.imageList} />
                {this.props.thought !== null ?
                <Text style={[styles.textColor, {marginBottom: 10}]}>
                  {(this.props.thought).trim()}
                </Text> : null}
                {this.props.story !== null ?
                <Text style={styles.textColor}>
                  {(this.props.story).trim()}
                </Text> : null}
                {this.state.mediaList != '' && this.props.reach != 'NONE' ?
                  <View>
                    <Text style={[styles.textColor, {fontSize: 18, fontWeight: 'bold', marginTop: 10}]}>{this.state.mediaType == "video" ? "Video" : "Audio"}:</Text>
                    <View style = {{flexDirection: 'row', justifyContent: 'space-between', marginTop: 15}}>
                      <Text numberOfLines={1} style={[styles.textColor, {flex: 0.6}]}>{this.state.title}</Text>
                      <TouchableOpacity
                        style={[styles.loginbutton, { width: 70, backgroundColor: 'rgb(224, 110, 56)', alignSelf: 'flex-start', marginTop: -10 }]}                   
                        onPress={() => {
                          Tts.stop()
                          this.props.dispatch(readThought(false))
                          AudioPlayer.stop()
                          Actions.media({
                            navigationBarStyle : {backgroundColor: this.props.navBar},
                            mediaList: this.state.mediaList,
                            videos,
                            videoTitles,
                            audios,
                            audioTitles,
                          })
                        }}
                      >                 
                        <Text style={[styles.buttonText, { fontSize: 14 }]}>
                         Play
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View> : null }
              </View> :
              <Spinner visible={true} color={this.props.navBar} overlayColor={'transparent'} /> }
            </ScrollView>}
            {this.props.success && ((story && (story.substring(0,4) !== "Http" && story.substring(0,4) !== "http"))) || !story ? 
            <ContentFooter mediaList={this.state.mediaList} /> : null }
          </View>

        <Modal
          open={this.props.imageExpand}
          offset={0}
          overlayBackground={'rgba(0, 0, 0, 1)'}
          animationDuration={160}
          animationTension={40}
          modalDidOpen={() => undefined}
          modalDidClose={() => undefined}
          closeOnTouchOutside={false}
          modalStyle={{
             backgroundColor: 'black',
          }}
        >        
          <Image
            source={{ uri: this.props.imageValue }}
            style={{
              height: 500,
              resizeMode: 'contain',
              flex: 1,
            }}
          >
            <TouchableHighlight underlayColor="transparent"
              style={{ padding: 20 }}
              onPress={() => {
                this.props.dispatch(isExpand(false))                            
              }}>
              <View style={{ height: 25, width: 25, borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.7)', alignSelf: 'flex-end', borderRadius: 12.5 }}>
                <Text style={{ color: 'rgba(255, 255, 255, 0.7)', alignSelf: 'center', fontWeight: 'bold' }}>X</Text>
              </View>
            </TouchableHighlight>
          </Image>
          <ImageFooter />
        </Modal>
      </View>
    )
  }
}

ContentScreen.propTypes = {
  dispatch: PropTypes.func,
  statusBar: PropTypes.string,
  navBar: PropTypes.string,
  button: PropTypes.string,
  container: PropTypes.string,
  tabcontent: PropTypes.string,
  titleCarousel: PropTypes.string,
  footer: PropTypes.string,
  imageExpand: PropTypes.bool,
  imageValue: PropTypes.string,
  thought: PropTypes.string,
  story: PropTypes.string,
  video: PropTypes.string,
  reach: PropTypes.string,
  success: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    date: state.ValEdu.get('date'),
    statusBar: state.ValEdu.get('statusBar'),
    navBar: state.ValEdu.get('navBar'),
    button: state.ValEdu.get('button'),
    container: state.ValEdu.get('container'),
    tabcontent: state.ValEdu.get('tabcontent'),
    titleCarousel: state.ValEdu.get('titleCarousel'),
    footer: state.ValEdu.get('footer'),
    imageExpand: state.ValEdu.get('imageExpand'),
    imageValue: state.ValEdu.get('imageValue'),
    thought: state.ValEdu.get('thought'),
    story: state.ValEdu.get('story'),
    reach: state.ValEdu.get('reach'),
    video: state.ValEdu.get('video'),
    notify: state.ValEdu.get('notify'),
    success: state.ValEdu.get('success'),
    notifDate: state.ValEdu.get('notifDate'),
  }
}

export default connect(mapStateToProps)(ContentScreen)
{/*<Media mediaList={this.state.mediaList} videos={videos} videoTitles={videoTitles} audios={audios} audioTitles={audioTitles}/> */}
