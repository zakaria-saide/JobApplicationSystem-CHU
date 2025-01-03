using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MonProjetAspNetCore.Data;
using Oracle.ManagedDataAccess.Client; // Ensure this is added
using MonProjetAspNetCore.Models;
using System;

namespace MonProjetAspNetCore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CandidatureController : ControllerBase
    {
        private readonly OracleDbContext _context;

        public CandidatureController(OracleDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CreateCandidature([FromBody] Candidature candidature)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                _context.Candidatures.Add(candidature);
                _context.SaveChanges();

                return StatusCode(StatusCodes.Status200OK, "Candidature créée avec succès.");
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, $"Erreur lors de l'enregistrement de la candidature. Détails : {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Une erreur inattendue est survenue. Détails : {ex.Message}");
            }
        }



  
[HttpGet]
[Authorize]
public async Task<ActionResult> GetCandidatureByProfession(string profession)
{
    var userId = GetUserIdFromToken();
    if (userId == null)
    {
        return Unauthorized(new { message = "User ID not found in token" });
    }

    try
    {
        var candidature = await _context.Candidatures
            .FirstOrDefaultAsync(c => c.PROFESSION.ToLower() == profession.ToLower());

        if (candidature == null)
        {
            return NotFound(new { message = "No candidature found for the specified profession" });
        }

        // var demande = await _context.Demandes
        //     .FirstOrDefaultAsync(d => d.USERID == userId && d.ID_CANDIDATURE == candidature.ID_CANDIDATURE);

        // if (demande != null)
        // {
        //     string message;
        //     int validationStatus;
        //     switch (demande.VALIDATION)
        //     {
        //         case null:
        //             message = "L'utilisateur a déjà une demande, mais elle est en attente de validation.";
        //             validationStatus = 0;
        //             break;
        //         case "Accepte":
        //             message = "L'utilisateur a déjà une demande, et elle a été acceptée.";
        //             validationStatus = 1;
        //             break;
        //         case "Refuse":
        //             message = "L'utilisateur a déjà une demande, mais elle a été refusée.";
        //             validationStatus = -1;
        //             break;
        //         default:
        //             message = "L'utilisateur a déjà une demande, mais l'état de validation est inconnu.";
        //             validationStatus = 0;
        //             break;
        //     }
        //     return Ok(new { candidature, message, validationStatus });
        // }

        return Ok(new { candidature });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Internal server error.", error = ex.Message });
    }
}

[HttpGet("GetDemandeByUserId")]
        public async Task<IActionResult> GetDemandeByUserId()
        {
            var claims = User.Claims.ToList();
            var userIdClaim = claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
            {
                return Unauthorized(new { message = "User ID not found in token" });
            }

            if (!int.TryParse(userIdClaim.Value, out int userId))
            {
                return BadRequest(new { message = "Invalid user ID in token" });
            }

            try
            {
                var demande = await _context.Demandes
                    .AsNoTracking()
                    .Where(d => d.USERID == userId )
                    .Select(d => new
                    {
                        d.ID,
                        d.USERID,
                        d.ID_CANDIDATURE,
                        d.NOM,
                        d.PRENOM,
                        d.DEMANDEMANUSCRITE,
                        d.COPIEDIPLOME,
                        d.COPIECARTEIDENTITERECTO,
                        d.COPIECARTEIDENTITEVERSO,
                        d.COPIEATTESTATIONHANDICAP,
                        d.COPIEATTESTATIONSTATUT,
                        d.COPIEARRETEEQUIVALENCEDIPLOME,
                        d.AUTORISATIONONCOURS,
                        d.DATEPOSTULATION,
                        d.VALIDATION,
                        d.ETAT
                    })
                    .FirstOrDefaultAsync();

                if (demande == null)
                {
                    return NotFound(new { message = "Demand not found or not in the required state." });
                }

                var candidature = await _context.Candidatures
                    .AsNoTracking()
                    .FirstOrDefaultAsync(c => c.ID_CANDIDATURE == demande.ID_CANDIDATURE);

                if (candidature == null)
                {
                    return NotFound(new { message = "Associated candidature not found." });
                }

                string message;
                int validationStatus;
                switch (demande.VALIDATION)
                {
                    case "Accepte":
                        message = "The user's demand has been accepted.";
                        validationStatus = 1;
                        break;
                    case "Refuse":
                        message = "The user's demand has been refused.";
                        validationStatus = -1;
                        break;
                    default:
                        message = "The user's demand validation status is unknown.";
                        validationStatus = 0;
                        break;
                }

                return Ok(new { demande, candidature, message, validationStatus });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while processing your request", error = ex.Message });
            }
        }
