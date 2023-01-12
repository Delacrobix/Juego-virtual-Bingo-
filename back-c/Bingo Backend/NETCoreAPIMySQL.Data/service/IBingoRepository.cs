using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.Respositories
{
    public interface IBingoRepository
    {
        Task<IEnumerable<List<int>>> NumStringToArr(string str);

        Task<IEnumerable<Bingo>> GetAllBingos();

        Task<Bingo> FindById(int id);

        Task<bool> InsertBingo(Bingo bingo);

        Task<bool> UpdateBingo(Bingo bingo);

        Task<bool> DeleteBingo(Bingo bingo);
    }
}
