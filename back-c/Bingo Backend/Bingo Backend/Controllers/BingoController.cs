using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Data.service;
using NETCoreAPIMySQL.Model;
using Org.BouncyCastle.Pkcs;
using System.Threading;
using System.Diagnostics;

namespace Bingo_Backend.Controllers
{
    [Route("api/bingo")]
    [ApiController]
    public class BingoController : ControllerBase
    {
        private readonly IBingoRepository _bingoRepository;
        private readonly IGamerRepository _gamerRepository;
        private readonly ICardRepository _cardRepository;
        private readonly IBallotsObtainedRepository _ballotsObteinedRepository;
        private readonly IColumnLetterRepository _columLetterRepository;
        private readonly IHubContext<BingoHub> _hubContext;
        static SemaphoreSlim semaphore = new SemaphoreSlim(1, 1);

        public BingoController
               (IBingoRepository bingoRepository, IGamerRepository gamerRepository, ICardRepository 
                cardRepository, IBallotsObtainedRepository ballotsObteinedRepository, IColumnLetterRepository 
                columLetterRepository, IHubContext<BingoHub> hubContext)
        {
            _bingoRepository = bingoRepository;
            _gamerRepository = gamerRepository;
            _cardRepository = cardRepository;
            _ballotsObteinedRepository = ballotsObteinedRepository;
            _columLetterRepository = columLetterRepository;
            _hubContext = hubContext;
        }

        [HttpGet("")]
        public async Task<IActionResult> TestMethod()
        {
            return Ok("It works!");
        }

        [HttpPost("new-game")]  
        public async Task<IActionResult> CreateNewGame()
        {
            await semaphore.WaitAsync();

            try
            {
                var bingoNew = new Bingo();
                var currentGame = await _bingoRepository.GetCurrentGame();

                if(currentGame == null)
                {
                    bingoNew.Game_state = true;
                    await _bingoRepository.InsertBingo(bingoNew);
                } else
                {
                    //Si no hay un juego iniciado, inicie uno nuevo
                    if (!currentGame.Game_state)
                    {
                        bingoNew.Game_state = true;
                        await _bingoRepository.InsertBingo(bingoNew);
                    } else
                    {
                        return BadRequest("There is already one game started.");
                    }
                }

            }
            finally
            {
                semaphore.Release();
            }

            return Ok("Bingo has been created successfully");
        }

        [HttpGet("current-game-state")]
        public async Task<IActionResult> GetCurrentGameState()
        {
            var currentGame = await _bingoRepository.GetCurrentGame();

            if(currentGame == null)
            {
                return BadRequest("Has not one game started yet.");
            }else
            {
                if(currentGame.Game_state)
                {
                    return Ok(true);
                } else
                {
                    return Ok(false);
                }
            }
        }

        [HttpGet("current-game")]
        public async Task<IActionResult> GetCurrentGame()
        {
            var currentGame = await _bingoRepository.GetCurrentGame();

            if (currentGame == null)
            {
                return BadRequest("Has not one game started yet.");
            }
            else
            {
                return Ok(currentGame);
            }
        }

        [HttpPost("send-card")]
        public async Task<IActionResult> BuildCard(Gamer gamer)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(gamer);
            }

            await semaphore.WaitAsync();
            var cardToSave = new Card();

            try
            {
                var currentGame = await _bingoRepository.GetCurrentGame();
                var gamerDatabase = await _gamerRepository.FindByMongoAndGameId(gamer.Mongo_id, currentGame.Id);

                if (currentGame == null)
                {
                    return BadRequest("There has not one game started.");
                }

                var haveCards = await _cardRepository.FindByGamerAndGameId(gamerDatabase.Id, currentGame.Id);
            
                if (haveCards != null)
                {
                    return Ok(haveCards);
                }

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

                //Se actualiza el juego con los nuevos datos
                cardToSave = _cardRepository.GenerateCard(columnsIds, currentGame.Id, gamerDatabase.Id);
                var cardsIds = (List<int>)(IEnumerable<int>)await _bingoRepository.NumStringToArr(currentGame.Cards_id);
          
                cardsIds.Add(card.Id);

                currentGame.Cards_id = await _bingoRepository.NumListToString(cardsIds);
                cardToSave.Id = card.Id;

                await _bingoRepository.UpdateBingo(currentGame);
                await _cardRepository.UpdateCard(cardToSave);
            }
            finally
            {
                semaphore.Release();
            }

