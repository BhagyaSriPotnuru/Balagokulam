import React, { Component, PropTypes } from 'react'
import {
  View,
  ListView,
  AsyncStorage,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
  NetInfo,
  Alert,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import { connect } from 'react-redux'
import Footer from './Footer'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import { getRefreshToken } from './refreshToken'
import DeviceInfo from 'react-native-device-info'
import SQLite from 'react-native-sqlite-storage'
import  insertData from '../utils/InsertRecords'
import HomeNavBar from './HomeNavBar'
import RecordsScreen from './RecordsScreen'
import {
  startSpinner,
  stopSpinner,
  records,
  dateChange,
  onNotify,
  isCalendar,
  channelChange,
  tagChange,
  isSearch,
  isRec,
  recExist,
  noOfRows,
  internetAlert,
  recRendered,
} from '../actions/ValEduActions'
import http from '../utils/Http'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'

let index = 0
let width
let registerToken
let token
let userId
let isCacheCreated
let cacheRecordsNum = 0
let currentDate
let db

class ListScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      rows: [],
      reach: 'NONE',
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

  componentDidMount = async () => {
    try {
      dbCreated = await AsyncStorage.getItem('dbCreated')
      dbCreated = JSON.parse(dbCreated)
      const { dispatch } = this.props
      NetInfo.fetch().done((reach) => {
        this.setState({reach})
        if(reach !== 'NONE') {
          dispatch(recExist(true))
          dispatch(internetAlert(false))
        }
      })
      NetInfo.addEventListener('change',this.handleConnectionInfoChange)    
      dispatch(startSpinner())
      this.getContent()
      if(this.props.notify || this.props.isChannelChanged) {
        dispatch(onNotify(false))
        dispatch(channelChange(false))
        dispatch(recExist(true))
        dispatch(noOfRows(-1))
        cacheRecordsNum = 0                    
        this.setState({rows: []})
        setTimeout(()=>this.getContent(), 0)
      }
      setInterval(() => {
        if(this.props.notify || this.props.isChannelChanged) {
          dispatch(onNotify(false))
          dispatch(channelChange(false))
          dispatch(recExist(true))
          dispatch(noOfRows(-1))
          cacheRecordsNum = 0                    
          this.setState({rows: []})
          setTimeout(()=>this.getContent(), 0)
        }
      }, 1500)
    } catch(e) {}
  }

  handleConnectionInfoChange = (reach) => {
    const { dispatch } = this.props
    this.setState({reach})
    if(reach !== 'NONE') {  
      dispatch(recExist(true))
      dispatch(internetAlert(false))
    }
  }

  componentWillUnmount() {
    NetInfo.removeEventListener('change', this.handleConnectionInfoChange)
  }

  displayContent = async () => {
    try {
      const { dispatch } = this.props
      dispatch(recRendered(false))
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      isCacheCreated = await AsyncStorage.getItem('cacheCreated')
      isCacheCreated = JSON.parse(isCacheCreated)     

      let recordsList = []
      
      if (!isCacheCreated || this.props.rowsDisplayed >= cacheRecordsNum || cacheRecordsNum == 0) {
        if (this.state.reach === 'NONE') {
            dispatch(recRendered(true))
            dispatch(recExist(false))
            dispatch(internetAlert(true))
            dispatch(stopSpinner())
            Alert.alert(
              'Balagokulam - Seekho Sikhao',
              'You are offline. Please Connect to internet to view more Stories',
              [
                { text: 'OK'},
              ],
              { cancelable: false }
            )
        } else {
          dispatch(internetAlert(false))
          http('fetchNextRecords', { currentCount: this.props.rowsDisplayed, type: 'all', userId }, 'POST', token)
          .then((response) => {          
            if (response.Message) {
              getRefreshToken()
              this.displayContent()
            } else if (!response.isActive) {
              AsyncStorage.multiRemove(['theme', 'tablesUpdated', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
              Actions.welcome()            
            } else if (response.status && response.recordList) {
              // alert(response.recordList.length)
              dispatch(noOfRows(this.props.rowsDisplayed + response.recordList.length))
              if(response.recordList.length < 10) {
                dispatch(recExist(false))
              } else {
                dispatch(recExist(true))
              }
              this.setState({ rows: this.state.rows.concat(response.recordList) })
              dispatch(records(this.state.rows))
              dispatch(stopSpinner())
              dispatch(recRendered(true))     
            } 
            if (response.status && !response.recordList) {
              dispatch(recExist(false))
              dispatch(recRendered(true))
            }
          })
          .catch((error) => {
            // alert('error')
          })
        }

      } else if (isCacheCreated && this.props.rowsDisplayed < cacheRecordsNum) {
        let query = 'select rtd.record_title_id as tId,rtd.title as title,rtd.createdOn,story,thought,image as imageUrl '+
          'from (select * from record_title_data '+
          'where date(createdOn)<=\'' + currentDate + '\' order by date(createdOn) desc,record_title_id desc limit 10 offset ?) as rtd '+
          'inner join record_data on record_data.record_id=rtd.record_title_id'
        db.transaction((tx) => {
          tx.executeSql(query, [this.props.rowsDisplayed], (tx, results) => {
            // alert(results.rows.length)
            if (results.rows.length > 0) {
               for (let index = 0; index < results.rows.length; index++) {
                  let row = results.rows.item(index)
                  recordsList.push(row)
               }
               this.setState({ rows: this.state.rows.concat(recordsList) })
               dispatch(recRendered(true))
               dispatch(internetAlert(false))
               dispatch(records(this.state.rows))
               dispatch(stopSpinner())
               dispatch(noOfRows(this.props.rowsDisplayed === -1 ? 0 : this.props.rowsDisplayed))
               dispatch(noOfRows(this.props.rowsDisplayed + results.rows.length))
               if(results.rows.length < 10 && this.props.recordsRendered && this.props.recordsExist && !this.props.search && !this.props.noInternetAlertTriggered) {
                  this.displayContent()
               }
            }
          },(e) => {
            // console.log('error' + JSON.stringify(e))
        })
       })           
      }
    }
    catch(e) {} 
  }


  getContent = async () => {
    try {
      currentDate = JSON.stringify(new Date())
      currentDate = currentDate.substring(1,11)
      isCacheCreated = await AsyncStorage.getItem('cacheCreated')
      isCacheCreated = JSON.parse(isCacheCreated)
      if (isCacheCreated) {
        if (this.props.rowsDisplayed === -1) {
          db.transaction((tx) => {
            tx.executeSql('select count(*) as count from record_title_data where date(createdOn) = \'' + currentDate + '\'', [], (tx, data) => {
              if (data.rows.item(0).count == 0) {
                tx.executeSql('select min(createdOn) as createdOn from record_title_data where date(createdOn) > \'' + currentDate + '\'',
                [], (tx, results) => {
                  if(results.rows.item(0).createdOn) {
                    currentDate = JSON.stringify(new Date(results.rows.item(0).createdOn))
                    currentDate = currentDate.substring(1,11)
                  }
                  tx.executeSql('select count(*) as count from record_title_data where date(createdOn) <= \'' + currentDate + '\'',
                  [], (tx, results) => {
                    cacheRecordsNum = results.rows.item(0).count
                    this.displayContent()
                  }, (e) => {
                  // console.log('error' + JSON.stringify(e))
                }) 
                }, (e) => {
                // console.log('error' + JSON.stringify(e))
              })
              } else {
                tx.executeSql('select count(*) as count from record_title_data where date(createdOn) <= \'' + currentDate + '\'',
                [], (tx, results) => {
                  cacheRecordsNum = results.rows.item(0).count
                  this.displayContent()
                }, (e) => {
                // console.log('error' + JSON.stringify(e))
              }) 
              }
            },(e) => {
            // console.log('error' + JSON.stringify(e))
          })
          })
        }
      } else {
        this.displayContent()
      }
    } catch(e) {}
  }

  searchRecords = async () => {
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
    }
    catch (e) {}
    const { dispatch } = this.props
    if (this.state.reach === 'NONE') {
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
          AsyncStorage.multiRemove(['theme', 'tablesUpdated', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
          Actions.welcome()
        } else if (response.status && response.searchList) {
          dispatch(isRec(true))
          dispatch(records(response.searchList))         
        } else {
          dispatch(isRec(false))
        }
      })
      .catch((error) => {
        // alert(error)
      })
    }
  }

  onSearch = () => {
    dismissKeyboard()
    if (this.props.tag) {
      this.searchRecords()
    } else {
      const { dispatch } = this.props
      dispatch(records(this.state.rows))
    }
  }

  onChangeTag = (tag) => {
    const { dispatch } = this.props
    dispatch(tagChange(tag))
    let newRows = []
    let row = 0
    const data = this.state.rows
    for (row = 0; row < data.length; row++) {
      let thoughtSearchkey = data[row].thoughtSearchkey
      let storySearchkey = data[row].storySearchkey
      let imageSearchkey = data[row].imageSearchkey
      let videoSearchkey = data[row].videoSearchkey
      if (!thoughtSearchkey) {
        thoughtSearchkey = ''
      }
      if (!storySearchkey) {
        storySearchkey = ''
      }
      if (!imageSearchkey) {
        imageSearchkey = ''
      }
      if (!videoSearchkey) {
        videoSearchkey = ''
      }
      if (thoughtSearchkey.toLowerCase().indexOf(tag.toLowerCase()) !== -1
        || storySearchkey.toLowerCase().indexOf(tag.toLowerCase()) !== -1
        || imageSearchkey.toLowerCase().indexOf(tag.toLowerCase()) !== -1
        || videoSearchkey.toLowerCase().indexOf(tag.toLowerCase()) !== -1) {
        newRows.push(data[row])
      }
    }
    if (newRows) {
      dispatch(isRec(true))
      dispatch(records(newRows))
    } else {
      dispatch(isRec(false))
    }
  }

  onBack = () => {
    const { dispatch } = this.props
    dispatch(isSearch(false))
    dispatch(tagChange(''))
    dispatch(isRec(true))  
    dismissKeyboard()
    dispatch(records(this.state.rows))
  }

  render() {
    if (this.props.success) {      
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
          <RecordsScreen
            displayContent={this.displayContent}
          />
        </View>
      )
    } else {
      return (
        <View style={[styles.container, {backgroundColor: this.props.container}]}>
          <StatusBar
            backgroundColor={this.props.statusBar}
            barStyle="light-content"
          />
          <Spinner visible={true} color={this.props.navBar} overlayColor={'transparent'} />          
        </View>
      )
    }
  }
}

