const { Machine, assign } = require('xstate')
const {VM} = require('vm2')

module.exports = (dehydrated) => {
  let rehydreted = JSON.parse(dehydrated)
  let guards = {}
  Object.keys(rehydreted.guards).forEach(guard => {
    let func = Function(rehydreted.guards[guard])
    guards[guard] = func
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
    // else {
    //   let actionFunctions = {}
    //   Object.keys(rehydreted.actions[action]).forEach(a => {
    //     let str = rehydreted.actions[action][a]
    //     let func = Function(str)
    //     actionFunctions[a] = func
    //   })
    //   actions[action] = assign(actionFunctions)
    // }
  })

  let machine = Machine(rehydreted.machine, {guards, actions})
  return machine
}
