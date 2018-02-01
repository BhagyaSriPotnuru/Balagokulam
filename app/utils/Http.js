import { Alert } from 'react-native'
import getServiceUrl from './Config'

const http = (endpoint, newData, method = 'POST', token = null) => {
  // alert(JSON.stringify(newData))
  const url = getServiceUrl(endpoint)
  const data = {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData),
  }
  if (token != null) {
    data.headers.Authorization = `bearer ${token}`
  }
  if (method === 'GET') {
    delete data.body
  }
  return fetch(url, data)
    .then(res => res.json())
    .then(res => res)
    .catch(error => {
      // Alert.alert(`Error: ${JSON.stringify(error)}`)
    })
}

export default http
