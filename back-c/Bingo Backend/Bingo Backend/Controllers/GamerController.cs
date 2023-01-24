using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Model;
using System.Diagnostics;

namespace Bingo_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamerController : ControllerBase
    {
        private readonly IBingoRepository _bingoRepository;
        private readonly IGamerRepository _gamerRepository;

        public GamerController(IBingoRepository bingoRepository, IGamerRepository gamerRepository)
        {
            _bingoRepository = bingoRepository;
            _gamerRepository = gamerRepository;
        }

        /**
         * Asigna el Id del juego al jugador y suma el id del jugador
         * en la lista de jugadores del juego en curso
         */
        [HttpPost("save-gamer-in-game")]
        public async Task<IActionResult> AssignGamerToGame(Gamer gamer)
        {
            if (gamer == null)
            {
                return BadRequest("The gamer object can not be NULL.");
            } else if(string.IsNullOrEmpty(gamer.Mongo_id))
            {
                return BadRequest("The mongoId can not be empty or NULL.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var bingoList = await _bingoRepository.GetAllBingos();
            var currentGame = bingoList.LastOrDefault();

            if (currentGame == null)
            {
                return BadRequest("There has not a game started yet.");
            } else
            {
                gamer.Game_id = currentGame.Id;
                await _gamerRepository.InsertGamer(gamer);
                gamer = await _gamerRepository.FindByMongoId(gamer.Mongo_id);

                var gamersIds = (List<int>)(IEnumerable<int>)await _bingoRepository.NumStringToArr(currentGame.Gamers_id);
         
                gamersIds.Add(gamer.Id);

                currentGame.Gamers_id = await _bingoRepository.NumListToString(gamersIds);
                
                await _bingoRepository.UpdateBingo(currentGame);
            }

            return Ok("Game assign to gamer.");
        }

        [HttpGet("send-all-players")]
        public async Task<IActionResult> SendPlayersOfCurrentGame()
        {
            var bingoList = await _bingoRepository.GetAllBingos();
            var last_bingo = bingoList.LastOrDefault();

            if(last_bingo == null)
            {
                return BadRequest();
            }

            var gamers = _gamerRepository.GetAllGamersByGameId(last_bingo.Id);

            return Ok(gamers);
        }
    }
}
