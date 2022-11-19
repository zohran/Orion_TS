const express = require('express')


/**
   * Setup routes
   * @param app express app
   * @returns 
*/
module.exports = function(app) {
    app.use(express.json());
    app.use('/api/urls', require('../routes/urls'));
}