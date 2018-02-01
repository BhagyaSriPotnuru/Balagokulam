import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
  ListView,
  Dimensions,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
  NetInfo,
  TouchableNativeFeedback,
} from 'react-native'
import { connect } from 'react-redux'
import Calendar from 'react-native-calendar'
import moment from 'moment'
import { Actions } from 'react-native-router-flux'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import Orientation from 'react-native-orientation'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import Icon from 'react-native-vector-icons/FontAwesome'
import Spinner from 'react-native-loading-spinner-overlay'
import SQLite from 'react-native-sqlite-storage'
import HomeNavBar from './HomeNavBar'
import RecordsScreen from './RecordsScreen'
import http from '../utils/Http'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'
import createDb from '../utils/DbConnection'
import insertData from '../utils/InsertRecords'
import insertChannels from '../utils/InsertChannels'
import updateData from '../utils/UpdateRecords'
import deleteData from '../utils/DeleteRecords'
import { convertToIST } from '../utils/Validations'
import {
  dateChange,
  isCalendar,
  onNotify,
  loadAllDates,
  channelChange,
  notificationDate,
  isSearch,
  tagChange,
  isRec,
  noOfRows,
  records,
  clickSearch,
} from '../actions/ValEduActions'
var DeviceInfo = require('react-native-device-info')

const PushNotification = require('react-native-push-notification')
const customDayHeadings = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const customMonthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May',
  'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

let userId
let token
let registerToken
let allDates
let titles
let titlesView
let data
let datevalue
let dbCreated
let isCacheCreated
let channelsInserted
let currentMonth
let monthValue
let userTime
let model = DeviceInfo.getModel()
let i = 0
let j = 0
let { width } = Dimensions.get("window").width
let initial = Orientation.getInitialOrientation()
const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

