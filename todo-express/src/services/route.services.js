const { v4: UuidV4 } = require('uuid')

function errorsToResponse(errorObjectOrArray) {
  const returnThisJsonArray = []

  let incomingErrorArray = []

  // make sure we have an array of errors from this point forward
  if (!Array.isArray(errorObjectOrArray)) {
    incomingErrorArray.push(errorObjectOrArray)
  } else {
    incomingErrorArray = errorObjectOrArray
  }

  incomingErrorArray.forEach((anError) => {
    switch (anError.name) {
      case 'ExpressValidatorErrorCollection':
        for (const error of anError.errorArray) {
          const thisMessage = `${error.msg} in request ${error.location}: ${error.param} = ${error.value}`
          returnThisJsonArray.push({
            name: 'ValidationError',
            message: thisMessage,
          })
        }
        break
      default:
        // generic response
        returnThisJsonArray.push({
          name: anError.name,
          message: anError.message,
        })
    }
  })
  return { errors: returnThisJsonArray }
}

function getUUID() {
  return UuidV4()
}

function cloneJSON(objectToClone) {
  // basic type deep copy
  let i
  if (
    objectToClone === null ||
    objectToClone === undefined ||
    typeof objectToClone !== 'object'
  ) {
    return objectToClone
  }
  // array deep copy
  if (objectToClone instanceof Array) {
    const cloneA = []
    for (i = 0; i < objectToClone.length; ++i) {
      cloneA[i] = cloneJSON(objectToClone[i])
    }
    return cloneA
  }
  // object deep copy
  const cloneO = {}
  for (i in objectToClone) {
    cloneO[i] = cloneJSON(objectToClone[i])
  }
  return cloneO
}

module.exports = {
  errorsToResponse,
  getUUID,
  cloneJSON,
}