ListScreen.propTypes = {
  dispatch: PropTypes.func,
  statusBar: PropTypes.string,
  navBar: PropTypes.string,
  button: PropTypes.string,
  container: PropTypes.string,
  tabcontent: PropTypes.string,
  titleCarousel: PropTypes.string,
  footer: PropTypes.string,
  notify: PropTypes.bool,
  success: PropTypes.bool,
  notify: PropTypes.bool,

}

function mapStateToProps(state) {
  return {
    success: state.ValEdu.get('success'),
    rows: state.ValEdu.get('rows'),
    date: state.ValEdu.get('date'),
    isFooter: state.ValEdu.get('isFooter'),
    statusBar: state.ValEdu.get('statusBar'),
    navBar: state.ValEdu.get('navBar'),
    button: state.ValEdu.get('button'),
    container: state.ValEdu.get('container'),
    tabcontent: state.ValEdu.get('tabcontent'),
    titleCarousel: state.ValEdu.get('titleCarousel'),
    footer: state.ValEdu.get('footer'),
    notify: state.ValEdu.get('notify'),
    isChannelChanged: state.ValEdu.get('isChannelChanged'),
    tag: state.ValEdu.get('tag'),
    search: state.ValEdu.get('search'),
    isRecords: state.ValEdu.get('isRecords'),
    recordsExist: state.ValEdu.get('recordsExist'),
    rowsDisplayed: state.ValEdu.get('rowsDisplayed'),
    noInternetAlertTriggered: state.ValEdu.get('noInternetAlertTriggered'),
    recordsRendered: state.ValEdu.get('recordsRendered'),
  }
}

