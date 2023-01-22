using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.Respositories
{
    public interface IGamerRepository
    {

        public Task<bool> Update(Gamer gamer);

        Task<bool> InsertGamer(Gamer gamer);

        public Task<Gamer> FindByMongoId(string Id);

        Task<IEnumerable<Gamer>> GetAllGamersByGameId(int Id);
    }
}
