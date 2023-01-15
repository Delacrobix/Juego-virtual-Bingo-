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

        /**
         * Asigna el Id del juego al jugador y suma el id del jugador
         * en la lista de jugadores del juego en curso
         */
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
            var currentGame = bingo_list.LastOrDefault();

            if (currentGame == null)
            {
                return BadRequest();
            }
            else
            {
                gamer.Game_id = currentGame.Id;

                var gamersIds = (List<int>)(IEnumerable<int>)_bingoRepository.NumStringToArr(currentGame.Gamers_id);
                gamersIds.Add(gamer.Id);

                currentGame.Gamers_id = await _bingoRepository.NumListToString(gamersIds);
                await _gamerRepository.InsertGamer(gamer);
                await _bingoRepository.UpdateBingo(currentGame);
            }

            //return Created("GAME ASING TO GAMER.", gamer);
            return NoContent();
        }

        [HttpGet("send-all-players")]
        public async Task<IActionResult> SendPlayersOfCurrentGame()
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
