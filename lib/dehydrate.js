module.exports = (loaded) => {
  let transformed = {
    machine: loaded.machine,
    actions: {},
    guards: {}
  }

  let actions = loaded.actions || {}
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

  let guards = loaded.guards || {}
  Object.keys(guards).forEach(guard => {
    let func = guards[guard]
    let asString = func.toString()
    transformed.guards[guard] = asString
  })

  return JSON.stringify(transformed, null, 4)
}
