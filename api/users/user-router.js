const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('./user-model');
const { validateUser, validateUsername } = require('./user-middleware');
const { JWT_SECRET } = require('../secrets');
  
router.post('/register', validateUser, async (req, res) => {
    const user = req.body;
    const hash = bcrypt.hashSync(user.password, 8);
    user.password = hash;
    let result = await Users.insert(user);
    res.status(201).json(result);
});

router.post('/login', validateUser, validateUsername, (req, res) => {
    const request = req.body.password;
    const user = req.user;
    if(bcrypt.compareSync(request, user.password)) {
        const token = generateToken(user);
        res.status(200).json({
            message: `welcome ${user.username}`,
            token
        });
    } else {
        res.json(401).json({message: 'invalid credentials'});
    }
});

function generateToken(user) {
    const payload = {
        subject: user.user_id,
        username: user.username
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

module.exports = router;