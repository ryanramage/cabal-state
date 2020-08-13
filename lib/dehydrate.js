exports.toString = (machineDfn) => {
  let asJson = exports.toJson(machineDfn)
  return JSON.stringify(asJson, null, 2)
}

exports.toJson = (machineDfn) => {
  let transformed = {
    machine: machineDfn.machine,
    actions: {},
    assignments: {},
    guards: {}
  }

  // Actions - the vanilla kind
  let actions = machineDfn.actions || {}
  Object.keys(actions).forEach(action => {
    let allActions = actions[action]
    if (typeof allActions === 'function') {
      let asString = actions[action].toString()
      transformed.actions[action] = asString
    } else {
      let transformedActions = {}
      Object.keys(allActions).forEach(a => {
        let func = allActions[a]
        let asString = func.toString()
        transformedActions[a] = asString
      })
      transformed.actions[action] = transformedActions
    }
  })

  // Assignments, a special case of actions
  let assignments = machineDfn.assignments || {}
  let assignmentObject = {}
  Object.keys(assignments).forEach(name => {
    let details = assignments[name]
    // details should be an object
    let transformedActions = {}
    Object.keys(details).forEach(contextProperty => {
      let thing = details[contextProperty]
      if (typeof thing === 'function') {
        let asString = thing.toString()
        transformedActions[contextProperty] = {
          type: 'function',
          value: asString
        }
      } else {
        transformedActions[contextProperty] = {
          type: 'value',
          value: thing
        }
      }
    })
    assignmentObject[name] = transformedActions
  })
  transformed.assignments = assignmentObject

  // Guards
  let guards = machineDfn.guards || {}
  Object.keys(guards).forEach(guard => {
    let func = guards[guard]
    let asString = func.toString()
    transformed.guards[guard] = asString
  })
  return transformed
}
