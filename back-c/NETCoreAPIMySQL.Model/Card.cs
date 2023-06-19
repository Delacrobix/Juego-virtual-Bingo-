using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Model
{
    public class Card
    {
        public int Id { get; set; }

        public int B_id { get; set; }

        public int I_id { get; set; }

        public int N_id { get; set; }

        public int G_id { get; set; }

        public int O_id { get; set; }

        public int Gamer_id { get; set; }

        public int Game_id { get; set; } //GAME_ID == GAME_NUMBER
    }
}
