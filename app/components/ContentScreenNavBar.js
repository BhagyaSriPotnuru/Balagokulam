import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'
import DatePicker from 'react-native-datepicker'
import { Actions } from 'react-native-router-flux'
import AudioPlayer from 'react-native-play-audio'
import {
  onNotify,
  isExpand,
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
  audioPlay,
} from '../actions/ValEduActions'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'

class ContentScreenNavBar extends Component {
  render() {
    const { dispatch } = this.props
    return (
      <View style={[styles.homeNavBar, styles.spaceContainer, { backgroundColor: this.props.navBar, paddingTop: Platform.OS == 'ios' ? 20 : 5, marginBottom: 10 }]}>
        <TouchableOpacity style={{padding:10}} underlayColor="transparent" onPress={() => {     
          AudioPlayer.stop()
          dispatch(audioPlay(false))
          dispatch(isExpand(false))
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
          if (this.props.notify && !this.props.calendar) {
            Actions.drawer()
          } else {
            Actions.pop()
          }
        }}>   
          <Icon name="angle-left" color={Colors.white} size={30} />
        </TouchableOpacity>
        <View style={styles.navDatePicker}>
          <TouchableOpacity onPress={this.props.decrementDate} style={{ paddingLeft: 50 }}>
            <Icon name="caret-left" color="white" size={25} />
          </TouchableOpacity>
          <DatePicker
            style={{ width: 110, marginHorizontal: 5 }}
            date={this.props.date}
            mode="date"
            placeholder="Date of birth"
            format="MMM DD YYYY"
            confirmBtnText="OK"
            cancelBtnText="Cancel"
            showIcon={false}
            onDateChange={this.props.dateChange}
            customStyles={{
              placeholderText: {
                color: '#fff',
                fontSize: 15,
              },
              dateInput: {
                flex: 1,
                height: 40,
                borderWidth: 1,
                borderColor: 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              },
              dateText: {
                color: '#fff',
                fontSize: 17,
              },
            }}
          />
          <TouchableOpacity onPress={this.props.incrementDate} style={{ paddingRight: 50 }}>
            <Icon name="caret-right" color={Colors.white} size={25} /> 
          </TouchableOpacity>
        </View>
        <TouchableOpacity underlayColor="transparent" onPress={this.props.onSearchClick} style={{ padding: 10 }}>
          <Icon name="search" color={this.props.navBar} size={20} />
        </TouchableOpacity>           
      </View>
    )
  }
}

ContentScreenNavBar.propTypes = {
  navBar: PropTypes.string,
  notify: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    navBar: state.ValEdu.get('navBar'),
    notify: state.ValEdu.get('notify'),
    calendar: state.ValEdu.get('calendar'),
    notifDate: state.ValEdu.get('notifDate'),
  }
}
export default connect(mapStateToProps)(ContentScreenNavBar)
