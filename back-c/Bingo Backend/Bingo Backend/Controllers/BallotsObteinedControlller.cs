using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Data.service;
using NETCoreAPIMySQL.Model;

namespace Bingo_Backend.Controllers
{
    [Route("api/ballotsbteined")]
    [ApiController]
    public class BallotsObteinedControlller : ControllerBase
    {
        private readonly BallotsObteinedRepository _ballotsObteinedRepository;
        private readonly BingoRepository _bingoRepository;

        [HttpGet("send-game-ballots")]
        public async Task<IActionResult> SendAllBallotsByGame(int gameId)
        {
            var ballotsObtained = await _ballotsObteinedRepository.FindById(gameId);
            var ballots = _bingoRepository.NumStringToArr(ballotsObtained.Ballots);

            return Ok(ballots);
        }
    }
}
