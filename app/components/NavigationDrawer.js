import React, { Component, PropTypes } from 'react'
import {
  AsyncStorage
} from 'react-native'
import Drawer from 'react-native-drawer'
import { Actions, DefaultRenderer } from 'react-native-router-flux'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import { connect } from 'react-redux'
import ListScreen from './ListScreen'
import SideTabContent from './SideTabContent'
import { getRefreshToken } from './refreshToken'
import http from '../utils/Http'
import CalendarView from './CalendarView'
let userId
let token
let refreshToken

class NavigationDrawer extends Component {
  state={
    drawerOpen: false,
    drawerDisabled: false,
  }

  closeDrawer = () => {
    dismissKeyboard()
    this.refs.navigation.close()
  }

  openDrawer = () => {
    dismissKeyboard()
    this.refs.navigation.open()
  }
  
  render() {
    const state = this.props.navigationState
    const children = state.children
    return (
      <Drawer
        ref="navigation"
        onOpen={() => {
          this.setState({ drawerOpen: true })
        }}
        onClose={() => {
          this.setState({ drawerOpen: false })
        }}
        type="overlay"
        content={<SideTabContent closeDrawer={this.closeDrawer} />}
        tapToClose={true}
        openDrawerOffset={0.2}
        panCloseMask={0.2}
        negotiatePan={true}
        tweenDuration={75}
        tweenHandler={(ratio) => ({ main: { opacity: Math.max(0.54, 1 - ratio) } })}
      >
      {this.props.calendar ? 
        <CalendarView openMenu={this.openDrawer} closeMenu={this.closeDrawer} /> : 
        <ListScreen openMenu={this.openDrawer} closeMenu={this.closeDrawer} />
      }
      </Drawer>
    )
  }
}

NavigationDrawer.propTypes = {
  isThought: PropTypes.bool,
  isImage: PropTypes.bool,
  isStory: PropTypes.bool,
  isVideo: PropTypes.bool,
  isTag: PropTypes.bool,
}

function mapStateToProps(state) {
  return {
    isThought: state.ValEdu.get('isThought'),
    isImage: state.ValEdu.get('isImage'),
    isStory: state.ValEdu.get('isStory'),
    isVideo: state.ValEdu.get('isVideo'),
    isTag: state.ValEdu.get('isTag'),
    calendar: state.ValEdu.get('calendar'),
    reach: state.ValEdu.get('reach'),
  }
}

export default connect(mapStateToProps)(NavigationDrawer)
/*      {this.props.calendar ? 
          <CalendarView openMenu={this.openDrawer} closeMenu={this.closeDrawer} /> : 
          }
          */