using chatapplication_mvc.Models;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace chatapplication_mvc.Hubs
{
    public class DefaultHub : Microsoft.AspNetCore.SignalR.Hub
    {
        public static List<Message> Messages;
        public static Dictionary<string, string> ConnectedUsers = new Dictionary<string, string>();

        public DefaultHub()
        {
            if (Messages == null)
                Messages = new List<Message>();
        }

        public async Task JoinRoom(string roomId, string userId)
        {
            Users.list.Add(Context.ConnectionId, userId);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
            await Clients.Group(roomId).SendAsync("user-connected", userId);
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            return base.OnDisconnectedAsync(exception);
        }

        public void NewMessage(string username, string text)
        {
            Clients.All.SendAsync("newMessage", username, text);
            Messages.Add(new Message()
            {
                Text = text,
                UserName = username
            });
        }

        public void NewUser(string username, string connectionId)
        {
            Clients.Client(connectionId).SendAsync("previousMessages", Messages);
            Clients.All.SendAsync("newUser", username);
        }
    }

    public class Message
    {
        public string UserName { get; set; }
        public string Text { get; set; }
    }
}
