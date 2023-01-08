using Dapper;
using MySql.Data.MySqlClient;
using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.Respositories
{
    public class BingoRepository : IBingoRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public BingoRepository(MySQLConfiguration connectingString)
        {
            _connectionString = connectingString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnecionString);
        }
        public async Task<bool> DeleteBingo(Bingo bingo)
        {
            var db = dbConnection();

            var sql = @"DELETE FROM Bingo WHERE id = @Id";

            var result = await db.ExecuteAsync(sql, new { Id = bingo.id });

            return result > 0;
        }

        public async Task<IEnumerable<Bingo>> GetAllBingos()
        {
            var db = dbConnection();

            var sql = @" SELECT id, game_number, id_cards, id_gamers, game_state, winner_id 
                         FROM Bingo ";

            return await db.QueryAsync<Bingo>(sql, new { });
        }

        public async Task<Bingo> GetDetails(int id_)
        {
            var db = dbConnection();

            var sql = @" SELECT id, game_number, id_cards, id_gamers, game_state, winner_id 
                         FROM Bingo 
                         FROM id_ = @id";

            return await db.QueryFirstOrDefaultAsync<Bingo>(sql, new { id = id_ });
        }

        public async Task<bool> InsertBingo(Bingo bingo)
        {
            var db = dbConnection();

            var sql = @" INSERT INTO Bingo (game_number, id_cards, id_gamers, game_state, winner_id) 
                         VALUES (@Game_number, @Id_cards, @Id_gamers, @Game_state, @Winner_id)";

            var result = await db.ExecuteAsync(sql, new 
                { bingo.id_cards, bingo.id_gamers, bingo.game_state, bingo.winner_id });

            return result > 0;
        }

        public async Task<bool> UpdateBingo(Bingo bingo)
        {
            var db = dbConnection();

            var sql = @" UPDATE Bingo 
                         SET  game_number = @Game_number, 
                              id_cards = @Id_cards, 
                              id_gamers = @Id_gamers, 
                              game_state = @Game_state, 
                              winner_id = @Winner_id 
                         WHERE id = @Id";

            var result = await db.ExecuteAsync(sql, new 
                { bingo.game_number, bingo.id_cards, bingo.id_gamers, bingo.game_state, bingo.winner_id });

            return result > 0;
        }
    }
}