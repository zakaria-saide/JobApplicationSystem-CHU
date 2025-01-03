using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MonProjetAspNetCore.Models
{
    public class Candidature
    {
        [Key]
        [Column("ID_CANDIDATURE")]
        public int ID_CANDIDATURE { get; set; } // Primary Key

        [Column("PROFESSION")]
        public string PROFESSION { get; set; }

        [Column("DATEDEPART")]
        public DateTime DATEDEPART { get; set; }

        [Column("DATEFIN")]
        public DateTime DATEFIN { get; set; }

        [Column("TITRE")]
        public string TITRE { get; set; }

        [NotMapped]
        public ICollection<Demande> Demandes { get; set; }
    }
}
