import { User } from "../Models/UserSchema.js";

const sendChatHistory = (req, res) => {
    const currentUser = req.body.currentUser;
    User.findOne({ username: currentUser }).then(user => {
        if (user && user.ChatHistory) {
            res.json({history:user.ChatHistory})
        }
    })
}

export { sendChatHistory }