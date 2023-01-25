﻿using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.service
{
    public interface IBallotsObtainedRepository
    {
        public Task<int> GetOneBallot();

        public Task<bool> UpdateBallots(BallotsObtained ballotsobtained);

        public Task<IEnumerable<BallotsObtained>> FindByGameId(int gameId);

        public Task<IEnumerable<BallotsObtained>> GetAllBallotsObtained();
    }
}