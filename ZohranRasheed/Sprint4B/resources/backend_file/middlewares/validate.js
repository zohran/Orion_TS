/**
   * Middleware to validate request body
   * @param req request object
   * @param res response object
   * @param next method to pass control to next middleware
   * @returns response
*/
function validate (req, res, next) {
    const keys = Object.keys(req.body)
    if(keys.length != 1 || keys[0] != 'url'){
        return res.status(400).send('Please send only url')
    }
    else{
        next();
    }
};

module.exports = validate;