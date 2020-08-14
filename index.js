const { interpret } = require('xstate')
const collect = require('collect-stream')
const rehydrate = require('./lib/rehydrate')

exports.fromString = (cabal, machineDfn, channelName) => exports.fromJson(cabal, rehydrate.fromString(machineDfn), channelName)

exports.fromJson = (cabal, machineDfn, channelName) => {
  const machine = rehydrate.fromJson(machineDfn)
  const service = interpret(machine)

  // dont expose service.send to the outside world. we want to send it to the cabal first
  let internalServiceSend = service.send // save for later

  service.start()
  cabal.ready(() => {
    const rs = cabal.messages.read(channelName)
    collect(rs, (err, msgs) => {
      let reversed = []
      for (let i = msgs.length - 1; i >= 0; --i) {
        const msg = msgs[i]

        let stateMachineMessage = parseMessage(msg)
        if (stateMachineMessage) reversed.push(stateMachineMessage)
      }
      if (reversed.length) internalServiceSend(reversed)

      // now that we have caught the state machine up, bind to any more event messages
      cabal.messages.events.on('message', (details) => {
        let message = parseMessage(details)
        if (message) internalServiceSend(message)

      })
    })
  })

  // override the service send that is exposed, we need to publish to cabel
  service.send = (arg1, arg2) => {
    if (typeof arg1 === 'string') {
      publishStateMessage(cabal, arg1, arg2)
    }
    else if (Array.isArray(arg1)) {
      arg1.forEach(item => {
        if (typeof item === 'string') publishStateMessage(cabal, item)
        else if (typeof item === 'object') publishEvent(cabal, item)
      })
    }
    else if (typeof arg1 === 'object') {
      publishEvent(cabal, arg1)
    }
  }
  return service
}

function publishEvent (cabal, event) {
  let type = event.type
  delete event.type
  publishStateMessage(cabal, type, event)
}

function publishStateMessage (cabal, type, event) {
  let cabalMessage = {
    type: 'chat/text',
    content: {
      text: type,
      channel: channelName,
      stateMachine: true
    }
  }
  if (event) cabalMessage.content.event = event
}

function parseMessage(message) {
  let value = message.value
  if (!value) return
  let content = value.content
  if (!content) return
  let text = content.text
  let event = content.event || {}
  event.type = text
  return event
}
