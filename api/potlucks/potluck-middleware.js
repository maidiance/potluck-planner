const Potlucks = require('./potluck-model');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../secrets');

const restricted = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        res.status(401).json({message: 'token required'});
    } else {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if(err) {
                res.status(401).json({message: 'token invalid'});
            } else {
                req.decodedJwt = decoded;
                next();
            }
        });
    }
}

const validateId = (req, res, next) => {
    const id = req.params.id || req.id;
    Potlucks.findById(id)
        .then(potluck => {
            if(potluck.length < 1) {
                res.status(404).json({message: `potluck ${id} not found`});
            } else {
                req.potluck = potluck[0];
                next();
            }
        })
        .catch(() => {
            res.status(500).json({message: 'could not validate potluck id'});
        })
}

const validatePotluck = (req, res, next) => {
    const potluck = req.body;
    if(!potluck) {
        res.status(400).json({message: 'missing required body'});
    } else if (!potluck.name || !potluck.name.trim()) {
        res.status(400).json({message: 'missing required name'});
    } else if (potluck.name.length >= 128){
        res.status(400).json({message: 'name too long'});
    } else {
        next();
    }
}

module.exports = {
    restricted,
    validateId,
    validatePotluck
}