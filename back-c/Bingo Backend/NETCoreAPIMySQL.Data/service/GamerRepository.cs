using Dapper;
using MySql.Data.MySqlClient;
using NETCoreAPIMySQL.Model;

namespace NETCoreAPIMySQL.Data.Respositories
{
    public class GamerRepository : IGamerRepository
    {
        private readonly MySQLConfiguration _connectionString;

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnecionString);
        }
        public async Task<bool> InsertGamer(Gamer gamer)
        {
            var db = dbConnection();

            var sql = @" INSERT INTO Gamer (id, mongo_id, game_id, gamer_ballots) 
                         VALUES (@Id, @Mongo_id, @Game_id, @gamer_ballots)";

            var result = await db.ExecuteAsync(sql, new
            { gamer.Id, gamer.Mongo_id, gamer.Game_id, gamer.Gamer_ballots});

            return result > 0;
        }
    }
}