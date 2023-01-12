using Dapper;
using MySql.Data.MySqlClient;
using MySqlX.XDevAPI.Common;
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

        public async Task<IEnumerable<int>> NumStringToArr(string str)
        {
            string[] aux = str.Split(',');

            var task = new Task<IEnumerable<int>>(() =>
            {
                var result = aux.Select(x => Convert.ToInt32(x)).ToList();
                return result;
            });

            task.Start();
            var ballots = await task;

            return ballots;
        }

        public async Task<string> NumListToString(List<int> ballots)
        {
            var task = new Task<string>(() =>
            {
                string result = "";

                foreach (int i in ballots)
                {
                    result = new StringBuilder().Append(i).Append(',').ToString();
                }

                return result;
            });

            task.Start();
            string ballots_string = await task;
            
            return ballots_string;
        }

        public bool IsWinner(List<int> ballots, List<int[]> columns)
        {
            if (FourCornersWin(ballots, columns))
            {
                return true;
            } else if (PrincipalDiagonalWin(ballots, columns))
            {
                return true;
            } else if (HorizontalWin(ballots, columns))
            {
                return true;
            } else if (VerticalWin(ballots, columns))
            {
                return true;
            } else if (SecondaryDiagonalWin(ballots, columns))
            {
                return true;
            } else {
                return false;
            }
        }

        public bool FourCornersWin(List<int> ballots, List<int[]> columns)
        {
            int[] corner_marker = { 0, 0, 0, 0 };

            foreach (int ball in ballots)
            {
                if (Object.Equals(ball, columns[0][0])){
                    corner_marker[0] = 1;
                } else if (Object.Equals(ball, columns[0][4]))
                {
                    corner_marker[1] = 1;
                } else if (Object.Equals(ball, columns[4][0]))
                {
                    corner_marker[2] = 1;
                } else if (Object.Equals(ball, columns[4][4]))
                {
                    corner_marker[3] = 1;
                }
            }

            return IsWinner(corner_marker);
        }

        public bool PrincipalDiagonalWin(List<int> ballots, List<int[]> columns)
        {
            int[] diagonal_markers = { 0, 0, 0, 0 };

            foreach (int ball in ballots)
            {
                if (Object.Equals(ball, columns[0][0]))
                {
                    diagonal_markers[0] = 1;
                } else if (Object.Equals(ball, columns[1][1]))
                {
                    diagonal_markers[1] = 1;
                } else if (Object.Equals(ball, columns[3][3]))
                {
                    diagonal_markers[2] = 1;
                }  else if (Object.Equals(ball, columns[4][4]))
                {
                    diagonal_markers[3] = 1;
                }
            }

            return IsWinner(diagonal_markers);
        }

        public bool SecondaryDiagonalWin(List<int> ballots, List<int[]> columns)
        {
            int[] diagonal_markers = { 0, 0, 0, 0 };

            foreach (int ball in ballots)
            {
                if (Object.Equals(ball, columns[4][0]))
                {
                    diagonal_markers[0] = 1;
                } else if (Object.Equals(ball, columns[3][1]))
                {
                    diagonal_markers[1] = 1;
                } else if (Object.Equals(ball, columns[1][3]))
                {
                    diagonal_markers[2] = 1;
                } else if (Object.Equals(ball, columns[0][4]))
                {
                    diagonal_markers[3] = 1;
                }
            }

            return IsWinner(diagonal_markers);
        }

        public bool HorizontalWin(List<int> ballots, List<int[]> columns)
        {
            int[] horizontalArr = new int[5];
            int[] bingoRow = new int[5];

            for(int j = 0; j < 5; j++)
            {
                Array.Fill(horizontalArr, 0);

                for(int i = 0; i < 5; i++)
                {
                    bingoRow[i] = columns[i][j];
                }

                foreach (int ball in ballots)
                {
                    if (Object.Equals(ball, bingoRow[0]))
                    {
                        horizontalArr[0] = 1;
                    } else if (Object.Equals(ball, bingoRow[1]))
                    {
                        horizontalArr[1] = 1;
                    } else if (Object.Equals(ball, bingoRow[3]))
                    {
                        horizontalArr[3] = 1;
                    } else if (Object.Equals(ball, bingoRow[4]))
                    {
                        horizontalArr[4] = 1;
                    } else if ((Object.Equals(ball, bingoRow[2])) || (Object.Equals(0, bingoRow[2])))
                    {
                        horizontalArr[2] = 1;
                    }
                }

                if (IsWinner(horizontalArr))
                {
                    return true;
                }
            }

            return false;
        }

        public bool VerticalWin(List<int> ballots, List<int[]> columns)
        {
            int[] verticalArr = new int[5];

            for (int i = 0; i < 5; i++)
            {
                Array.Fill(verticalArr, 0);

                foreach (int ball in ballots)
                {
                    if (Object.Equals(ball, columns[j][0]))
                    {
                        verticalArr[0] = 1;
                    } else if (Object.Equals(ball, columns[j][1]))
                    {
                        verticalArr[1] = 1;
                    } else if (Object.Equals(ball, columns[j][3]))
                    {
                        verticalArr[3] = 1;
                    } else if (Object.Equals(ball, columns[j][4]))
                    {
                        verticalArr[4] = 1;
                    } else if ((Object.Equals(ball, columns[j][2])) || (Object.Equals(0, columns[j][2])))
                    {
                        verticalArr[2] = 1;
                    }
                }

                if (IsWinner(verticalArr))
                {
                    return true;
                }
            }

            return false;
        }

        private bool IsWinner(int[] markers)
        {
            foreach(int i in markers)
            {
                if(i == 0)
                {
                    return false;
                }
            }

            return true;
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