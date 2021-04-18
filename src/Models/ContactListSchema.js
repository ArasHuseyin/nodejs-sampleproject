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

const contactListSchema = mongoose.Schema({
    emails: {
        type: Array,
        required: true
    },
    usernames: {
        type: Array,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }, profilePicture: {
        type: Boolean || File,
        required: false
    }
});

const ContactList = connection.model('ContactList', contactListSchema);
export { ContactList };
