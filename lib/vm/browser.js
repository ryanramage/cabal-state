
module.exports = (code, context, event) => {
  // eval evil
  let expression = `
    const context = ${JSON.stringify(context)};
    const event = ${JSON.stringify(event)};
    const exp = ${code}
    exp(context, event)
  `
  return eval(expression)
}
