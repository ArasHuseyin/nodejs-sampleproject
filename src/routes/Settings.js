import { verifyToken } from './UserSearch.js';
import { User } from '../Models/UserSchema.js'
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import * as fs from 'fs'
import imgbbUploader from 'imgbb-uploader';

dotenv.config();
const __dirname = path.resolve();

const loadImageProfile = (req, res) => {
    const { isValidToken, token } = verifyToken(req.session.token);
    if (isValidToken) {
        User.findOne({ email: token.email }).then((user) => {
            if (user.ProfileInfos) {
                res.json({ img: [user.ProfileInfos.image.url, user.ProfileInfos.delete_url] })
            }
            if (!user.ProfileInfos) {
                console.log('no Profileimage found, placeholder image sent')
                res.json({ img: ['https://bootdey.com/img/Content/avatar/avatar1.png', null] })
            }
        });
    } else if (!isValidToken) {
        res.render('index');
    }
}

const updateProfileImage = (req, res) => {
    console.log(req.file);
    const fileEnding = req.file.originalname.split('.').pop();
    console.log(fileEnding)
    const { isValidToken, token } = verifyToken(req.session.token);
    if (isValidToken && (fileEnding.toLowerCase() === 'png' || fileEnding.toLowerCase() === 'jpg')) {
        console.log(token)
        const oldPath = path.join(__dirname, `uploads/${req.file.filename}`);
        const newPath = path.join(__dirname, 'uploads/' + token.email + '.' + fileEnding);
        fs.rename(oldPath, newPath, () => { });
        console.log(newPath)
        imgbbUploader(
            process.env.IMGBB_API_KEY,
            newPath
        )
            .then((response) => {
                if (response) {
                    console.log(response);
                    fs.unlink(newPath, async (err) => {
                        if (err) {
                            console.log(err);
                        } else {
                            await User.updateOne({ email: token.email }, { $set: { ProfileInfos: response } });
                            res.json({ status: true, imgUrl: response.image.url })
                        }

                    })
                }
            })
            .catch((error) => console.error(error));
    } else if (!isValidToken) {
        res.render('index');
    } else if (fileEnding.toLowerCase() !== 'png' && fileEnding.toLowerCase() !== 'jpg') {
        res.json({ status: false, msg: 'Only PNG or JPG Files currently allowed' })
    }
}

const settingsRedirect = (req, res) => {
    const { isValidToken } = verifyToken(req.session.token);
    if (isValidToken) {
        res.render('Settings');
    } else {
        res.redirect('/');
    }
}

const updateStatus = async (req, res) => {
    const status = req.body.status;
    const { isValidToken, token } = verifyToken(req.session.token);
    if (isValidToken && status.length > 0) {
        await User.updateOne({ email: token.email }, { $set: { status: status } });
        res.json({ status: true })
    } else {
        res.json({ status: false });
    }
}

const changePassword = (req, res) => {
    const { isValidToken, token } = verifyToken(req.session.token);
    console.log(req.body)
    const oldPassword = req.body.password
    let newPassword = req.body.newPassword
    if (isValidToken && req.body.newPassword.length > 8 && oldPassword.length > 0) {
        User.findOne({ email: token.email }).then(async (user) => {
            if (user) {
                console.log(oldPassword)
                bcrypt.compare(oldPassword, user.password, (err, resp) => {
                    if (err)
                        console.log(err)

                    console.log(resp)
                    if (resp) {
                        bcrypt.hash(newPassword, 8, (async (err, hash) => {
                            if (err)
                                console.log(err);
                            if (hash) {
                                await User.updateOne({ email: user.email }, { $set: { password: hash } });
                                res.json({ status: true, redirect: false })
                            }
                        }))
                    } else if (!resp) {
                        res.json({ status: false, redirect: false, message: 'Incorrect password, please try again!', redirect: false })
                    }

                });

            }
        }).catch(err => console.log(err))
    } else if (!isValidToken) {
        res.json({ status: false, redirect: true, redirectLocation: '/' });
    } else if (isValidToken && newPassword < 12) {
        res.json({ status: false, redirect: false, message: 'Password must be at least 12 charackters long' })
    }
}

export {
    settingsRedirect,
    updateStatus,
    changePassword,
    updateProfileImage,
    loadImageProfile
}