            return Ok(cardToSave);
        }

        [HttpGet("send-ballot")]
        public async Task<IActionResult> SendBallot()
        {
            var currentGame = await _bingoRepository.GetCurrentGame();
            var currentBallots = await _ballotsObteinedRepository.FindByGameId(currentGame.Id);
            
            if(currentBallots == null)
            {
                currentBallots = new BallotsObtained
                {
                    Game_id = currentGame.Id
                };

                await _ballotsObteinedRepository.InsertBallots(currentBallots);
                currentBallots = await _ballotsObteinedRepository.GetLastBallots();
            }

            if(currentBallots.Ballots == string.Empty)
            {
                var ballotsList = new List<int> { };

                do
                {
                    currentGame = await _bingoRepository.GetCurrentGame();

                    if (!currentGame.Game_state)
                    {
                        return Ok("The game has been finished.");
                    }

                    var ballot = await _ballotsObteinedRepository.GetOneBallot(ballotsList);

                    if(ballot == 0)
                    {
                        return Ok("All ballots have been send.");
                    }

                    ballotsList.Add(ballot);

                    currentBallots.Ballots = await _bingoRepository.NumListToString(ballotsList);

                    await _ballotsObteinedRepository.UpdateBallots(currentBallots);

                    await _hubContext.Clients.All.SendAsync("sendBallot", ballot);
                    await Task.Delay(100);
                } while (ballotsList.Count < 75);

                return Ok("All ballots have been send.");
            } else
            {
                currentBallots = await _ballotsObteinedRepository.GetLastBallots();
                var ballotsList = (List<int>)await _bingoRepository.NumStringToArr(currentBallots.Ballots);

                if (ballotsList.Count == 75)
                {
                    return Ok("All ballots have been send.");
                }
                else
                {
                    return Ok("The ballots are sending");
                }
            }
        }

        [HttpPost("save-column")]
        public async Task<int> SaveColumn(int[] column, char letter, int cardId)
        {
            var columnToSave = _columLetterRepository.GenerateColumn(column, letter, cardId);
            await _columLetterRepository.InsertColumnLetter(columnToSave);

            var columnList = await _columLetterRepository.GetAllColumnLetters();
            var lastColumn = columnList.LastOrDefault();

            return lastColumn.Id;
        }

        [HttpPut("disqualify")]
        public async Task<IActionResult> DisqualifyPlayer([FromBody] string mongoId)
        {
            var gamerInfo = await _gamerRepository.FindLastByMongoId(mongoId);

            if(gamerInfo == null)
            {
                return NotFound("MongoId not found.");
            }

            // Se obtiene la lista de jugadores en el juego en curso
            var currentGame = await _bingoRepository.GetCurrentGame();

            if(currentGame == null)
            {
                return BadRequest("There has not a game started yet.");
            }

            if(currentGame.Game_state == false)
            {
                return BadRequest("The game have been finished with a winner");
            }

            var playerList = (List<int>)(IEnumerable<int>)await _bingoRepository.NumStringToArr(currentGame.Gamers_id);

            if (!(playerList.Contains(gamerInfo.Id)))
            {
                return NotFound("The player has not in game.");
            }

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
                return NotFound("Player list not found.");
            }

            //Se desasocia el jugador del juego
            gamerInfo.Game_id = 0;
            await _gamerRepository.Update(gamerInfo);

            //Guarda el juego con la lista de jugadores actualizada
            currentGame.Gamers_id = await _bingoRepository.NumListToString(playerList);

            if (playerList.Count() == 0)
            {
                currentGame.Game_state = false;
            }

            await _bingoRepository.UpdateBingo(currentGame);

            return Ok(playerList);
        }

        [HttpPut("ballot-marked/{mongoId}")]
        public async Task<IActionResult> BallotMarkedForPlayer(string mongoId, [FromBody]int ballot) {
            if (ballot == 0)
            {
                return BadRequest("Ballot can not be Null.");
            } else if (mongoId == "")
            {
                return BadRequest("MongoId can not be empty or null.");
            }

            var currentGame = await _bingoRepository.GetCurrentGame();

            if (currentGame == null)
            {
                return BadRequest("There has not a game started yet.");
            }

            var gamerDatabase = await _gamerRepository.FindByMongoAndGameId(mongoId, currentGame.Id);

            if (gamerDatabase == null)
            {
                return BadRequest("GamerId not found.");
            }

            //Linea en JAVA que no entiendo su funcion
            //gamerDatabase.Game_id = currentGame.Id;

            var ballotsGamer = (List<int>)(IEnumerable<int>)await _bingoRepository.NumStringToArr(gamerDatabase.Gamer_ballots);
            
            ballotsGamer.Add(ballot);

            gamerDatabase.Gamer_ballots = await _bingoRepository.NumListToString(ballotsGamer);
            await _gamerRepository.Update(gamerDatabase);

            return Ok("The ballot has been marked correctly.");
        }

        [HttpPut("is-winner")]
        public async Task<IActionResult> IsWinner([FromBody]string mongoId)
        {
            if (mongoId == "")
            {
                return BadRequest("MongoId can not be empty or null.");
            }

            var currentGame = await _bingoRepository.GetCurrentGame();
            var gamerDatabase = await _gamerRepository.FindByMongoAndGameId(mongoId, currentGame.Id);

            if(gamerDatabase == null)
            {
                return NotFound("MongoId not found.");
            }

            List<int> ballotsGamer;

            ballotsGamer = (List<int>)(IEnumerable<int>)await _bingoRepository.NumStringToArr(gamerDatabase.Gamer_ballots);

            var cardDatabase = await _cardRepository.FindByGamerId(gamerDatabase.Id);
            var columnList = await _columLetterRepository.GetAllColumnLetters();

            var columnOfCurrentGame = _columLetterRepository.BuildColumnsArrays((List<ColumnLetter>)columnList, cardDatabase.Id);

            //Verifica si el jugador es el ganador
            var isWinner = _bingoRepository.IsWinner(ballotsGamer, columnOfCurrentGame);

            if (isWinner)
            {
                currentGame.Game_state = false;
                currentGame.Winner_id = mongoId;

                await _bingoRepository.UpdateBingo(currentGame);
            }

            return Ok(isWinner);
        }

        [HttpPut("finish-current")]
        public async Task<IActionResult> FinishCurrentGame()
        {
            var currentGame = await _bingoRepository.GetCurrentGame();

            if((currentGame == null) || (!currentGame.Game_state))
            {
                return BadRequest("There has not one game started yet.");
            }

            currentGame.Game_state = false;

            await _bingoRepository.UpdateBingo(currentGame);

            return Ok("Current game finished.");
        }

        [HttpGet("get-current-winner")]
        public async Task<IActionResult> GetCurrentGameWinner()
        {
            var currentGame = await _bingoRepository.GetCurrentGame();

            return Ok(currentGame);
        }
    }
}