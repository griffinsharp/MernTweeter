const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const keys = require('../../config/keys');
const jwt = require('jsonwebtoken');

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));


// register route for our user
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (user) {
                return res.status(400).json({email: "A user is already registered with that email"})
            } else { 
                const newUser = new User({
                    handle: req.body.handle,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save() 
                            .then((user) => res.json(user))
                            .catch(err => console.log(err));
                    });
                });
            }
        });
});

// find - return array
// findOne - returns the one object
// this is for the 'api/users/login' route
// if there's no user with the email specified, return one response.
// if there's an email, continue to the bcrypt logic.
// if there's an email, and the password matches, it should signify a successful login.
// if there's an email, but the passsword isn't a match, signify an incorrect password entry. 

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // ES6 let's us write {email: email} as just {email}
    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({ email: "This user does not exist." });
            }

        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {

                    const payload = {
                        id: user.id,
                        handle: user.handle,
                        email: user.email
                    }

                // json webtoken setup
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                } else {
                    return res.status(400).json({password: "Incorrect password"});
                }
            });
        });
});

module.exports = router;