const router = require('express').Router();
const Items = require('./item-model');
const { restricted, validateId } = require('./../potlucks/potluck-middleware');
const { validateItemId, validateItem } = require('./item-middleware');

// Item routes
router.get('/items', validateId, (req, res) => {
    const id = req.id;
    Items.find(id)
        .then(items => {
            res.status(200).json(items);
        })
        .catch(() => {
            res.status(500).json({message: 'could not get items'});
        })
});

router.post('/items', validateId, validateItem, (req, res) => {
    const id = req.id;
    Items.insert(id, req.body)
        .then(item => {
            res.status(201).json(item);
        })
        .catch(() => {
            res.status(500).json({message: 'could not post item'});
        })
});

router.put('/items/:item_id', restricted, validateId, validateItemId, validateItem, (req, res) => {
    const {item_id} = req.params;
    Items.update(item_id, req.body)
        .then(item => {
            res.status(200).json(item);
        })
        .catch(() => {
            res.status(500).json({message: 'could not put item'});
        })
});

router.delete('/items/:item_id', restricted, validateId, validateItemId, (req, res) => {
    const {item_id} = req.params;
    Items.remove(item_id)
        .then(item => {
            res.status(200).json(item);
        })
        .catch(() => {
            res.status(500).json({message: 'could not delete item'});
        })
});

module.exports = router;