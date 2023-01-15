using Dapper;
using MySql.Data.MySqlClient;
using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

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

        public ColumnLetter GenerateColumn(int[] column, char letter, int card_id)
        {
            ColumnLetter columnLetter = new ColumnLetter();

            if (letter == 'N')
            {
                columnLetter.Letter = letter;
                columnLetter.N1 = column[0];
                columnLetter.N2 = column[1];
                columnLetter.N3 = 0;
                columnLetter.N4 = column[2];
                columnLetter.N5 = column[3];
            } else
            {
                columnLetter.Letter = letter;
                columnLetter.N1 = column[0];
                columnLetter.N2 = column[1];
                columnLetter.N3 = column[2];
                columnLetter.N4 = column[3];
                columnLetter.N5 = column[4];
            }

            columnLetter.Card_id = card_id;

            return columnLetter;
        }

        public List<int[]> BuildColumnsArrays(List<ColumnLetter> columnList, int id)
        {
            List<int[]> column_list = new List<int[]>();

            foreach (ColumnLetter columnLetter in columnList)
            {
                if (Object.Equals(columnLetter.Card_id, id))
                {
                    int[] numbers = {columnLetter.N1, columnLetter.N2, columnLetter.N3,
                                     columnLetter.N4, columnLetter.N5};

                    column_list.Add(numbers);
                }
            }

            return column_list;
        }

        public async Task<IEnumerable<ColumnLetter>> GetAllColumnLetters()
        {
            var db = dbConnection();

            var sql = @" SELECT id, card_id, letter, n1, n2, n3, n4, n5,
                         FROM Colum_letter";

            return await db.QueryFirstOrDefaultAsync<IEnumerable<ColumnLetter>>(sql, new { });
        }

        public async Task<bool> InsertColumnLetter(ColumnLetter columnLetter)
        {
            var db = dbConnection();

            var sql = @" INSERT INTO Column_letter (id, card_id, letter, n1, n2, n3, n4, n5) 
                         VALUES (@id, @card_id, @letter, @n1, @n2, @n3, @n4, @n5)";

            var result = await db.ExecuteAsync(sql, new
                { columnLetter.Id, columnLetter.Card_id, columnLetter.Letter, columnLetter.N1, 
                  columnLetter.N2, columnLetter.N3, columnLetter.N4, columnLetter.N5 });

            return result > 0;
        }

        public async Task<ColumnLetter> FindById(int Id)
        {
            var db = dbConnection();

            var sql = @" SELECT id, card_id, letter, n1, n2, n3, n4, n5,
                         FROM Colum_letter 
                         WHERE id = @Id";

            return await db.QueryFirstOrDefaultAsync<ColumnLetter>(sql, new { id = Id });
        }
    }
}
