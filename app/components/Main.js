import React, { Component, PropTypes } from 'react'
import {
  View,
  TouchableOpacity,
  AsyncStorage,
  Linking,
  BackAndroid,
  Alert,
  AppState,
  NetInfo,
  Platform,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Scene, Router, Actions } from 'react-native-router-flux'
import DeviceInfo from 'react-native-device-info'
import { connect } from 'react-redux'
import SplashScreen from 'react-native-splash-screen'
import Tts from 'react-native-tts'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import AudioPlayer from 'react-native-play-audio'
import SQLite from 'react-native-sqlite-storage'
import Welcome from './Welcome'
import Aboutus from './settings/AboutUs'
import EditProfile from './profile/EditProfile'
import ProfileInfo from './profile/ProfileInfo'
import ContentScreen from './ContentScreen'
import NavigationDrawer from './NavigationDrawer'
import Feedback from './settings/Feedback'
import CalendarView from './CalendarView'
import Channels from './Channels'
import Media from './contentType/Media'
import { getRefreshToken } from './refreshToken'
import {
  showModal,
  themeNum,
  readThought,
  readStory,
  isCalendar,
  appConstants,
  isNetwork,
  audioPlay,
} from './../actions/ValEduActions'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'
import http from '../utils/Http'

let token
let userId
let tablesUpdated
let url = 'https://play.google.com/store/apps/details?id=com.valueeducation'
console.disableYellowBox = true
let db

class ValueEducation extends Component {
  constructor(props) {
    super(props)
    this.state = {
      logged: false,
      loading: true,
    }
    db = SQLite.openDatabase({
      name: 'test.db',
      createFromLocation : "~balagokulam.db",
      location: 'Library'
    }, () => {
    // console.log('db opened')
      }, (e) => { // console.log('error' + JSON.stringify(e))
    })
  }

  handleAppStateChange = (appState) => {
    if(appState == 'active') {
      if (this.props.reach === 'NONE') {
        // alert('No Internet Connection')
        /*Alert.alert(
          'Balagokulam - Seekho Sikhao',
          'Please connect to internet for accessing the app',
          [
            { text: 'OK'},
          ]
        )*/
        SplashScreen.hide()
      } else {
        http('isUpdateAvailable', {userAppVersion: DeviceInfo.getVersion()}, 'POST')
        .then((response) => {
          if (response.status && response.forceUpdateAvailable) {          
            Alert.alert(
              'Update Available',
              'Please update your app to the latest version',
              [               
                { text: 'OK', onPress: () => {
                  Linking.canOpenURL(url).then(supported => {
                    if (supported) {
                      Linking.openURL(url);
                    } else {
                      alert('can not open the url: ' + url);
                    }
                  })
                } },
              ],
              { cancelable: false }
            )           
          } else {
            SplashScreen.hide()
          }         
        })
        .catch((error) => {
          // alert(error)
        })
      }
    }
    else {
      AudioPlayer.stop()
      this.props.dispatch(audioPlay(false))
      this.props.dispatch(readThought(false))
      this.props.dispatch(readStory(false))
      Tts.stop()
    }
  }

  componentDidMount = async () => {
    const { dispatch } = this.props   
    AppState.addEventListener('change', this.handleAppStateChange)
    this.handleAppStateChange('active')
    NetInfo.fetch().done((reach) => {
      dispatch(isNetwork(reach))
    })
    NetInfo.addEventListener('change', this.handleConnectionInfoChange)
    try {
      theme = await AsyncStorage.getItem('theme')
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      tablesUpdated = await AsyncStorage.getItem('tablesUpdated')   
      theme = JSON.parse(theme)
      if(theme != null){
        dispatch(themeNum(theme))
      } else {
        await AsyncStorage.setItem('theme', JSON.stringify(0))
      }
      if (token && userId) {
        this.setState({
          logged: true,
          loading: false,
        })
        this.getProfileInfo()
        if (!tablesUpdated) {
          if (DeviceInfo.getVersion() == '1.2.3') {
            db.transaction((tx) => {             
              tx.executeSql('drop table if exists record_data')
              tx.executeSql('drop table if exists images')
              tx.executeSql('drop table if exists media')
              tx.executeSql('drop table if exists channels')
              tx.executeSql('drop table if exists record_title_data')
              tx.executeSql('drop table if exists channels_info')             
              AsyncStorage.removeItem('dbCreated')
              AsyncStorage.removeItem('cacheCreated')
            })
            AsyncStorage.setItem('tablesUpdated', 'true')
          }
          this.saveVersion()
        }
      } else {
        this.setState({
          loading: false,
        })
      }
    } catch (e) { }
  }

