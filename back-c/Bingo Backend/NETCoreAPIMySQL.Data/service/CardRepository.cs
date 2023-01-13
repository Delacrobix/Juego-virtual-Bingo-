using Dapper;
using MySql.Data.MySqlClient;
using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.service
{
    public class CardRepository : ICardRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public CardRepository(MySQLConfiguration connectingString)
        {
            _connectionString = connectingString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnecionString);
        }

        public Card GenerateCard(int[] ids, int id_game, int id_gamer)
        {
            Card card = new Card();

            card.B_id = ids[0];
            card.I_id = ids[1];
            card.N_id = ids[2];
            card.G_id = ids[3];
            card.O_id = ids[4];

            card.Game_id = id_game);
            card.Gamer_id = id_gamer);

            return card;
        }

        public async Task<Card> FindByGamerId(int gamerId)
        {
            var db = dbConnection();

            var sql = @" SELECT id, B_id, I_id, N_id, G_id, O_id, gamer_id, game_id, 
                         FROM Card 
                         WHERE id = @gamerId";

            return await db.QueryFirstOrDefaultAsync<Card>(sql, new { id = gamerId });
        }
    }
}
