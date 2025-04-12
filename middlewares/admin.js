const { JWT_ADMIN } = require('../config')
const jwt = require('jsonwebtoken')
function adminMiddleware(req,res,next){
    const {token} = req.headers;
    const decode = jwt.verify(token,JWT_ADMIN)
    if(!decode){
        return res.json({
            msg : "Go and Signin first"
        })
    }
    req.adminId = decode.id;
    next();
}

module.exports = {
    adminMiddleware
}