export default connect(mapStateToProps)(ListScreen)
{/*
            {recordLength > 5 && recordsExist ?
            <View style={[styles.readFooter, { backgroundColor: this.props.footer }]}>
              <Text
                style={{
                  color: Colors.textColor,
                  fontStyle: 'italic',
                  alignSelf: 'flex-end',
                  fontSize: 12,
                }}
              >scroll down to read more</Text>
              </View> : null }
              */}

             /* renderFooter={() => {
                return(
                  <View>
                    {this.state.recordsExist ?
                    <View style={{ height: 40, justifyContent: 'center', alignItems: 'center'}}>
                      <Text style={[styles.textColor, {alignSelf: 'center'}]}>Loading...</Text>
                    </View>:null}
                  </View>
                )
              }}


              getContent = () => {
    if (!this.state.rowsDisplayed) {
      db.transaction((tx) => {
        tx.executeSql('select count(*) as count from record_title_data where date(createdOn) = \'' + currentDate + '\'', [], (tx, data) => {
          if (data.rows.item(0).count > 0) {
            tx.executeSql('select count(*) as count from record_title_data where date(createdOn) <= \'' + currentDate + '\'',
            [], (tx, results) => {
              cacheRecordsNum = results.rows.item(0).count
            }, (e) => // console.log('error' + JSON.stringify(e)))
          } else {
            tx.executeSql('select min(createdOn) as createdOn from record_title_data where date(createdOn) > \'' + currentDate + '\'',
            [], (tx, results) => {
              alert(results.rows.item(0).createdOn)
            }, (e) => // console.log('error' + JSON.stringify(e)))
          }
        },(e) => // console.log('error' + JSON.stringify(e)))
      })
    }
    this.displayContent()
  }*/