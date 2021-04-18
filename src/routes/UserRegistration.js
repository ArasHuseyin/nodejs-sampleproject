import bcrypt from 'bcryptjs'
import { User } from '../Models/UserSchema.js';
import sendMail from '../controller/confirmationMail/sendMail.js'

const mainPage = (req, res) => { res.render('index');};

const registrationPage = (req, res) => {res.render('registration');};

const notFound = (req, res) => { res.render('error');}

const registration = (req, res) => {
    if (req.body) {
        let { name, email, username, password } = req.body;
        bcrypt.hash(password, 8, (err, hash) => {
            if (err)
                console.log(err);
            password = hash;
        })
        console.log(password)
        if (!name || !email || !username || !password) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(new Error('Internal Server Error!'))
        } else {
            User.findOne({ email: email }).then((user) => {
                if (user) {
                    // statuscode wird noch geändert
                    res.status(200).send({
                        message: 'Email already registered! Please Provide a correct Email or click here to login'
                    })
                } else {
                    User.findOne({ username: username }).then(user => {
                        if (user) {
                            res.status(200).send({
                                message: 'User with given Username already registered! Please Provide a correct Email or click here to login'
                            })
                        } else {
                            let code = (Math.random() * 21000) + (Math.random() * 2000 / 2 * 200);
                            const newUser = new User({
                                name: name, email: email, username: username, password: password, isValidMail: false, confirmationCode: code,
                            })
                            newUser.save()
                                .then(res => console.log(res))
                                .catch(err => console.log('UserHadling.mjs: 45 ', err))
                            sendMail(email, code);
                            res.status(200).send({
                                message: 'Registered Successfully! Email has been sent, please Check your Mails'
                            })
                        }
                    })
                }
            });
        }
    }
};

const verify = async (req, res) => {
    console.log(req.query.token);
    await User.updateOne({ confirmationCode: req.query.token }, { $set: { isValidMail: true } });
    res.render('mailconfirmation');
}

export {
    mainPage,
    registrationPage,
    notFound,
    registration,
    verify
}
