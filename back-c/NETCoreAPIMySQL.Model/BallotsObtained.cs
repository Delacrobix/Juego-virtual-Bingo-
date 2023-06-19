using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NETCoreAPIMySQL.Model
{
    public class BallotsObtained
    {
        public int Id { get; set; }

        public int Game_id { get; set; } //GAME_ID == GAME_NUMBER

        public string Ballots { get; set; }

        public BallotsObtained()
        {
            Ballots = string.Empty;
        }
    }
}
