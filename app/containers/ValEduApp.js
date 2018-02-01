import React from 'react'
import { connect } from 'react-redux'
import ValueEducation from '../components/Main'

function ValEduApp(props) {
  // alert(props.date)
  return <ValueEducation />
}

function mapStateToProps(state) {
  return {
    date: state.ValEdu.get('date'),
  }
}

export default connect(mapStateToProps)(ValEduApp)
