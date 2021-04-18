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

const chatHistorySchema = mongoose.Schema({
    owner: {
        type: Array,
        required: true
    },
    chat: {
        type: Array,
        payload: {
            type: Object,
            sender: { type: String },
            messageInfos: {
                type: Array,
                messageContent: {
                    type: Object,
                    message: { type: String },
                    time: { type: String },
                    timestamp: { type: Number }
                }
            },
        }
    }
});

const ChatHistory = connection.model('ChatHistory', chatHistorySchema);

export { ChatHistory };
