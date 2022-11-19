function validate (req, res, next) {
    const keys = Object.keys(req.body)
    if(keys.length != 0 || keys[0] != 'url'){
        return res.status(400).send('Please send url')
    }
    else{
        next();
    }
};

module.exports = validate;