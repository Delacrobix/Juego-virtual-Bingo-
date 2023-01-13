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
    public class BallotsObteinedRepository : IBallotsObteinedRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public BallotsObteinedRepository(MySQLConfiguration connectingString)
        {
            _connectionString = connectingString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnecionString);
        }

        public async Task<BallotsObteined> FindById(int Id)
        {
            var db = dbConnection();

            var sql = @" SELECT id, game_id, ballots 
                         FROM Ballots_obtained 
                         WHERE id = @Id";

            return await db.QueryFirstOrDefaultAsync<BallotsObteined>(sql, new { id = Id });
        }

        public async Task<IEnumerable<BallotsObteined>> GetAllBallotsObtained()
        {
            var db = dbConnection();

            var sql = @" SELECT id, game_id, ballots 
                        FROM Ballots_obtained ";

            return await db.QueryAsync<BallotsObteined>(sql, new { });
        }
    }
}
