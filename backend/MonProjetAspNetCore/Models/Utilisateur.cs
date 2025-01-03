using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MonProjetAspNetCore.Models
{
    public class Utilisateur
    {
        [Key]
        [Column("USERID")]
        public int USERID { get; set; } // Primary Key

        [Column("EMAIL")]
        public string EMAIL { get; set; }

        [Column("PASSWORDHASH")]
        public string PASSWORDHASH { get; set; }

        [Column("ROLE")]
        public string ROLE { get; set; }

        [Column("ISEMAILVERIFIED")]
        public bool IsEmailVerified { get; set; } // Indicates if the email is verified

        [Column("EMAILTOKEN")]
        public string? EmailToken { get; set; } // Token used for email verification

        
        public ICollection<Demande>? Demandes { get; set; }
    }
}
