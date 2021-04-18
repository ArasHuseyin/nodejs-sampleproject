import express from 'express';
import hbs from 'hbs';
import path from 'path';
import bodyParser from 'body-parser';
import {
    mainPage,
    registrationPage,
    notFound,
    registration,
    verify,
} from './routes/UserRegistration.js'
import session from 'express-session';
import dotenv from 'dotenv';
import MongoStore from 'connect-mongo';
import { connectionString } from './Models/UserSchema.js';
import { loginHandling, authorizationHandling } from './routes/UserAuthentication.js'
import multer from 'multer';
import { findUser, sendContactList, updateTargetUser, verifyToken } from './routes/UserSearch.js';
import { changePassword, loadImageProfile, settingsRedirect, updateProfileImage, updateStatus } from './routes/Settings.js';
import http from 'http';
import { createRequire } from 'module';
import { socketTest } from './controller/SocketServer/PrivateChat.js';
import { sendImages, sendSingleImage } from './routes/SendUserProfile.js';
import { sendChatHistory } from './routes/ChatRequestHandler.js';
const require = createRequire(import.meta.url);
// Server
const app = express();
const server = http.createServer(app);
let io = require('socket.io')(server);

//.env
dotenv.config();
const secret = process.env.SESSION_SECRET;
const PORT = process.env.PORT || 8080;

//setting public/partials/views path
const __dirname = path.resolve();
const viewsPath = path.join(__dirname, "templates/views");
const publicDirectoryPath = path.join(__dirname, "public");
const partialsPath = path.join(__dirname, "templates/partials");

//handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

//setting static files and initializing bodyparser
app.use(express.static(publicDirectoryPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret,
    store: MongoStore.default.create({
        mongoUrl: connectionString
    }),
    resave: false,
    saveUninitialized: true,
    cookie: { //secure: true 
        maxAge: 25000000
    }
}));

//WebSocketServer:
io.on('connection', socketTest);

const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads')
    },
    filename: (req, file, cb) => {
        const { isValidToken, token } = verifyToken(req.session.token);
        if (isValidToken) {
            console.log(req.file);
            cb(null, file.originalname);
        }
    }
})

let upload = multer({ storage: fileStorageEngine });

//routes
app.get('/', mainPage);
app.get('/register', registrationPage);
app.post('/register/process', registration);
app.all('/verify', verify);
app.get('/settings', settingsRedirect);
app.post('/settings/statusupdate', updateStatus);
app.post('/settings/changepassword', changePassword);
app.post('/images/profile', upload.single('profile'), updateProfileImage);
app.get('/images/profile', loadImageProfile);
app.all('/login', loginHandling);
app.all('/dashboard', authorizationHandling);
app.all('/search/usersearch', findUser);
app.get('/search/contactlist', sendContactList);
app.post('/search/chathistory', sendChatHistory);
app.get('/search/profileimage', sendImages);
app.post('/search/profileimage',sendSingleImage)
app.post('/contacts/newcontact',updateTargetUser);
app.get('*', notFound);
server.listen(PORT);

export { io };

