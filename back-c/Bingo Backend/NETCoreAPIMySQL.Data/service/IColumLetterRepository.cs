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
        Task<ColumLetter> FindById(int id);
    }
}
