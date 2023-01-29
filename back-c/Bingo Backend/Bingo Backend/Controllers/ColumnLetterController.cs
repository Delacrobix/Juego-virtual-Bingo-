using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.service;
using NETCoreAPIMySQL.Model;
using System.Diagnostics;

namespace Bingo_Backend.Controllers
{
    [Route("api/columnLetter")]
    [ApiController]
    public class ColumnLetterController : ControllerBase
    {
        private readonly IColumnLetterRepository _columnLetterRepository;

        public ColumnLetterController(IColumnLetterRepository columnLetterRepository)
        {
            _columnLetterRepository = columnLetterRepository;
        }

        //? No esta siendo usado
        [HttpGet("send-column/{id}")]
        public async Task<IActionResult> SendColumById(int id)
        {
            var column = await _columnLetterRepository.FindById(id);

            return Ok(column);
        }
    }
}
