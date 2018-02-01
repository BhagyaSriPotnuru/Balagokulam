import React, { Component, PropTypes } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Platform,
  ScrollView,
  Switch,
  Dimensions,
  Alert,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/FontAwesome'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import { connect } from 'react-redux'
import Share from 'react-native-share'
import Toast from 'react-native-root-toast'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'
import http from '../utils/Http'
import Footer from './Footer'
import { getRefreshToken } from './refreshToken'
import {
  alertsOn,
  alertsOff,
  saveProfileInfo,
  themeNum,
  changeTag,
} from '../actions/ValEduActions'

let radio_props = [
  {label: 'Vibrant Orange', value: 0 },
  {label: 'Classic Gray', value: 1 },
  {label: 'Aqua Blue', value: 2 }
];
let token
let userId
let phoneNumber
let theme
const base64 = 'R0lGODlhYABgAPcAAPz9/sLL38PM38PM4MHK3sLM38HL38DK3sPN4PP1+d7j7vj5+9nf68bP4ezv9cHL3tPa6MDJ3vL0+P7+/svT5P3+/vX2+v39/s7W5fv8/fz8/dDX5sjR4sHK38jQ4urt9P7///7+/+Hl7+7w9tfd6vDy9/P1+Obq8sfQ4sfP4dje6srS4+/x99bc6sXO4MXO4ePn8PHz+Pr6/M/W5fDz9+To8dzi7fn6/N7k7snR4snR4/T1+fv7/c7W5tje68bO4MjQ48bO4ens88jR48nS4+7x9sTM4OXp8fr7/czU5c3V5dTa6Ovu9OXp8uLm8OPo8PT2+ff4++Dk7+Xq8d/k7srT47/J3dHY59HZ6NXb6MfR4s3U5MPN3+vv9NHZ59vh7Nrg7NLZ5+js88TN3+/y99jf6uPo8dzh7czU5PX2+eHm8MnQ4vj6/NTa6eLn8NLY58DL39Tb6cXP4eHm79fe68DL3sfP4uDl7uru9eDl7+Hl8NXb6evu9dvg6/j6+9/j7r/J3s7V5fb3+vX4+uru9Nbd6d3i7fT2+tnf7ODk7ubq8eTn8ejr8/X3+u3w9vn5+9DW5vz9/c3U5ezv9ufq8tDY5t7k7djf6/H0+MXN4P///8TN4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAAAAAAALAAAAABgAGAAAAj/ADMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFMO3MSypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjmxAIEBCgKdKnRAUQOLCJAwUIDHBQKAC1684BATqgWGLow40QmjSN0CHAq1uaBQgYGcLAAZQKafPSCNL2rV+XAyJwqDshr+G0l6j+/SvVg5M0hyNrSqDlweK3ATb1WSC5s4kNBC53JZBkROfTmjIw6NBXdNEDJG6gnj3FBVfXQhEYUDC7tyZHOQzgDmpAjW/fJlZkHt7zAO/jvskEQcB8ZwBJGqAfVxC6es4ANbQf/1+Qo7V3mgKADBJ/HMLy83CVgGDv2817+DIDtKHv28F9/DAFQAd/vZXwH4AuBWADgbPtMACC+YnAIGoJPAhhgBJO2FmFF2Ko4YYWdthSAHl8KBmHIo7IgImROZjiiD6weJiBL7IUAAkyGjbCgRcGAEGOeflX4yY+ApmWEDxCGEAPRmrCSJIIEkBBkwpEUKMARDjRZBEz1EjACU2mZYEHt3VIAAxhaiIBCuZB6FyaH4xhRIoPkDBfk0dYmWIAGCARJhV6iohAA1E0WUELwr0YgAVN8oABlPgFgEmTMnAQoogBlNEkE5ACaMAiQMZg6ZCbGNBDBjlKYQWpLDXQiIwgqP+gGKkEdCHjAiuUOWQAiMhIw6ykCrACWiae0SmEAyCAh4kVVKErrSqYyAQXrLokwA8SaKjBFR1Um+AGhTEIAxzevhQAHwxO4MGl5QZwB4MLNMCutwEkwqAfKcxbLQJgEnjBuuW+NEm6bAXcErYTbtBmtQM08MiEJByLaQN4MagAIAYPgIYZdxIoAQQBDyBHDCxi8OyVQGRnYiESAyhAEjIq0jJ+u8koQR3eRsCCjEgE0t2LAhgQgAqoyvhBAw/MLJoAB6TQQgLh5siGHhQEYBl+A8RFBA4JpJlWBid4QUAAC182wAECYHAEZ14bBsAIcTRwgNJREfBCC4S0jZoJNlDDEIEA1LmFwNhrWNK13r0tIESXBJxM1AAEDLBEE5EgLh4LDAyBtlEGFGDHFyUQazl7FjyxhVT66tSUEnPIMLqGFTgAQSY/WxfABh/w8LqMLIDxAms5MQWJAxfsbqQFDLiQaE0EpNBE8caHWUQlkdMUQBiCRN/2BX+QLdMDPqisfduUXP2SAW9AP77eNSzP0gAoMLo+4iHscV8BGc6P+CEuWIjAC2zTH+KycJsAYAEACEygAhfIwAY68IEQjKAEJSiGAwQEADs='
const shareOptions = {
  title: 'Balagokulam - Seekho Sikhao',
  message: 'Download the app at ',
  url: 'https://play.google.com/store/apps/details?id=com.valueeducation',
  subject: 'Balagokulam - Seekho Sikhao: Powered by GGK Tech - Delivering Commitments',
}

