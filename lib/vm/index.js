const { VM } = require('vm2')

module.exports = (code, context, event) => {
  let expression = `(${code})(context, event)`
  const vm = new VM({
    sandbox: {context, event, console}
  })
  return vm.run(expression)
}
