
// wird an class mesgs angehängt
const messages = `  
<div class="incoming_msg">
    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
    </div>
    <div class="received_msg">
        <div class="received_withd_msg">
            <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Obcaecati, sunt?</p>
            <span class="time_date"> 11:01 AM | June 9</span>
        </div>
    </div>
</div>
<div class="outgoing_msg">
    <div class="sent_msg">
        <p>Lorem ipsum dolor sit amet.</p>
        <span class="time_date"> 11:01 AM | June 9</span>
    </div>
</div>
<div class="incoming_msg">
    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
    </div>
    <div class="received_msg">
        <div class="received_withd_msg">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
            <span class="time_date"> 11:01 AM | Yesterday</span>
        </div>
    </div>
</div>
<div class="outgoing_msg">
    <div class="sent_msg">
        <p>Lorem ipsum dolor sit amet.</p>
        <span class="time_date"> 11:01 AM | Today</span>
    </div>
</div>
<div class="incoming_msg">
    <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
    </div>
    <div class="received_msg">
        <div class="received_withd_msg">
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quidem quod accusamus aliquid rerum
                mollitia quae aliquam quia deserunt eum ducimus..</p>
            <span class="time_date"> 11:01 AM | Today</span>
        </div>
    </div>`


// wird an div class type_msg angehängt
const messageInput1 = ` <div class="input_msg_write">
<input type="text" class="write_msg" placeholder="Type a message" />
<button class="msg_send_btn" type="button"><i class="fa fa-paper-plane-o"
        aria-hidden="true"></i></button>
</div>`
$(document).ready(() => {

    class Contacts {
        constructor() {
            this.contactList = [];
        }
        getContacts = () => {
            return this.contactList;
        }

        addContact = (username) => {
            this.contactList.push(username)
        }
    }
    const currentContacts = new Contacts();
    class LoadContacts {
        LoadContacts = () => {
            fetch('search/contactlist', {
                method: 'GET', headers: { 'content-type': 'application/json; charset=UTF-8' }
            })
                .then((res => res.json()))
                .then((res) => {
                    if (res.status === true)
                        this._appendContacts(res.contacts.usernames)
                    console.log(res)
                })
                .catch(err => console.log(err));
        }
        _appendContacts = (contactList) => {
            fetch('/images/profile', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json; charset=UTF-8'
                }
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.img) {
                        const defaultImage = "https://ptetutorials.com/images/user-profile.png";
                        contactList.forEach(arrayElement => {
                            if (!currentContacts.getContacts().includes(arrayElement)) {
                                currentContacts.addContact(arrayElement)
                            }
                            const contact = `<div class="chat_list ${arrayElement}">
                        <div class="chat_people">
                        <div class="chat_img"> <img class="img_${arrayElement}" src=${defaultImage} alt="sunil"> </div>
                        <div class="chat_ib">
                        <h5 class="contact-name"><a class="single-chat single_chat_${arrayElement}" href="">${arrayElement} </a><span class="chat_date">Dec 25</span></h5>
                        <p class="msg-notification-${arrayElement}"></p>
                        </div>
                        </div>
                        </div>`;
                            $(contact).insertAfter('.messaging')
                            $(`.${arrayElement}`).on('click', chat.startConversation.bind(this))
                        });
                    }
                    chat.fetchProfileImageTest();
                })
        }
    }

    class AddContact {
        usersearch = (e) => {
            e.preventDefault();
            this.searchinput = $('.search-field').val();
            if ((e.key === 'Enter' || e.keyCode == 12 || e.type === 'click') && this.searchinput.length > 0) {
                this._spinner();
                this._fetchUser();
            }
        }

        _fetchUser = () => {
            const _this = this;
            fetch('/search/usersearch', {
                method: 'POST', headers: { 'content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    username: _this.searchinput
                })
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res, "usersearch.js:59");
                    //console.log(res.contacts.username)
                    if (res.status === true) {
                        $('.spinner-border').remove();
                        let append = true;
                        $('.contact-name').each((element) => {
                            if ($(element).text().search(res.username) > 0) {
                                append = false;
                            }
                        });

                        if (append && res.contactList) {
                            _this._appendUser(res.contactList.usernames[res.contactList.usernames.length - 1]);
                            currentContacts.addContact(res.username);
                        } else if (append && res.username && res.email) {
                            _this._appendUser(res.username);
                            currentContacts.addContact(res.username);
                        }
                    } else if (res.status === false) {
                        _this.appendWarning(res.message);
                    }
                })
                .catch(err => console.log(err));
        }
        _appendUser = (username) => {

            const defaultImage = "https://ptetutorials.com/images/user-profile.png";
            const li = ` <div class="chat_list ${username}">
                    <div class="chat_people">
                <div class="chat_img"> <img class="img_${username}" src=${defaultImage} alt="sunil"> </div>
                <div class="chat_ib">
                <h5 class="contact-name"><a class="single-chat single_chat_${username}" href="">${username}</a><span class="chat_date">Dec 25</span></h5>
                <p class="msg-notification-${username}"></p>
                </div>
                </div>
                </div>`;
            $(li).insertAfter('.messaging');
            $(`.single_chat_${username}`).on('click', chat.startConversation.bind(this));
        }
        _spinner = () => {
            const spinner = `<div class="spinner-border progress-spinner" role="status">
        <span class="sr-only">Loading...</span>
      </div>`;
            $('.contact-list-alerts').prepend(spinner);
        }
        removeElements = () => {
            this._removeSpinner();
            this.removeWarning();
        }
        _removeSpinner = () => {
            $('.spinner-border').remove();
        }
        removeWarning = () => {
            $('#warning').remove();
        }
        appendWarning = (message) => {
            const warning = `<div class="alert alert-dark" id="warning" role="alert">
        <i class="fas fa-exclamation-triangle"></i>
        ${message} 
      </div>`
            $('.contact-list-alerts').prepend(warning);
            this._removeSpinner();
        }
    }

    class StartChat {
        constructor() {
            this.chatMap = new Map();
            this.currentUser = this._initializeCurrentUser();
            this._loadChatHistory();
            this.targetUser = null;
            this.currentChat = null;
            this.socket = io.connect('https://save-chat.herokuapp.com');
            this.socket.on(`incoming-message-${this.currentUser}`, this._incomingMessageHandler.bind(this))
        }

        _initializeCurrentUser = () => {
            const sectionGreeting = $('.section-greeting').text();
            return sectionGreeting.substr(sectionGreeting.indexOf(' ') + 1);
        }
        updateInboxProfileImage = (username, classNameSelector) => {
            fetch(`contacts/newcontact`, {
                method: 'POST', headers: { 'content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    username
                })
            }).then(res => res.json())
                .then(res => {

                    if ($(`.${classNameSelector}`).length) {
                        $(`.${classNameSelector}`).attr({src:res.image,title: "profile-image"})
                    }
                })
        }

        _removeNotification = (username) => {
            if( $(`#notification_${username}`).length)
            $(`#notification_${username}`).remove();
        }
        _incomingMessageHandler = (payload) => {
            console.log("payload_ ", payload)
            if ($(`.${payload.sender}`).length) {
                console.log('notification:')
                $(`.msg-notification-${payload.sender}`).text(payload.messageContent.message)
                this.updateInboxProfileImage(payload.sender, `image_${payload.sender}`);
                $(`<i id="notification_${payload.sender}" class="fas fa-bell" style="color: red;"></i>`).appendTo(`.last_msg_${payload.sender}`)
            } else {
                const defaultImage = "https://ptetutorials.com/images/user-profile.png";
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const time = `${months[new Date().getMonth()]} ${new Date().getDate()}`;
                const li = ` <div class="chat_list ${payload.sender}">
                    <div class="chat_people">
                <div class="chat_img"> <img class="img_${payload.sender}" src=${defaultImage} alt="sunil"> </div>
                <div class="chat_ib">
                <h5 class="contact-name"><a class="single-chat single_chat_${payload.sender}" href="">${payload.sender}</a><span class="chat_date">${time}</span></h5>
                <p class="last_msg_${payload.sender}">${payload.messageContent.message} <i id="notification_${payload.sender}" class="fas fa-bell"style="color: red;"></i></p>
                </div>
                </div>
                </div>`;
                $(li).insertAfter('.messaging');
                $(`.single_chat_${payload.sender}`).on('click', chat.startConversation.bind(this));

                fetch(`contacts/newcontact`, {
                    method: 'POST', headers: { 'content-type': 'application/json; charset=UTF-8' },
                    body: JSON.stringify({
                        targetUser: payload.sender,
                        currentUser: this.currentUser
                    })
                }).then(res => res.json())
                    .then(res => console.log(res))
                this.updateInboxProfileImage(payload.sender, `image_${payload.sender}`);
            }
            console.log(this.chatMap.has(payload.sender))
            if (!this.chatMap.has(payload.sender)) {
                this.chatMap.set(payload.sender, [{ to: this.currentUser, message: payload.messageContent.message, time: payload.messageContent.time, timestamp: payload.messageContent.timestamp, incomingMsg: true }]);
                //   console.log(this.chatMap.get(payload.sender));
                // console.log(payload)
                if (!currentContacts.getContacts().includes(payload.sender)) {
                    currentContacts.addContact(payload.sender);
                    //li an die contactliste im dom mit der letzten message appenden
                }
            } else {
                const valueBefore = this.chatMap.get(payload.sender);
                valueBefore.push({ to: this.currentUser, message: payload.messageContent.message, time: payload.messageContent.time, timestamp: payload.messageContent.timestamp, incomingMsg: true });
                this.chatMap.set(payload.sender, valueBefore);
            }
            console.log('ausserga')
            if (this.currentChat !== null) {
                console.log(this.currentChat)
                console.log('curentchat triggern')
                $(`.${this.currentChat}`).trigger('click');
            }
        }

        _loadChatHistory = () => {
            //handle was passiert wenn user noch keine msgs hat? (serverside)
            fetch(`/search/chathistory`, {
                method: 'POST', headers: { 'content-type': 'application/json; charset=UTF-8' },
                body: JSON.stringify({
                    currentUser: this.currentUser
                })
            }).then(res => {
                return res.json();
            }).then(res => {
                if (res.history) {
                    console.log(res.history)
                    res.history.Messages.forEach((room, index) => {
                        const temp = [];
                        room.messageInfos.forEach(historyPayload => {
                            temp.push({
                                to: res.history.Messages[index].to,
                                message: historyPayload.message,
                                time: historyPayload.time,
                                timestamp: historyPayload.timestamp,
                                incomingMsg: room.to === this.currentUser ? true : false
                            })
                        })
                        this.chatMap.set(room.sender, temp);
                    })
                }
            })
        }

        startConversation = (event) => {
            event.preventDefault();
            $('.incoming_msg').remove();
            $('.outgoing_msg').remove();
            $('#form').remove();
            this.currentChat = event.target.className.split(' ').pop();
            this.targetUser = event.target.className.split('_').pop();
            console.log(this.targetUser);
            console.log(event.target.className.substr(event.target.className.lastIndexOf('_') + 1))
            console.log(this.currentUser)
            this._removeNotification(this.targetUser);
            this.appendExistingMessages();
            const messageInput =
                `<form id="form" action="">
            <input id="input" autocomplete="off" /><button>Send</button>
          </form>`;
            //   $(messageInput).insertAfter('.mesgs')
            $('.type_msg').append(messageInput);
            const form = $('#form');
            const input = $('#input');
            form.on('submit', (e) => {
                e.preventDefault();
                console.log(input.val())
                if (input.val().length > 0) {
                    console.log(this.socket);
                    const payload = { content: input.val(), targetUser: this.targetUser, sender: this.currentUser };
                    this.socket.emit('single-room-message', payload);
                    input.val('');
                    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                    const time = `${new Date().getHours()}:${new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()} | ${months[new Date().getMonth()]} ${new Date().getDate()}`;
                    if (this.chatMap.has(this.currentUser)) {
                        const outgoingMessages = this.chatMap.get(this.currentUser)
                        outgoingMessages.push({ to: this.targetUser, message: payload.content, time, timestamp: Date.now(), incomingMsg: false });
                        this.chatMap.set(this.currentUser, outgoingMessages);
                    } else {
                        this.chatMap.set(this.currentUser, [{ to: this.targetUser, message: payload.content, time, timestamp: Date.now(), incomingMsg: false }])
                    }
                    $(`.${this.currentChat}`).trigger('click');
                    $('#input').focus()
                }
            })
        }

        appendExistingMessages = () => {
            console.log(this.chatMap)
            const outgoingMessages = this.chatMap.has(this.currentUser) ? this.chatMap.get(this.currentUser) : [{ to: null, message: null, time: null, timestamp: 1, incomingMsg: 'initial Placeholder' }];
            const incomingMessages = this.chatMap.has(this.targetUser) >= 1 ? this.chatMap.get(this.targetUser) : [{ to: null, message: null, time: null, timestamp: 2, incomingMsg: 'initial Placeholder' }];

            const msgArray = outgoingMessages.concat(incomingMessages);

            if (msgArray.length >= 1) {
                msgArray.sort((arg1, arg2) => { return arg1.timestamp - arg2.timestamp })
                msgArray.forEach(msg => {
                    console.log(msg)
                    if (msg.incomingMsg === false && this.targetUser === msg.to) {
                        const outgoingMessageHtml = `<div class="testklasse outgoing_msg">
                                                        <div class="sent_msg">
                                                            <p>${msg.message}</p>
                                                                <span class="time_date">${msg.time}</span>
                                                        </div>
                                                    </div>`;
                        $(outgoingMessageHtml).appendTo('.msg_history');

                    } else if (msg.incomingMsg === true) {
                        const incomingMessageHtml = `<div class="incoming_msg">
                                                         <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil">
                                                       </div>
                                                      <div class="received_msg">
                                                          <div class="received_withd_msg">
                                                            <p>${msg.message}</p>
                                                              <span class="time_date"> ${msg.time}</span>
                                                         </div>
                                                       </div>
                                                  </div>`;
                        $(incomingMessageHtml).appendTo('.msg_history');
                    }
                })
                console.log(msgArray);

            } else {
                console.log('empty Chathistory (no message recieved yet and no message has been sent yet)');
            }
        }

        _fetchProfileImage = () => {
            fetch('/search/profileimage', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json; charset=UTF-8'
                }
            })
                .then(res => res.json())
                .then(res => {
                    console.log(res);
                    if (res.img) {
                        console.log(res.img[0]);
                        console.log(res.img[0]);
                        $('chat-profile-image').attr({
                            src: res.img[0],
                            title: "profile-image"
                        });
                    }
                })
                .catch(error => console.log(error))
        }

        fetchProfileImageTest = () => {
            fetch('/search/profileimage', {
                method: 'GET',
                headers: {
                    'content-type': 'application/json; charset=UTF-8'
                }
            }).then(res => res.json()).then(res => {
                res.imgUrls.forEach(arg => {
                    if ($(`.img_${arg.username}`).length) {
                        $(`.img_${arg.username}`).attr({ src: arg.imageUrl, title: "profile" })
                    }
                })
            })
        }
    }

    const addContact = new AddContact();
    const loadContacts = new LoadContacts();
    loadContacts.LoadContacts();
    const chat = new StartChat();

    $('.search_icon').on('click', addContact.usersearch.bind(this))
    $('.search-field').on('keyup', addContact.usersearch.bind(this))
    $('.search-field').on('keydown', addContact.removeWarning.bind(this))
})
