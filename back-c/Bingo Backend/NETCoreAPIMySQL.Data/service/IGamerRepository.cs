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
        Task<bool> InsertGamer(Gamer gamer);

        Task<IEnumerable<Gamer>> GetAllGamersByGameId(int Id);
    }
}
