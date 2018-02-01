import {
  AsyncStorage,
  NetInfo,
} from 'react-native'
import http from '../utils/Http'
let refreshToken
let phoneNumber
let userId
export async function getRefreshToken() {
	try {
    refreshToken = await AsyncStorage.getItem('refreshToken')
    phoneNumber = await AsyncStorage.getItem('phoneNumber')
    userId = await AsyncStorage.getItem('userId')
  } catch (e) { }
	NetInfo.fetch().done((reach) => {
		if (reach === 'NONE') {
			// alert('No Internet Connection')
		} else {
			const data = 'grant_type=refresh_token&refresh_token=' + refreshToken + '&client_id='              
      fetch('http://103.255.144.120:8888/Token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: data
      }).then((response) => response.json())
      .then(async (response) => {
        if(response.error) {
          http('mobileLogin', {phoneNumber, userId}, 'POST')
          .then(async (res) => {
            try {
              await AsyncStorage.setItem('token', res.access_token)
              await AsyncStorage.setItem('refreshToken', res.refresh_token)
              await AsyncStorage.setItem('userId', res.userId)
            } catch(e) {}
          })
          .catch((error) => {
            // alert(error)
          })
        }
        else {
          try {
            await AsyncStorage.setItem('token', response.access_token)
            await AsyncStorage.setItem('refreshToken', response.refresh_token)
            await AsyncStorage.setItem('userId', response.userId)
          } catch(e) {}
        }
      })
      .catch((error) => {
        // alert(error)
      })
		}
	})
}
