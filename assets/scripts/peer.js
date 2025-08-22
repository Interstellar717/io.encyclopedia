var connSendMedia;
async function sendShare() {
    let mediaStream = null;
    try {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: "always"
            },
            audio: true
        });


        connSendMedia = peer_sen.call(connSend.peer, mediaStream);

        connSendMedia.on('stream', (_) => {
            console.log(`Send stream received`);
        })
        connSendMedia.on('close', function () {
            console.log('SMedia conn close');
        });
        connSendMedia.on('error', (err) => { console.log(`SMedia connection error ${err}`) })

    } catch (ex) {
        console.error("Error occurred: " + ex);
    }
}

var peer_sen;
var peer_rec;

var connSend;
var connRec;

function connect() {
    const peerId = document.getElementById('peerId-connect').value;
    connSend = peer_sen.connect(peerId);
    console.log(connSend)
    connSend.on('open', () => { // emitted when data connection is established and ready to use
        console.log('Sender connected to ' + connSend.peer);
        document.getElementById('sender-status').innerText = 'Connected to ' + connSend.peer;
        qs('#chat-sender-input').addEventListener('keypress', e => {
            if (e.key == "Enter") {
                e.target.parentElement.querySelector('button').click();
                e.target.value = ""
            }
        })
    });
    connSend.on('data', (data) => {
        console.log(`sender received data ${data}`);
        document.getElementById('sender-msgs').innerHTML += `<b>${connSend.peer}:</b> ${data}<br>`;
        const div = document.getElementById('sender-msgs');
        div.scrollTop = div.scrollHeight;
    })
    connSend.on('closed', () => { console.log(`Sender data connection closed`) })
}

function sendMsg(msg = "[empty message]") {
    if (connSend) {
        connSend.send(msg);
        document.getElementById('sender-msgs').innerHTML += `<b>${peer_sen.id}:</b> ${msg}<br>`;
        const div = document.getElementById('sender-msgs');
        div.scrollTop = div.scrollHeight;
    }
    else if (connRec) {
        connRec.send(msg);
        document.getElementById('receiver-msgs').innerHTML += `<b>${peer_rec.id}:</b> ${msg}<br>`;
        const div = document.getElementById('receiver-msgs');
        div.scrollTop = div.scrollHeight;
    }
}


function setSenderID(id) {
    peer_sen = new Peer(id);

    peer_sen.on('open', id => {
        console.log('Sender peer ID is: ' + id);
        qs('.sender-ui h1').innerText += " #" + id;
        qs('#sender-status-icon').textContent = "✅";
        qs('.sender-ui').classList.add('selected');
        qs('.receiver-ui').classList.add('disabled');
    });
    peer_sen.on('close', function () {
        console.log('Connection destroyed');
    });
    peer_sen.on('error', function (err) {
        console.log(err)
    })
}

function setReceiverID(id) {
    peer_rec = new Peer(id);
    peer_rec.on('open', id => {
        console.log('Receiver peer ID is: ' + id);
        qs('.receiver-ui h1').innerText += " #" + id;
        qs('#receiver-status-icon').textContent = "✅";
        qs('.sender-ui').classList.add('disabled');
        qs('.receiver-ui').classList.add('selected');
    });
    peer_rec.on('connection', function (conR) {

        connRec = conR;

        console.log('Receiver connected to ' + connRec.peer);
        document.getElementById('receiver-status').innerText = 'Connected to ' + connRec.peer;

        qs('#chat-receiver-input').addEventListener('keypress', e => {
            if (e.key == "Enter") {
                e.target.parentElement.querySelector('button').click();
                e.target.value = ""
            }
        })


        console.log(connRec);

        connSend &&
            connSend.on('open', () => { console.log(`Receiver connection open`) });

        connRec.on('data', function (data) {
            console.log('Received', data);
            document.getElementById('receiver-msgs').innerHTML += `<b>${connRec.peer}:</b> ${data}<br>`;
            const div = document.getElementById('receiver-msgs');
            div.scrollTop = div.scrollHeight;
        });

        connSend &&
            connSend.on('closed', () => { console.log(`Receiver data connection closed`) });
    });
    peer_rec.on('call', function (mcRec) {
        mcRec.answer(null); // parameter usually stream
        console.log(mcRec);
        mcRec.on('stream', (_) => {
            console.log(`Rec stream received`)
            qs('#video').srcObject = _;
            qs('#video').addEventListener('click', qs('#video').requestFullscreen)
        })
        mcRec.on('close', function () {
            console.log('RMedia conn close');
        });
        mcRec.on('error', (err) => { console.log(`RMedia connection error ${err}`) })
    });
    peer_rec.on('call', (mcRec) => {
        console.log(`Receiver received media connection`)
    })
    peer_rec.on('close', function () {
        console.log('Connection destroyed');
    });
    peer_rec.on('error', function (err) {
        console.log(err)
    });
}



function closeSen() {
    peer_sen.destroy();
    qs('#peer1Id').value = '';
    qs('#sender-status-icon').textContent = '❌';
    qs('.sender-ui h1').textContent = 'Sender';
}

function closeRec() {
    peer_rec.destroy();
    qs('#peer2Id').value = '';
    qs('#receiver-status-icon').textContent = '❌';
    qs('.receiver-ui h1').textContent = 'Receiver';
}
