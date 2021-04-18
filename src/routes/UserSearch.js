import { User } from '../Models/UserSchema.js';
import EmailValidator from 'email-validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { ContactList } from '../Models/ContactListSchema.js';

dotenv.config();
const findUser = (req, res, next) => {
    const user = req.body.username;
    console.log(req.session.token);
    console.log(req.body.username);
    jwt.verify(req.session.token, process.env.TOKEN_KEY, (err, result) => {
        if (err) console.log(err);
        if (result) {
            if (user && EmailValidator.validate(user)) {
                if (result.email == user) {
                    res.json({
                        status: false,
                        message: 'Can not add current user to friendlist!'
                    })
                } else {

                    //user wird gesucht 
                    User.findOne({ email: user }).then((foundUser) => {
                        if (foundUser) {
                            // suche nach kontaktliste von aktuellen benutzer
                            ContactList.findOne({ email: result.email }).then((async contacts => {
                                if (contacts) {
                                    let isContact = false;
                                    await contacts.emails.forEach((contact) => {
                                        if (contact == user) {
                                            isContact = true;
                                            res.json({ status: false, message: 'User already in friendlist' })
                                            next();
                                        }
                                    })
                                    if (!isContact) {
                                        contacts.emails.push(foundUser.email);
                                        contacts.usernames.push(foundUser.username);
                                        await contacts.save();
                                        res.json({
                                            status: true,
                                            username: contacts.usernames[contacts.usernames.length - 1],
                                            email: contacts.emails[contacts.emails.length - 1]
                                        });
                                    }
                                } else if (!contacts) {
                                    const contactList = await new ContactList({
                                        username: result.username,
                                        usernames: [foundUser.username],
                                        emails: [foundUser.email],
                                        email: result.email
                                    }).save();
                                    res.json({ status: true, contactList });
                                }
                            }));
                        } else if (!foundUser) {
                            res.json({ status: false, message: 'Could not find User with given credentials' })
                        }
                    })
                }
            }
            else if (user && !EmailValidator.validate(user)) {
                if (user == result.username) {
                    res.json({ status: false, message: 'Can not add current user to friendlist!' })
                } else {

                    //user wird gesucht 
                    User.findOne({ username: user }).then((foundUser) => {
                        if (foundUser) {
                            // suche nach kontaktliste von aktuellen benutzer
                            ContactList.findOne({ username: result.username }).then((async contacts => {
                                if (contacts) {
                                    let isContact = false;
                                    await contacts.usernames.forEach((contact) => {
                                        if (contact == user) {
                                            isContact = true;
                                            res.json({ status: false, message: 'User already in friendlist' })
                                            next();
                                        }
                                    })
                                    if (!isContact) {
                                        contacts.emails.push(foundUser.email);
                                        contacts.usernames.push(foundUser.username);
                                        await contacts.save();
                                        res.json({
                                            status: true,
                                            username: contacts.usernames[contacts.usernames.length - 1],
                                            email: contacts.emails[contacts.emails.length - 1]
                                        });
                                    }
                                } else if (!contacts) {
                                    const contactList = await new ContactList({
                                        username: result.username,
                                        usernames: [foundUser.username],
                                        emails: [foundUser.email],
                                        email: result.email
                                    }).save();
                                    res.json({ status: true, contactList });
                                }
                            }));
                        } else if (!foundUser) {
                            res.json({ status: false, message: 'Could not find User with given credentials' })
                        }
                    })
                }
            }
        }
    })
};

const updateTargetUser = async (req, res) => {
    const owner = req.body.currentUser;
    const targetUser = req.body.targetUser;
    let username;
    let mail;
    let ownerMail;
    await User.findOne({ username: owner }).then(user => {
        if (user) {
            ownerMail = user.email;
        }
    })
    await User.findOne({ username: targetUser }).then(user => {
        if (user) {
            mail = user.email;
            username = user.username;
        }
    })
    if (targetUser && owner && ownerMail) {
        ContactList.findOne({ username: targetUser }).then(async (contactlist) => {
            if (contactlist && !contactlist.emails.includes(mail) && !contactlist.usernames.includes(username) && contactlist.email === ownerMail) {
                console.log('mail---_____________________________', mail);
             contactlist.emails.push(mail);
             contactlist.usernames.push(username);
             //   contactlist.emails.set(contactlist.emails.length, mail);
              //  contactlist.usernames.set(contactlist.usernames.length, owner);
              await  contactlist.save();
                res.json({status: true ,contactlist:contactlist})
            } else {
                console.log('imelse-----------------------------------------------')
                const contactList = await new ContactList({
                    username: owner,
                    usernames: [targetUser],
                    emails: [mail],
                    email: ownerMail
                }).save();
                res.json({ status: true, contactList });
            }
        })
    }
}

const sendContactList = async (req, res,) => {
    const { isValidToken, token } = verifyToken(req.session.token);
    console.log(req.session.token);
    const user = token.email;
    failureResponse(user, res, 'msg folgt');
    if (isValidToken) {
        if (user && EmailValidator.validate(user)) {
            contactList({ email: user }, res);
        } else {
            res.json({ status: false })
        }
    }
}


const contactList = async (searchFilter, res) => {
    await ContactList.findOne(searchFilter).then(contacts => {
        if (contacts) {
            res.json({ status: true, contacts });
        } else if (!contacts) {
            res.json({ status: false, message: 'Empty Contactlist' })
        }
    });
}



const verifyToken = (payload) => {
    let isValidToken = false;
    let token;
    if (payload) {
        jwt.verify(payload, process.env.TOKEN_KEY, (err, result) => {
            if (err) console.log(err);
            if (result) {
                token = result;
                isValidToken = true;
            }
        })
        return { isValidToken, token };
    } else if (!payload) {
        console.log('no Payload was given -> session expired!')
        return { isValidToken, token: null };
    }

}

const failureResponse = (user, res, msg) => {
    if (!user) {
        res.json({
            status: false,
            message: msg
        })
    }
}
export { findUser, sendContactList, verifyToken, updateTargetUser };