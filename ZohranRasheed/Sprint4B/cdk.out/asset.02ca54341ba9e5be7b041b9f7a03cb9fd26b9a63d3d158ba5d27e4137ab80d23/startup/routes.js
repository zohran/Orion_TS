const express = require('express')

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/urls', require('../routes/urls'));
}