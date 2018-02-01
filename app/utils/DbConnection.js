import SQLite from 'react-native-sqlite-storage'
import React, { Component } from 'react'
import { AsyncStorage } from 'react-native'

success = (data) => {
  // console.log('successful' + data)
}

export default createDb = () => {
  try {
    let db = SQLite.openDatabase({name: 'test.db', createFromLocation : "~balagokulam.db", location: 'Library'}, () => {
      // console.log('create db: success')
    }, (e) => {
      // console.log('create db error' + JSON.stringify(e))
    })
    db.transaction((tx) => {

      /*tx.executeSql('drop table record_title_data', [], success('drop record_title_data'), (e) => // console.log('record_data error' + JSON.stringify(e)))
      tx.executeSql('drop table record_data', [], success('drop record_data'), (e) => // console.log('record_data error' + JSON.stringify(e)))
      tx.executeSql('drop table images', [], success('drop images'), (e) => // console.log('record_data error' + JSON.stringify(e)))
      tx.executeSql('drop table media', [], success('drop media'), (e) => // console.log('record_data error' + JSON.stringify(e)))
      tx.executeSql('drop table channels', [], success('drop channels'), (e) => // console.log('record_data error' + JSON.stringify(e)))
      tx.executeSql('drop table app_values', [], success('drop app_values'), (e) => // console.log('record_data error' + JSON.stringify(e)))
*/
      tx.executeSql('create table if not exists record_title_data( '
        + 'record_title_id integer primary key not null, '
        + 'title text, '
        + 'createdOn varchar(19), '
        + 'updatedOn varchar(19)); ', [], success('create record_title_data'), (e) => {
        // console.log('record_title_data error' + JSON.stringify(e))
      })

      tx.executeSql('create table if not exists record_data( '
        + 'record_id integer primary key not null, '
        + 'thought text, '
        + 'story text, '
        + 'image text, '
        + 'thought_search_key text, '
        + 'story_search_key text, '       
        + 'image_search_key text, '
        + 'video_search_key text, '
        + 'foreign key(record_id) references record_title_data(record_title_id));', [], success('create record_data'), (e) => {
        // console.log('record_data error' + JSON.stringify(e))
      })

      tx.executeSql('create table if not exists images( '
        + 'image text, '
        + 'image_position varchar(2), '
        + 'fk_record_id integer not null, '
        + 'foreign key(fk_record_id) references record_title_data(record_title_id));', [], success('create images'), (e) => {
        // console.log('images error' + JSON.stringify(e))
      })

      tx.executeSql('create table if not exists media( '
        + 'media text, '
        + 'media_title text, '
        + 'media_type text, '
        + 'fk_record_id integer not null, '
        + 'foreign key(fk_record_id) references record_title_data(record_title_id));', [], success('create media'), (e) => {
        // console.log('media error' + JSON.stringify(e))
      })

      tx.executeSql('create table if not exists channels( '       
        + 'channel_id integer not null, '
        + 'channel_name text, '
        + 'fk_record_id integer not null, '
        + 'foreign key(fk_record_id) references record_title_data(record_title_id));', [], success('create channels'), (e) => {
        // console.log('channel error' + JSON.stringify(e))
      })

      tx.executeSql('create table if not exists channels_info( '       
        + 'channel_id integer primary key not null, '
        + 'channel_name text, '
        + 'is_user_selected boolean, '
        + 'is_default boolean, ' 
        + 'is_enabled boolean);', [], success('create channels_info'), (e) => {
        // console.log('channel error' + JSON.stringify(e))
      }) 

      AsyncStorage.setItem('dbCreated', JSON.stringify(true))  
    }, (e) => {
      AsyncStorage.setItem('dbCreated', JSON.stringify(false)) 
      // alert('tables not created  ' + JSON.stringify(e))
    })
  } catch(e) {
    // console.log(e)
  }
}
