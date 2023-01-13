using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.service
{
    public interface IBallotsObteinedRepository
    {
        public Task<IEnumerable<BallotsObteined>> GetAllBallotsObtained();

        public Task<BallotsObteined> FindById(int id);
    }
}
