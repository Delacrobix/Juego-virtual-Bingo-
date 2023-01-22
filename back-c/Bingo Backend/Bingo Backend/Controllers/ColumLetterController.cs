using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.service;
using NETCoreAPIMySQL.Model;

namespace Bingo_Backend.Controllers
{
    [Route("api/ColumnLetter")]
    [ApiController]
    public class ColumLetterController : ControllerBase
    {
        private readonly IColumLetterRepository _columLetterRepository;

        //? No esta siendo usado
        [HttpGet("send-column")]
        public async Task<IActionResult> SendColumById([FromBody] int id)
        {
            var colum = await _columLetterRepository.FindById(id);

            return Ok(colum);
        }
    }
}
