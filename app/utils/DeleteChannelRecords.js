import SQLite from 'react-native-sqlite-storage'
import deleteData from './DeleteRecords'

superbag = (sup, sub) => {
  sup.sort(function(a, b){return a-b})
  sub.sort(function(a, b){return a-b})
  var i, j
  for (i=0,j=0; i<sup.length && j<sub.length;) {
      if (sup[i] < sub[j]) {
          ++i
      } else if (sup[i] == sub[j]) {
          ++i
          ++j
      } else {
          // sub[j] not in sup, so sub not subbag
          return false
      }
  }
  // make sure there are no elements left in sub
  return j == sub.length
}

export default deleteChannelRecords = (deleteList, unSelectedChannels) => {
  db = SQLite.openDatabase({
      name: 'test.db',
      createFromLocation : "~balagokulam.db",
      location: 'Library'
    }, () => {
    // console.log('db opened')
    }, (e) => { // console.log('error' + JSON.stringify(e))
  })
  let tIdList = []
  for (let i = 0; i < deleteList.length; i++) {
    let query = 'select fk_record_id, channel_id from channels t where not exists (select 1 from channels where t.fk_record_id = fk_record_id'
      + ' AND t.channel_id <> channel_id)'
    let query3 = 'select distinct fk_record_id from channels t where exists'
      + '(select 1 from channels where fk_record_id = t.fk_record_id and channel_id =' + deleteList[i] + ')'
    let query4 = 'select channel_id from channels where fk_record_id = ?'
    db.transaction((tx) => {
      tx.executeSql(query, [], (tx, results) => {
        if (results.rows.length > 0) {
          for (let j = 0; j < results.rows.length; j++) {
            if (results.rows.item(j).channel_id == deleteList[i]) {
              tIdList.push({tId: results.rows.item(j).fk_record_id})             
            }
          }
          if (tIdList != '') {
            deleteData(tIdList)
          }
        }
      }, (e) => {
        // console.log('error' + JSON.stringify(e))
      })            
      tx.executeSql(query3, [], (tx, results2) => {
        if (results2.rows.length > 0) {
          for (let j = 0; j < results2.rows.length; j++) {                   
            tx.executeSql(query4, [results2.rows.item(j).fk_record_id], (tx, results3) => {
              let assignedChannels = []
              for (let k = 0; k < results3.rows.length; k++) {
                assignedChannels.push(results3.rows.item(k).channel_id)
             }                  
              if (superbag(unSelectedChannels, assignedChannels)) {
                deleteData([{tId: results2.rows.item(j).fk_record_id}])
              }
            }, (e) => {
              // console.log('error' + JSON.stringify(e))
            })
          }
        }                                    
      }, (e) => {
        // console.log('error' + JSON.stringify(e))
      })
    }, (e) => {
      // console.log('error1' + JSON.stringify(e))
    })
  }
}