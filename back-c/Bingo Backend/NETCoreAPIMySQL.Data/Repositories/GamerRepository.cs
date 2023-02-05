using Dapper;
using MySql.Data.MySqlClient;
using NETCoreAPIMySQL.Model;

namespace NETCoreAPIMySQL.Data.Respositories
{
    public class GamerRepository : IGamerRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public GamerRepository(MySQLConfiguration connectionString)
        {
            _connectionString = connectionString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnecionString);
        }

        public async Task<bool> Update(Gamer gamer)
        {
            var db = dbConnection();

            var sql = @" UPDATE Gamers 
                         SET  id = @Id, 
                              mongo_id = @Mongo_id, 
                              game_id = @Game_id, 
                              gamer_ballots = @Gamer_ballots
                         WHERE id = @Id";

            var result = await db.ExecuteAsync(sql, new
            { gamer.Id, gamer.Mongo_id, gamer.Game_id, gamer.Gamer_ballots });

            return result > 0;
        }

        public async Task<bool> InsertGamer(Gamer gamer)
        {
            var db = dbConnection();

            var sql = @" INSERT INTO Gamers (id, mongo_id, game_id, gamer_ballots) 
                         VALUES (@Id, @Mongo_id, @Game_id, @gamer_ballots)";

            var result = await db.ExecuteAsync(sql, new
            { gamer.Id, gamer.Mongo_id, gamer.Game_id, gamer.Gamer_ballots});

            return result > 0;
        }

        public async Task<Gamer> FindByMongoId(string Id)
        {
            var db = dbConnection();

            var sql = @" SELECT id, mongo_id, game_id, gamer_ballots 
                         FROM Gamers 
                         WHERE mongo_id = @Id";

            return await db.QueryFirstOrDefaultAsync<Gamer>(sql, new { id = Id });
        }

        public async Task<Gamer> FindByMongoAndGameId(string Id, int gameId)
        {
            var db = dbConnection();

            var sql = @" SELECT id, mongo_id, game_id, gamer_ballots 
                         FROM Gamers 
                         WHERE mongo_id = @Id 
                         ORDER BY game_id DESC";

            return await db.QueryFirstOrDefaultAsync<Gamer>(sql, new { id = Id });
        }

        public async Task<IEnumerable<Gamer>> GetAllGamersByGameId(int Game_id)
        {
            var db = dbConnection();

            var sql = @" SELECT id, mongo_id, game_id, gamer_ballots
                         FROM Gamers
                         WHERE game_id = @Game_id";

            return await db.QueryAsync<Gamer>(sql, new { game_id = Game_id });
        }
    }
}