using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NETCoreAPIMySQL.Data.service;

namespace Bingo_Backend.Controllers
{
    public class BingoHub : Hub
    {
        public async Task SendBallot()
        {
           await Clients.All.SendAsync("sendBallot", "connected");
        }
    }
}
