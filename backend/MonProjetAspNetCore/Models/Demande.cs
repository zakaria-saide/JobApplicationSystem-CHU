using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MonProjetAspNetCore.Models
{
    public class Demande
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("ID")]
        public int ID { get; set; } // Primary Key

        [Column("USERID")]
        public int USERID { get; set; } // Foreign Key

        [Column("ID_CANDIDATURE")]
        public int ID_CANDIDATURE { get; set; } // Foreign Key

        [Column("NOM")]
        public string? NOM { get; set; }

        [Column("PRENOM")]
        public string? PRENOM { get; set; }

        [Column("DEMANDEMANUSCRITE")]
        public byte[]? DEMANDEMANUSCRITE { get; set; }

        [Column("COPIEDIPLOME")]
        public byte[]? COPIEDIPLOME { get; set; }

        [Column("COPIECARTEIDENTITERECTO")]
        public byte[]? COPIECARTEIDENTITERECTO { get; set; }

        [Column("COPIECARTEIDENTITEVERSO")]
        public byte[]? COPIECARTEIDENTITEVERSO { get; set; }

        [Column("COPIEATTESTATIONHANDICAP")]
        public byte[]? COPIEATTESTATIONHANDICAP { get; set; }

        [Column("COPIEATTESTATIONSTATUT")]
        public byte[]? COPIEATTESTATIONSTATUT { get; set; }

        [Column("COPIEARRETEEQUIVALENCEDIPLOME")]
        public byte[]? COPIEARRETEEQUIVALENCEDIPLOME { get; set; }

        [Column("AUTORISATIONONCOURS")]
        public byte[]? AUTORISATIONONCOURS { get; set; }

        [Column("DATEPOSTULATION")]
        public DateTime DATEPOSTULATION { get; set; }

        [Column("VALIDATION")]
        public string? VALIDATION { get; set; }

        [Column("ETAT")]
        public int? ETAT { get; set; }

        
        [ForeignKey("USERID")]
        public Utilisateur Utilisateur { get; set; }

        [ForeignKey("ID_CANDIDATURE")]
        public Candidature Candidature { get; set; }
    }
}
