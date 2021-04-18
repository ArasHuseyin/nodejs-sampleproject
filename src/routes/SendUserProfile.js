import { ContactList } from "../Models/ContactListSchema.js";
import { User } from "../Models/UserSchema.js";
import { verifyToken } from "./UserSearch.js"

const sendImages = (req, res) => {
    const { isValidToken, token } = verifyToken(req.session.token);
    console.log('----------------------------------')
    console.log(token);
    console.log('----------------------------------')
    if (isValidToken) {
        const contacts = [];
        const imgUrls = [];
        ContactList.findOne({ email: token.email }).then(contactlist => {
            if (contactlist) {
                contactlist.usernames.forEach(contact => {
                    contacts.push(contact);
                })

                contacts.forEach((contact) => {
                    User.findOne({ username: contact }).then(user => {
                        if (user && user.ProfileInfos) {
                            console.log(user.ProfileInfos.image.url)
                            return { username: contact, imageUrl: user.ProfileInfos.image.url };
                        } else {
                            return { username: contact, imageUrl: 'https://ptetutorials.com/images/user-profile.png' };
                        }
                    }).then(r => {
                        console.log('------------------');
                        console.log(r)
                        console.log('------------------');
                        imgUrls.push(r);
                        if (contacts.length === imgUrls.length) {
                            console.log('------------------');
                            res.json({ imgUrls })
                            console.log('------------------');
                        }
                    })
                })
            }
        })
    } else {
        res.redirect('/');
    }
}

const sendSingleImage = (req, res) => {
    const username = req.body.username;

    User.findOne({ username }).then(user => {
        if (user && user.ProfileInfos) {
            res.json({ image: user.ProfileInfos.image.url })
        } else {
            res.json({ image: 'https://ptetutorials.com/images/user-profile.png' })
        }
    })
}

export { sendImages, sendSingleImage };