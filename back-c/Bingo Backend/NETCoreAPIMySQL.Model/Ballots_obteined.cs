using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Model
{
    public class Ballots_obteined
    {
        public int id { get; set; }
        public int game_number { get; set; }
        public string ballots { get; set; }
    }
}
