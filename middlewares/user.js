const { JWT_USER } = require('../config')
const jwt = require('jsonwebtoken')
function userMiddleware(req,res,next){
    const {token} = req.headers;
    const decode = jwt.verify(token,JWT_USER)
    if(!decode){
        return res.json({
            msg : "Go and Signin first"
        })
    }
    req.userId = decode.id;
    next();
}

module.exports = {
    userMiddleware
}