import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native'
import { Actions } from 'react-native-router-flux'
import GoogleAnalytics from 'react-native-google-analytics-bridge'
import Orientation from 'react-native-orientation'
import styles from '../utils/Styles'
import valueEducationLogo from '../images/ValueEdu.png'

GoogleAnalytics.setTrackerId('UA-81365729-4')
GoogleAnalytics.setDispatchInterval(10)
GoogleAnalytics.trackScreenView('Welcome')

export default class Welcome extends Component {
  componentWillUnmount() {
    Orientation.unlockAllOrientations()
  }

  SignIn = () => {
    Actions.profileinfo({ navigationBarStyle: { backgroundColor: 'rgb(182, 73, 38)' } })
  }
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: 'rgb(255, 240, 165)' }}>
        <StatusBar
          backgroundColor="rgb(168, 69, 36)"
          barStyle="light-content"
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
        >
          <Image
            style={styles.contentImage}
            resizeMode="contain"
            source={valueEducationLogo}
          />
          <TouchableOpacity
            onPress={this.SignIn}
            style={
              [styles.loginbutton,
                {
                  backgroundColor: 'rgb(224, 110, 56)',
                  width: 150,
                  marginTop: 20,
                },
            ]}
          >
            <Text style={styles.buttonText}>
              Register!
            </Text>
          </TouchableOpacity>
          <Image
            source={require('../images/logo_big.png')}
            resizeMode="contain"
            style={{ marginLeft: 5, alignSelf: 'center', marginTop: 40 }}
            width={80}
            height={23}
          />
          <Text style={[styles.textColor, { fontSize: 14, alignSelf: 'center', color: 'rgb(83, 71, 65)', marginTop: 5 }]}>
            Delivering Commitments
          </Text>
        </ScrollView>
      </View>
    )
  }
}
