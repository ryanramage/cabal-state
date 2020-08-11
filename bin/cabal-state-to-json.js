#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const dehydrate = require('../lib/dehydrate')

let file = process.argv[2]
let fullPath = path.resolve(process.cwd(), file)
let toFile = fullPath + 'on' // make a json

const loaded = require(fullPath)
const data = dehydrate(loaded)


fs.writeFile(toFile, data, (err) => {
  if (err) console.log(err)
  else console.log('wrote', toFile)
})
