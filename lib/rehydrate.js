const { Machine, assign } = require('xstate')
const {VM} = require('vm2')

module.exports = (dehydrated) => {
  let rehydreted = JSON.parse(dehydrated)


  let guards = {}
  Object.keys(rehydreted.guards).forEach(guard => {
    let code = `(${rehydreted.guards[guard]})(context, event)`
    guards[guard] = (context, event) => {
      const vm = new VM({
        sandbox: {context, event, console}
      })
      return vm.run(code)
    }
  })

  let actions = {}
  Object.keys(rehydreted.actions).forEach(action => {

    let about = rehydreted.actions[action]
    if (typeof about === 'string') {
      let code = `(${rehydreted.actions[action]})(context, event)`
      actions[action] = (context, event) => {
        const vm = new VM({
          sandbox: {context, event, console}
        })
        return vm.run(code)
      }
    }
  })

  Object.keys(rehydreted.assignments).forEach(name => {
    let details = rehydreted.assignments[name]
    let assignmentObject = {}
    Object.keys(details).forEach(contextProperty => {
            // this is an object
      let aboutContextProperty = details[contextProperty]
      if (aboutContextProperty.type === 'function') {
        let code = `(${aboutContextProperty.value})(context, event)`
        assignmentObject[contextProperty] = (context, event) => {
          const vm = new VM({
            sandbox: {context, event, console}
          })
          return vm.run(code)
        }
      } else {
        assignmentObject[contextProperty] = aboutContextProperty.value
      }
    })
    actions[name] = assign(assignmentObject)
  })

  let machine = Machine(rehydreted.machine, {guards, actions})
  return machine
}
