using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Model
{
    public class Card
    {
        public int id { get; set; }
        public int id_card { get; set; }
        public int B_id { get; set; }
        public int I_id { get; set; }
        public int N_id { get; set; }
        public int G_id { get; set; }
        public int O_id { get; set; }
        public int id_gamer { get; set; }
        public int game_number { get; set; }
    }
}
