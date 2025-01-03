using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MonProjetAspNetCore.Data;
using MonProjetAspNetCore.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;


namespace MonProjetAspNetCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemandesController : ControllerBase
    {
        private readonly OracleDbContext _context;

        public DemandesController(OracleDbContext context)
        {
            _context = context;
        }

[HttpPost]
[Consumes("multipart/form-data")]
public async Task<IActionResult> PostDemande([FromForm] DemandeDto demandeDto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    var claims = User.Claims.ToList();
    foreach (var claim in claims)
    {
        Console.WriteLine($"{claim.Type}: {claim.Value}");
    }

    var userIdClaim = claims.FirstOrDefault(c => c.Type == "UserId");
    if (userIdClaim == null)
    {
        return Unauthorized(new { message = "User ID not found in token" });
    }

    Console.WriteLine($"User ID Claim: {userIdClaim.Value}");

    if (!int.TryParse(userIdClaim.Value, out int userId))
    {
        return BadRequest(new { message = "Invalid user ID in token" });
    }

    try
    {
        var existingDemande = await _context.Demandes.FirstOrDefaultAsync(d => d.USERID == userId);
        if (existingDemande != null)
        {
            existingDemande.ID_CANDIDATURE = demandeDto.ID_CANDIDATURE != 0 ? demandeDto.ID_CANDIDATURE : existingDemande.ID_CANDIDATURE;
            existingDemande.NOM = demandeDto.NOM ?? existingDemande.NOM;
            existingDemande.PRENOM = demandeDto.PRENOM ?? existingDemande.PRENOM;
            if (demandeDto.DEMANDEMANUSCRITE != null) 
                existingDemande.DEMANDEMANUSCRITE = await ConvertToByteArray(demandeDto.DEMANDEMANUSCRITE);
            if (demandeDto.COPIEDIPLOME != null) 
                existingDemande.COPIEDIPLOME = await ConvertToByteArray(demandeDto.COPIEDIPLOME);
            if (demandeDto.COPIECARTEIDENTITERECTO != null) 
                existingDemande.COPIECARTEIDENTITERECTO = await ConvertToByteArray(demandeDto.COPIECARTEIDENTITERECTO);
            if (demandeDto.COPIECARTEIDENTITEVERSO != null) 
                existingDemande.COPIECARTEIDENTITEVERSO = await ConvertToByteArray(demandeDto.COPIECARTEIDENTITEVERSO);
            if (demandeDto.COPIEATTESTATIONHANDICAP != null) 
                existingDemande.COPIEATTESTATIONHANDICAP = await ConvertToByteArray(demandeDto.COPIEATTESTATIONHANDICAP);
            if (demandeDto.COPIEATTESTATIONSTATUT != null) 
                existingDemande.COPIEATTESTATIONSTATUT = await ConvertToByteArray(demandeDto.COPIEATTESTATIONSTATUT);
            if (demandeDto.COPIEARRETEEQUIVALENCEDIPLOME != null) 
                existingDemande.COPIEARRETEEQUIVALENCEDIPLOME = await ConvertToByteArray(demandeDto.COPIEARRETEEQUIVALENCEDIPLOME);
            if (demandeDto.AUTORISATIONONCOURS != null) 
                existingDemande.AUTORISATIONONCOURS = await ConvertToByteArray(demandeDto.AUTORISATIONONCOURS);
            existingDemande.DATEPOSTULATION = DateTime.Now;
            existingDemande.VALIDATION = null;
            existingDemande.ETAT = 1;

            _context.Entry(existingDemande).State = EntityState.Modified;
        }
        else
        {
            var newDemande = new Demande
            {
                USERID = userId,
                ID_CANDIDATURE = demandeDto.ID_CANDIDATURE,
                NOM = demandeDto.NOM,
                PRENOM = demandeDto.PRENOM,
                DEMANDEMANUSCRITE = demandeDto.DEMANDEMANUSCRITE != null ? await ConvertToByteArray(demandeDto.DEMANDEMANUSCRITE) : null,
                COPIEDIPLOME = demandeDto.COPIEDIPLOME != null ? await ConvertToByteArray(demandeDto.COPIEDIPLOME) : null,
                COPIECARTEIDENTITERECTO = demandeDto.COPIECARTEIDENTITERECTO != null ? await ConvertToByteArray(demandeDto.COPIECARTEIDENTITERECTO) : null,
                COPIECARTEIDENTITEVERSO = demandeDto.COPIECARTEIDENTITEVERSO != null ? await ConvertToByteArray(demandeDto.COPIECARTEIDENTITEVERSO) : null,
                COPIEATTESTATIONHANDICAP = demandeDto.COPIEATTESTATIONHANDICAP != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONHANDICAP) : null,
                COPIEATTESTATIONSTATUT = demandeDto.COPIEATTESTATIONSTATUT != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONSTATUT) : null,
                COPIEARRETEEQUIVALENCEDIPLOME = demandeDto.COPIEARRETEEQUIVALENCEDIPLOME != null ? await ConvertToByteArray(demandeDto.COPIEARRETEEQUIVALENCEDIPLOME) : null,
                AUTORISATIONONCOURS = demandeDto.AUTORISATIONONCOURS != null ? await ConvertToByteArray(demandeDto.AUTORISATIONONCOURS) : null,
                DATEPOSTULATION = DateTime.Now,
                VALIDATION = null,
                ETAT = 1
            };

            _context.Demandes.Add(newDemande);
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Demande created or updated successfully" });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "An error occurred while processing your request", error = ex.Message });
    }
}



