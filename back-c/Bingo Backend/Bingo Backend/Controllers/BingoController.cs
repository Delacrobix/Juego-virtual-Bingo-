using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Model;

namespace Bingo_Backend.Controllers
{
    [Route("api/bingo")]
    [ApiController]
    public class BingoController : ControllerBase
    {
        private readonly BingoRepository _bingoRepository;

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