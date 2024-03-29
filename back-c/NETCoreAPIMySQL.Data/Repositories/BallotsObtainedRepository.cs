﻿using Dapper;
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
    public class BallotsObtainedRepository : IBallotsObtainedRepository
    {
        private readonly MySQLConfiguration _connectionString;
        private readonly IBingoRepository _bingoRepository;

        public BallotsObtainedRepository(MySQLConfiguration connectingString, IBingoRepository bingoRepository)
        {
            _connectionString = connectingString;
            _bingoRepository = bingoRepository;
        }

        protected MySqlConnection dbConnection()
        {
            return new MySqlConnection(_connectionString.ConnecionString);
        }

        public async Task<int> GetOneBallot(List<int> ballotList)
        {
            var result = 0;

            if (ballotList.Count < 75)
            {
                var task = new Task<int>(() =>
                {
                    bool exist;
                    int random;

                    do
                    {
                        exist = false;
                        Random r = new Random();
                        random = r.Next(1, 76);

                        foreach (int ball in ballotList)
                        {
                            if (random == ball)
                            {
                                exist = true;
                                break;
                            }
                        }
                    } while (exist);

                    return random;
                });

                task.Start();
                result = await task;
            }

            return result;
        }

        public async Task<bool> UpdateBallots(BallotsObtained ballotsobtained)
        {
            var db = dbConnection();

            var sql = @" UPDATE Ballots_obtained 
                         SET  id = @Id,
                              game_id = @Game_id, 
                              ballots = @Ballots 
                         WHERE id = @Id";

            var result = await db.ExecuteAsync(sql, new
            { ballotsobtained.Id, ballotsobtained.Game_id, ballotsobtained.Ballots });

            return result > 0;
        }

        public async Task<BallotsObtained> FindByGameId(int Game_id)
        {
            var db = dbConnection();

            var sql = @" SELECT id, game_id, ballots
                         FROM Ballots_obtained
                         WHERE game_id = @Game_id";

            return await db.QueryFirstOrDefaultAsync<BallotsObtained>(sql, new { game_id = Game_id });
        }

        public async Task<bool> InsertBallots(BallotsObtained ballotsObtained)
        {
            var db = dbConnection();

            var sql = @" INSERT INTO Ballots_obtained (id, game_id, ballots) 
                         VALUES (@id, @game_id, ballots)";

            var result = await db.ExecuteAsync(sql, new
                { ballotsObtained.Id, ballotsObtained.Game_id, ballotsObtained.Ballots });

            return result > 0;
        }
        public async Task<IEnumerable<BallotsObtained>> GetAllBallotsObtained()
        {
            var db = dbConnection();

            var sql = @" SELECT id, game_id, ballots 
                        FROM Ballots_obtained ";

            return await db.QueryAsync<BallotsObtained>(sql, new { });
        }

        public async Task<BallotsObtained> GetLastBallots()
        {
          var ballotList = await GetAllBallotsObtained();
          return ballotList.LastOrDefault();
        }
    }
}
