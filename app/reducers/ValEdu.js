import Immutable from 'immutable'
import actionTypes from '../actions/ActionTypes'

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

/* function createInitialState() {
  return Immutable.fromJS({
    alertsOn: true,
    frequency: 15,
  })
} */

const date = new Date()
const initialState = Immutable.fromJS({
  alertsOn: true,
  frequency: 15,
  thought: '',
  story: '',
  image: '',
  mediaList: [],
  imageList: [],
  video: '',
  audio: '',
  title: '',
  date,
  notifDate: date,
  success: true,
  name: '',
  email: '',
  profileImage: '',
  dob: new Date(),
  age: '',
  isVisible: false,
  rows: [],
  isThought: true,
  isImage: true,
  isStory: true,
  isVideo: true,
  isTag: false,
  theme: 0,
  statusBar: 'rgb(168, 69, 36)',
  navBar: 'rgb(182, 73, 38)',
  container: 'rgb(255, 240, 165)',
  footer: 'rgb(255, 176, 59)',
  tabcontent: 'rgb(255, 191, 128)',
  titleCarousel: 'rgb(255, 176, 59)',
  button: 'rgb(224, 110, 56)',
  imageExpand: false,
  imageValue: '',
  storyReading: false,
  thoughtReading: false,
  notify: false,
  playAudio: false,
  longPress: false,
  longPress1: false,
  longPress2: false,
  longPress3: false,
  longPress4: false,
  longPress5: false,
  longPress6: false,
  longPress7: false,
  longPress8: false,
  longPress9: false,
  selectedImages: [],
  calendar: true,
  allDates: [],
  aboutUs: "Gokul is the place where an ordinary cowherd boy blossomed in to a divine incarnation. It is here that Krishna's magical days of childhood were spent and his powers came to be recognized. \n" +
            "  Every child has that spark of divinity within. BalaGokulam-Seekho Sikhao app is designed to enable children to appreciate their cultural roots, learn our ancient values in an enjoyable manner, develop a sense of Sewa, Service to humankind and in the process discover that divinity within. \n" +
            "  Our goal is to introduce children to stories about our great heroes (Puranic, Ancient, Medieval and Modern), talk about Significance of various festivals and also introduce children to some very fundamental pillars of Sanatan Dharma including scriptures, symbolism, values & concepts.\n" +
            "  Do going through all the content posted in this mobile app. Also if you have any positive or negative feedback, please do share with us.",
  videoLink: 'https://www.youtube.com/watch?v=tkSvL-u2SdI',
  isEngThought: true,
  isEngStory: true,
  reach: 'NONE',
  channels: [],
  selectedChannels: [],
  unSelectedChannels: [],
  disabledChannels: [],
  isChannelChanged: false,
  search: false,
  tag: '',
  isRecords: true,
  recordsExist: true,
  rowsDisplayed: -1,
  noInternetAlertTriggered: false,
  recordsRendered: true,
  searchClick: false,
})
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ALERTS_ON:
      return state.merge({ alertsOn: true })
    case ALERTS_OFF:
      return state.merge({ alertsOn: false })
    case FREQUENCY:
      return state.merge({ frequency: action.payload.frequency })
    case CONTENT_INFO:
      return state.merge({
        thought: action.thought,
        imageList: action.imageList,
        story: action.story,
        mediaList: action.mediaList,
        title: action.title,
      })
    case PROFILE_INFO:
      return state.merge({
        name: action.name,
        email: action.email,
        profileImage: action.profileImage,
        dob: action.dob,
        age: action.age,
      })
    case CHANGE_DATE:
      return state.merge({ date: action.date })
    case NOTIF_DATE:
      return state.merge({ notifDate: action.notifDate })
    case START_SPINNER:
      return state.merge({ success: false })
    case STOP_SPINNER:
      return state.merge({ success: true })
    case SHOW_MODAL:
      return state.merge({ isVisible: true })
    case HIDE_MODAL:
      return state.merge({ isVisible: false })
    case RECORDS:
      return state.merge({ rows: action.rows })
    case CHANNEL_INFO:
      return state.merge({ channels: action.channels })
    case SEL_CHANNELS:
      return state.merge({ selectedChannels: action.selectedChannels })
    case UNSEL_CHANNELS:
      return state.merge({ unSelectedChannels: action.unSelectedChannels })
    case DISABLED_CHANNELS:
      return state.merge({ disabledChannels: action.disabledChannels })
    case IS_TAG:
      return state.merge({ isTag: action.payload })
    case CHANNEL_CHANGE:
      return state.merge({ isChannelChanged: action.payload })
    case IMAGE_EXPAND:
      return state.merge({ imageExpand: action.payload })
    case IMAGE_CHANGE:
      return state.merge({ imageValue: action.payload })
    case READ_THOUGHT:
      return state.merge({ thoughtReading: action.payload })
    case READ_STORY:
      return state.merge({ storyReading: action.payload })
    case CHANGE_VIDEO:
      return state.merge({ video: action.payload })
    case CHANGE_AUDIO:
      return state.merge({ audio: action.payload })
    case ON_NOTIFICATION:
      return state.merge({ notify: action.payload })
    case PLAY_AUDIO:
      return state.merge({ playAudio: action.payload })
    case LONGPRESS_DETECTED:
      return state.merge({ longPress: action.payload })
    case LONGPRESS_DETECTED1:
      return state.merge({ longPress1: action.payload })
    case LONGPRESS_DETECTED2:
      return state.merge({ longPress2: action.payload })
    case LONGPRESS_DETECTED3:
      return state.merge({ longPress3: action.payload })
    case LONGPRESS_DETECTED4:
      return state.merge({ longPress4: action.payload })
    case LONGPRESS_DETECTED5:
      return state.merge({ longPress5: action.payload })
    case LONGPRESS_DETECTED6:
      return state.merge({ longPress6: action.payload })
    case LONGPRESS_DETECTED7:
      return state.merge({ longPress7: action.payload })
    case LONGPRESS_DETECTED8:
      return state.merge({ longPress8: action.payload })
    case LONGPRESS_DETECTED9:
      return state.merge({ longPress9: action.payload })
    case ADD_IMAGE:
      return state.merge({ selectedImages: action.payload })
    case IS_CALENDAR:
      return state.merge({ calendar: action.payload })
    case ALL_DATES:
      return state.merge({ allDates: action.payload })
    case APP_CONSTANTS:
      return state.merge({ aboutUs: action.aboutUs, videoLink: action.videoLink })
    case IS_ENGLISH_THOUGHT:
      return state.merge({ isEngThought: action.payload })
    case IS_ENGLISH_STORY:
      return state.merge({ isEngStory: action.payload })
    case IS_REACH:
      return state.merge({ reach: action.payload })
    case SHARE_IMAGE:
      return state.merge({ image: action.payload })
    case IS_SEARCH:
      return state.merge({ search: action.payload })
    case IS_RECORDS:
      return state.merge({ isRecords: action.payload })
    case RECORDS_EXISTS:
      return state.merge({ recordsExist: action.payload })
    case ROWS_DISPLAYED:
      return state.merge({ rowsDisplayed: action.payload })
    case TAG_VALUE:
      return state.merge({ tag: action.payload })
    case INTERNET_ALERT:
      return state.merge({ noInternetAlertTriggered: action.payload })
    case RECORDS_RENDERED:
      return state.merge({ recordsRendered: action.payload })
    case SEARCH_CLICK:
      return state.merge({ searchClick: action.payload })
    case THEME:
      if (action.payload === 0)
        return state.merge({
          theme: action.payload,
          statusBar: 'rgb(168, 69, 36)',
          navBar: 'rgb(182, 73, 38)',
          container: 'rgb(255, 240, 165)',
          footer: 'rgb(255, 176, 59)',
          tabcontent: 'rgb(255, 191, 128)',
          titleCarousel: 'rgb(255, 176, 59)',
          button: 'rgb(224, 110, 56)',
        })
      else if (action.payload === 1)
        return state.merge({
          theme: action.payload,
          statusBar: 'rgb(56 ,45, 40)',
          navBar: 'rgb(83, 71, 65)',
          container: 'rgb(232, 234, 228)',
          footer: 'rgb(217, 220, 209)',
          tabcontent: 'rgb(255, 221, 153)',
          titleCarousel: 'rgb(153, 153, 102)',
          button: 'rgb(224, 110, 56)',
        })
      else if (action.payload === 2)
        return state.merge({
          theme: action.payload,
          statusBar: 'rgb(52, 127, 125)',
          navBar: 'rgb(56, 138, 136)',
          container: 'rgb(202, 232, 232)',
          footer: 'rgb(128, 203, 201)',
          tabcontent: 'rgb(128, 203, 201)',
          titleCarousel: 'rgb(44, 109, 106)',
          button: 'rgb(224, 110, 56)',
        })
    default:
      return state
  }
}