class CalendarView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedDate: moment().utcOffset(330).format(),
      dataSource: ds.cloneWithRows([]),
      allDates: [],
      orientation: initial,
    }
    db = SQLite.openDatabase({name: 'test.db', createFromLocation : "~balagokulam.db", location: 'Library'},() => {
      // console.log('db opened')
      }, (e) => {
      // console.log('error' + JSON.stringify(e))
    })
  }

  orientationDidChange = (orientation) => {
    this.setState({orientation})
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationDidChange)
  }

  componentDidMount = async () => {    
    try {       
      birthDate = await AsyncStorage.getItem('birthDate')
      dbCreated = await AsyncStorage.getItem('dbCreated')
      channelsInserted = await AsyncStorage.getItem('channelsInserted')
      channelsInserted = JSON.parse(channelsInserted)
      dbCreated = JSON.parse(dbCreated)
      currentMonth = await AsyncStorage.getItem('currentMonth')
      Orientation.addOrientationListener(this.orientationDidChange)
      Orientation.getOrientation((err, orientation) => {
        this.setState({orientation})
      })
      const date = convertToIST(new Date())
      if(!dbCreated) {
        await createDb()
      }

      let monthValue = date.getMonth()
      if(!currentMonth) {
        await AsyncStorage.setItem('currentMonth', JSON.stringify(monthValue))
      }

      this.createCache()
      this.getAllDates()
      this.configurePush()
        
      if(!channelsInserted) {
        this.insertChannels()
      }
      const { dispatch } = this.props
      if(this.props.isChannelChanged) {
        dispatch(channelChange(false))
        setTimeout(()=>this.getAllDates(), 0)
      }
      setInterval(() => {
        if(this.props.isChannelChanged) {
          dispatch(channelChange(false))
          setTimeout(()=>this.getAllDates(), 0)
        }
      }, 1500)  
    } catch(e) {}    
  }

  insertChannels = async () => {
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      http('fetchUserChannels', { userId }, 'POST', token)
      .then(async (response) => {
        if(response.Message) {
          getRefreshToken()
          this.fetchUserChannels()
        } else if (!response.isActive) {
          AsyncStorage.multiRemove(['theme', 'updatedTables', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
          Actions.welcome()
        } else if (response.status) {
          await insertChannels(response.channelList)
          await AsyncStorage.setItem('channelsInserted', 'true')
        }
      })
    } catch(e) {}
  }

  getAllDates = async () => {
    let allDates = []
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      isCacheCreated = await AsyncStorage.getItem('cacheCreated')
      isCacheCreated = JSON.parse(isCacheCreated)
      if(this.props.reach == 'NONE') {
        if (isCacheCreated) {
          let offLineDatesData = []
          db.transaction((tx) => {
            tx.executeSql('select record_title_id as tId,title,createdOn from record_title_data order by createdOn desc', [], (tx, results) => {
              for (let index=0; index<results.rows.length; index++) {
                let contentDate = results.rows.item(index).createdOn
                let title = results.rows.item(index).title
                let tId = results.rows.item(index).tId
                if (index === 0) {
                  offLineDatesData.push({contentDate,titleList : [{title,tId}] })
                } else {
                  let len = offLineDatesData.length;
                  if (contentDate == offLineDatesData[len-1].contentDate) {
                    offLineDatesData[len-1].titleList.push({title,tId})
                  } else {
                    offLineDatesData.push({contentDate,titleList : [{title,tId}] })
                  }
                }
              }
              data = offLineDatesData
              for(i = 0; i < data.length ; i++) {
                allDates.push(data[i].contentDate)       
              }
              this.setState({allDates})
              this.onDateSelection(this.state.selectedDate)            
            }, (e) => {
                // console.log('error' + JSON.stringify(e))
            })
          })
        } else {
          /*Alert.alert (
            'Balagokulam - Seekho Sikhao',
            'You are offline. Please connect to internet',
            [
              { text: 'OK'},
            ],
            { cancelable: false }
          )*/
        }
      } else {
        http('fetchAllDates', { userId }, 'POST', token)
        .then((response) => {
          if(response.Message) {
            getRefreshToken()
            this.getAllDates()
          } else if (!response.isActive) {
            AsyncStorage.multiRemove(['theme', 'updatedTables', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
            Actions.welcome()            
          } else if(response.status) {
            data = response.dayList
            if(data) {
              for(i = 0; i < data.length ; i++) {
                allDates.push(data[i].contentDate)       
              }
            }
            this.setState({allDates})
            this.onDateSelection(this.state.selectedDate)
          }
        }).catch((e) => {
          // alert('error')
        })
      }
    } catch(e) {
      // alert(e)
    }
  }

  createCache = async () => {
    try {
      isCacheCreated = await AsyncStorage.getItem('cacheCreated')
      currentMonth = await AsyncStorage.getItem('currentMonth')
      isCacheCreated = JSON.parse(isCacheCreated)
      let date = convertToIST(new Date())
      monthValue = date.getMonth()

      if(JSON.parse(currentMonth) === monthValue) {
        if (!isCacheCreated) {
          this.fetchCacheData(0)
        } else {
          this.fetchCacheUpdate()
        }
      } else {
        db.transaction((tx) => {
          tx.executeSql('delete from record_data')
          tx.executeSql('delete from images')
          tx.executeSql('delete from media')
          tx.executeSql('delete from channels')
          tx.executeSql('delete from record_title_data')
          tx.executeSql('delete from channels_info')             
          AsyncStorage.removeItem('cacheCreated')
          AsyncStorage.setItem('currentMonth', JSON.stringify(monthValue))
          this.fetchCacheData(0)
        })
      }
    } catch(e) {}
  }

  fetchCacheData = async (monthPosition) => {
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      isCacheCreated = await AsyncStorage.getItem('cacheCreated')
      isCacheCreated = JSON.parse(isCacheCreated)
      let data = {
        userId,
        monthPosition,
      }
      if (this.props.reach === 'NONE') {
        if(!isCacheCreated) {
          Alert.alert (
            'Balagokulam - Seekho Sikhao',
            'You are offline. Please connect to internet',
            [
              { text: 'OK'},
            ],
            { cancelable: false }
          )
        }
      } else {
        http('fetchMobileCacheByMonth', data, 'POST', token)
        .then(async (response) => {
          if(response.Message) {
            getRefreshToken()
            this.fetchCacheData()
          } else if (!response.isActive) {
            AsyncStorage.multiRemove(['theme', 'updatedTables', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
            Actions.welcome()
          } else if (response.status) {
            // alert(JSON.stringify(response))
            try {
              await AsyncStorage.setItem('apiTime', response.apiTime)
              // console.log(monthPosition)
              if (response.contentList.length > 0) {
                await insertData(response.contentList)
              } else {

              }
              if(!isCacheCreated) {
                if (monthPosition === 0) {
                  this.fetchCacheData(-1)
                } else if (monthPosition === -1) {
                  this.fetchCacheData(1)
                } else if (monthPosition === 1) {
                  await AsyncStorage.setItem('cacheCreated', JSON.stringify(true))
                }
              }
            } catch(e) {}
          }
        })
        .catch((error) => {
          // alert(error)
        })
      }
    } catch(e) {}
  }

  fetchCacheUpdate = async () => {
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      userTime = await AsyncStorage.getItem('apiTime')
      let data = {
        userId,
        userTime,
      }
      if (this.props.reach === 'NONE') {
        /*Alert.alert (
          'Balagokulam - Seekho Sikhao',
          'You are offline. Please connect to internet',
          [
            { text: 'OK'},
          ]
        )*/
      } else {
        http('fetchCacheUpdate', data, 'POST', token)
        .then(async (response) => {
          if(response.Message) {
            getRefreshToken()
            this.fetchCacheUpdate()
          } else if (!response.isActive) {
            AsyncStorage.multiRemove(['theme', 'updatedTables', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
            Actions.welcome()
          } else if (response.status) {
            // alert(JSON.stringify(response.updateList))
            try {
              if(response.addList && response.addList.length > 0) {
                await insertData(response.addList)
              }
              if(response.updateList && response.updateList.length > 0) {
                await updateData(response.updateList)
              }
              if(response.deletedList && response.deletedList.length > 0) {
                await deleteData(response.deletedList)
              }
              AsyncStorage.setItem('apiTime', response.apiTime)
              if(response.addList || response.updateList || response.deletedList) {
                this.getAllDates()
              }
              
            } catch (e) {}
          }
        }).catch((error) => {
          // alert('error')
        })
      }
    } catch(e) {}
  }

  configurePush = async () => {
    const { dispatch, reach } = this.props   
    try {
      registerToken = await AsyncStorage.getItem('registerToken')
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      // alert(registerToken)
      PushNotification.configure({
        onRegister(result) {
          if (!registerToken) {
            AsyncStorage.setItem('registerToken', result.token)
            const data = {
              userId,
              deviceToken: result.token,
              deviceUdId: DeviceInfo.getUniqueID(),
              isNotificationEnabled: true,
              platform: result.os,
            }
            if (token && reach != 'NONE') {
              http('saveDeviceRegId', data, 'POST', token)
              .then((response) => {
                if(response.Message) {
                  getRefreshToken()
                  this.configurePush()
                } else if (!response.isActive) {
                  AsyncStorage.multiRemove(['theme', 'updatedTables', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
                  Actions.welcome()
                } else if (response.status) {
                  // console.log('push notifications registered successfully')
                } else {
                  // console.log('push notifications not registered')
                }
              })
              .catch((error) => {
                // alert(error)
              })
            }
          }
        },

        onNotification(notification) {
          try {          
            GoogleAnalytics.trackEvent('NotificationRecieved', '' + notification.data.contentTitle + '')
            db.transaction((tx) => {
            tx.executeSql('select count(*) as count from record_title_data where record_title_id = \'' + notification.data.tId + '\'', [], (tx, data) => {
              // alert(data.rows.item(0).count)
              if (data.rows.item(0).count == 0) {
                const data = {
                  userId,
                  tId: notification.data.tId
                }
                http('fetchContentBytitleId', data, 'POST', token)
                .then((response) => {
                  if(response.Message) {
                    getRefreshToken()
                  } else if (!response.isActive) {
                    AsyncStorage.multiRemove(['theme', 'updatedTables', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
                    Actions.welcome()
                  } else if (response.status) {
                    insertData([response.contentInfo])
                  }
                })
                .catch((error) => {
                  // alert(error)
                })
              }}, (e) => {
                // console.log('error' + JSON.stringify(e))
              })
            }, (e) => {
              // console.log('error' + JSON.stringify(e))
            }) 
            dispatch(onNotify(true))                       
            if(notification.userInteraction) {              
              GoogleAnalytics.trackEvent('NotificationClick', '' + notification.data.contentTitle + '')
              if (notification.data.routeKey === 'content_update') {
                const contentDate = convertToIST(new Date(notification.data.contentDate))
                dispatch(dateChange(contentDate))
                setTimeout(() => {
                  Actions.contentscreen({titleId: notification.data.tId})               
                }, 1200)
              }
             /* if (notification.data.routeKey === 'birthday') {
                if(showBdayScreen === 'notShown') {
                  Actions.birthday({navigationBarStyle : {backgroundColor: this.props.navBar}})
                }
              }*/
            }
          } catch(e) { 
          // console.log(e) 
          }
        },

        senderID: '402074549643',
        permissions: {
          alert: true,
          badge: true,
          sound: true,
        },

        popInitialNotification: true,
        requestPermissions: token ? true : false,
      })
    } catch (error) { }
  }

  onDateSelection = (date) => {
    try {
      this.setState({ selectedDate: date })
      titles = []
      titlesView = []
      let currentDate = convertToIST(new Date(date))
      let day = currentDate.getDate()
      if (day < 10) {
        day = '0' + day
      }
      let month = currentDate.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      let year = currentDate.getFullYear()
      const datec = year + '-' + month + '-' + day
      if(data) {
        for(i = 0; i < data.length; i++) {

          datevalue = convertToIST(new Date(data[i].contentDate))
          day = datevalue.getDate()
          if (day < 10) {
            day = '0' + day
          }
          month = datevalue.getMonth() + 1
          if (month < 10) {
            month = '0' + month
          }
          year = datevalue.getFullYear()
          const datev = year + '-' + month + '-' + day

          if(datev == datec) {
            titles = data[i].titleList
            this.setState({dataSource: ds.cloneWithRows(data[i].titleList)})
          }
          if(titles == ''){
            this.setState({dataSource: ds.cloneWithRows([])})
          }
        }
      } else {
        this.setState({dataSource: ds.cloneWithRows([])})
      }
    } catch(e) {
      // alert(e)
    }
  }

  getPrevDate = (e) => {  
    try {
      let monthValue = e.month()
      let yearValue = e.year()
      let tag = true
      let date
      let i
      let allDates = this.state.allDates
      for (i = 0; i < allDates.length ; i++) {
        date = convertToIST(new Date(allDates[i]))
        if(date.getMonth() == monthValue && date.getFullYear() == yearValue) {
          tag = false           
          break
        }
      }

      if(tag) {
        date.setDate(1)
        date.setMonth(monthValue)
        date.setYear(yearValue)
      }
      this.setState({selectedDate: date})
      this.onDateSelection(date)
    } catch(e) {}
  }

  getNextDate = (e) => {
    try {
      let monthValue = e.month()
      let yearValue = e.year()
      let tag = true
      let date
      let i
      let allDates = this.state.allDates
      for (i = allDates.length; i > 0 ; i--) {
        date = convertToIST(new Date(allDates[i]))
        if(date.getMonth() == monthValue && date.getFullYear() == yearValue) {
          tag = false             
          break
        }
      }

      if(tag) {
        date.setDate(1)
        date.setMonth(monthValue)
        date.setYear(yearValue)
      }

      this.setState({selectedDate: date})
      this.onDateSelection(date)
    } catch(e) {}
  }

  onBack = () => {   
    const { dispatch } = this.props
    dispatch(isSearch(false))
    dispatch(clickSearch(false))
    dispatch(tagChange(''))
    dispatch(records([]))
    dispatch(noOfRows(-1))
    dispatch(isRec(true))
    dismissKeyboard()
  }

  onSearch = () => {
    const { dispatch } = this.props
    dispatch(clickSearch(true))
    dismissKeyboard()
    if (this.props.tag) {
      this.searchRecords()
    }
  }

  searchRecords = async () => {
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
    }
    catch (e) {}
    const { dispatch } = this.props
    if (this.props.reach === 'NONE') {
      Alert.alert(
        'Balagokulam - Seekho Sikhao',
        'You are offline. Please connect to internet',
        [
          { text: 'OK'},
        ]
      )
    } else {
      http('searchRecords', { searchkey: this.props.tag, type: 'all', userId }, 'POST', token)
      .then((response) => {
        if(response.Message) {
          getRefreshToken()
          this.searchRecords()
        } else if (!response.isActive) {
          AsyncStorage.multiRemove(['theme', 'updatedTables', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
          Actions.welcome()
        } else if (response.status && response.searchList) {
          dispatch(records(response.searchList))
          dispatch(isRec(true))         
        } else {
          dispatch(isRec(false))
        }
      })
      .catch((error) => {
        // alert(error)
      })
    }
  }

  render() {
    return (
        <View style={[styles.container, { backgroundColor: this.props.container, paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 }]}>
        <StatusBar
          backgroundColor={this.props.statusBar}
          barStyle="light-content"
        />
        <HomeNavBar
          onBack={this.onBack}
          openMenu={this.props.openMenu}
          onSearch={this.onSearch}
        />
      <ScrollView showsVerticalScrollIndicator={false}>
      {!this.props.searchClick ?
      <View style={{flexDirection: this.state.orientation == 'PORTRAIT' ? null : 'row', flexWrap: this.state.orientation == 'PORTRAIT' ? null : 'wrap'}}>
        {this.state.selectedDate || this.state.orientation ?
        <Calendar
          ref="calendar"
          showEventIndicators
          eventDates={this.state.allDates}
          showControls
          scrollEnabled={this.state.orientation == 'PORTRAIT' && !model.includes('Nexus') ? true : false}
          dayHeadings={customDayHeadings}
          monthNames={customMonthNames}
          onTouchPrev={this.getPrevDate}
          onTouchNext={this.getNextDate}
          onSwipePrev={this.getPrevDate}
          onSwipeNext={this.getNextDate}
          titleFormat={'MMM YYYY'}
          prevButtonText={'Prev'}
          nextButtonText={'Next'}
          selectedDate={this.state.selectedDate}
          onDateSelect={this.onDateSelection}         
          today={this.state.selectedDate}
          startDate={this.state.selectedDate}
          currentMonth={this.state.selectedDate}
          customStyle={{
            calendarContainer: {
              backgroundColor: this.props.container,
            },
            weekendHeading: {
              color: Colors.black,
            },
            selectedDayCircle: {
              backgroundColor: this.props.button,
            },
            dayButton: {
              borderBottomWidth: 0.5,
              borderBottomColor: 'gray',
            },
            eventIndicator: {
              backgroundColor: this.props.button,
              width: 6,
              height: 6,
              borderRadius: 3,
            },
            currentDayCircle: {
              backgroundColor: this.props.button,
            },
            currentDayText: {
              color: this.props.button,
              fontWeight: 'bold',
            },
            controlButtonText: {
              color: this.props.statusBar,
              fontWeight: 'bold',
            },
            title: {
              color: this.props.statusBar,
              fontWeight: 'bold',
            },
          }}
        /> : null }  

        <View style={{ flex: 1, marginLeft: this.state.orientation === 'PORTRAIT' ? null : 30 }}>
          <View style={{backgroundColor: this.state.orientation === 'PORTRAIT' ? this.props.footer : null}}>
            <Text style={[styles.storiesText, { alignSelf: this.state.orientation === 'PORTRAIT' ? 'center' : null, marginLeft: this.state.orientation === 'PORTRAIT' ? null : 7}]}>
              Stories on {moment(this.state.selectedDate).utcOffset(330).format('MMM DD, YYYY')}
            </Text>
          </View>
          {!this.state.dataSource.getRowCount() ?
          <Text style={[styles.textColor, {margin: 10}]}>
          No stories found for the selected date.
          Please select a date which is highlighted to view the stories.</Text> : null }
          <ListView
            dataSource={this.state.dataSource}
            enableEmptySections={true}
            renderRow={(rowData) => {
              return(
              <View style={{borderBottomColor: 'gray', borderBottomWidth: 0.5}}>
                <TouchableHighlight
                  underlayColor="transparent"
                  style={{paddingHorizontal: 10, paddingVertical: 15}}
                  onPress={() => {                  
                    this.props.dispatch(dateChange(convertToIST(new Date(this.state.selectedDate))))
                    GoogleAnalytics.trackEvent('recordView', '' + rowData.title + '')
                    Actions.contentscreen({titleId: rowData.tId})
                  }}
                >
                  <Text style={styles.textColor}>{rowData.title}</Text>
                </TouchableHighlight>
              </View>
              )
            }}
          />       
        </View>
        </View> : <RecordsScreen />}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    container: state.ValEdu.get('container'),
    statusBar: state.ValEdu.get('statusBar'),
    footer: state.ValEdu.get('footer'),
    navBar: state.ValEdu.get('navBar'),
    button: state.ValEdu.get('button'),
    allDates: state.ValEdu.get('allDates'),
    calendar: state.ValEdu.get('calendar'),
    reach: state.ValEdu.get('reach'),
    notify: state.ValEdu.get('notify'),
    isChannelChanged: state.ValEdu.get('isChannelChanged'),
    tag: state.ValEdu.get('tag'),
    searchClick: state.ValEdu.get('searchClick'),
  }
}

export default connect(mapStateToProps)(CalendarView)
