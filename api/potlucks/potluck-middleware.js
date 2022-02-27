const Potlucks = require('./potluck-model');

const validateId = (req, res, next) => {
    const id = req.params.id;
    Potlucks.findById(id)
        .then(potluck => {
            if(!potluck) {
                res.status(404).json({message: `potluck ${id} not found`});
            } else {
                req.potluck = potluck;
                next();
            }
        })
        .catch(() => {
            res.status(500).json({message: 'could not Potlucks.findById'});
        })
}

const validatePotluck = (req, res, next) => {
    const potluck = req.body;
    if(!potluck) {
        res.status(500).json({message: 'missing required body'});
    } else if (!potluck.name || !potluck.name.trim()) {
        res.status(500).json({message: 'missing required name'});
    } else {
        next();
    }
}

const validateItem = (req, res, next) => {
    if(!req.body.name){
        res.status(400).json({message: 'missing required name'});
    } else {
        next();
    }
}

module.exports = {
    validateId,
    validatePotluck,
    validateItem
}