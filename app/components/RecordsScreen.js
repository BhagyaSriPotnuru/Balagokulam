import React, { Component } from 'react'
import {
  View,
  ListView,
  Text,
  Animated,
  Easing,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import { Actions } from 'react-native-router-flux'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import noImageIcon from '../images/noImage.png'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'
import {
  dateChange,
  isSearch,
  isRec,
  tagChange,
  clickSearch,
  records,
  noOfRows,
} from '../actions/ValEduActions'

const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
let statusText = ''
let recordLength
let listViewscroll = true

class RecordsScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.animatedValue = new Animated.Value(0)
  }
  componentDidMount() {   
    this.animate()
  }

  animate = () => {
    this.animatedValue.setValue(0)
    Animated.timing(
      this.animatedValue,
      {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear
      }
    ).start(() => this.animate())
  }

  getNextRecords = () => {
    listViewscroll = this.refs.listview.scrollProperties.offset +
      this.refs.listview.scrollProperties.visibleLength >=
      this.refs.listview.scrollProperties.contentLength
    if (listViewscroll && this.props.recordsRendered && this.props.recordsExist && !this.props.search && !this.props.noInternetAlertTriggered) {      
      this.props.displayContent()
    }
  }

  getListViewData = () => {
    let dataList = []
    const { rows } = this.props
    rows.map(row => {
      let rowData = {}
      rowData.title = row.get('title')
      rowData.imageUrl = row.get('imageUrl')
      rowData.story = row.get('story')
      rowData.thought = row.get('thought')
      rowData.createdOn = row.get('createdOn')
      rowData.tId = row.get('tId')
      dataList.push(rowData)
    })
    recordLength = dataList.length
    return dataList
  }

  renderRowElement = (rowData, sectionID, rowID) => {
    const introButton = this.animatedValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0, 50, 0]
    })
    let date = new Date(rowData.createdOn)
    let source = noImageIcon
    if (rowData.imageUrl) {
      source = { uri: rowData.imageUrl }
    }
    date = date.toUTCString()
    date = date.split(' ').slice(0, 4).join(' ')
    let currentDate = new Date()
    currentDate = currentDate.toUTCString()
    currentDate = currentDate.split(' ').slice(0, 4).join(' ')
    if (rowID == 0) {
      const thought = rowData.thought
      const story = rowData.story
      if (thought) {
        statusText = 'Thought of the day'
      } else if (story) {
        statusText = 'Story of the day'
      }
      return (
        <View>
          <TouchableOpacity
            onPress={() => {
              const { dispatch } = this.props
              const contentDate = new Date(rowData.createdOn)
              dispatch(dateChange(contentDate))
              if (this.props.search) {
                dismissKeyboard()
                dispatch(isSearch(false))
                dispatch(isRec(true))
                dispatch(tagChange(''))
                dispatch(records([]))
                dispatch(noOfRows(-1))
                if(this.props.calendar) {                 
                  dispatch(clickSearch(false))
                } else {
                  this.props.displayContent()
                }
              }
              GoogleAnalytics.trackEvent('recordView', '' + rowData.title + '')
              Actions.contentscreen({titleId: rowData.tId})
            }}>
              <Text style={[styles.textColor, styles.date]}>{date}</Text>
            <View style={{backgroundColor: this.props.button, height:25}}>
              <Text
                style={{
                  color: Colors.white,
                  fontStyle: 'italic',
                  alignSelf: 'center',
                  fontSize: 16,
                }}
              >{statusText}</Text>
            </View>
            <View 
              style={[
                styles.listItem,
                  { height: 140, backgroundColor: this.props.footer }
                ]
              }>                                 
              <Image
                source={source}
                style={[styles.contentPic, {borderColor: this.props.navBar, marginTop: 30}]}
              />
              <View style={styles.listContent}>
                <Animated.Text numberOfLines={1} style={[styles.textColor, { marginBottom: 10, marginLeft: introButton }]}>{rowData.title}</Animated.Text>
                <Text
                  numberOfLines={4}
                  style={{ lineHeight: 25, fontFamily: Platform.OS == 'ios' ? 'helvetica neue' : 'roboto', fontSize: 14}}
                >
                  {rowData.thought ? rowData.thought : rowData.story}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          {recordLength > 1 ? 
          <View style={{height: 25, backgroundColor: Colors.moreStory}}>
            <Text
              style={{
                color: Colors.white,
                fontStyle: 'italic',
                alignSelf: 'center',
                fontSize: 16,
              }}
            >More Stories</Text>
          </View> : null }
        </View>
      )
    } else {
      return (
        <View style={{
          flex: 1,
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}>
          <TouchableOpacity               
            onPress={() => {
              const { dispatch } = this.props
              let contentDate = new Date(rowData.createdOn)
              dispatch(dateChange(contentDate))
              if (this.props.search) {
                dismissKeyboard()
                dispatch(isSearch(false))
                dispatch(isRec(true))
                dispatch(tagChange(''))
                dispatch(records([]))
                dispatch(noOfRows(-1))
                if(this.props.calendar) {                 
                  dispatch(clickSearch(false))
                } else {
                  this.props.displayContent()
                }
              }
              GoogleAnalytics.trackEvent('recordView', '' + rowData.title + '')
              Actions.contentscreen({titleId: rowData.tId})
            }}
          >
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              <Image
                source={source}
                style={[styles.contentPic, {borderColor: this.props.navBar}]}
              />
              <View style={styles.listContent}>            
                <View style={[styles.spaceContainer, { marginBottom: 10, flex: 1 }]}>
                  <View style={{flex:0.5}}>
                    <Text style={styles.textColor} numberOfLines={1} >{rowData.title}</Text>
                  </View>
                  <View style={{flex: 0.4}}>
                    <Text style={[styles.textColor, { fontSize: 12, alignSelf:'flex-end', marginLeft: 5 }]}>{date}</Text>
                  </View>
                </View>
                <Text numberOfLines={1} style={{ lineHeight: 25, fontFamily: Platform.OS == 'ios' ? 'helvetica neue' : 'roboto', fontSize: 14 }}>
                  {rowData.thought ? rowData.thought : rowData.story}
                </Text>        
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
      { this.props.isRecords ?
        <ListView
          ref="listview"
          enableEmptySections={true}
          dataSource={ds.cloneWithRows(this.getListViewData())}
          onScroll={this.getNextRecords}
          onEndReachedThreshold={2000}
          automaticallyAdjustContentInsets={false}             
          renderRow={this.renderRowElement}
          style={{flex: 1}}
          renderFooter={() => {
            return(
              <View>
                {this.props.recordsExist && !this.props.search ?
                <View style={{ height: 40, justifyContent: 'center', alignItems: 'center'}}>
                  <Text style={[styles.textColor, {alignSelf: 'center'}]}>Loading...</Text>
                </View>:null}
              </View>
            )
          }}
          renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => {
            if(rowID == 0) {
              return null
            } else  {
            return (
              <View
                style={{
                  height: 1,
                  backgroundColor: this.props.footer,
                  marginLeft: 60,
                }}
              />
            )
          }
          }}
        /> :
        <View style={[styles.container, {backgroundColor: this.props.container}]}>
          <Text style={[styles.textColor, { alignSelf: 'center' }]}>No Data Found</Text>
        </View> }
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    navBar: state.ValEdu.get('navBar'),
    container: state.ValEdu.get('container'),
    footer: state.ValEdu.get('footer'),
    button: state.ValEdu.get('button'),
    search: state.ValEdu.get('search'),
    rows: state.ValEdu.get('rows'),
    isRecords: state.ValEdu.get('isRecords'),
    recordsExist: state.ValEdu.get('recordsExist'),
    noInternetAlertTriggered: state.ValEdu.get('noInternetAlertTriggered'),
    recordsRendered: state.ValEdu.get('recordsRendered'),
    search: state.ValEdu.get('search'),
    calendar: state.ValEdu.get('calendar'),
  }
}

export default connect(mapStateToProps)(RecordsScreen)
