const Items = require('./item-model');
const Users = require('./../users/user-model');

const validateItemId = (req, res, next) => {
    const id = req.params.item_id;
    Items.findById(id)
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
    validateItemId,
    validateItem
}