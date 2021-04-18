import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const db_name = process.env.DB_NAME;
const db_pass = process.env.DB_PASS;

const connectionString = `mongodb+srv://admin:${db_pass}@clusterwifi-project.yuga8.mongodb.net/${db_name}?retryWrites=true&w=majority`;
const connectionOptions = { useUnifiedTopology: true, useNewUrlParser: true };

const connection = mongoose.createConnection(
    connectionString,
    connectionOptions
);

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isValidMail: {
        type: Boolean,
        required: true
    },
    confirmationCode: {
        type: Number,
        required: true
    },
    status: {
        type: String
    },
    ProfileInfos: {
        type: Object
    },
    ChatHistory: {
       Messages: {
            type: Array,
            // owner: {
            //     type: String,
            // },
            payload: {
                type: Object,
                to: { type: String },
                sender: { type: String },
                messageInfos: {
                    type: Array,
                    messageContent: {
                        type: Object,
                        message: { type: String },
                        time: { type: String },
                        timestamp: { type: Number }
                    }
                }
            }
        }
    }

});

const User = connection.model('User', userSchema);
export { User, connection, connectionString };
