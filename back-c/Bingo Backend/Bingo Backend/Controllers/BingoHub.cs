using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NETCoreAPIMySQL.Data.service;

namespace Bingo_Backend.Controllers
{
    public class BingoHub : Hub
    {
        private readonly BallotsObteinedRepository _ballotsObteinedRepository;
        //public async Task SendNewBallot()
        //{
        //    await Clients.All.SendAsync("send-ballot", await _ballotsObteinedRepository.GetOneBallot());
        //}
    }
}