//         [HttpPost]
// [Consumes("multipart/form-data")]
// public async Task<IActionResult> PostDemande([FromForm] DemandeDto demandeDto)
// {
//     if (!ModelState.IsValid)
//     {
//         return BadRequest(ModelState);
//     }

//     var claims = User.Claims.ToList();
//     foreach (var claim in claims)
//     {
//         Console.WriteLine($"{claim.Type}: {claim.Value}");
//     }

//     var userIdClaim = claims.FirstOrDefault(c => c.Type == "UserId");
//     if (userIdClaim == null)
//     {
//         return Unauthorized(new { message = "User ID not found in token" });
//     }

//     Console.WriteLine($"User ID Claim: {userIdClaim.Value}");

//     if (!int.TryParse(userIdClaim.Value, out int userId))
//     {
//         return BadRequest(new { message = "Invalid user ID in token" });
//     }

//     try
//     {
//         // Check if a demand already exists for the user
//         var existingDemande = await _context.Demandes.FirstOrDefaultAsync(d => d.USERID == userId);
//         if (existingDemande != null)
//         {
//             // Update the existing demand with the new data
//             existingDemande.ID_CANDIDATURE = demandeDto.ID_CANDIDATURE;
//             existingDemande.NOM = demandeDto.NOM ?? existingDemande.NOM;
//             existingDemande.PRENOM = demandeDto.PRENOM ?? existingDemande.PRENOM;
//             existingDemande.DEMANDEMANUSCRITE = demandeDto.DEMANDEMANUSCRITE != null ? await ConvertToByteArray(demandeDto.DEMANDEMANUSCRITE) : existingDemande.DEMANDEMANUSCRITE;
//             existingDemande.COPIEDIPLOME = demandeDto.COPIEDIPLOME != null ? await ConvertToByteArray(demandeDto.COPIEDIPLOME) : existingDemande.COPIEDIPLOME;
//             existingDemande.COPIECARTEIDENTITERECTO = demandeDto.COPIECARTEIDENTITERECTO != null ? await ConvertToByteArray(demandeDto.COPIECARTEIDENTITERECTO) : existingDemande.COPIECARTEIDENTITERECTO;
//             existingDemande.COPIECARTEIDENTITEVERSO = demandeDto.COPIECARTEIDENTITEVERSO != null ? await ConvertToByteArray(demandeDto.COPIECARTEIDENTITEVERSO) : existingDemande.COPIECARTEIDENTITEVERSO;
//             existingDemande.COPIEATTESTATIONHANDICAP = demandeDto.COPIEATTESTATIONHANDICAP != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONHANDICAP) : existingDemande.COPIEATTESTATIONHANDICAP;
//             existingDemande.COPIEATTESTATIONSTATUT = demandeDto.COPIEATTESTATIONSTATUT != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONSTATUT) : existingDemande.COPIEATTESTATIONSTATUT;
//             existingDemande.COPIEARRETEEQUIVALENCEDIPLOME = demandeDto.COPIEARRETEEQUIVALENCEDIPLOME != null ? await ConvertToByteArray(demandeDto.COPIEARRETEEQUIVALENCEDIPLOME) : existingDemande.COPIEARRETEEQUIVALENCEDIPLOME;
//             existingDemande.AUTORISATIONONCOURS = demandeDto.AUTORISATIONONCOURS != null ? await ConvertToByteArray(demandeDto.AUTORISATIONONCOURS) : existingDemande.AUTORISATIONONCOURS;
//             existingDemande.DATEPOSTULATION = DateTime.Now;
//             existingDemande.VALIDATION = null; // Set VALIDATION to null explicitly
//             existingDemande.ETAT = 1;

