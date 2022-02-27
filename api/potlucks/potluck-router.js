const router = require('express').Router();
const Potluck = require('./potluck-model');
const { validateId, validatePotluck, validateItem } = require('./potluck-middleware');

router.get('/', (req, res) => {
    Potluck.find()
        .then(potlucks => {
            res.status(200).json(potlucks);
        })
        .catch(() => {
            res.status(500).json({message: 'could not get potlucks'});
        })
});

router.get('/:id', (req, res) => {
    res.json(req.potluck);
});

router.post('/', (req, res) => {
    Potluck.insert(req.body)
        .then(potluck => {
            res.status(201).json(potluck);
        })
        .catch(() => {
            res.status(500).json({message: 'could not post potluck'});
        })
});

router.put('/:id', (req, res) => {
    Potluck.update(req.params.id, req.body)
        .then(potluck => {
            res.status(200).json(potluck);
        })
        .catch(() => {
            res.status(500).json({message: 'could not update potluck'});
        })
});

router.delete('/:id', (req, res) => {
    Potluck.delete(req.params.id)
        .then(potluck => {
            res.status(200).json(potluck);
        })
        .catch(() => {
            res.status(500).json({message: 'could not delete potluck'});
        })
});

router.get('/:id/items', (req, res) => {
    const { id } = req.params;
    Potluck.findItems(id)
        .then(items => {
            res.status(200).json(items);
        })
        .catch(() => {
            res.status(500).json({message: 'could not get items'});
        })
});

router.post('/:id/items', (req, res) => {
    const { id } = req.params;
    Potluck.insertItem(id, req.body)
        .them(item => {
            res.status(201).json(item);
        })
        .catch(() => {
            res.status(500).json({message: 'could not post item'});
        })
});

module.exports = router;