private int? GetUserIdFromToken()
{
    var claims = User.Claims;
    var userIdClaim = claims.FirstOrDefault(c => c.Type == "UserId");
    if (userIdClaim == null)
    {
        return null;
    }

    Console.WriteLine($"User ID Claim: {userIdClaim.Value}");

    if (!int.TryParse(userIdClaim.Value, out int userId))
    {
        return null;
    }

    return userId;
}

[HttpDelete("{id}")]
public async Task<IActionResult> DeleteCandidature(int id)
{
    using var transaction = await _context.Database.BeginTransactionAsync();
    try
    {
        // Find the Candidature and its related Demandes
        var candidature = await _context.Candidatures
            .Include(c => c.Demandes)
            .FirstOrDefaultAsync(c => c.ID_CANDIDATURE == id);

        if (candidature == null)
        {
            return NotFound(new { message = "Candidature not found" });
        }

        // Delete related Demandes
        _context.Demandes.RemoveRange(candidature.Demandes);

        // Delete the Candidature
        _context.Candidatures.Remove(candidature);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return NoContent();
    }
    catch (Exception ex)
    {
        await transaction.RollbackAsync();
        return StatusCode(500, new { message = "Internal server error", error = ex.Message });
    }
}



[HttpGet("all")]
public async Task<ActionResult<IEnumerable<Candidature>>> GetAllCandidatures()
{
    try
    {
        var candidatures = await _context.Candidatures
            .Select(c => new Candidature
            {
                ID_CANDIDATURE = c.ID_CANDIDATURE,
                PROFESSION = c.PROFESSION,
                DATEDEPART = DateTime.SpecifyKind(c.DATEDEPART, DateTimeKind.Utc),
                DATEFIN = DateTime.SpecifyKind(c.DATEFIN, DateTimeKind.Utc),
                TITRE = c.TITRE
            })
            .ToListAsync();

        return Ok(candidatures);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Internal server error.", error = ex.Message });
    }
}

        
       
    
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidature(int id, [FromBody] UpdateCandidatureDto updatedCandidatureDto)
        {
            if (!ModelState.IsValid)
    {
        var errors = ModelState
            .SelectMany(x => x.Value.Errors.Select(e => e.ErrorMessage))
            .ToList();

        // Log the model state errors
        Console.WriteLine("ModelState Errors:");
        foreach (var state in ModelState)
        {
            foreach (var error in state.Value.Errors)
            {
                Console.WriteLine($"Key: {state.Key}, Error: {error.ErrorMessage}");
            }
        }

        return BadRequest(new { message = "Validation errors", errors });
    }

            try
            {
                var existingCandidature = await _context.Candidatures.FindAsync(id);
                if (existingCandidature == null)
                {
                    return NotFound(new { message = "Candidature not found." });
                }

                // Update the properties of the existing candidature with the new values
                existingCandidature.PROFESSION = updatedCandidatureDto.PROFESSION;
                existingCandidature.DATEDEPART = updatedCandidatureDto.DATEDEPART;
                existingCandidature.DATEFIN = updatedCandidatureDto.DATEFIN;
                existingCandidature.TITRE = updatedCandidatureDto.TITRE;

                // Save the changes to the database
                await _context.SaveChangesAsync();

                return Ok(new { message = "Candidature updated successfully." });
            }
            catch (DbUpdateException ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, $"Erreur lors de la mise à jour de la candidature. Détails : {ex.Message}");
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Une erreur inattendue est survenue. Détails : {ex.Message}");
            }
        }

            public class UpdateCandidatureDto
        {
            public int ID_CANDIDATURE { get; set; }
            public string PROFESSION { get; set; }
            public DateTime DATEDEPART { get; set; }
            public DateTime DATEFIN { get; set; }
            public string TITRE { get; set; }
        }

    }
}