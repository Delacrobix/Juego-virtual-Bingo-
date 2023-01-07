using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Model
{
    public class Bingo
    {
        public int id { get; set; }
        public int game_number { get; set; }
        public string id_cards { get; set; }
        public string id_gamers { get; set; }
        public bool game_state { get; set; }
        public string winner_id { get; set; }
    }
}
