import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  TextInput,
  Text,
  BackAndroid,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'
import {
  dateChange,
  isCalendar,
  isSearch,
  tagChange,
  records,
  noOfRows,
} from '../actions/ValEduActions'

class HomeNavBar extends Component {
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if(this.props.search) {
        this.props.onBack()
        this.props.dispatch(noOfRows(-1))
      }
    })
  }

  onSearchClick = () => {
    const { dispatch } = this.props
    dispatch(isSearch(true))
    setTimeout(() => {
      this.refs.tag.focus()
    }, 50)   
  }

  onChangeTag = (tag) => {
    const { dispatch } = this.props
    dispatch(tagChange(tag))
  }

  render() {
    return (
      <View>
      { this.props.search ?           
        <View style={[styles.homeNavBar, styles.spaceContainer, { backgroundColor: Colors.white, paddingTop: Platform.OS === 'ios' ? 20 : 5, marginBottom: 10 }]}>
          <View style={[styles.spaceAround, {flex: 1}]}>
            <TouchableOpacity style={{ padding: 10, flex: 0.1 }} onPress={this.props.onBack}>
              <Icon name="arrow-left" color={this.props.navBar} size={20} />
            </TouchableOpacity>
            <TextInput
              ref="tag"
              style={{ flex: 0.9, fontSize: 16, marginBottom: 6 }}
              onChangeText={this.onChangeTag}
              underlineColorAndroid ="transparent"
              placeholder="Search Records.."
              value={this.props.tag}
              maxLength={25}
            />
          </View>
          <TouchableOpacity onPress={this.props.onSearch} style={{ padding: 10, marginBottom: 6 }}>
            <Icon name="search" color={this.props.navBar} size={20} />
          </TouchableOpacity>
        </View> :
        <View style={[styles.homeNavBar, styles.spaceContainer, { backgroundColor: this.props.navBar, paddingTop: Platform.OS === 'ios' ? 20 : 5, marginBottom: 10 }]}>
          <TouchableOpacity onPress={() => {
            this.props.openMenu()              
          }} style={{ paddingVertical:10, paddingLeft: 10, paddingRight: 40 }}>
            <Icon name="bars" color={Colors.white} size={20} />
          </TouchableOpacity>
          <Text style={[styles.homeTitle,{paddingLeft: 35}]}>Home</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          {this.props.calendar ?
            <TouchableOpacity onPress={() => {
              this.props.dispatch(noOfRows(-1))
              this.props.dispatch(isCalendar(false))          
            }} style={{ paddingVertical:10, paddingLeft: 40, paddingRight: 10 }}>
              <Icon name="list" color={Colors.white} size={20} />
            </TouchableOpacity> :
            <TouchableOpacity onPress={() => {
              this.props.dispatch(isCalendar(true))
              this.props.dispatch(records([]))
              this.props.dispatch(dateChange(new Date()))
            }} style={{ paddingVertical:10, paddingLeft: 40, paddingRight: 10 }}>
              <Icon name="calendar" color={Colors.white} size={20} />
            </TouchableOpacity>
          }
          <TouchableOpacity onPress={this.onSearchClick} style={{ paddingVertical:10, paddingLeft: 20, paddingRight: 10 }}>
            <Icon name="search" color={Colors.white} size={20} />
          </TouchableOpacity>
          </View>
        </View>
      }
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    navBar: state.ValEdu.get('navBar'),
    tag: state.ValEdu.get('tag'),
    search: state.ValEdu.get('search'),
    calendar: state.ValEdu.get('calendar'),
  }
}

export default connect(mapStateToProps)(HomeNavBar)
