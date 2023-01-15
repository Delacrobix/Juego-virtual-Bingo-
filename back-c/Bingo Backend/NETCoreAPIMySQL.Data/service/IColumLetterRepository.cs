using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.service
{
    public interface IColumLetterRepository
    {
        Task<ColumnLetter> FindById(int id);

        public Task<IEnumerable<ColumnLetter>> GetAllColumnLetters();

        public Task<bool> InsertColumnLetter(ColumnLetter columnLetter);
    }
}
