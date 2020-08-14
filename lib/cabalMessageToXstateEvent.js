module.exports = function parseMessage(message) {
  let value = message.value
  if (!value) return
  let content = value.content
  if (!content) return
  let text = content.text
  let event = content.event || {}
  event.type = text
  return event
}
