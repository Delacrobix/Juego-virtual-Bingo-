using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.Respositories
{
    public class BingoRepository : IBingoRepository
    {
        Task<bool> IBingoRepository.DeleteBingo(Bingo bingo)
        {
            throw new NotImplementedException();
        }

        Task<IEnumerable<Bingo>> IBingoRepository.GetAllBingos()
        {
            throw new NotImplementedException();
        }

        Task<Bingo> IBingoRepository.GetDetails(int id)
        {
            throw new NotImplementedException();
        }

        Task<bool> IBingoRepository.InsertBingo(Bingo bingo)
        {
            throw new NotImplementedException();
        }

        Task<bool> IBingoRepository.UpdateBingo(Bingo bingo)
        {
            throw new NotImplementedException();
        }
    }
}
