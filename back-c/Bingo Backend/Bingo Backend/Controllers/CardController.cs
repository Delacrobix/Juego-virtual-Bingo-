using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Model;
using System.Net.NetworkInformation;

namespace Bingo_Backend.Controllers
{
    [Route("api/cards")]
    [ApiController]
    public class CardController : ControllerBase
    {
        private readonly IBingoRepository _bingoRepository;
        private readonly IGamerRepository _gamerRepository;
    }
}
