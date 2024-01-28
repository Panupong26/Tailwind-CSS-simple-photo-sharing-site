const jwt = require('jsonwebtoken');
const db = require('../models');

require('dotenv').config();


module.exports = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if(!authorization || !authorization.startsWith('Bearer')) {
            return res.status(401).send({message: 'unauthorized'});
        };

        const token = authorization.split(' ')[1];

        if(!token) {
            return res.status(401).send({message: 'unauthorized'});
        }
        
        const payload = jwt.verify(token, process.env.JWT_SECRETKEY);

        const user = await db.user.findOne({
            where: {
                username: payload.userEmail
            },
            attributes: {
                exclude: ['password']
            }
        });


        if(!user) {
            return res.status(401).send({message: 'unauthorized'});
        }

        req.user = user;

        next();
    } catch(err) {
        if(err.message === 'jwt expired') {
            return res.status(401).send({message: 'unauthorized'});
        } else {
            return res.status(500).send({message: err.message});
        }
    }  
}