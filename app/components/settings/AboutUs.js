import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  AsyncStorage,
  NetInfo,
} from 'react-native'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import DeviceInfo from 'react-native-device-info'
import Icon from 'react-native-vector-icons/FontAwesome'
import Communications from 'react-native-communications'
import Share from 'react-native-share'
import styles from '../../utils/Styles'
import http from '../../utils/Http'
import { getRefreshToken } from '../refreshToken'
import {
  appConstants,
} from '../../actions/ValEduActions'

GoogleAnalytics.setTrackerId('UA-81365729-4')
GoogleAnalytics.setDispatchInterval(10)
GoogleAnalytics.trackScreenView('Aboutus')
const shareOptions = {
  title: 'Balagokulam - Seekho Sikhao',
  message: 'Download the app at ',
  url: 'https://play.google.com/store/apps/details?id=com.valueeducation',
  subject: 'Balagokulam - Seekho Sikhao: Powered by GGK Tech - Delivering Commitments',
}
let userId
let token

class Aboutus extends Component {
  componentDidMount = () => {
    this.getAppContants()
  }

  getAppContants = async () => {
    try {
      token = await AsyncStorage.getItem('token')
      userId = await AsyncStorage.getItem('userId')
      NetInfo.fetch().done((reach) => {
        if (reach === 'NONE') {
          // alert('No Internet Connection')
        } else {
          http('fetchAppConstants', { userId }, 'POST', token)
          .then((response) => {
            if (response.Message) {
              getRefreshToken()
              this.getAppContants()
            } else if (!response.isActive) {
              AsyncStorage.multiRemove(['theme', 'tablesUpdated', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
              Actions.welcome()
            } else if (response.status) {
              AsyncStorage.setItem('aboutUs', response.aboutUs)
              AsyncStorage.setItem('videoLink', response.appVideoLink)
              this.props.dispatch(appConstants(response.aboutUs, response.appVideoLink))
            }
          }).catch((e) => {
            // alert('error')
          })
        }
      })
    } catch (e) {}
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.container, paddingHorizontal: 0, paddingBottom: 0 }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
        >
          <View style={{ paddingHorizontal: 20 }}>
            <Image
              source={require('../../images/ValueEdu.png')}
              style={{
                height: 90,
                width: 90,
                resizeMode: 'contain',
              }}
            />
            <Text style={[styles.textColor, { marginLeft: 100, marginTop: -15 }]}>v{DeviceInfo.getVersion()}</Text>
            <Text style={[styles.textColor, { marginVertical: 20 }]}>{this.props.aboutUs}</Text>
            <TouchableOpacity
              onPress={() => {
                setTimeout(() => {
                  Share.open(shareOptions).then((info) => {
                    GoogleAnalytics.trackEvent('AppShared', 'share')
                  }).catch((err) => {
                    // console.log(err)
                  });
                }, 60)
              }}
            >
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                <Icon name="share-alt" color={this.props.navBar} size={20} />
                <Text style={[styles.textColor, { marginTop: 3, marginLeft: 10 }]}>Share App</Text>
              </View>
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 15, alignItems: 'center', marginTop: 40 }}>
              <Image
                source={require('../../images/logo_big.png')}
                style={{
                  height: 23,
                  width: 80,
                  resizeMode: 'contain',
                }}
              />
              <Text style={[styles.textColor, { fontSize: 14, marginTop: 5 }]}>Delivering Commitments</Text>
            </View>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: 'gray', paddingHorizontal: 20,marginTop: 15 }}>
            <Text style={[styles.textColor, { marginVertical: 15, fontSize: 14 }]} onPress={() => {
              Communications.email(['balagokulambharat@gmail.com'], null, null, 'Balagokulam: Powered by GGK Tech - Delivering Commitments', '')
            }}>Contact us</Text>
          </View>
          <View style={{ borderTopWidth: 1, borderTopColor: 'gray', paddingHorizontal: 20 }}>
            <Text style={[styles.textColor, { marginVertical: 15, fontSize: 14 }]} onPress={() => {
              Linking.openURL('http://ggktech.com').catch(err => console.error('An error occurred', err))
            }}>About ggk</Text>
          </View>
          <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: 'gray', paddingHorizontal: 20 }}>
            <Text style={[styles.textColor, { marginVertical: 15, fontSize: 14 }]} onPress={() => {
              Linking.openURL(this.props.videoLink).catch(err => console.error('An error occurred', err))}}>
              Who we are and What we do</Text>
          </View>
        </ScrollView>
      </View>
    )
  }
}

Aboutus.propTypes = {
  container: PropTypes.string,
  navBar: PropTypes.string,
  aboutUs: PropTypes.string,
  videoLink: PropTypes.string,
  dispatch: PropTypes.func,
}

function mapStateToProps(state) {
  return {
    container: state.ValEdu.get('container'),
    navBar: state.ValEdu.get('navBar'),
    aboutUs: state.ValEdu.get('aboutUs'),
    videoLink: state.ValEdu.get('videoLink'),
  }
}
export default connect(mapStateToProps)(Aboutus)
