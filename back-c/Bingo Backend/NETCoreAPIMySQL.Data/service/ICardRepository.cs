﻿using NETCoreAPIMySQL.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data.service
{
    public interface ICardRepository
    {
        public Task<Card> FindByGamerId(int Id);
    }
}
