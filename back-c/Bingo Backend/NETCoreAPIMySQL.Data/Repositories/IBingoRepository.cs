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
        public List<int[]> CreateCardColumns();

        public int[] CreateColumn(int cells, int min, int max);

        public Task<IEnumerable<int>> NumStringToArr(string str);

        public Task<string> NumListToString(List<int> ballots);

        public int GenerateBallot(string ballots_string);

        public bool IsWinner(List<int> ballots, List<int[]> columns);

        public bool IsWinner(int[] markers);

        public bool FourCornersWin(List<int> ballots, List<int[]> columns);

        public bool PrincipalDiagonalWin(List<int> ballots, List<int[]> columns);

        public bool SecondaryDiagonalWin(List<int> ballots, List<int[]> columns);

        public bool HorizontalWin(List<int> ballots, List<int[]> columns);

        public bool VerticalWin(List<int> ballots, List<int[]> columns);

        public Task<bool> DeleteBingo(Bingo bingo);

        Task<IEnumerable<Bingo>> GetAllBingos();

        public Task<Bingo> FindById(int id);

        public Task<bool> InsertBingo(Bingo bingo);

        public Task<bool> UpdateBingo(Bingo bingo);
    }
}