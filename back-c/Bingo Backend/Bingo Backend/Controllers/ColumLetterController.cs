using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.service;
using NETCoreAPIMySQL.Model;

namespace Bingo_Backend.Controllers
{
    public class ColumLetterController : ControllerBase
    {
        private readonly ColumLetterRepository _columLetterRepository;

        public async Task<IActionResult> SendColumById([FromBody] int id)
        {
            var colum = await _columLetterRepository.FindById(id);

            return Ok(colum);
        }
    }
}
