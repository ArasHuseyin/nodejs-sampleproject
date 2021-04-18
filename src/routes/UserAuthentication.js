import { User } from '../Models/UserSchema.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const loginHandling = async (req, res) => {
    console.log(req.body)
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email }).then(async (user) => {
        if (user && user.isValidMail) {
            console.log(user.password)
            const passwordValidation = await bcrypt.compare(password, user.password);
            if (passwordValidation) {
                jwt.sign({ email: user.email,username:user.username}, process.env.TOKEN_KEY, (err, token) => {
                    if(err) console.log(err);
                    if (token){
                        req.session.token = token;
                        res.json({status:true})
                    }
                })
            } else {
                res.json({status:false, message: "Invalid Credentials. Please try again" });
            }
        } else res.json({status:false, message: "Invalid Credentials. Please try again" });
    })
};

const authorizationHandling = (req, res) => {
    const token = req.session.token;
    console.log(token)
    if (typeof token !== 'undefined' || token !== null) {
        jwt.verify(token,process.env.TOKEN_KEY,(err,result) => {
            console.log(result)
            if(result)
            res.render('Dashboard',{
                username:result.username
            })
            if(err){
                console.log(err)
                res.render('registration')
            }
        })
    } else {
        res.redirect('/')
    }
}


export { loginHandling, authorizationHandling };

