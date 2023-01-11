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
    public class ColumLetterRepository :IColumLetterRepository
    {
        private readonly MySQLConfiguration _connectionString;

        public ColumLetterRepository(MySQLConfiguration connectingString)
        {
            _connectionString = connectingString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnecionString);
        }

        public async Task<ColumLetter> FindById(int id)
        {
            var db = dbConnection();

            var sql = @" SELECT id, card_id, letter, n1, n2, n3, n4, n5,
                         FROM Colum_letter 
                         WHERE id = @Id";

            return await db.QueryFirstOrDefaultAsync<ColumLetter>(sql, new { id = Id });
        }
    }
}
