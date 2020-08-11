const machine = {
  id: 'trigger',
  initial: 'inactive',
  context: {
    level: 0
  },
  states: {
    inactive: {
      on: {
        TRIGGER: {
          target: 'active',
          actions: ['activate', 'sendTelemetry']
        }
      }
    },
    active: {
      entry: ['notifyActive', 'sendTelemetry'],
      exit: ['notifyInactive', 'sendTelemetry'],
      on: {
        STOP: 'inactive'
      }
    }
  }
}

const actions = {
  // action implementations
  activate: (context, event) => {
    console.log('activating...')
  },
  notifyActive: (context, event) => {
    console.log('active!')
  },
  notifyInactive: (context, event) => {
    console.log('inactive!')
  },
  sendTelemetry: (context, event) => {
    console.log('time:', Date.now())
  }
}

const guards = {
  glassIsFull: (context, event) => context.amount >= 10
}

module.exports = { machine, actions, guards }
