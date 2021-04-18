import { io } from '../../app.js'
import { User } from '../../Models/UserSchema.js';

const socketTest = (socket) => {
    console.log('a user connected');

    // When a user submits the form input (client side) - this "socket event" gets triggered and -
    // the necessary payload is sent to the server
    socket.on('single-room-message', async ({ content, targetUser, sender }) => {
        console.log(socket.id);
        //this is what the client has sent:
        console.log(content, targetUser, sender, '<- payload from client')
        // Here we create a date String, this is needed for the chat message to store its actual date (when the message has been sent)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const time = `${new Date().getHours()}:${new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()} | ${months[new Date().getMonth()]} ${new Date().getDate()}`;
        console.log(time)

        //this is the payload needs to be stores in the database and also needs to be send to the user which recieves the message
        const messagePayload = { sender, targetUser, messageContent: { message: content, time: time, timestamp: Date.now() } };
        /*
        *
        * Updating targetuser in DB
        *
        */
        User.findOne({ username: targetUser }).then(async (user) => {
            if (user) {
                //check if message sender has already a chathistory with targetuser
                let currentChat = user.ChatHistory.Messages.find(payload => { return payload.sender === messagePayload.sender && payload.to === messagePayload.targetUser });

                if (currentChat) {
                    // find the Chatname and push the last message with the payload(time, timestamp) to the db.
                    user.ChatHistory.Messages.forEach(payload => {
                        if (payload.sender === messagePayload.sender && payload.to === messagePayload.targetUser) {
                            payload.messageInfos.push(messagePayload.messageContent)
                            user.ChatHistory.Messages.set(user.ChatHistory.Messages.indexOf(payload), payload);
                            // user.markModified('ChatHistory.Messages.payload.messageInfos')
                            user.save();
                        }
                    })
                }
                // create new Chathistory in DB if current chat is not existing yet
                else if (currentChat === undefined) {
                    const payload = {
                        to: messagePayload.targetUser,
                        sender: messagePayload.sender,
                        messageInfos: [messagePayload.messageContent]
                    }
                    user.ChatHistory.Messages.push(payload);
                    await user.save();
                }
            }
        })
        /*
         * Updating message sender in DB
        */
        await User.findOne({ username: sender }).then(async (user) => {
            if (user) {
                // find the current chat history in db
                let currentChat = user.ChatHistory.Messages.find(payload => { return payload.sender === messagePayload.sender && payload.to === messagePayload.targetUser });
                if (currentChat) {
                    //  find the Chatname and push the last message with the payload(time, timestamp) to the db.
                    user.ChatHistory.Messages.filter(payload => {
                        if (payload.sender === messagePayload.sender && payload.to === messagePayload.targetUser) {
                            payload.messageInfos.push(messagePayload.messageContent);
                            user.ChatHistory.Messages.set(user.ChatHistory.Messages.indexOf(payload), payload);
                            // user.markModified('ChatHistory.Messages.payload.messageInfos')
                            user.save();
                        }
                    })

                    user.ChatHistory.Messages.forEach(payload => {
                        if (payload.sender === messagePayload.sender && payload.to === messagePayload.targetUser) {
                        }
                    })

                }
                // craete new chatroom in db if current chat room is not existing
                else if (currentChat === undefined) {
                    const payload = {
                        to: messagePayload.targetUser,
                        sender: messagePayload.sender,
                        messageInfos: [messagePayload.messageContent]
                    }
                    user.ChatHistory.Messages.push(payload);
                    await user.save();
                }
            }
        })
        io.emit(`incoming-message-${targetUser}`, messagePayload);
    });

    socket.on('disconnect', () => {
        console.log('user left')
    })
};



export { socketTest };