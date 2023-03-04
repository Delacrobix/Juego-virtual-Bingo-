using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Model;
using System.Diagnostics;
using System.Threading;

namespace Bingo_Backend.Controllers
{
    [Route("api/gamer")]
    [ApiController]
    public class GamerController : ControllerBase
    {
        private readonly IBingoRepository _bingoRepository;
        private readonly IGamerRepository _gamerRepository;
        static SemaphoreSlim semaphore = new SemaphoreSlim(1, 1);


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
        public async Task<IActionResult> AssignGamerToGame([FromBody]Gamer gamer)
        {
            if (gamer == null)
            {
                return BadRequest("The gamer object can not be NULL.");
            }
            else if (string.IsNullOrEmpty(gamer.Mongo_id))
            {
                return BadRequest("The mongoId can not be empty or NULL.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await semaphore.WaitAsync();

            try
            {
                var currentGame = await _bingoRepository.GetCurrentGame();

                gamer.Game_id = currentGame.Id;
                await _gamerRepository.InsertGamer(gamer);
                gamer = await _gamerRepository.FindByMongoAndGameId(gamer.Mongo_id, currentGame.Id);

                var gamersIds = (List<int>)(IEnumerable<int>)await _bingoRepository.NumStringToArr(currentGame.Gamers_id);

                gamersIds.Add(gamer.Id);

                currentGame.Gamers_id = await _bingoRepository.NumListToString(gamersIds);

                await _bingoRepository.UpdateBingo(currentGame);
            } finally
            {
                semaphore.Release();
            }

            return Ok("Game assign to gamer.");
        }

        [HttpGet("send-all-players")]
        public async Task<IActionResult> SendPlayersOfCurrentGame()
        {
            var bingoList = await _bingoRepository.GetAllBingos();
            var currentGame = bingoList.LastOrDefault();

            if(currentGame == null)
            {
                return BadRequest("There has not a game started yet.");
            }

            var gamers = _gamerRepository.GetAllGamersByGameId(currentGame.Id);

            return Ok(gamers.Result);
        }
    }
}