class SideTabContent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      phoneNumber: null,
      theme: this.props.theme,     
    }
  }

  componentDidMount = async () => {
    const { dispatch } = this.props   
    dispatch(changeTag(false))
    try {
      phoneNumber = await AsyncStorage.getItem('phoneNumber')
    }
    catch(e) {

    }   
    this.setState({phoneNumber})
    AsyncStorage.multiGet(['name', 'email', 'birthDate', 'profileImage']).then((values) => {
      const date2 = new Date()
      const date1 = new Date(values[2][1])
      const timeDiff = Math.abs(date2.getTime() - date1.getTime())
      const age = Math.ceil(timeDiff / (1000 * 3600 * 24 * 365))
      let source = base64
      if (values[3][1]) {
        source = values[3][1]
      }      
      dispatch(saveProfileInfo(values[0][1], values[1][1], source, values[2][1], age))
    })
    AsyncStorage.getItem('alert')
    .then((value) => {
      if (value === 'Off') {
        const { dispatch } = this.props
        dispatch(alertsOff())
      } else {
        const { dispatch } = this.props
        dispatch(alertsOn())
      }
    })
  }

  onAlert = (value) => {
    this.setState({ SwitchIsOn: value })
    if (value) {
      AsyncStorage.setItem('alert', 'On')
      const { dispatch } = this.props
      dispatch(alertsOn())
    } else {
      AsyncStorage.setItem('alert', 'Off')
      const { dispatch } = this.props
      dispatch(alertsOff())
    }
    AsyncStorage.multiGet(['token', 'userId', 'registerToken', 'refreshToken'])
    .then((values) => {
      const data = {
        userId: values[1][1],
        deviceToken: values[2][1],
        isNotificationEnabled: value,
      }
      if (values[0][1] != null) {
        if (this.props.reach === 'NONE') {
          // alert('No Internet Connection')
        } else {
          http('toggleNotification', data, 'POST', values[0][1])
          .then((response) => {
            if(response.Message) {
              getRefreshToken()
              this.onAlert()
            } else if (!response.isActive) {
              AsyncStorage.multiRemove(['theme', 'tablesUpdated', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
              Actions.welcome()
            } else if (response.status) {
              if(value) {
                let toast1 = Toast.show('Notifications are enabled', {
                  duration: 500,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                })
              } else {
                let toast2 = Toast.show('Notifications are disabled', {
                  duration: 500,
                  position: Toast.positions.BOTTOM,
                  shadow: true,
                  animation: true,
                  hideOnPress: true,
                  delay: 0,
                })
              }
            } else {
              // alert('error occured')
            }
          })
          .catch((error) => {
            // alert(error)
          })
        }
      }
    })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.container, paddingBottom: 25 }}>
        <TouchableOpacity
          onPress={() => {
            this.props.closeDrawer()
            Actions.editprofile({navigationBarStyle : {backgroundColor: this.props.navBar}})
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              paddingTop: 20,
              paddingBottom: 20,
              paddingHorizontal: 15,
              backgroundColor: this.props.footer,
              borderBottomColor: 'rgb(215, 220, 209)',
              borderBottomWidth: 0.5,
            }}
          >
            <Image
              source={{ uri: 'data:image/jpeg;base64,' + this.props.profileImage, isStatic: true }}
              style={{
                height: 80,
                width: 80,
                borderColor: 'transparent',
                borderWidth: 0.5,
                borderRadius: 40,
              }}
            />
            <View style={{ marginLeft: 20, marginTop: 5, flex: 1 }}>
              <Text style={[styles.textColor, { fontSize: 18 }]}>{this.props.name}</Text>
              { (this.props.email).trim() ? 
              <Text style={[styles.textColor, { fontSize: 14, marginTop: 15 }]}>
              {this.props.email}</Text>  : null }
              <Text style={[styles.textColor, { fontSize: 14, marginTop: 15 }]}>
              {this.state.phoneNumber}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
        >
          <View style={{ flex:1, flexDirection: 'column', padding: 10 }}>
            <View style={styles.spaceAround}>
              <TouchableOpacity
                style={{flex: 0.5, marginRight: 10}}
                onPress={() => {
                  this.props.closeDrawer()
                  Actions.editprofile({navigationBarStyle : {backgroundColor: this.props.navBar}})
                }}
              >
                <View style={styles.tile}>
                  <Icon name='key' color={this.props.navBar} size={20} style={{flex: 0.3}} />
                  <Text style={[styles.textColor, {marginTop: 3, flex: 0.7}]}>Account</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{flex: 0.5}}
                onPress={() => {
                  this.props.closeDrawer()
                  Actions.aboutus({navigationBarStyle : {backgroundColor: this.props.navBar}})
                }}                
              >
                <View style={styles.tile}>
                  <Icon name='book' color={this.props.navBar} size={20} style={{flex: 0.3}} />
                  <Text style={[styles.textColor, {marginTop: 3, flex: 0.7}]}>About us</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 10}}>
              <View style={{flex: 0.5, marginRight: 10}}>    
                <View style={[styles.tile,{paddingVertical: 6}]}>
                  <Text style={[styles.textColor, {marginTop: 5, flex: 0.6}]}>Alerts</Text>
                  <Switch
                    value={this.props.alertsOn}
                    onValueChange={this.onAlert}
                    style={{flex: 0.4}}
                  />
                </View>
              </View>
              <View style={{flex: 0.5}} />
            </View>
            <Text style={[styles.textColor, {marginTop: 10, marginLeft: 2}]}>Choose the Channels for which you want to receive the posts:</Text>                      
            <TouchableOpacity
              style={{flex: 1, marginTop: 13}}
              onPress={() => {
                this.props.closeDrawer()
                Actions.channel({navigationBarStyle : {backgroundColor: this.props.navBar}})
              }}
            >
              <View style={styles.tile}>
                <Icon name='pencil' color={this.props.navBar} size={20} style={{flex: 0.3}} />
                <Text style={[styles.textColor, {marginTop: 3, flex: 0.7}]}>Choose Channels</Text>
              </View>
            </TouchableOpacity>
           {/* <Text style={[styles.textColor, {marginTop: 10, color: 'red', fontSize: 14, lineHeight: 15 }]}>* Choose the Channels for which you want to receive the posts</Text>            */}
            <View style={{marginTop: 10}}>
            </View>
            <Text style={styles.textColor}>Theme</Text>            
            <View style={[styles.settingsContainer, {backgroundColor: Colors.white }]}>
              <View style={[styles.spaceContainer, { paddingRight: 5 }]}>
                <RadioForm
                  radio_props={radio_props}
                  initial={this.state.theme}
                  formHorizontal={false}
                  labelHorizontal={true}
                  buttonColor={this.props.footer}
                  animation={true}
                  onPress={(value) => {
                    AsyncStorage.setItem('theme', JSON.stringify(value))
                      this.setState({
                        theme: value,
                      })
                      const { dispatch } = this.props    
                      dispatch(themeNum(value))
                  }}
                />
              <View>
                <View style={{flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{height: 20, width: 30, backgroundColor: 'rgb(182, 73, 38)'}}></View>
                  <View style={{height: 20, width: 30, backgroundColor: 'rgb(255, 240, 165)'}}></View>
                  <View style={{height: 20, width: 30, backgroundColor: 'rgb(255, 176, 59)'}}></View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 10}}>
                  <View style={{height: 20, width: 30, backgroundColor: 'rgb(83, 71, 65)'}}></View>
                  <View style={{height: 20, width: 30, backgroundColor: 'rgb(232, 234, 228)'}}></View>
                  <View style={{height: 20, width: 30, backgroundColor: 'rgb(217, 220, 209)'}}></View>
                </View>
                
                <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 10}}>
                  <View style={{height: 20, width: 30, backgroundColor: 'rgb(56, 138, 136)'}}></View>
                  <View style={{height: 20, width: 30, backgroundColor: 'rgb(189, 245, 234)'}}></View>
                  <View style={{height: 20, width: 30, backgroundColor: 'rgb(27, 230, 232)'}}></View>
                </View>
                </View>
              </View>
            </View>
            <View style={styles.spaceAround}>
              <TouchableOpacity
                style={{flex: 0.5, marginRight: 10}}
                onPress={() => {
                  this.props.closeDrawer()
                  setTimeout(() => {
                    Share.open(shareOptions).then((info) => {
                      GoogleAnalytics.trackEvent('AppShared', 'share')
                    }).catch((err) => {
                      // console.log(err)
                    });
                  }, 60)
                }}
              >
                <View style={styles.tile}>
                  <Icon name='share-alt' color={this.props.navBar} size={20} style={{flex: 0.3}}/>
                  <Text style={[styles.textColor, { marginTop: 3, flex: 0.7 }]}>Share App</Text>
                </View>
              </TouchableOpacity>           
              <TouchableOpacity
                style={{flex: 0.5}}
                onPress={() => {
                  this.props.closeDrawer()
                  Actions.feedback({navigationBarStyle : {backgroundColor: this.props.navBar}})
                }}
              >
                <View style={styles.tile}>
                  <Icon name='commenting-o' color={this.props.navBar} size={20} style={{flex: 0.3}}/>
                  <Text style={[styles.textColor, { marginTop: 3, flex: 0.7 }]}>Feedback</Text>
                </View>
              </TouchableOpacity>
            </View>           
          </View>
          </ScrollView> 
        <Footer />
      </View>
    )
  }
}

SideTabContent.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  profileImage: PropTypes.string,
  dispatch: PropTypes.func,
  closeDrawer: PropTypes.func,
  alertsOn: PropTypes.bool,
  navBar: PropTypes.string,
  button: PropTypes.string,
  container: PropTypes.string,
  footer: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    name: state.ValEdu.get('name'),
    email: state.ValEdu.get('email'),
    profileImage: state.ValEdu.get('profileImage'),
    dob: state.ValEdu.get('dob'),
    age: state.ValEdu.get('age'),
    alertsOn: state.ValEdu.get('alertsOn'),
    theme: state.ValEdu.get('theme'),
    navBar: state.ValEdu.get('navBar'),
    button: state.ValEdu.get('button'),
    container: state.ValEdu.get('container'),
    footer: state.ValEdu.get('footer'),
    reach: state.ValEdu.get('reach'),
  }
}

export default connect(mapStateToProps)(SideTabContent)
