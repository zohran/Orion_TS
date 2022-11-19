require('source-map-support/register')
const serverLessExpress = require('@vendia/serverless-express')
const app = require('./index')

exports.handler = serverLessExpress({ app })