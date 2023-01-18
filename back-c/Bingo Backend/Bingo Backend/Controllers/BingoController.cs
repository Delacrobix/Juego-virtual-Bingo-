using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
        private readonly BallotsObteinedRepository _ballotsObteinedRepository;
        private readonly ColumLetterRepository _columLetterRepository;
        private readonly IHubContext<BingoHub> _hubContext;

        public BingoController(IHubContext<BingoHub> hubContext)
        {
            _hubContext = hubContext;
        }

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

        [HttpPost("send-cards")]
        public async Task<IActionResult> BuildCards(string mongoId)
        {
            //Crea, guarda y obtenga la carta para asignarle un ID de la base de datos a la carta
            //Cuando regresa la carta de la base de datos, ya tiene un ID asignado
            var card = new Card();
            await _cardRepository.InsertCard(card);
            var cardList = await _cardRepository.GetAllCards();
            card = cardList.LastOrDefault();

            int[] columnsIds = new int[5];
            var cardColumns = _bingoRepository.CreateCardColumns();

            columnsIds[0] = await SaveColumn(cardColumns[0], 'B', card.Id);
            columnsIds[1] = await SaveColumn(cardColumns[1], 'I', card.Id);
            columnsIds[2] = await SaveColumn(cardColumns[2], 'N', card.Id);
            columnsIds[3] = await SaveColumn(cardColumns[3], 'G', card.Id);
            columnsIds[4] = await SaveColumn(cardColumns[4], 'O', card.Id);

            var gamerDatabase = await _gamerRepository.FindByMongoId(mongoId);
            var gameList = await _bingoRepository.GetAllBingos();
            var currentGame = gameList.LastOrDefault();

            if (currentGame == null)
            {
                return BadRequest();
            }

            //Se actualiza el juego con los nuevos datos
            var cardToSave = _cardRepository.GenerateCard(columnsIds, currentGame.Id, gamerDatabase.Id);
            var cardsIds = (List<int>)(IEnumerable<int>)_bingoRepository.NumStringToArr(currentGame.Cards_id);
          
            cardsIds.Add(card.Id);

            currentGame.Cards_id = await _bingoRepository.NumListToString(cardsIds);

            await _bingoRepository.UpdateBingo(currentGame);
            await _cardRepository.UpdateCard(card);

            return Ok(card);
        }

        [HttpGet]
        public async Task SendBallot()
        {
            await _hubContext.Clients.All.SendAsync("ballot", await _ballotsObteinedRepository.GetOneBallot());
        }

        [HttpPost]
        public async Task<int> SaveColumn(int[] column, char letter, int cardId)
        {
            var columnToSave = _columLetterRepository.GenerateColumn(column, letter, cardId);
            await _columLetterRepository.InsertColumnLetter(columnToSave);

            var columnList = await _columLetterRepository.GetAllColumnLetters();
            var lastColumn = columnList.LastOrDefault();

            return lastColumn.Id;
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

            //Se desasocia el jugador del juego
            gamerInfo.Game_id = 0;
            await _gamerRepository.Update(gamerInfo);

            //Guarda el juego con la lista de jugadores actualizada
            currentGame.Gamers_id = await _bingoRepository.NumListToString(playerList);
            await _bingoRepository.UpdateBingo(currentGame);

            return Ok(playerList);
        }

        [HttpPost("ballots-gamer")]
        public async Task<IActionResult> BallotMarkedForPlayer(string mongoId, int ballot)
        {
            var gamerDatabase = await _gamerRepository.FindByMongoId(mongoId);
            var gameList = await _bingoRepository.GetAllBingos();
            var currentGame = gameList.LastOrDefault();

            if ((gamerDatabase == null) || (currentGame == null))
            {
                return BadRequest();
            }

            //Linea en JAVA que no entiendo su funcion
            //gamerDatabase.Game_id = currentGame.Id;

            var ballotsGamer = (List<int>)(IEnumerable<int>)await _bingoRepository.NumStringToArr(gamerDatabase.Gamer_ballots);
            ballotsGamer.Add(ballot);

            gamerDatabase.Gamer_ballots = await _bingoRepository.NumListToString(ballotsGamer);
            await _gamerRepository.Update(gamerDatabase);

            return Ok(gamerDatabase);
        }

        [HttpPost("is-winner")]
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

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteBingo(int id)
        {
            await _bingoRepository.DeleteBingo(new Bingo { Id = id });

            return NoContent();
        }
    }
}