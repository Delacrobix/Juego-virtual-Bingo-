﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Data
{
    public class MySQLConfiguration
    {
        public MySQLConfiguration(string connectionString)
        {
            connecionString = connectionString;
        }
       
       public string connecionString { get; set; }
    }
}
