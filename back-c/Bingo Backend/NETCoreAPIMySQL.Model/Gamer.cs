using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Model
{
    public class Gamer
    {
        public int Id { get; set; }

        public string Mongo_id { get; set; } //Cadena id enviada desde mongoDB

        public int Game_id { get; set; }

        public string Gamer_ballots { get; set; }

        public Gamer()
        {
            Mongo_id = string.Empty;
            Gamer_ballots= string.Empty;
        }
    }
}