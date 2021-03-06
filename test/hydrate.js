const test = require('tape')
const { interpret } = require('xstate')
const dehydrate = require('../lib/dehydrate')
const rehydrate = require('../lib/rehydrate')

const example = require('./assets/water-glass.js')

test('dehydrate/rehydrate cycle', t => {
  const asJson = dehydrate.toJson(example)
  const machine = rehydrate.fromJson(asJson)

  const service = interpret(machine).onTransition(state => {
    console.log(state.value);
    console.log(state.context)
  });

  // Start the service
  service.start();

  // Send events
  service.send('TRIGGER');
  service.send('TRIGGER');
  service.send('STOP')

  // Stop the service when you are no longer using it.
  service.stop();

  t.end()
})
