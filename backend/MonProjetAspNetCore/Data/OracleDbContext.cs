using Microsoft.EntityFrameworkCore;
using MonProjetAspNetCore.Models;

namespace MonProjetAspNetCore.Data
{
    public class OracleDbContext : DbContext
    {
        public OracleDbContext(DbContextOptions<OracleDbContext> options) : base(options) { }

        public DbSet<Demande> Demandes { get; set; }
        public DbSet<Utilisateur> Utilisateurs { get; set; }
        public DbSet<Candidature> Candidatures { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Define table names in uppercase
            modelBuilder.Entity<Demande>().ToTable("DEMANDE");
            modelBuilder.Entity<Utilisateur>().ToTable("UTILISATEUR");
            modelBuilder.Entity<Candidature>().ToTable("CANDIDATURE");

            // Define primary keys
            modelBuilder.Entity<Candidature>()
                .HasKey(c => c.ID_CANDIDATURE);

            modelBuilder.Entity<Demande>()
                .HasKey(d => d.ID);

            // Configure relationships
            modelBuilder.Entity<Demande>()
                .HasOne(d => d.Utilisateur)
                .WithMany(u => u.Demandes)
                .HasForeignKey(d => d.USERID);

            modelBuilder.Entity<Demande>()
                .HasOne(d => d.Candidature)
                .WithMany(c => c.Demandes)
                .HasForeignKey(d => d.ID_CANDIDATURE);

            // Configure USERID as an identity column
            modelBuilder.Entity<Utilisateur>()
                .Property(u => u.USERID)
                .UseIdentityColumn();

            // Explicitly configure the columns for Utilisateur
            modelBuilder.Entity<Utilisateur>()
                .Property(u => u.IsEmailVerified)
                .HasColumnType("NUMBER(1)")
                .HasConversion(
                    v => v ? 1 : 0,
                    v => v == 1);

            modelBuilder.Entity<Utilisateur>()
                .Property(u => u.EmailToken)
                .HasColumnType("VARCHAR2(255)");

            // Explicitly configure the BLOB columns for Demande
            modelBuilder.Entity<Demande>()
                .Property(d => d.DEMANDEMANUSCRITE)
                .HasColumnType("BLOB");

            modelBuilder.Entity<Demande>()
                .Property(d => d.COPIEDIPLOME)
                .HasColumnType("BLOB");

            modelBuilder.Entity<Demande>()
                .Property(d => d.COPIECARTEIDENTITERECTO)
                .HasColumnType("BLOB");

            modelBuilder.Entity<Demande>()
                .Property(d => d.COPIECARTEIDENTITEVERSO)
                .HasColumnType("BLOB");

            modelBuilder.Entity<Demande>()
                .Property(d => d.COPIEATTESTATIONHANDICAP)
                .HasColumnType("BLOB")
                .HasDefaultValueSql("NULL");

            modelBuilder.Entity<Demande>()
                .Property(d => d.COPIEATTESTATIONSTATUT)
                .HasColumnType("BLOB")
                .HasDefaultValueSql("NULL");

            modelBuilder.Entity<Demande>()
                .Property(d => d.COPIEARRETEEQUIVALENCEDIPLOME)
                .HasColumnType("BLOB")
                .HasDefaultValueSql("NULL");

            modelBuilder.Entity<Demande>()
                .Property(d => d.AUTORISATIONONCOURS)
                .HasColumnType("BLOB")
                .HasDefaultValueSql("NULL");

            // Explicitly configure other columns if needed
            modelBuilder.Entity<Demande>()
                .Property(d => d.DATEPOSTULATION)
                .HasColumnType("DATE");

            modelBuilder.Entity<Demande>()
                .Property(d => d.NOM)
                .HasColumnType("VARCHAR2(100)");

            modelBuilder.Entity<Demande>()
                .Property(d => d.PRENOM)
                .HasColumnType("VARCHAR2(100)");

            modelBuilder.Entity<Demande>()
                .Property(d => d.VALIDATION)
                .HasColumnType("VARCHAR2(10)");
        }
    }
}

