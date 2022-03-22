import style from './main.css';
import AgoraRTM from 'agora-rtm-sdk';
import "regenerator-runtime";
import config from './config';
var Config = require('./config'),
    conf = new Config();

// console.log('====> Agora RTM sdk version: ' + AgoraRTC.VERSION + ' compatible: ' + AgoraRTM.checkSystemRequirements());
console.log('Troubleshooting conf.appId', conf.appId + ' > ' + conf.channel);

// Initialize client
const client = AgoraRTM.createInstance(conf.appId);

let options = {
    uid: "",
    token: config.token
}

let channel = null;

// Client Event listeners
// Display messages from peer
client.on('MessageFromPeer', function(message, peerId) {
    // console.log('Troubleshooting message from peer', JSON.parse(JSON.stringify(message)).text);
    document.getElementById("log").appendChild(document.createElement('div')).append("Message from: " + peerId + " Message: " + JSON.parse(JSON.stringify(message)).text);
});
// Display connection state changes
client.on('ConnectionStateChanged', function(state, reason) {
    document.getElementById("log").appendChild(document.createElement('div')).append("Current State: " + state + " Status: " + reason);
});


window.onload = function() {

    document.querySelector('[id="live_chat_buttons_container"]').style.display = 'none';
    document.querySelector('[id="live_chat_messages_container"]').style.display = 'none';
    document.querySelector('[id="live_chat_messages_container"]').style.display = 'none';

    disableButton(document.querySelector('[id="leave"]'));
    disableButton(document.querySelector('[id="logout"]'));

    // login
    document.getElementById("login").onclick = async function(event) {
        // event.preventDefault();
        if (!!document.querySelector('[id="channel"]').value) {
            event.preventDefault();
            options.uid = document.getElementById("uid").value.toString();
            await client.login(options);
            disableButton(document.querySelector('[id="login"]'));
            enableButton(document.querySelector('[id="logout"]'));
            document.querySelector('[id="live_chat_buttons_container"]').style.display = 'block';
            document.querySelector('[id="live_chat_buttons_container"]').style.width = '23em';
            channelInit();
        }
    }

    // logout
    document.getElementById("logout").onclick = async function(event) {
        event.preventDefault();
        await client.logout();
        disableButton(document.querySelector('[id="logout"]'));
        enableButton(document.querySelector('[id="login"]'));
        document.querySelector('[id="live_chat_buttons_container"]').style.display = 'none';
        document.querySelector('[id="live_chat_messages_container"]').style.display = 'none';
    }

    // create and join channel
    document.getElementById("join").onclick = async function(event) {
        event.preventDefault();
        console.log('Troubelshooting join');
        // Channel event listeners
        // Display channel messages
        await channel.join().then(() => {
            document.getElementById("log").appendChild(document.createElement('div')).append("You have successfully joined channel " + channel.channelId);
            enableButton(document.querySelector('[id="leave"]'));
            disableButton(document.querySelector('[id="join"]'));
            document.querySelector('[id="live_chat_messages_container"]').style.display = 'grid';
            document.querySelector('[id="live_chat_messages_container"]').style.gridTemplateColumns = '1fr 1fr';
            document.querySelector('[id="live_chat_messages_container"]').style.width = '50em';


            // Update list memberNames
            channel.getMembers().then((memberNames) => {
                var select = document.getElementById("peerUid");
                document.getElementById("peerUid").innerHTML = null;

                for (var i = 0; i < memberNames.length; i++) {
                    var opt = memberNames[i];
                    var el = document.createElement("option");
                    el.textContent = opt;
                    el.value = opt;
                    select.appendChild(el);
                }
                console.log('Troubleshooting memberNames', memberNames);
            });
        });
    }

    // leave channel
    document.getElementById("leave").onclick = async function(event) {
        event.preventDefault();
        console.log('Troubelshooting Leave');
        if (channel != null) {
            await channel.leave();
            disableButton(document.querySelector('[id="leave"]'));
            enableButton(document.querySelector('[id="join"]'));
            document.querySelector('[id="live_chat_messages_container"]').style.display = 'none';
        } else {
            console.log("Channel is empty");
        }
    }

    // send peer-to-peer message
    document.getElementById("send_peer_message").onclick = async function(event) {
        event.preventDefault();

        let peerId = document.getElementById("peerUid").value.toString();
        let peerMessage = document.getElementById("peerMessage").value.toString();

        await client.sendMessageToPeer({ text: peerMessage },
            peerId,
        ).then(sendResult => {
            if (sendResult.hasPeerReceived) {
                document.getElementById("log").appendChild(document.createElement('div')).append("Message has been received by: " + peerId + " Message: " + peerMessage);
                document.getElementById("peerMessage").value = '';
            } else {
                document.getElementById("log").appendChild(document.createElement('div')).append("Message sent to: " + peerId + " Message: " + peerMessage);
                document.getElementById("peerMessage").value = '';
            }
        });
    }

    // send channel message
    document.getElementById("send_channel_message").onclick = async function(event) {
        event.preventDefault();

        let channelMessage = document.getElementById("channelMessage").value.toString();

        if (channel != null) {
            await channel.sendMessage({ text: channelMessage }).then(() => {
                document.getElementById("log").appendChild(document.createElement('div')).append("Channel message: " + channelMessage + " from " + channel.channelId);
            });
            document.getElementById("channelMessage").value = '';
        }
    }
}

async function channelInit() {


    conf.channel = (!!document.querySelector('[id="channel"]').value) ? document.querySelector('[id="channel"]').value : conf.channel;
    console.log('Troubleshooting channelInit ', conf.channel);
    channel = client.createChannel(conf.channel);

    channel.on('ChannelMessage', function(message, memberId) {
        // console.log('Troubleshooting Channel message', JSON.parse(JSON.stringify(message)).text);
        document.getElementById("log").appendChild(document.createElement('div')).append("Channel Message received from: " + memberId + " Message: " + JSON.parse(JSON.stringify(message)).text);
    });
    // Display channel member stats
    channel.on('MemberJoined', function(memberId) {
        document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " joined the channel");
        // Update list memberNames
        channel.getMembers().then((memberNames) => {
            var select = document.getElementById("peerUid");
            document.getElementById("peerUid").innerHTML = null;

            for (var i = 0; i < memberNames.length; i++) {
                var opt = memberNames[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }
            console.log('Troubleshooting memberNames', memberNames);
        });
    });
    // Display channel member stats
    channel.on('MemberLeft', function(memberId) {
        document.getElementById("log").appendChild(document.createElement('div')).append(memberId + " left the channel");
        // Update list memberNames
        channel.getMembers().then((memberNames) => {
            var select = document.getElementById("peerUid");
            document.getElementById("peerUid").innerHTML = null;

            for (var i = 0; i < memberNames.length; i++) {
                var opt = memberNames[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }
            console.log('Troubleshooting memberNames', memberNames);
        });
    });
}

async function disableButton(element) {
    element.disabled = true;
    element.style.opacity = '.65';
    element.style.cursor = 'default';
}

async function enableButton(element) {
    element.disabled = false;
    element.style.opacity = '1';
    element.style.cursor = 'pointer';
}