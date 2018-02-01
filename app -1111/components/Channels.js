import React, { Component } from 'react'

import {
  View,
  AsyncStorage,
  Alert,
} from 'react-native'
import SelectMultiple from 'react-native-select-multiple'
import { connect } from 'react-redux'
import SQLite from 'react-native-sqlite-storage'
import insertData from '../utils/InsertRecords'
import insertChannels from '../utils/InsertChannels'
import deleteData from '../utils/DeleteRecords'
import deleteChannelRecords from '../utils/DeleteChannelRecords'
import Spinner from 'react-native-loading-spinner-overlay'
import http from '../utils/Http'
import styles from '../utils/Styles'
import { getRefreshToken } from './refreshToken'
import {
  infoChannels,
  infoSelChannels,
  infoUnSelChannels,
  startSpinner,
  stopSpinner,
  channelChange,
  infoDisChannels,
} from '../actions/ValEduActions'

let channelList
let channels = []
let selectedChannels = []
let unSelectedChannels = []
let disabledChannels = []
let db

class Channel extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      channels: [],
      selectedChannels: [],
      unSelectedChannels: [],
      disabledChannels: [],
    }
    db = SQLite.openDatabase({name: 'test.db', createFromLocation : "~balagokulam.db", location: 'Library'},() => {
      // console.log('db opened')
      }, (e) => {
      // console.log('error' + JSON.stringify(e))
    })
  }
  componentDidMount() {
    this.fetchUserChannels()
  }

  fetchUserChannels = async () => {
    channelList
    channels = []
    selectedChannels = []
    unSelectedChannels = []
    disabledChannels = []
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
     /* channelsInserted = await AsyncStorage.getItem('userId')
      channelsInserted = JSON.parse(channelsInserted)*/
      const { dispatch } = this.props
      if (this.props.reach === 'NONE') {
        db.transaction((tx) => {
          tx.executeSql('select channel_id, channel_name, is_user_selected, is_default, is_enabled from channels_info', [],
          (tx, results) => {
            // alert(results.rows.length)
            for(let i = 0; i < results.rows.length; i++) {
              if (results.rows.item(i).is_enabled) {
                if(results.rows.item(i).channel_id != 13) {
                  channels.push({label: results.rows.item(i).channel_name, value: results.rows.item(i).channel_id})
                }              
              }
              if (results.rows.item(i).is_enabled && results.rows.item(i).is_user_selected) {
                selectedChannels.push({label: results.rows.item(i).channel_name, value: results.rows.item(i).channel_id})
              } else {
                unSelectedChannels.push(results.rows.item(i).channel_id)
              }
              if (!results.rows.item(i).is_enabled && results.rows.item(i).is_user_selected) {
                disabledChannels.push(results.rows.item(i).channel_id)
              }      
            }
            this.setState({channels, selectedChannels, unSelectedChannels, disabledChannels})
          }, (e) => {// alert(JSON.stringify(e))
          })
        }, (e) => {// alert('error' + JSON.stringify(e))
        })
      } else {
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
            channelList = response.channelList
            // alert(JSON.stringify(channelList))
            for(let i = 0; i < channelList.length; i++) {
              if (channelList[i].isEnabled) {
                if (channelList[i].channnelId != 13) {
                  channels.push({label: channelList[i].channelName, value: channelList[i].channnelId})
                }
              }
              if (channelList[i].isEnabled && channelList[i].isUserSelected) {
                selectedChannels.push({label: channelList[i].channelName, value: channelList[i].channnelId})
              } else {
                unSelectedChannels.push(channelList[i].channnelId)
              }
              if (!channelList[i].isEnabled && channelList[i].isUserSelected) {
                disabledChannels.push(channelList[i].channnelId)
              }      
            }
            this.setState({channels, selectedChannels, unSelectedChannels, disabledChannels})
            if(disabledChannels != '') {
              // alert(disabledChannels + '   ' + unSelectedChannels)
              await deleteChannelRecords(disabledChannels, unSelectedChannels)
              dispatch(channelChange(true))
            }
          }
        })
        .catch((error) => {
          // alert(error)
        })
      }
    }
    catch (e) {
      // alert(e)
    }
  }

  onChange = async (selChannels) => { 
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      const { dispatch } = this.props
      dispatch(startSpinner())    
      let list1 = this.state.selectedChannels
      let list2 = selChannels
      let onlyList1 = list1.filter(function(current){
        return list2.filter(function(current_b){
          return current_b.label == current.label && current_b.value == current.value
        }).length == 0
      })
      let onlyList2 = list2.filter(function(current){
        return list1.filter(function(current_a){
          return current_a.label == current.label && current_a.value == current.value
        }).length == 0
      })
      let addList = []
      let deleteList = []
      if(onlyList1.length > 0) {
        for(let i = 0; i < onlyList1.length; i++) {
          deleteList.push(onlyList1[i].value)
          unSelectedChannels.push(onlyList1[i].value)
          if(this.props.reach != 'NONE') {
            db.transaction((tx) => {
              tx.executeSql('update channels_info set is_user_selected=? where channel_id = ?', [false, onlyList1[i].value],
              (tx, results) => {
              })
            })
          }
        }
      }
      if(onlyList2.length > 0) {
        for(let i = 0; i < onlyList2.length; i++) {
          addList.push(onlyList2[i].value)
          for(let j = unSelectedChannels.length - 1; j >= 0; j--) {
            if(unSelectedChannels[j] === onlyList2[i].value) {
              unSelectedChannels.splice(j, 1);
            }
          }
          if(this.props.reach != 'NONE') {
            db.transaction((tx) => {
              tx.executeSql('update channels_info set is_user_selected=? where channel_id = ?', [true, onlyList2[i].value],
              (tx, results) => {
              })
            })
          }
        }
      }
      if(deleteList != '') {
        await deleteChannelRecords(deleteList, unSelectedChannels)
      }
      this.setState({selectedChannels: selChannels})
      if (this.props.reach === 'NONE') {
        Alert.alert(
          'Balagokulam - Seekho Sikhao',
          'You are offline. Please connect to internet',
          [
            { text: 'OK'},
          ]
        )
        dispatch(stopSpinner())
      } else {
        if (addList != '' || deleteList != '') {
          http('updateUserChannels', { userId, addList, deleteList }, 'POST', token)
          .then(async (response) => {
            if(response.Message) {
              getRefreshToken()
              this.updateUserChannels()
            } else if (!response.isActive) {
              AsyncStorage.multiRemove(['theme', 'updatedTables', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
              Actions.welcome()
            } else if (response.status) {
              setTimeout(() => {
                dispatch(stopSpinner())
              }, 1500)
              
              dispatch(channelChange(true))
              // alert(JSON.stringify(response))
              if (response.newRecords.length > 0) {
                await insertData(response.newRecords)
              } else {

              }
            }
          })
          .catch((error) => {
            // alert(error)
          })
        }
      }
    }
    catch (e) {

    }
  } 
  render() {
    return (
      <View style={{paddingTop: 54, backgroundColor: this.props.container, flex:1}}>
      {this.state.channels != '' ?
        <SelectMultiple
          items={this.state.channels}
          selectedItems={this.state.selectedChannels}
          rowStyle={{borderBottomColor: this.props.button, backgroundColor: this.props.container}}
          labelStyle={styles.textColor}
          onSelectionsChange={this.onChange} /> : null }
      {this.props.success ? null : <Spinner visible={true} color={this.props.navBar} overlayColor={'transparent'} /> }
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    reach: state.ValEdu.get('reach'),
    container: state.ValEdu.get('container'),
    button: state.ValEdu.get('button'),
    success: state.ValEdu.get('success'),
    channels: state.ValEdu.get('channels'),
    selectedChannels: state.ValEdu.get('selectedChannels'),
    unSelectedChannels: state.ValEdu.get('unSelectedChannels'),
    navBar: state.ValEdu.get('navBar'),
  }
}

export default connect(mapStateToProps)(Channel)
