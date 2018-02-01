import SQLite from 'react-native-sqlite-storage'
import { AsyncStorage } from 'react-native'
success = (data) => {
  // console.log(data + ' successful')
}

export default insertChannels = (dataCollection) => {
  let db = SQLite.openDatabase({name: 'test.db', createFromLocation : "~balagokulam.db", location: 'Library'}, success('dbCreated'), (e) => {
    // console.log('error' + JSON.stringify(e))
  })
  let channelQueryStr = 'insert into channels_info(channel_id, channel_name, is_user_selected, is_default, is_enabled) values'
  let channelData = []

  try {
    for (let  index = 0; index < dataCollection.length; index++) {
      let  data = dataCollection[index]
      db.transaction((tx) => {
        tx.executeSql('select channel_name from channels_info where channel_id = ?',[data.channnelId],
          (tx, results) => {
            if(results.rows.length > 0) {
              tx.executeSql('update channels_info set channel_name=?, is_user_selected=?, is_default=?, is_enabled=? where channel_id = ?',[data.channelName, data.isUserSelected, data.isDefault, data.isEnabled, data.channnelId],
              (tx, results) => {
              }, (e) => {})
            } else {
              if (data) {
              channelQueryStr = channelQueryStr + '(?,?,?,?,?),'
              channelData.push(data.channnelId)
              channelData.push(data.channelName)
              channelData.push(data.isUserSelected)
              channelData.push(data.isDefault)
              channelData.push(data.isEnabled)
            }
          }
        })
      })     
    }

    db.transaction((tx) => {
      if (channelData.length > 0) {
        tx.executeSql(channelQueryStr.slice(0, -1) + ';', channelData, success("channels_info"), (e) => {
          // console.log('error' + JSON.stringify(e))
        })
      }
      // AsyncStorage.setItem('channelsInserted', JSON.stringify(true))  
    }, (e) => {
      // AsyncStorage.setItem('channelsInserted', JSON.stringify(false))  
      alert('error' + JSON.stringify(e))
    })
  } catch(e) {
    alert(JSON.stringify(e))
  }
}
