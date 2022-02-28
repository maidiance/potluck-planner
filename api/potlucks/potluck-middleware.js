const Potlucks = require('./potluck-model');

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

const validateItem = (req, res, next) => {
    if(!req.body.name || !req.body.name.trim()){
        res.status(400).json({message: 'missing required name'});
    } else {
        next();
    }
}

module.exports = {
    validateId,
    validatePotluck,
    validateItemId,
    validateItem
}