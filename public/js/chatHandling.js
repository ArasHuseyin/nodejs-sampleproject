class ClientSocket {
    constructor() {
        this.chatMap = new Map();
        this.currentUser = this._initializeCurrentUser();
        this.targetUser = null;
        this.socket = io.connect('http://localhost:8080');
        this.socket.on(`incoming-message-${this.currentUser}`, this._incomingMessageHandler.bind(this))
    }

    _initializeCurrentUser = () => {
        const sectionGreeting = $('.section-greeting').text();
        this.currentUser = sectionGreeting.substr(sectionGreeting.indexOf(' ') + 1);
    }

    _incomingMessageHandler = (payload) => {
        if (!this.chatMap.has(payload.sender)) {
            this.chatMap.set(payload.sender, [{ message: payload.message, time: payload.time }]);
            console.log(payload)
        } else if (!this.chatMap.has(payload.sender)) {
            const valueBefore = this.chatMap.get(payload.sender);
            this.chatMap.set(payload.sender, valueBefore.push({ message: payload.message, time: payload.time }));
            console.log(payload)
        }
    }

    _loadChatHistory = () => {
        fetch(`/search/chathistory`, {
            method: 'GET', headers: { 'content-type': 'application/json; charset=UTF-8' }
        }).then(res => {
            console.log(res);
        })
    }

    _sendMessage = (event) => {
        event.preventDefault();
        $('.incoming_msg').remove();
        $('.outgoing_msg').remove();
        $('#form').remove();
        this.targetUser = event.target.className.split('_').pop();
        console.log(this.targetUser);
        console.log(event.target.className.substr(event.target.className.indexOf(' ') + 1))

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
                // const isExistingChat = this.chatArray.filter(ref => {ref.payload.owner.includes(targetUser) && ref.payload.owner.includes(this.currentUser)})
                //console.log(isExistingChat.length < 1)
                this.socket.emit('single-room-message', { content: input.val(), targetUser: this.targetUser, sender: this.currentUser});
                input.val('');
                if (this.chatMap.has(this.currentUser)) {
                    console.log('exists')
                }
            }
        })
    }
}

$(document).ready(() => {
    new StartChat();
})