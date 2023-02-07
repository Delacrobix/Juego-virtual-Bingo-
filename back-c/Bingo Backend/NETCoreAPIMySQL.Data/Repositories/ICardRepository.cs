using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.service
{
    public interface ICardRepository
    {
        public Card GenerateCard(int[] ids, int id_game, int id_gamer);

        public Task<bool> InsertCard(Card card);

        public Task<bool> UpdateCard(Card card);

        public Task<IEnumerable<Card>> GetAllCards();

        public Task<Card> FindByGamerId(int Id);

        public Task<Card> FindByGamerAndGameId(int gamerId, int gameId);
    }
}
