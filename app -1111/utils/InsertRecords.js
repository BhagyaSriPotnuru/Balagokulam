import SQLite from 'react-native-sqlite-storage'
import updateData from './UpdateRecords'
success = (data) => {
  // console.log(data + ' successful')
}

export default insertData = (dataCollection) => {
  let db = SQLite.openDatabase({name: 'test.db', createFromLocation : "~balagokulam.db", location: 'Library'}, success('dbCreated'), (e) => {
    // console.log('error' + JSON.stringify(e))
  })
  let titleQueryStr = 'insert into record_title_data(record_title_id, title, createdOn, updatedOn) values'
  let storyQueryStr = 'insert into record_data(record_id, thought, story, image, thought_search_key, story_search_key, image_search_key, video_search_key) values'
  let imageQueryStr = 'insert into images(image, image_position, fk_record_id) values' 
  let mediaQueryStr = 'insert into media(media, media_title, media_type, fk_record_id) values'
  let channelQueryStr = 'insert into channels(channel_id, channel_name, fk_record_id) values'

  let titleData = []
  let storyData = []
  let imageData = []
  let mediaData = []
  let channelData = []

  try {
    for (let  index = 0; index < dataCollection.length; index++) {
      let  data = dataCollection[index]
      db.transaction((tx) => {
        tx.executeSql('select title from record_title_data where record_title_id = ?',[data.tId],
          (tx, results) => {
            if(results.rows.length > 0) {
              updateData([data])
            } else {
              if (data && data.updateType !== 'delete') {
              titleQueryStr = titleQueryStr + '(?,?,?,?),'
              titleData.push(data.tId)
              titleData.push(data.title)
              titleData.push(data.createdOn)
              titleData.push("kkkk")

              storyQueryStr = storyQueryStr + '(?,?,?,?,?,?,?,?),'  
              storyData.push(data.tId)
              storyData.push(data.thought)
              storyData.push(data.story)
              storyData.push(data.imageUrl)
              storyData.push(data.thoughtSearchKey)
              storyData.push(data.storySearchKey)       
              storyData.push(data.imageSearchKey)
              storyData.push(data.videoSearchKey)
              if(data.imageList) {
                for (let  index1 = 0; index1 < data.imageList.length; index1++) {
                  let image = data.imageList[index1];
                  imageQueryStr = imageQueryStr + '(?,?,?),'
                  imageData.push(image.imageUrl)
                  imageData.push(image.imagePosition)
                  imageData.push(data.tId)
                }
              }
              if(data.mediaList) {
                for (let  index2 = 0; index2 < data.mediaList.length; index2++) {
                  let media = data.mediaList[index2]
                  mediaQueryStr = mediaQueryStr + '(?,?,?,?),'
                  mediaData.push(media.media)
                  mediaData.push(media.mediaTitle)
                  mediaData.push(media.mediaType)
                  mediaData.push(data.tId)
                }
              }
              if(data.channelList) {
                for (let  index3 = 0; index3 < data.channelList.length; index3++) {
                  let channels = data.channelList[index3]
                  channelQueryStr = channelQueryStr + '(?,?,?),'
                  channelData.push(channels.channnelId)
                  channelData.push(channels.channelName)
                  channelData.push(data.tId)
                }
              }
            }
          }
        })
      })     
    }
    // alert(titleData.length + ' ' + storyData.length + ' ' + imageData.length + ' ' + mediaData.length + ' ' + channelData.length)

    db.transaction((tx) => {
      if (titleData.length > 0) {
        tx.executeSql(titleQueryStr.slice(0, -1) + ';', titleData, success("title"), (e) => {
          // console.log('error' + JSON.stringify(e))
        })
      }
      if (storyData.length > 0) {
        tx.executeSql(storyQueryStr.slice(0, -1) + ';', storyData, success("story"), (e) => {
          // console.log('error' + JSON.stringify(e))
        })
      }
      if (imageData.length > 0) {
        tx.executeSql(imageQueryStr.slice(0, -1) + ';', imageData, success("image"), (e) => {
          // console.log('error' + JSON.stringify(e))
        })
      }  
      if (mediaData.length > 0) {
        tx.executeSql(mediaQueryStr.slice(0, -1) + ';', mediaData, success("media"), (e) => {
          // console.log('error' + JSON.stringify(e))
        })
      }
      if (channelData.length > 0) {
        tx.executeSql(channelQueryStr.slice(0, -1) + ';', channelData, success("channels"), (e) => {
          // console.log('error' + JSON.stringify(e))
        })
      }
    }, (e) => {
      // alert('error' + JSON.stringify(e))
    })
  } catch(e) {
    // alert(JSON.stringify(e))
  }
}
