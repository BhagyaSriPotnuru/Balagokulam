import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  NetInfo,
  Alert,
} from 'react-native'
import Emoji from 'react-native-emoji'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux'
import Toast from 'react-native-root-toast'
import styles from '../../utils/Styles'
import http from '../../utils/Http'
import { convertToIST } from '../../utils/Validations'
import Footer from '../Footer'
import { getRefreshToken } from '../refreshToken'

let userId
let token

class Feedback extends Component {
  constructor(props) {
    super(props)
    this.state = {
      feedback: '',
      value: 10,
      emoji1: true,
      emoji2: true,
      emoji3: true,
      emoji4: true,
      emoji5: false,
      rating: 5,
    }
  }

  onFeedback = async () => {
    try {
      userId = await AsyncStorage.getItem('userId')
      token = await AsyncStorage.getItem('token')
    } catch (e) { }
    const data = {
      userId,
      feedbackRating: this.state.rating,
      thoughts: this.state.feedback,
      recommendRating: this.state.value,
      feedbackDate: convertToIST(new Date(),)
    }
    NetInfo.fetch().done((reach) => {
      if (reach === 'NONE') {
        // alert('No Internet Connection')
        Alert.alert (
          'Balagokulam - Seekho Sikhao',
          'You are offline. Please connect to internet',
          [
            { text: 'OK' },
          ]
        )
      } else {
        http('saveFeedback', data, 'POST', token)
        .then((response) => {
          //alert(JSON.stringify(response))
          if (response.Message) {
            getRefreshToken()
            this.onFeedback()
          } else if (!response.isActive) {
            AsyncStorage.multiRemove(['theme', 'updatedTables', 'token', 'registerToken', 'refreshToken', 'name', 'email', 'profileImage', 'phoneNumber'])
            Actions.welcome()
          } else if (response.status) {
            GoogleAnalytics.trackEvent('FeedbackGiven', 'feedback')
            const toast = Toast.show('Feedback saved successfully', {
              duration: 500,
              position: Toast.positions.BOTTOM,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            })
            Actions.pop()
          }
        })
        .catch((error) => {
          // alert(error)
        })
      }
    })
  }

  onEmoji1 = () => {
    this.setState({
      emoji1: false,
      emoji2: true,
      emoji3: true,
      emoji4: true,
      emoji5: true,
      rating: 1,
    })
  }

  onEmoji2 = () => {
    this.setState({
      emoji1: true,
      emoji2: false,
      emoji3: true,
      emoji4: true,
      emoji5: true,
      rating: 2,
    })
  }

  onEmoji3 = () => {
    this.setState({
      emoji1: true,
      emoji2: true,
      emoji3: false,
      emoji4: true,
      emoji5: true,
      rating: 3,
    })
  }

  onEmoji4 = () => {
    this.setState({
      emoji1: true,
      emoji2: true,
      emoji3: true,
      emoji4: false,
      emoji5: true,
      rating: 4,
    })
  }

  onEmoji5 = () => {
    this.setState({
      emoji1: true,
      emoji2: true,
      emoji3: true,
      emoji4: true,
      emoji5: false,
      rating: 5,
    })
  }

  render() {
    return (
      <View style={[styles.container, { backgroundColor: this.props.container }]}>
        <ScrollView>
          <Text style={styles.textColor}>What do you think of our app?</Text>
          <View style={[styles.emojiContainer, styles.spaceContainer]}>
            <Text style={[styles.emoji, { opacity: this.state.emoji1 ? 0.5 : 1 }]} onPress={this.onEmoji1}>
              <Emoji name='rage' />
            </Text>
            <Text style={[styles.emoji, { opacity: this.state.emoji2 ? 0.5 : 1 }]} onPress={this.onEmoji2}>
              <Emoji name='disappointed' />
            </Text>
            <Text style={[styles.emoji, { opacity: this.state.emoji3 ? 0.5 : 1 }]} onPress={this.onEmoji3}>
              <Emoji name='expressionless' />
            </Text>
            <Text style={[styles.emoji, { opacity: this.state.emoji4 ? 0.5 : 1 }]} onPress={this.onEmoji4}>
              <Emoji name='smile' />
            </Text>
            <Text style={[styles.emoji, { opacity: this.state.emoji5 ? 0.5 : 1 }]} onPress={this.onEmoji5}>
              <Emoji name='heart_decoration' />
            </Text>
          </View>
          <Text style={styles.textColor}>What would you like to share with us?</Text>
          <View style={[styles.autogrowInput, { borderColor: this.props.navBar }]}>
            <AutoGrowingTextInput
              value={this.state.feedback}
              onChangeText={(feedback) => this.setState({ feedback })}
              placeholder={"Your thoughts"}
              underlineColorAndroid="transparent"
              maxLength={150}
              autoCapitalize={"sentences"}
              style={{ padding: 10 }}
            />
          </View>
          <Text style={{ alignSelf:'flex-end', color: 'gray', fontSize: 12, marginBottom: 10 }}>(maximum: 150 characters)</Text>
          <TouchableOpacity onPress={this.onFeedback} style={[styles.loginbutton, { backgroundColor: this.props.button }]}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
        <Footer />
      </View>
    )
  }
}

Feedback.propTypes = {
  navBar: PropTypes.string,
  button: PropTypes.string,
  container: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    navBar: state.ValEdu.get('navBar'),
    button: state.ValEdu.get('button'),
    container: state.ValEdu.get('container'),
  }
}
export default connect(mapStateToProps)(Feedback)
