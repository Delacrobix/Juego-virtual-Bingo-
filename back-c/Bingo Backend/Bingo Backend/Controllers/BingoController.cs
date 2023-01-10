using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Model;

namespace Bingo_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BingoController : ControllerBase
    {
        private readonly IBingoRepository _bingoRepository;

        public BingoController(IBingoRepository bingoRepository)
        {
            _bingoRepository = bingoRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewGame()
        {
            var bingo_new = new Bingo();
            var bingo_list = await _bingoRepository.GetAllBingos();
            var last_bingo = bingo_list.LastOrDefault();

            //Si no existe un juego anterior, crea el primero
            if(last_bingo == null)
            {
                bingo_new.Game_state = true;
                await _bingoRepository.InsertBingo(bingo_new);

            } else
            {
                //Si no hay un juego iniciado, inicie uno nuevo
                if(!last_bingo.Game_state)
                {
                    bingo_new.Game_state = true;
                    await _bingoRepository.InsertBingo(bingo_new);
                }
            }

            return Created("BINGO CREATED SUCCESSFULLY", bingo_new);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBingos()
        {
            return Ok(await _bingoRepository.GetAllBingos());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetails(int id)
        {
            return Ok(await _bingoRepository.GetDetails(id));
        }

        [HttpPost]
        public async Task<IActionResult> CreateBingo([FromBody] Bingo bingo)
        {
            if (bingo == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var created = await _bingoRepository.InsertBingo(bingo);

            return Created("created", created);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateBingo([FromBody] Bingo bingo)
        {
            if (bingo == null)
            {
                return BadRequest();
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            await _bingoRepository.UpdateBingo(bingo);

            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteBingo(int id)
        {
            await _bingoRepository.DeleteBingo(new Bingo { id = id });

            return NoContent();
        }
    }
}