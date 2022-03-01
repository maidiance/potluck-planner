const router = require('express').Router();
const Potluck = require('./potluck-model');
const { restricted, validateId, validatePotluck } = require('./potluck-middleware');
const { validateUserId } = require('./../users/user-middleware');

// Potluck routes
router.get('/', (req, res) => {
    Potluck.find()
        .then(potlucks => {
            res.status(200).json(potlucks);
        })
        .catch(() => {
            res.status(500).json({message: 'could not get potlucks'});
        })
});

router.get('/:id', validateId, (req, res) => {
    res.json(req.potluck);
});

router.post('/', restricted, validatePotluck, (req, res) => {
    Potluck.insert(req.body)
        .then(potluck => {
            res.status(201).json(potluck);
        })
        .catch(() => {
            res.status(500).json({message: 'could not post potluck'});
        })
});

router.put('/:id', restricted, validateId, validatePotluck, (req, res) => {
    Potluck.update(req.params.id, req.body)
        .then(potluck => {
            res.status(200).json(potluck);
        })
        .catch(() => {
            res.status(500).json({message: 'could not update potluck'});
        })
});

router.delete('/:id', restricted, validateId, (req, res) => {
    Potluck.remove(req.params.id)
        .then(potluck => {
            res.status(200).json(potluck);
        })
        .catch(() => {
            res.status(500).json({message: 'could not delete potluck'});
        })
});

// Attending routes
router.get('/:id/attend/:user_id', validateId, validateUserId, (req, res) => {
    
});

module.exports = router;