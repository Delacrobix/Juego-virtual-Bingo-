using Dapper;
using MySql.Data.MySqlClient;
using NETCoreAPIMySQL.Data.Respositories;
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
        private readonly BingoRepository _bingoRepository;

        public BallotsObteinedRepository(MySQLConfiguration connectingString)
        {
            _connectionString = connectingString;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnecionString);
        }

        public async Task<int> GetOneBallot()
        {
            List<int> ballots = new List<int>();

            if (ballots.Count < 75)
            {
                var ballotsList = await GetAllBallotsObtained();
                var LastBallots = ballotsList.LastOrDefault();

                bool exist;
                int random;

                do
                {
                    exist = false;
                    Random r = new Random();
                    random = r.Next(1, 76);

                    foreach (int ball in ballots)
                    {
                        if (random == ball)
                        {
                            exist = true;
                            break;
                        }
                    }
                } while (exist);
                
                ballots.Add(random);
                var stringBallots = await _bingoRepository.NumListToString(ballots);
                    
                LastBallots.Ballots = stringBallots;
                await UpdateBallots(LastBallots);

                return random;
            } else
            {
                return 0;
            }
        }

        public async Task<bool> UpdateBallots(BallotsObteined ballotsobtained)
        {
            var db = dbConnection();

            var sql = @" UPDATE Ballots_obtained 
                         SET  id = @id,  
                              game_id = @game_id, 
                              ballots = @ballots 
                         WHERE id = @id";

            var result = await db.ExecuteAsync(sql, new
            { ballotsobtained.Id, ballotsobtained.Game_id, ballotsobtained.Ballots });

            return result > 0;
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
