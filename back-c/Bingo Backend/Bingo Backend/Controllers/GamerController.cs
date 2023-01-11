using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Model;

namespace Bingo_Backend.Controllers
{
    [Route("api/gamer")]
    [ApiController]
    public class GamerController : ControllerBase
    {
        private readonly BingoRepository _bingoRepository;
        private readonly GamerRepository _gamerRepository;

        [HttpPost("save-gamer")]
        public async Task<IActionResult> AsingGamerToGame([FromBody] Gamer gamer)
        {
            if (gamer == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bingo_list = await _bingoRepository.GetAllBingos();
            var last_bingo = bingo_list.LastOrDefault();

            if (last_bingo == null)
            {
                return BadRequest();
            }
            else
            {
                gamer.Game_id = last_bingo.Id;
                await _gamerRepository.InsertGamer(gamer);
            }

            //return Created("GAME ASING TO GAMER.", gamer);
            return NoContent();
        }

        [HttpGet]
        public async Task<IActionResult> SendPlayerOfCurrentGame()
        {
            var bingo_list = await _bingoRepository.GetAllBingos();
            var last_bingo = bingo_list.LastOrDefault();

            if(last_bingo == null)
            {
                return BadRequest();
            }

            var gamers = _gamerRepository.GetAllGamersByGameId(last_bingo.Id);

            return Ok(gamers);
        }
    }
}
