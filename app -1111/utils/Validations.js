export function validateEmail(email) {
  let message = null
  if (!email) {
    message = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
    message = 'Invalid email address'
  }
  return message
}

export function validatePassword(password) {
  let message = null
  if (!password) {
    message = 'Required';
  } else if (password.length < 6) {
    message = 'Must be 6 characters or more'
  }
  return message
}

export function validatePhoneNumber(phonenum) {
  let message = null
  if (!phonenum) {
    message = 'Required';
  } else if (phonenum.length < 10) {
    message = 'Must be 10 characters'
  }
  return message
}

export function convertToIST(date) {
  let currentOffset = date.getTimezoneOffset()
  let ISTOffset = 330   // IST offset UTC +5:30 
  return new Date(date.getTime() + ( ISTOffset + currentOffset ) * 60000)
}
