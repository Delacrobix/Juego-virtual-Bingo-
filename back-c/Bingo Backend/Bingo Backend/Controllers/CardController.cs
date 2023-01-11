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
        private readonly BingoRepository _bingoRepository;
        private readonly GamerRepository _gamerRepository;

        [HttpPost]
        public async Task<IActionResult> SendCards([FromBody] Gamer gamer)
        {
            if (gamer == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok();
        }
    }
}
