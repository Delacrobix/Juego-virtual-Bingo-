using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.service
{
    public interface IColumnLetterRepository
    {
        public ColumnLetter GenerateColumn(int[] column, char letter, int card_id);

        public List<int[]> BuildColumnsArrays(List<ColumnLetter> columnList, int id);

        public Task<IEnumerable<ColumnLetter>> GetAllColumnLetters();

        public Task<bool> InsertColumnLetter(ColumnLetter columnLetter);

        Task<ColumnLetter> FindById(int id);
    }
}
