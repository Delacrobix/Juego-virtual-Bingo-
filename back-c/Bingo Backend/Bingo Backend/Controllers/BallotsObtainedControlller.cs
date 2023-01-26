using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Data.service;
using NETCoreAPIMySQL.Model;
using System.Diagnostics;

namespace Bingo_Backend.Controllers
{
    [Route("api/BallotsObtained")]
    [ApiController]
    public class BallotsObtainedControlller : ControllerBase
    {
        private readonly IBallotsObtainedRepository _ballotsObtainedRepository;
        private readonly IBingoRepository _bingoRepository;

        public BallotsObtainedControlller(IBallotsObtainedRepository ballotsObtainedRepository, IBingoRepository bingoRepository)
        {
            _ballotsObtainedRepository = ballotsObtainedRepository;
            _bingoRepository = bingoRepository;
        }   

        [HttpGet("send-game-ballots")]
        public async Task<IActionResult> SendAllBallotsOfCurrentGame()
        {
            var ballotsObtainedList = await _ballotsObtainedRepository.GetAllBallotsObtained();
            var currentGameBallots = ballotsObtainedList.LastOrDefault();
            var ballots = await _bingoRepository.NumStringToArr(currentGameBallots.Ballots);

            return Ok(ballots);
        }
    }
}
