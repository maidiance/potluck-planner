const Users = require('./user-model');

function validateUser (req, res, next) {
    const { username, password } = req.body;
    if(!username || !username.trim()) {
        res.status(400).json({message: 'username required'});
    } else if (!password || !password.trim()) {
        res.status(400).json({message: 'password required'});
    } else {
        next();
    }
}

async function validateUsername (req, res, next) {
    const username = req.body.username;
    const user = await Users.findBy({username});
    if(user == null || user.length < 1) {
        res.status(401).json({message: 'invalid user'});
        res.end();
    } else {
        req.user = user;
        next();
    }
}

module.exports = {
    validateUser,
    validateUsername
}