//             _context.Entry(existingDemande).State = EntityState.Modified;
//         }
//         else
//         {
//             // Create a new demand if one does not already exist
//             var newDemande = new Demande
//             {
//                 USERID = userId,
//                 ID_CANDIDATURE = demandeDto.ID_CANDIDATURE,
//                 NOM = demandeDto.NOM,
//                 PRENOM = demandeDto.PRENOM,
//                 DEMANDEMANUSCRITE = await ConvertToByteArray(demandeDto.DEMANDEMANUSCRITE),
//                 COPIEDIPLOME = await ConvertToByteArray(demandeDto.COPIEDIPLOME),
//                 COPIECARTEIDENTITERECTO = await ConvertToByteArray(demandeDto.COPIECARTEIDENTITERECTO),
//                 COPIECARTEIDENTITEVERSO = await ConvertToByteArray(demandeDto.COPIECARTEIDENTITEVERSO),
//                 COPIEATTESTATIONHANDICAP = demandeDto.COPIEATTESTATIONHANDICAP != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONHANDICAP) : null,
//                 COPIEATTESTATIONSTATUT = demandeDto.COPIEATTESTATIONSTATUT != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONSTATUT) : null,
//                 COPIEARRETEEQUIVALENCEDIPLOME = demandeDto.COPIEARRETEEQUIVALENCEDIPLOME != null ? await ConvertToByteArray(demandeDto.COPIEARRETEEQUIVALENCEDIPLOME) : null,
//                 AUTORISATIONONCOURS = demandeDto.AUTORISATIONONCOURS != null ? await ConvertToByteArray(demandeDto.AUTORISATIONONCOURS) : null,
//                 DATEPOSTULATION = DateTime.Now,
//                 VALIDATION = null, // Set VALIDATION to null explicitly
//                 ETAT = 1
//             };

//             _context.Demandes.Add(newDemande);
//         }

//         await _context.SaveChangesAsync();

//         return Ok(new { message = "Demande created or updated successfully" });
//     }
//     catch (Exception ex)
//     {
//         return StatusCode(500, new { message = "An error occurred while processing your request", error = ex.Message });
//     }
// }


    

        private async Task<byte[]> ConvertToByteArray(IFormFile file)
        {
            if (file == null) return null;

            using var memoryStream = new MemoryStream();
            await file.CopyToAsync(memoryStream);
            var fileData = memoryStream.ToArray();

            Console.WriteLine($"File {file.FileName} size: {fileData.Length} bytes");

            return fileData;
        }

        // private async Task<byte[]> ConvertToByteArray(IFormFile file)
        // {
        //     if (file == null) return null;

        //     using var memoryStream = new MemoryStream();
        //     await file.CopyToAsync(memoryStream);
        //     var fileData = memoryStream.ToArray();

        //     Console.WriteLine($"File {file.FileName} size: {fileData.Length} bytes");

        //     return fileData;
        // }
          
        [HttpPut("UpdateValidation/{id}")]
