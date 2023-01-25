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

        [HttpGet("send-game-ballots/{id}")]
        public async Task<IActionResult> SendAllBallotsByGameId(int id)
        {
            var ballotsObtained = await _ballotsObtainedRepository.FindByGameId(id);
            //var ballots = await _bingoRepository.NumStringToArr(ballotsObtained.Ballots);

            return Ok(ballotsObtained);
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var all = _ballotsObtainedRepository.GetAllBallotsObtained();

            return Ok(all);
        }
    }
}
