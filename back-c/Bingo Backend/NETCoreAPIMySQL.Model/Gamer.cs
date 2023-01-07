using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Model
{
    public class Gamer
    {
        public int id { get; set; }
        public int id_gamer { get; set; }
        public string id_mongo { get; set; }
        public int game_number { get; set; }
        public string gamer_ballots { get; set; }
    }
}
