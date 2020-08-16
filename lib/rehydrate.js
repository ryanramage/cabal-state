const { Machine, assign } = require('xstate')
const vm = require('./vm')

exports.fromString = (dehydrated) => {
  try {
    const json = JSON.parse(dehydrated)
    return exports.fromJson(json)
  } catch (e) {
    return null
  }
}

exports.fromJson = (rehydreted) => {
  let guards = {}
  Object.keys(rehydreted.guards).forEach(guard => {
    let code = rehydreted.guards[guard]
    guards[guard] = (context, event) => vm(code, context, event)
  })

  let actions = {}
  Object.keys(rehydreted.actions).forEach(action => {

    let about = rehydreted.actions[action]
    if (typeof about === 'string') {
      let code = rehydreted.actions[action]
      actions[action] = (context, event) => vm(code, context, event)
    }
  })

  Object.keys(rehydreted.assignments).forEach(name => {
    let details = rehydreted.assignments[name]
    let assignmentObject = {}
    Object.keys(details).forEach(contextProperty => {
            // this is an object
      let aboutContextProperty = details[contextProperty]
      if (aboutContextProperty.type === 'function') {
        let code = aboutContextProperty.value
        assignmentObject[contextProperty] = (context, event) => vm(code, context, event)
      } else {
        assignmentObject[contextProperty] = aboutContextProperty.value
      }
    })
    actions[name] = assign(assignmentObject)
  })

  let machine = Machine(rehydreted.machine, {guards, actions})
  return machine
}
