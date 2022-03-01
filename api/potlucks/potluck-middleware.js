const Potlucks = require('./potluck-model');
const Users = require('../users/user-model');
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
    const id = req.params.id;
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

const validateItemId = (req, res, next) => {
    const id = req.params.item_id;
    Potlucks.findItemById(id)
        .then(item => {
            if(item == null) {
                res.status(404).json({message: `item ${id} not found`});
            } else {
                next();
            }
        })
        .catch(() => {
            res.status(500).json({message: 'could not validate item id'});
        })
}

const validateItem = async (req, res, next) => {
    if(!req.body.name || !req.body.name.trim()){
        res.status(400).json({message: 'missing required name'});
    } else if(req.body.name.length >= 128) {
        res.status(400).json({message: 'name too long'});
    } else if(req.body.responsible != null) {
        const result = await Users.findById(req.body.responsible);
        if(!result) {
            res.status(400).json({message: 'invalid user'});
        } else {
            next();
        }
    } else {
        next();
    }
}

module.exports = {
    restricted,
    validateId,
    validatePotluck,
    validateItemId,
    validateItem
}