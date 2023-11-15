const validator = require('validator')

function validateAgainstSchema(body, validationSchema) {
  // all required properties are present
  for (const key of Object.keys(validationSchema)) {
    if (!validationSchema[key].type) {
      throw new Error(`Schema property '${key}' is missing its type def`)
    }
    if (validationSchema[key].required && !(key in body)) {
      throw new Error(`The property '${key}' is required`)
    }
    if (validationSchema[key].isEmpty === false && key in body) {
      if (
        body[key].length === 0 ||
        (typeof body[key] === 'object' && Object.keys(body[key]).length === 0)
      ) {
        throw new Error(`The property '${key}' can't be empty`)
      }
    }
    if (
      key in body &&
      validationSchema[key].isIn &&
      !validationSchema[key].isIn.includes(body[key])
    ) {
      throw new Error(`The property '${key}' is invalid`)
    }
  }
  // all body properties are known
  for (const key of Object.keys(body)) {
    // if present in the body and not present in the schema then discard the extra properties
    if (!(key in validationSchema)) {
      delete body[key]
    }
  }
  // validate data types
  for (const key of Object.keys(body)) {
    if (validationSchema[key].type === 'integer') {
      if (!_isInteger(body[key])) {
        throw new Error(`The property '${key}' must be an integer`)
      }
    } else if (
      validationSchema[key].type === 'positiveInteger' ||
      validationSchema[key].type === 'id'
    ) {
      const message = `The property '${key}' must be a positive integer`
      if (!_isInteger(body[key])) {
        throw new Error(message)
      }
      if (typeof body[key] == 'number' && body[key] <= 0) {
        throw new Error(message)
      }
    } else if (validationSchema[key].type === 'number') {
      if (!(_isInteger(body[key]) || validator.isNumeric('' + body[key]))) {
        throw new Error(`The property '${key}' must be a number`)
      }
    } else if (validationSchema[key].type === 'string') {
      if (typeof body[key] !== 'string') {
        throw new Error(`The property '${key}' must be a string`)
      }
    } else if (validationSchema[key].type === 'boolean') {
      if (typeof body[key] !== 'boolean') {
        throw new Error(`The property '${key}' must be a boolean`)
      }
    } else if (validationSchema[key].type === 'object') {
      if (typeof body[key] !== 'object' || body[key].length !== undefined) {
        throw new Error(`The property '${key}' must be an object`)
      }
      if (
        !Object.hasOwnProperty.call(validationSchema[key], 'validationSchema')
      ) {
        throw new Error(
          `validationSchema for object property '${key}' is missing its nested validationSchema`,
        )
      }
    } else if (validationSchema[key].type === 'array') {
      if (typeof body[key] !== 'object') {
        throw new Error(`The property '${key}' must be an array`)
      }
    } else if (validationSchema[key].type === 'arrayOfObjects') {
      if (typeof body[key] !== 'object') {
        throw new Error(`The property '${key}' must be an arrayOfObjects`)
      }
      if (body[key].length === undefined) {
        throw new Error(`The property '${key}' must be an arrayOfObjects`)
      }
      if (
        !Object.hasOwnProperty.call(validationSchema[key], 'validationSchema')
      ) {
        throw new Error(
          `validationSchema for arrayOfObjects property '${key}' is missing its nested validationSchema`,
        )
      }
    } else if (validationSchema[key].type === 'date') {
      if (
        !validator.isDate(dateStringToMMSlashDDSlashYYYY(body[key]), {
          format: 'MM/DD/YYYY',
        })
      ) {
        throw new Error(`'${key}' must be valid date`)
      }
    } else {
      throw new Error(
        `Unknown schema data type '${validationSchema[key].type}'`,
      )
    }
  }
  // recursive calls for arrayOfObjects and objects
  for (const key of Object.keys(validationSchema)) {
    if (validationSchema[key].type === 'object') {
      if (body[key]) {
        if (body[key] && Object.keys(body[key]).length) {
          validateAgainstSchema(
            body[key],
            validationSchema[key].validationSchema,
            key,
          )
        }
      }
    }
    if (validationSchema[key].type === 'arrayOfObjects') {
      if (body[key]) {
        body[key].forEach((element) => {
          if (body[key].length) {
            validateAgainstSchema(
              element,
              validationSchema[key].validationSchema,
              key,
            )
          }
        })
      }
    }
  }
}

function _isInteger(data) {
  if (data == null) {
    return true
  } else if (typeof data !== 'number') {
    return false
  } else {
    return validator.isInt('' + data)
  }
}

module.exports = {
  validateAgainstSchema,
}