public async Task<IActionResult> UpdateValidation(int id, [FromBody] UpdateValidationDto updateValidationDto)
{
        Console.WriteLine($"Received UpdateValidation request for id: {id}, validation: {updateValidationDto.Validation}");

    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    try
    {
        // Log the id and validation status
        Console.WriteLine($"Received UpdateValidation request for id: {id}, validation: {updateValidationDto.Validation}");

        var demande = await _context.Demandes.FindAsync(id);
        if (demande == null)
        {
            // Log if not found
            Console.WriteLine($"Demand with id {id} not found.");
            return NotFound(new { message = "Demand not found." });
        }

        demande.VALIDATION = updateValidationDto.Validation;
        await _context.SaveChangesAsync();

        // Log success
        Console.WriteLine($"Validation status for id {id} updated successfully.");
        return Ok(new { message = "Validation status updated successfully." });
    }
    catch (DbUpdateException ex)
    {
        // Log database update exception
        Console.WriteLine($"Error updating validation status for id {id}. Details: {ex.Message}");
        return StatusCode(StatusCodes.Status400BadRequest, $"Error updating validation status. Details: {ex.Message}");
    }
    catch (Exception ex)
    {
        // Log unexpected exceptions
        Console.WriteLine($"Unexpected error for id {id}. Details: {ex.Message}");
        return StatusCode(StatusCodes.Status500InternalServerError, $"An unexpected error occurred. Details: {ex.Message}");
    }
}

        public class UpdateValidationDto
        {
            public string Validation { get; set; }
        }

  [HttpGet]
public async Task<IActionResult> GetDemandes(int iD_CANDIDATURE)
{
    try
    {
        var demandes = await _context.Demandes
            .Where(d => d.ID_CANDIDATURE == iD_CANDIDATURE && d.VALIDATION == null)
            .ToListAsync();

        return Ok(demandes);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "An error occurred while fetching demands", error = ex.Message });
    }
}

