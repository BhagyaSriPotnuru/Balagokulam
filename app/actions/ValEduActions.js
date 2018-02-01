import actionTypes from './ActionTypes'

const {
  ALERTS_ON,
  ALERTS_OFF,
  FREQUENCY,
  CONTENT_INFO,
  CHANGE_DATE,
  START_SPINNER,
  STOP_SPINNER,
  PROFILE_INFO,
  SHOW_MODAL,
  HIDE_MODAL,
  RECORDS,
  IS_TAG,
  THEME,
  IMAGE_EXPAND,
  IMAGE_CHANGE,
  READ_STORY,
  READ_THOUGHT,
  CHANGE_VIDEO,
  CHANGE_AUDIO,
  ON_NOTIFICATION,
  PLAY_AUDIO,
  LONGPRESS_DETECTED,
  LONGPRESS_DETECTED1,
  LONGPRESS_DETECTED2,
  LONGPRESS_DETECTED3,
  LONGPRESS_DETECTED4,
  LONGPRESS_DETECTED5,
  LONGPRESS_DETECTED6,
  LONGPRESS_DETECTED7,
  LONGPRESS_DETECTED8,
  LONGPRESS_DETECTED9,
  ADD_IMAGE,
  IS_CALENDAR,
  ALL_DATES,
  APP_CONSTANTS,
  IS_ENGLISH_THOUGHT,
  IS_ENGLISH_STORY,
  IS_REACH,  
  CHANNEL_INFO,
  SEL_CHANNELS,
  UNSEL_CHANNELS,
  DISABLED_CHANNELS,
  CHANNEL_CHANGE,
  NOTIF_DATE,
  SHARE_IMAGE,
  IS_SEARCH,
  TAG_VALUE,
  IS_RECORDS,
  RECORDS_EXISTS,
  ROWS_DISPLAYED,
  INTERNET_ALERT,
  RECORDS_RENDERED,
  SEARCH_CLICK,
} = actionTypes

export function alertsOn(payload) {
  return ({
    type: ALERTS_ON,
    payload,
  })
}

export function alertsOff(payload) {
  return ({
    type: ALERTS_OFF,
    payload,
  })
}

export function frequency(payload) {
  return ({
    type: FREQUENCY,
    payload,
  })
}

export function contentInfo(thought, imageList, story, mediaList, title) {
  return ({
    type: CONTENT_INFO,
    thought,
    imageList,
    story,
    mediaList,
    title,
  })
}

export function dateChange(date) {
  return ({
    type: CHANGE_DATE,
    date,
  })
}

export function notificationDate(notifDate) {
  return ({
    type: NOTIF_DATE,
    notifDate,
  })
}

export function startSpinner(payload) {
  return ({
    type: START_SPINNER,
    payload,
  })
}

export function stopSpinner(payload) {
  return ({
    type: STOP_SPINNER,
    payload,
  })
}

export function saveProfileInfo(name, email, profileImage, dob, age) {
  return ({
    type: PROFILE_INFO,
    name,
    email,
    profileImage,
    dob,
    age,
  })
}

export function showModal(payload) {
  return ({
    type: SHOW_MODAL,
    payload,
  })
}

export function hideModal(payload) {
  return ({
    type: HIDE_MODAL,
    payload,
  })
}

export function records(rows) {
  // alert(JSON.stringify(rows))
  return ({
    type: RECORDS,
    rows,
  })
}

export function infoChannels(Channels) {
  // alert(JSON.stringify(channels))
  return ({
    type: CHANNEL_INFO,
    Channels,
  })
}

export function infoSelChannels(selectedChannels) {
  // alert(JSON.stringify(channels))
  return ({
    type: SEL_CHANNELS,
    selectedChannels,
  })
}

export function infoUnSelChannels(unSelectedChannels) {
  // alert(JSON.stringify(channels))
  return ({
    type: UNSEL_CHANNELS,
    unSelectedChannels,
  })
}

export function infoDisChannels(disabledChannels) {
  // alert(JSON.stringify(channels))
  return ({
    type: DISABLED_CHANNELS,
    disabledChannels,
  })
}

