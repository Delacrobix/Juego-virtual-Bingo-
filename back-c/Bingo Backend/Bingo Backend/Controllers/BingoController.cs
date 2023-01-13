using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Data.service;
using NETCoreAPIMySQL.Model;

namespace Bingo_Backend.Controllers
{
    [Route("api/bingo")]
    [ApiController]
    public class BingoController : ControllerBase
    {
        private readonly BingoRepository _bingoRepository;
        private readonly GamerRepository _gamerRepository;
        private readonly CardRepository _cardRepository;
        private readonly ColumLetterRepository _columLetterRepository;

        [HttpPost("new-game")]  
        public async Task<IActionResult> CreateNewGame()
        {
            var bingo_new = new Bingo();
            var bingo_list = await _bingoRepository.GetAllBingos();
            var last_bingo = bingo_list.LastOrDefault();

            //Si no existe un juego anterior, crea el primero
            if(last_bingo == null)
            {
                bingo_new.Game_status = true;
                await _bingoRepository.InsertBingo(bingo_new);

            } else
            {
                //Si no hay un juego iniciado, inicie uno nuevo
                if(!last_bingo.Game_status)
                {
                    bingo_new.Game_status = true;
                    await _bingoRepository.InsertBingo(bingo_new);
                }
            }

            //return Created("BINGO CREATED SUCCESSFULLY", bingo_new);
            return NoContent();
        }

        [HttpGet("current-game")]
        public async Task<IActionResult> GetCurrentGameStatus()
        {
            var bingo_list = await _bingoRepository.GetAllBingos();
            var last_bingo = bingo_list.LastOrDefault();

            if(last_bingo == null)
            {
                return BadRequest();
            }else
            {
                if(last_bingo.Game_status)
                {
                    return Ok(true);
                } else
                {
                    return Ok(false);
                }
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetGameStatusById(int id)
        {
            var bingo = await _bingoRepository.FindById(id);

            if(bingo == null)
            {
                return BadRequest();
            }

            return Ok(bingo.Game_status);
        }

        [HttpPost("disqualify")]
        public async Task<IActionResult> DisqualifyPlayer([FromBody]Gamer gamerFroDisqualify)
        {
            var gamerInfo = await _gamerRepository.FindByMongoId(gamerFroDisqualify.Mongo_id);

            // Se obtiene la lista de jugadores en el juego en curso
            var gameList = await _bingoRepository.GetAllBingos();
            var currentGame = gameList.LastOrDefault();

            if(currentGame == null)
            {
                return BadRequest();
            }

            var playerList = (List<int>)(IEnumerable<int>)_bingoRepository.NumStringToArr(currentGame.Gamers_id);

            // Se excluye el ID del jugador de la lista de IDs del juego en curso
            if (playerList != null)
            {
                for(int i = 0; i < playerList.Count; i++)
                {
                    if (playerList[i] == gamerInfo.Id)
                    {
                        playerList.RemoveAt(i);
                        break;
                    }
                }
            } else
            {
                return NotFound("NO SE ENCONTRO LISTA DE JUGADORES");
            }
        }

        [HttpPost("ballotsGamer")]
        public async Task<IActionResult> BallotMarkedForPlayer(string mongo_id, int ballot)
        {
            var gamerDatabase = await _gamerRepository.FindByMongoId(mongo_id);

            var gameList = await _bingoRepository.GetAllBingos();
            var currentGame = gameList.LastOrDefault();

        }

        [HttpPost("/is-winner")]
        public async Task<IActionResult> IsWinner(string mongoId)
        {
            var gamerDatabase = await _gamerRepository.FindByMongoId(mongoId);
            List<int> ballotsGamer;

            ballotsGamer = (List<int>)(IEnumerable<int>)_bingoRepository.NumStringToArr(gamerDatabase.Gamer_ballots);

            var cardDatabase = _cardRepository.FindByGamerId(gamerDatabase.Id);
            var columnList = await _columLetterRepository.GetAllColumnLetters();

            var columnOfCurrentGame = _columLetterRepository.BuildColumnsArrays((List<ColumnLetter>)columnList, cardDatabase.Id);

            //Verifica si el jugador es el ganador
            var isWinner = _bingoRepository.IsWinner(ballotsGamer, columnOfCurrentGame);

            if (isWinner)
            {
                var gameList = await _bingoRepository.GetAllBingos();
                var currentGame = gameList.LastOrDefault();

                currentGame.Game_status = false;
                currentGame.Winner_id = mongoId;

                await _bingoRepository.UpdateBingo(currentGame);
            }

            return Ok(isWinner);
        }

        [HttpPost("finish-current")]
        public async Task<IActionResult> FinishCurrentGame()
        {
            var bingo_list = await _bingoRepository.GetAllBingos();
            var last_bingo = bingo_list.LastOrDefault();

            if(last_bingo == null)
            {
                return NotFound();
            }

            last_bingo.Game_status = false;

            await _bingoRepository.UpdateBingo(last_bingo);

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBingo(int id)
        {
            await _bingoRepository.DeleteBingo(new Bingo { Id = id });

            return NoContent();
        }
    }
}