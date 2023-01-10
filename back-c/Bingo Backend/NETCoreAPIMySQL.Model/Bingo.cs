using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Model
{
    public class Bingo
    {
        public int Id { get; set; }

        public string Cards_id { get; set; }

        public string Gamers_id { get; set; }

        public bool Game_state { get; set; }

        public string Winner_id { get; set; }
    }
}
