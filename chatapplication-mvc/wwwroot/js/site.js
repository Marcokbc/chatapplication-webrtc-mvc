var userName = '';

$(document).ready(function () {
    $('#welcomeModal').modal({ backdrop: 'static', keyboard: false }).modal('show');
});

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/chat")
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.on("newUser", function (username) {
    if (userName == username) {
        $('#userJoinMessage').text("Você entrou na sala.");
        var userJoinToast = new bootstrap.Toast($('#userJoinToast')[0]);
        userJoinToast.show();

        $('#closeUserJoinToast').click(function () {
            userJoinToast.hide();
        });
    } else {
        $('#userJoinMessage').text("O usuário " + username + " entrou na sala.");
        var userJoinToast = new bootstrap.Toast($('#userJoinToast')[0]);
        userJoinToast.show();

        $('#closeUserJoinToast').click(function () {
            userJoinToast.hide();
        });
    }
});

$('#okBtn').click(function () {
    userName = $('#name').val();
    if (userName.trim() === '') {
        return;
    }

    connection.invoke("newUser", userName, connection.connectionId).then(function () {
        $('#welcomeModal').modal('hide'); 
    }).catch(function (err) {
        console.error(err.toString());
    });
});

connection.on("previousMessages", function (messages) {
    messages.forEach(function (message) {
        if (message.userName == userName) {
            $('#chat').append('<div class="message-line me"> <div class="message me"> <div class="user-name me"> <strong> Me </strong> </div> <div> ' + message.text + '</div> </div> </div>');
        } else {
            $('#chat').append('<div class="message-line other"> <div class="message other"> <div class="user-name other"> <strong>' + message.userName + ' </strong> </div> <div> ' + message.text + '</div> </div> </div>');
        }
    });
});

connection.on("newMessage", function (username, text) {
    if (userName == username) {
        $('#chat').append('<div class="message-line me"> <div class="message me"> <div class="user-name me"> <strong> Me </strong> </div> <div> ' + text + '</div> </div> </div>');
    } else {
        $('#chat').append('<div class="message-line other"> <div class="message other"> <div class="user-name other"> <strong>' + username + ' </strong> </div> <div> ' + text + '</div> </div> </div>');
    }
});

connection.start().then(function () {
    console.log("Connected to SignalR hub.");
}).catch(function (err) {
    return console.error(err.toString());
});

$('#messageForm').submit(function (event) {
    event.preventDefault();

    var message = $('#message').val();

    connection.invoke("NewMessage", userName, message).catch(function (err) {
        return console.error(err.toString());
    });

    $('#message').val('').focus();
});