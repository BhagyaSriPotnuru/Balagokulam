import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  Image,
} from 'react-native'
import { connect } from 'react-redux'
import styles from '../utils/Styles'
import Colors from '../utils/Colors'

class Footer extends Component { 
  render() {
    return (
      <View style={[styles.footer, {backgroundColor: this.props.footer}]}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', alignSelf: 'flex-end'}}>
          <Text style={[styles.textColor, { fontSize: 14, color: this.props.navBar}]}>
            Powered by:
          </Text>
          <Image 
            source={require('../images/logo_big.png')}
            resizeMode='contain'
            style={{ marginTop: -5, marginLeft: 5}}
            width={60}
            height={23}                  
          />
        </View>
      </View>
    )
  }
}

Footer.propTypes = {
  navBar: PropTypes.string,
  button: PropTypes.string,
  footer: PropTypes.string,
}

function mapStateToProps(state) {
  return {
    navBar: state.ValEdu.get('navBar'),
    button: state.ValEdu.get('button'),
    footer: state.ValEdu.get('footer'),
  }
}
export default connect(mapStateToProps)(Footer)
