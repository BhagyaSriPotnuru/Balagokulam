import SQLite from 'react-native-sqlite-storage'
import insertData from './InsertRecords'

success = (data) => {
  // console.log(data + ' successful')
}

export default updateData = (dataCollection) => {
  let db = SQLite.openDatabase({name: 'test.db', createFromLocation : "~balagokulam.db", location: 'Library'}, success('dbOpen'), (e) => {
      // console.log('error' + JSON.stringify(e))
    })

  let titleQueryStr = 'update record_title_data set title=?,updatedOn=?,createdOn=? where record_title_id=?'
  let storyQueryStr = 'update record_data set thought=?,image=?,story=?,' +
    'thought_search_key=?,image_search_key=?,video_search_key=?,story_search_key=? where record_id=?'
  let imageQueryStr = 'insert into images(image,image_position,fk_record_id) values'
  let mediaQueryStr = 'insert into media(media,media_title,media_type,fk_record_id) values'
  let channelQueryStr = 'insert into channels(channel_id,channel_name,fk_record_id) values'

  let imageParams = []
  let mediaParams = []
  let channelParams = []

  for (let index = 0; index < dataCollection.length; index++) {
    let  data = dataCollection[index]
    db.transaction((tx) => {
      tx.executeSql('select title from record_title_data where record_title_id = ?',[data.tId],
      (tx, results) => {
        if(results.rows.length > 0) {
          tx.executeSql(titleQueryStr, [data.title, data.updatedOn, data.createdOn, data.tId], success('update record_title_data'), (e) => {
            // console.log('error' + JSON.stringify(e))
          })
          tx.executeSql(storyQueryStr, [data.thought, data.imageUrl, data.story, data.thoughtSearchkey, data.imageSearchkey, data.videoSearchkey, data.storySearchkey, data.tId],
          (tx) => {
            try {
              if (data.imageList && data.imageList.length > 0) {
                tx.executeSql('delete from images where fk_record_id=?', [data.tId], success('delete images'), (e) => {
                  // console.log('error' + JSON.stringify(e))
                })
                for(let  index1 = 0; index1 < data.imageList.length; index1++){
                   let image = data.imageList[index1]
                   imageQueryStr = imageQueryStr+ '(?,?,?),'
                   imageParams.push(image.imageUrl)
                   imageParams.push(image.imagePosition)
                   imageParams.push(data.tId)
                } 
                tx.executeSql(imageQueryStr.slice(0, -1)+';', imageParams, success('update images'), (e) => {
                  // console.log('error' + JSON.stringify(e))
                })
              }

              if (data.mediaList && data.mediaList.length > 0) {
                tx.executeSql('delete from media where fk_record_id=?', [data.tId], success('delete media'), (e) => {
                  // console.log('error' + JSON.stringify(e))
                })
                for(let  index2 = 0; index2 < data.mediaList.length; index2++) {
                  let media = data.mediaList[index2]
                  mediaQueryStr = mediaQueryStr + '(?,?,?,?),'
                  mediaParams.push(media.media)
                  mediaParams.push(media.mediaTitle)
                  mediaParams.push(media.mediaType)
                  mediaParams.push(data.tId)
                }
                tx.executeSql(mediaQueryStr.slice(0, -1)+';', mediaParams, success('update media'), (e) => {
                  // console.log('error' + JSON.stringify(e))
                })
              }

              if (data.channelList && data.channelList.length > 0) {
                tx.executeSql('delete from channels where fk_record_id=?', [data.tId], success('delete media'), (e) => {
                  // console.log('error' + JSON.stringify(e))
                })
                for(let  index3 = 0; index3 < data.channelList.length; index3++) {
                  let channels = data.channelList[index3]
                  channelQueryStr = channelQueryStr + '(?,?,?),'
                  channelParams.push(channels.channnelId)
                  channelParams.push(channels.channelName)
                  channelParams.push(data.tId)
                }
                tx.executeSql(channelQueryStr.slice(0, -1)+';', channelParams, success('update channels'), (e) => {
                  // console.log('error' + JSON.stringify(e))
                })
              }
            } catch(e) {
              // console.log("update error: " + JSON.stringify(e))
            }
          }, (e) => {
            // console.log('error' + JSON.stringify(e))
          })
        } else {
          insertData([data])
        }
      })   
    })
  }
}