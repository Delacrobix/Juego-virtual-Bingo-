using Dapper;
using MySql.Data.MySqlClient;
using MySqlX.XDevAPI.Common;
using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Diagnostics;
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

            card.Game_id = id_game;
            card.Gamer_id = id_gamer;

            return card;
        }

        public async Task<bool> InsertCard(Card card)
        {
            var db = dbConnection();

            var sql = @" INSERT INTO Card (id, B_id, I_id, N_id, G_id, O_id, gamer_id, game_id) 
                         VALUES (@id, @B_id, @I_id, @N_id, @G_id, @O_id, @gamer_id, @game_id)";

            var result = await db.ExecuteAsync(sql, new
            { card.Id, card.I_id, card.B_id, card.N_id, card.G_id, card.O_id, card.Gamer_id, card.Game_id });

            return result > 0;
        }

        public async Task<IEnumerable<Card>> GetAllCards()
        {
            var db = dbConnection();

            var sql = @"SELECT id, B_id, I_id, N_id, G_id, O_id, gamer_id, game_id
                        FROM Card";

            return await db.QueryAsync<Card>(sql, new { });
        }

        public async Task<bool> UpdateCard(Card card)
        {
            var db = dbConnection();

            var sql = @" UPDATE Card 
                         SET  id = @id, 
                              B_id = @B_id,
                              I_id = @I_id,
                              N_id = @N_id,
                              G_id = @G_id,
                              O_id = @O_id,
                              gamer_id = @gamer_id, 
                              game_id = @game_id
                         WHERE id = @id";

            var result = await db.ExecuteAsync(sql, new
            { card.Id, card.B_id, card.I_id, card.N_id, card.G_id, card.O_id, card.Gamer_id, card.Game_id });

            return result > 0;
        }

        public async Task<Card> FindByGamerId(int Gamer_id)
        {
            var db = dbConnection();

            var sql = @" SELECT id, B_id, I_id, N_id, G_id, O_id, gamer_id, game_id
                         FROM Card 
                         WHERE gamer_id = @Gamer_id";

            return await db.QueryFirstOrDefaultAsync<Card>(sql, new { gamer_id = Gamer_id });
        }

        public async Task<Card> FindByGamerAndGameId(int gamerId, int gameId)
        {
            var db = dbConnection();

            var sql = @" SELECT id, B_id, I_id, N_id, G_id, O_id, gamer_id, game_id
                         FROM Card
                         WHERE gamer_id = @gamerId
                         AND game_id = @gameId 
                         ORDER BY game_id ASC";

            var result = await db.QuerySingleOrDefaultAsync<Card>(sql, new {gamerId, gameId});

            return result;
        }
    }
}