  saveVersion = async () => {
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      http('saveUserVersion', { userId, version: DeviceInfo.getVersion(), devicePlaform: Platform.OS }, 'POST', token)
      .then((response) => {
        if (response.status) {
        } 
      })
      .catch((error) => {
        // alert(error)
      })
    } catch (e) {}
  }

  handleConnectionInfoChange = (reach) => {
    this.props.dispatch(isNetwork(reach))
  }

  getProfileInfo = async () => {
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      if (this.props.reach === 'none') {
        // alert('No Internet Connection')
      } else {
        http('profileInfo', { userId }, 'POST', token)
        .then((response) => {
          // alert(JSON.stringify(response))
          if(response.Message) {
            getRefreshToken()
            this.getProfileInfo()
          } else if (!response.isActive) {
            AsyncStorage.multiRemove(['theme', 'tablesUpdated', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
            Actions.welcome()            
          } else if (response.status) {
            AsyncStorage.setItem('name', response.name)
            AsyncStorage.setItem('email', response.email)
            // AsyncStorage.setItem('birthDate', response.birthDate)
            AsyncStorage.setItem('profileImage', response.profileImage)
          }
        })
        .catch((error) => {
          // alert(error)
        })
      }
    } catch (e) {}
  }

  onDelete = () => {
    if (this.props.reach === 'NONE') {
      Alert.alert(
        'Balagokulam - Seekho Sikhao',
        'You are offline. Please connect to internet.',
        [
          { text: 'OK'},
        ]
      )
    } else {
      Alert.alert(
        'Delete Account',
        'Are you sure you want to delete your Account?',
        [
          { text: 'Cancel' },
          { text: 'OK', onPress: this.deleteAccount },
        ],
        { cancellable: false }
      )
    }   
  }

  deleteAccount = async () => {
    try {
      userId = await AsyncStorage.getItem('userId')
      if (this.props.reach === 'NONE') {
        Alert.alert(
          'Balagokulam - Seekho Sikhao',
          'You are offline. Please connect to internet.',
          [
            { text: 'OK'},
          ]
        )
      } else {
        http('deleteAccount', { userId })
        .then((response) => {
          // alert(JSON.stringify(response))
          if(response.Message) {
            getRefreshToken()
            this.deleteAccount()
          } else {
            this.props.dispatch(isCalendar(true))
            this.props.dispatch(themeNum(0))
            AsyncStorage.multiRemove(['dbCreated', 'cacheCreated', 'theme', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
            GoogleAnalytics.trackEvent('AccountDeleted', 'account')
            // this.setState({logged: false, loading: true})
            db.transaction((tx) => {             
              tx.executeSql('drop table if exists record_data')
              tx.executeSql('drop table if exists images')
              tx.executeSql('drop table if exists media')
              tx.executeSql('drop table if exists channels')
              tx.executeSql('drop table if exists record_title_data')
              tx.executeSql('drop table if exists channels_info')             
            }, (e) => {})
            Actions.welcome()
          }
        })
        .catch((error) => {
          // alert(error)
        })
      }
    } catch (e) { }
  }

  Search = () => {
    const { dispatch } = this.props
    dispatch(showModal())
  }

  rightButton = () => {
    return (
      <View style={styles.centerItems}>
        <TouchableOpacity onPress={this.Search}>
          <Icon name="search" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    )
  }

  calenderRightButton = () => {
    return (
      <View style={styles.centerItems}>
        <TouchableOpacity onPress={() => this.props.dispatch(isCalendar(false))}>
          <Icon name="list-ul" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    )
  }

  homeLeftButton = () => {
    return (
      <View style={styles.centerItems}>
        <TouchableOpacity onPress={this.Search}>
          <Icon name="bars" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    )
  }

  profileRightButton = () => {
    return(
      <View style={styles.centerItems}>
        <TouchableOpacity onPress={this.onDelete} style={{paddingLeft: 50, paddingVertical: 15}}>
          <Icon name="trash" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if (this.state.loading) {
      return <View />
    }
    return (
      <Router
        navigationBarStyle={{backgroundColor: this.props.navBar}}
        titleStyle={styles.navBarTitle}
        barButtonTextStyle={styles.barButtonTextStyle}
        barButtonIconStyle={styles.barButtonIconStyle}
      >
        <Scene
          key="welcome"
          component={Welcome}
          title="Welcome"
          hideNavBar
          initial={!this.state.logged}
        />
        <Scene
          key="profileinfo"
          component={ProfileInfo}
          title="Profile"
          type="reset"
        />
        <Scene
          key="drawer"
          component={NavigationDrawer}
          initial={this.state.logged}
          type="reset"
          hideNavBar 
        />
        <Scene
          key="contentscreen"
          component={ContentScreen}
          renderTitle={this.getTitle}
          hideNavBar
        />
        <Scene
          key="editprofile"
          component={EditProfile}
          title="Edit Profile"
          renderRightButton={this.profileRightButton}
          hideNavBar={false}
        />
        <Scene
          key="aboutus"
          component={Aboutus}
          title="About us"
          hideNavBar={false}
        />
        <Scene
          key="feedback"
          component={Feedback}
          title="Feedback"
          hideNavBar={false}
        />
        <Scene
          key="media"
          component={Media}
          title="Media"
          hideNavBar={false}
        />
        <Scene
          key="channel"
          component={Channels}
          title="Choose Channels"
          hideNavBar={false}
        />
      </Router>
    )
  }
}

ValueEducation.propTypes = {
  dispatch: PropTypes.func,
  navBar: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    navBar: state.ValEdu.get('navBar'),
    reach: state.ValEdu.get('reach'),
  }
}

export default connect(mapStateToProps)(ValueEducation)

/*renderTitle={this.getTitle}
          rightTitle="Submit"
          rightButtonTextStyle={{color: 'white'}}
          onRight={() => {
            alert('Submit')
          }}
          renderRightButton={this.contentRightButton}
renderRightButton={this.rightButton}
{ text: 'Cancel', onPress: () => { BackAndroid.exitApp() } },*/
