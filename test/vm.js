const test = require('tape')

test('browser eval', t => {
  let code = '(context, event) => context.count + 1'
  let context = {count: 1}
  let event = {}
  const vm = require('../lib/vm/browser')
  let result = vm(code, context, event)
  t.equals(2, result)
  t.end()

})

test('node vm', t => {
  let code = '(context, event) => context.count + 1'
  let context = {count: 1}
  let event = {}
  const vm = require('../lib/vm')
  let result = vm(code, context, event)
  console.log(result)
  t.equals(2, result)
  t.end()
})
