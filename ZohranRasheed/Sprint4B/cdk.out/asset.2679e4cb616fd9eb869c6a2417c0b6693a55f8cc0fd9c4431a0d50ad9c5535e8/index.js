const express = require('express')
const app = express()
require('./startup/routes')(app);

app.listen(3000, () => {
    console.log('Listening at port 3000')
})

module.exports = app