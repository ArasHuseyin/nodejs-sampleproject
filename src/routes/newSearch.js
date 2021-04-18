import { User } from '../Models/UserSchema.js';
import EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ContactList } from '../Models/ContactListSchema.js';

dotenv.config();
const findUser = (req, res) => {
    const user = req.body.username;
    console.log(req.session.token);
    console.log(req.body.username);
    jwt.verify(req.session.token, process.env.TOKEN_KEY, (err, result) => {
        if (err) console.log(err);
        if (result) {
        }
    })
}

const contactList = (searchFilter) => {
    ContactList.findOne({ searchFilter }).then(contacts => {
        if (contacts)
            res.json({ status: true, contacts })
        next();
    });
}
/*
   res.json({
                                    foundUser: true,
                                    email: user.email,
                                    username: user.username
                                });
*/


const failureResponse = (user, res) => {
    if (user === null) {
        res.json({
            foundUser: false,
            message: 'Could not find a user with given credentials'
        })
    }
}
export { findUser };