export function changeTag(payload) {
  return ({
    type: IS_TAG,
    payload,
  })
}

export function themeNum(payload) {
  return ({
    type: THEME,
    payload,
  })
}

export function isExpand(payload) {
  return ({
    type: IMAGE_EXPAND,
    payload,
  })
}

export function imageChange(payload) {
  return ({
    type: IMAGE_CHANGE,
    payload,
  })
}

export function readStory(payload) {
  return ({
    type: READ_STORY,
    payload,
  })
}

export function readThought(payload) {
  return ({
    type: READ_THOUGHT,
    payload,
  })
}

export function changeVideo(payload) {
  return ({
    type: CHANGE_VIDEO,
    payload,
  })
}

export function changeAudio(payload) {
  return ({
    type: CHANGE_AUDIO,
    payload,
  })
}

export function onNotify(payload) {
  return ({
    type: ON_NOTIFICATION,
    payload,
  })
}

export function audioPlay(payload) {
  return ({
    type: PLAY_AUDIO,
    payload,
  })
}

export function longPressDetected(payload) {
  return ({
    type: LONGPRESS_DETECTED,
    payload,
  })
}

export function longPressDetected1(payload) {
  return ({
    type: LONGPRESS_DETECTED1,
    payload,
  })
}

export function longPressDetected2(payload) {
  return ({
    type: LONGPRESS_DETECTED2,
    payload,
  })
}

export function longPressDetected3(payload) {
  return ({
    type: LONGPRESS_DETECTED3,
    payload,
  })
}

export function longPressDetected4(payload) {
  return ({
    type: LONGPRESS_DETECTED4,
    payload,
  })
}

export function longPressDetected5(payload) {
  return ({
    type: LONGPRESS_DETECTED5,
    payload,
  })
}

export function longPressDetected6(payload) {
  return ({
    type: LONGPRESS_DETECTED6,
    payload,
  })
}

export function longPressDetected7(payload) {
  return ({
    type: LONGPRESS_DETECTED7,
    payload,
  })
}

export function longPressDetected8(payload) {
  return ({
    type: LONGPRESS_DETECTED8,
    payload,
  })
}

export function longPressDetected9(payload) {
  return ({
    type: LONGPRESS_DETECTED9,
    payload,
  })
}

export function addImage(payload) {
  return ({
    type: ADD_IMAGE,
    payload,
  })
}

export function isCalendar(payload) {
  return ({
    type: IS_CALENDAR,
    payload,
  })
}

export function loadAllDates(payload) {
  return ({
    type: ALL_DATES,
    payload,
  })
}

export function appConstants(aboutUs, videoLink) {
  return ({
    type: APP_CONSTANTS,
    aboutUs,
    videoLink,
  })
}

export function isEnThought(payload) {
  return ({
    type: IS_ENGLISH_THOUGHT,
    payload,
  })
}

export function isEnStory(payload) {
  return ({
    type: IS_ENGLISH_STORY,
    payload,
  })
}

export function isNetwork(payload) {
  return ({
    type: IS_REACH,
    payload,
  })
}

export function channelChange(payload) {
  return ({
    type: CHANNEL_CHANGE,
    payload,
  })
}

export function shareImage(payload) {
  return ({
    type: SHARE_IMAGE,
    payload,
  })
}

export function isSearch(payload) {
  return ({
    type: IS_SEARCH,
    payload,
  })
}

export function tagChange(payload) {
  return ({
    type: TAG_VALUE,
    payload,
  })
}

export function isRec(payload) {
  return ({
    type: IS_RECORDS,
    payload,
  })
}

export function recExist(payload) {
  return ({
    type: RECORDS_EXISTS,
    payload,
  })
}

export function noOfRows(payload) {
  return ({
    type: ROWS_DISPLAYED,
    payload,
  })
}

export function internetAlert(payload) {
  return ({
    type: INTERNET_ALERT,
    payload,
  })
}

export function recRendered(payload) {
  return ({
    type: RECORDS_RENDERED,
    payload,
  })
}

export function clickSearch(payload) {
  return ({
    type: SEARCH_CLICK,
    payload,
  })
}
