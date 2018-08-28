const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (req, res, next) => {
    try {
        let token = req.headers.authorization
        token = token.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_KEY)
        req.userData = decoded
        console.log('AUTH CORRECT')
        next()

    } catch (error) {
        console.log(error)
        return res.status(401).json({message: 'Auth failed'})
    }

}