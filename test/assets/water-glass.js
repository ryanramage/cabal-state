const machine = {
  id: 'trigger',
  initial: 'inactive',
  context: {
    triggerCount: 0
  },
  states: {
    inactive: {
      on: {
        TRIGGER: {
          target: 'active',
          cond: { type: 'minTwo' },
          actions: ['activate', 'sendTelemetry', 'incTriggerCount']
        }
      }
    },
    warm: {
      on: {
        TRIGGER: {
          target: 'active',
        }
      }
    },

    active: {
      //cond: 'minTwo',
      entry: ['notifyActive', 'sendTelemetry'],
      exit: ['notifyInactive', 'sendTelemetry'],
      on: {
        STOP: {
          target: 'inactive',
          actions: 'resetTriggerCount'
        }
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

const assignments = {
  incTriggerCount: {
    triggerCount: (context, event) => context.triggerCount + 1
  },
  resetTriggerCount: {
    triggerCount: 0
  }
}

const guards = {
  minTwo: (context, event) => context.triggerCount >= 2
}

module.exports = { machine, actions, assignments, guards }
