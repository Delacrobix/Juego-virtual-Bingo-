using Dapper;
using MySql.Data.MySqlClient;
using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Schema;

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

        public Task<IEnumerable<int>> NumStringToArr(string str)
        {
            string[] aux = str.Split(',');

            List<int> ballots = aux.Select(x => Convert.ToInt32(x)).ToList();

            return Ok(ballots);
        }

        public async Task<bool> DeleteBingo(Bingo bingo)
        {
            var db = dbConnection();

            var sql = @"DELETE FROM Bingo WHERE id = @Id";

            var result = await db.ExecuteAsync(sql, new { Id = bingo.Id });

            return result > 0;
        }

        public async Task<IEnumerable<Bingo>> GetAllBingos()
        {
            var db = dbConnection();

            var sql = @" SELECT id, cards_id, gamers_id, game_status, winner_id 
                         FROM Bingo ";

            return await db.QueryAsync<Bingo>(sql, new { });
        }

        public async Task<Bingo> FindById(int Id)
        {
            var db = dbConnection();

            var sql = @" SELECT id, cards_id, gamers_id, game_status, winner_id 
                         FROM Bingo 
                         WHERE id = @Id";

            return await db.QueryFirstOrDefaultAsync<Bingo>(sql, new { id = Id });
        }

        public async Task<bool> InsertBingo(Bingo bingo)
        {
            var db = dbConnection();

            var sql = @" INSERT INTO Bingo (id, cards_id, gamers_id, game_status, winner_id) 
                         VALUES (@id, @cards_id, @gamers_id, @game_status, @winner_id)";

            var result = await db.ExecuteAsync(sql, new
            { bingo.Id, bingo.Cards_id, bingo.Gamers_id, bingo.Game_status, bingo.Winner_id });

            return result > 0;
        }

        public async Task<bool> UpdateBingo(Bingo bingo)
        {
            var db = dbConnection();

            var sql = @" UPDATE Bingo 
                         SET  id = @id, 
                              cards_id = @cards_id, 
                              gamers_id = @gamers_id, 
                              game_status = @game_status, 
                              winner_id = @winner_id 
                         WHERE id = @id";

            var result = await db.ExecuteAsync(sql, new
            { bingo.Id, bingo.Cards_id, bingo.Gamers_id, bingo.Game_status, bingo.Winner_id });

            return result > 0;
        }
    }
}