[HttpPost("SaveDraft")]
[Consumes("multipart/form-data")]
public async Task<IActionResult> SaveDraft([FromForm] DemandeDraft demandeDto)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

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
        // Check if a demand already exists for the user
        var existingDemande = await _context.Demandes.FirstOrDefaultAsync(d => d.USERID == userId);
        if (existingDemande != null)
        {
            // Update the existing demand with the new data
            existingDemande.ID_CANDIDATURE = demandeDto.ID_CANDIDATURE; // Default value if null
            existingDemande.NOM = demandeDto.NOM ?? existingDemande.NOM;
            existingDemande.PRENOM = demandeDto.PRENOM ?? existingDemande.PRENOM;
            existingDemande.DEMANDEMANUSCRITE = demandeDto.DEMANDEMANUSCRITE != null ? await ConvertToByteArray(demandeDto.DEMANDEMANUSCRITE) : existingDemande.DEMANDEMANUSCRITE;
            existingDemande.COPIEDIPLOME = demandeDto.COPIEDIPLOME != null ? await ConvertToByteArray(demandeDto.COPIEDIPLOME) : existingDemande.COPIEDIPLOME;
            existingDemande.COPIECARTEIDENTITERECTO = demandeDto.COPIECARTEIDENTITERECTO != null ? await ConvertToByteArray(demandeDto.COPIECARTEIDENTITERECTO) : existingDemande.COPIECARTEIDENTITERECTO;
            existingDemande.COPIECARTEIDENTITEVERSO = demandeDto.COPIECARTEIDENTITEVERSO != null ? await ConvertToByteArray(demandeDto.COPIECARTEIDENTITEVERSO) : existingDemande.COPIECARTEIDENTITEVERSO;
            existingDemande.COPIEATTESTATIONHANDICAP = demandeDto.COPIEATTESTATIONHANDICAP != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONHANDICAP) : existingDemande.COPIEATTESTATIONHANDICAP;
            existingDemande.COPIEATTESTATIONSTATUT = demandeDto.COPIEATTESTATIONSTATUT != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONSTATUT) : existingDemande.COPIEATTESTATIONSTATUT;
            existingDemande.COPIEARRETEEQUIVALENCEDIPLOME = demandeDto.COPIEARRETEEQUIVALENCEDIPLOME != null ? await ConvertToByteArray(demandeDto.COPIEARRETEEQUIVALENCEDIPLOME) : existingDemande.COPIEARRETEEQUIVALENCEDIPLOME;
            existingDemande.AUTORISATIONONCOURS = demandeDto.AUTORISATIONONCOURS != null ? await ConvertToByteArray(demandeDto.AUTORISATIONONCOURS) : existingDemande.AUTORISATIONONCOURS;
            existingDemande.DATEPOSTULATION = DateTime.Now;
            existingDemande.VALIDATION = null; // Not validated yet
            

            _context.Entry(existingDemande).State = EntityState.Modified;
        }
        else
        {
            // Create a new demand if one does not already exist
            var newDemande = new Demande
            {
                USERID = userId,
                ID_CANDIDATURE = demandeDto.ID_CANDIDATURE, // Default value if null
                NOM = demandeDto.NOM,
                PRENOM = demandeDto.PRENOM,
                DEMANDEMANUSCRITE = demandeDto.DEMANDEMANUSCRITE != null ? await ConvertToByteArray(demandeDto.DEMANDEMANUSCRITE) : null,
                COPIEDIPLOME = demandeDto.COPIEDIPLOME != null ? await ConvertToByteArray(demandeDto.COPIEDIPLOME) : null,
                COPIECARTEIDENTITERECTO = demandeDto.COPIECARTEIDENTITERECTO != null ? await ConvertToByteArray(demandeDto.COPIECARTEIDENTITERECTO) : null,
                COPIECARTEIDENTITEVERSO = demandeDto.COPIECARTEIDENTITEVERSO != null ? await ConvertToByteArray(demandeDto.COPIECARTEIDENTITEVERSO) : null,
                COPIEATTESTATIONHANDICAP = demandeDto.COPIEATTESTATIONHANDICAP != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONHANDICAP) : null,
                COPIEATTESTATIONSTATUT = demandeDto.COPIEATTESTATIONSTATUT != null ? await ConvertToByteArray(demandeDto.COPIEATTESTATIONSTATUT) : null,
                COPIEARRETEEQUIVALENCEDIPLOME = demandeDto.COPIEARRETEEQUIVALENCEDIPLOME != null ? await ConvertToByteArray(demandeDto.COPIEARRETEEQUIVALENCEDIPLOME) : null,
                AUTORISATIONONCOURS = demandeDto.AUTORISATIONONCOURS != null ? await ConvertToByteArray(demandeDto.AUTORISATIONONCOURS) : null,
                DATEPOSTULATION = DateTime.Now,
                VALIDATION = null, // Not validated yet
                ETAT = 0
            };

            _context.Demandes.Add(newDemande);
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Draft saved successfully" });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "An error occurred while processing your request", error = ex.Message });
    }
}

    }

    public class DemandeDraft
{
    public int ID_CANDIDATURE { get; set; }
    public string? NOM { get; set; }
    public string? PRENOM { get; set; }
    public IFormFile? DEMANDEMANUSCRITE { get; set; }
    public IFormFile? COPIEDIPLOME { get; set; }
    public IFormFile? COPIECARTEIDENTITERECTO { get; set; }
    public IFormFile? COPIECARTEIDENTITEVERSO { get; set; }
    public IFormFile? COPIEATTESTATIONHANDICAP { get; set; }
    public IFormFile? COPIEATTESTATIONSTATUT { get; set; }
    public IFormFile? COPIEARRETEEQUIVALENCEDIPLOME { get; set; }
    public IFormFile? AUTORISATIONONCOURS { get; set; }
    public int? ETAT { get; set; }
}
    
    public class DemandeDto
    {
        public int ID_CANDIDATURE { get; set; }
        public string? NOM { get; set; }
        public string? PRENOM { get; set; }
        public IFormFile? DEMANDEMANUSCRITE { get; set; }
        public IFormFile? COPIEDIPLOME { get; set; }
        public IFormFile? COPIECARTEIDENTITERECTO { get; set; }
        public IFormFile? COPIECARTEIDENTITEVERSO { get; set; }
        public IFormFile? COPIEATTESTATIONHANDICAP { get; set; }
        public IFormFile? COPIEATTESTATIONSTATUT { get; set; }
        public IFormFile? COPIEARRETEEQUIVALENCEDIPLOME { get; set; }
        public IFormFile? AUTORISATIONONCOURS { get; set; }

        public int? ETAT { get; set; }
    }

}
