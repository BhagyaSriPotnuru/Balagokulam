import {
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native'
import Colors from './Colors'

const fontFamily = Platform.OS === 'ios' ? 'helvetica neue' : 'roboto'
const radius = 2
const styles = StyleSheet.create({
  navBarTitle: {
    color: Colors.white,
    fontWeight: 'bold',
    fontFamily,
    width: Platform.OS === 'ios' ? 300 : null,
  },

  barButtonTextStyle: {
    color: Colors.textColor,
  },

  barButtonIconStyle: {
    tintColor: Colors.white,
  },

  spaceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  centerItems: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  welcomeView: {
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap',
    marginBottom: 40,
  },

  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 20,
    paddingBottom: 25,
  },

  emojiContainer: {
    marginTop: 10,
    marginBottom: 30,
  },

  carouselContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 40,
    width: Platform.OS === 'ios' ? Dimensions.get('window').width / 1.5 : null,
    height: Platform.OS === 'ios' ? 40 : null,
  },

  settingsContainer: {
    borderRadius: radius,
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 5,
    paddingBottom: 5,
    marginVertical: 10,
  },

  homeNavBar: {
    height: Platform.OS === 'ios' ? 64 : 54,
    alignItems: 'center',
/*    elevation: 2,*/
  },

  emoji: {
    fontSize: 30,
    color: Colors.textColor,
  },

  autogrowInput: {
    borderWidth: 1,
    height: 100,
    marginTop: 10,
    borderRadius: radius,
  },

  readFooter: {
    height: 20,
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingRight: 10,
    left: 200,
  },

  spaceAround: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  tile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.white,
    borderRadius: radius,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  check: {
    alignSelf: 'flex-end',
    padding: 5,
  },

  listItem: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 10,
    paddingVertical: 5,
    justifyContent: 'center',
  },

  listContent: {
    flex: 1,
    paddingLeft: 10,
    paddingVertical: 5,
  },

  tabContent: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: radius,
    borderWidth: 0.3,
    padding: 10,
    marginBottom: 10,
  },

  homeTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'helvetica neue' : 'roboto',
  },

  navDatePicker: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textBox: {
    borderWidth: 1,
    borderRadius: 2,
    height: 40,
    width: 40,
  },

  errorText: {
    color: 'red',
    lineHeight: 25,
    fontFamily,
    fontSize: 16,
    marginBottom: 10,
    alignSelf: 'center',
  },

  textInput: {
    borderBottomColor: Platform.OS === 'ios' ? Colors.navBar : 'transparent',
    borderBottomWidth: 1,
  },

  loginbutton: {
    borderRadius: radius,
    width: 110,
    marginTop: 20,
    alignItems: 'center',
    alignSelf: 'center',
    padding: 5,
  },

  footer: {
    height: 25,
    padding: 5,
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
    flex: 1,
  },

  contentPic: {
    height: 50,
    width: 50,
    borderWidth: 0.5,
    borderRadius: 25,
  },

  storiesText: {
    paddingVertical: 10,
    alignSelf: 'center',
    color: Colors.textColor,
    fontSize: 16,
  },

  phoneNumber: {
    height: 40,
    marginTop: 20,
  },

  switch: {
    marginTop: -5,
    alignSelf: 'flex-end',
  },

  avatarIcon: {
    height: 50,
    width: 50,
    marginTop: 5,
  },

  profileIcon: {
    height: 100,
    width: 100,
    borderColor: 'transparent',
    borderWidth: 0.5,
    borderRadius: 50,
    marginTop: 10,
  },

  buttonText: {
    color: Colors.white,
    fontFamily,
    fontSize: 18,
    margin: 4,
  },

  textColor: {
    color: Colors.textColor,
    lineHeight: 25,
    fontFamily,
    fontSize: 16,
  },

  readOutIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },

  contentImage: {
    width: 300,
    height: 300,
    marginTop: 30,
    alignSelf: 'center',
  },

  date: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginRight: 10,
    paddingBottom: 10,
  },
})

export default styles
