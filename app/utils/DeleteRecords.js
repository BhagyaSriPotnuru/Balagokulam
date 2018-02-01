import SQLite from 'react-native-sqlite-storage'
success = (data) => {
  // console.log(data + ' successful')
}

export default deleteData = (dataCollection) => {
  let db = SQLite.openDatabase({name: 'test.db', createFromLocation : "~balagokulam.db", location: 'Library'}, success('db Open'), (e) => {
    // console.log('error' + JSON.stringify(e))
  })
  let deleteImageQueryStr = 'delete from images where fk_record_id in('
  let deleteMediaQueryStr = 'delete from media where fk_record_id in('
  let deleteStoryQueryStr = 'delete from record_data where record_id in('
  let deleteTitleQueryStr = 'delete from record_title_data where record_title_id in('
  let deleteChannelQueryStr = 'delete from channels where fk_record_id in('

  let imageParams = []
  let mediaParams = []
  let storyParams = []
  let titleParams = []
  let channelParams = []

  for (let  index = 0; index < dataCollection.length; index++) {
    let data = dataCollection[index]     
    imageParams.push(data.tId)
    mediaParams.push(data.tId)    
    storyParams.push(data.tId)   
    titleParams.push(data.tId)
    channelParams.push(data.tId)

    deleteImageQueryStr = deleteImageQueryStr + '?,'
    deleteMediaQueryStr = deleteMediaQueryStr + '?,'
    deleteStoryQueryStr = deleteStoryQueryStr + '?,'
    deleteTitleQueryStr = deleteTitleQueryStr + '?,'
    deleteChannelQueryStr = deleteChannelQueryStr + '?,'
  }

  if (dataCollection.length > 0) {
    deleteImageQueryStr = deleteImageQueryStr.slice(0, -1) + ')'
    deleteMediaQueryStr = deleteMediaQueryStr.slice(0, -1) + ')'
    deleteStoryQueryStr = deleteStoryQueryStr.slice(0, -1) + ')'
    deleteTitleQueryStr = deleteTitleQueryStr.slice(0, -1) + ')'
    deleteChannelQueryStr = deleteChannelQueryStr.slice(0, -1) + ')'

    db.transaction((tx) => {
      tx.executeSql(deleteImageQueryStr, imageParams, success("delete image"), (e) => {
        // console.log('error' + JSON.stringify(e))
      })
      tx.executeSql(deleteMediaQueryStr, mediaParams, success("delete media"), (e) => {
        // console.log('error' + JSON.stringify(e))
      })
      tx.executeSql(deleteStoryQueryStr, storyParams, success("delete story"), (e) => {
        // console.log('error' + JSON.stringify(e))
      })
      tx.executeSql(deleteTitleQueryStr, titleParams, success("delete titte"), (e) => {
        // console.log('error' + JSON.stringify(e))
      })
      tx.executeSql(deleteChannelQueryStr, channelParams, success("delete channels"), (e) => {
        // console.log('error' + JSON.stringify(e))
      })
    })
  }
}