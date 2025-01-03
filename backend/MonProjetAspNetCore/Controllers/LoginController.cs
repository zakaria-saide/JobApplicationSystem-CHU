using Microsoft.AspNetCore.Mvc;
using MonProjetAspNetCore.Data;
using MonProjetAspNetCore.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;


[ApiController]
[Route("api/[controller]")]
public class LoginController : ControllerBase
{
    private readonly OracleDbContext _context;
    private readonly IConfiguration _configuration;

    public LoginController(OracleDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }
    
//     [HttpPost("login")]
// public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
// {
//     if (string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
//     {
//         return BadRequest(new { message = "L'email et le mot de passe sont requis." });
//     }

//     try
//     {
//         var user = _context.Utilisateurs.FirstOrDefault(u => u.EMAIL == loginRequest.Email);

//         if (user == null)
//         {
//             return NotFound(new { message = "Ce compte n’est pas enregistré. Veuillez vous inscrire." });
//         }

//         if (!VerifyPassword(loginRequest.Password, user.PASSWORDHASH))
//         {
//             return Unauthorized(new { message = "Le mot de passe saisi est incorrect. Veuillez réessayer." });
//         }

//         if (!user.IsEmailVerified)
//         {
//             return BadRequest(new { message = "Veuillez confirmer votre compte par le lien envoyé par email." });
//         }

//         if (string.IsNullOrEmpty(user.ROLE))
//         {
//             return StatusCode(500, new { message = "Le rôle de l'utilisateur n'est pas défini." });
//         }

//         // Generate the token
//         var token = GenerateJwtToken(user);

//         // Extract user ID from the generated token
//         var userId = GetUserIdFromToken(token);
//         if (userId == null)
//         {
//             return Unauthorized(new { message = "User ID not found in token" });
//         }

//         // Retrieve the demande and associated candidature
//         var demande = await _context.Demandes
//             .AsNoTracking()
//             .Where(d => d.USERID == userId && d.ETAT == 1)
//             .Select(d => new
//             {
//                 d.ID,
//                 d.USERID,
//                 d.ID_CANDIDATURE,
//                 d.NOM,
//                 d.PRENOM,
//                 d.DEMANDEMANUSCRITE,
//                 d.COPIEDIPLOME,
//                 d.COPIECARTEIDENTITERECTO,
//                 d.COPIECARTEIDENTITEVERSO,
//                 d.COPIEATTESTATIONHANDICAP,
//                 d.COPIEATTESTATIONSTATUT,
//                 d.COPIEARRETEEQUIVALENCEDIPLOME,
//                 d.AUTORISATIONONCOURS,
//                 d.DATEPOSTULATION,
//                 d.VALIDATION

//             })
//             .FirstOrDefaultAsync();

//         if (demande != null)
//         {
//             var candidature = await _context.Candidatures
//                 .AsNoTracking()
//                 .FirstOrDefaultAsync(c => c.ID_CANDIDATURE == demande.ID_CANDIDATURE);

//             if (candidature == null)
//             {
//                 return NotFound(new { message = "La candidature associée à cette demande n'a pas été trouvée." });
//             }

            
//             return Ok(new { demande, candidature});
//         }

//         return Ok(new { token });
//     }
//     catch (Exception ex)
//     {
//         // Log the exception (not shown here)
//         return StatusCode(500, new { message = "Une erreur inattendue est survenue. Veuillez réessayer plus tard." });
//     }
// }

[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
{
    if (string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
    {
        return BadRequest(new { message = "L'email et le mot de passe sont requis." });
    }

    try
    {
        var user = _context.Utilisateurs.FirstOrDefault(u => u.EMAIL == loginRequest.Email);

        if (user == null)
        {
            return NotFound(new { message = "Ce compte n’est pas enregistré. Veuillez vous inscrire." });
        }

        if (!VerifyPassword(loginRequest.Password, user.PASSWORDHASH))
        {
            return Unauthorized(new { message = "Le mot de passe saisi est incorrect. Veuillez réessayer." });
        }

        if (!user.IsEmailVerified)
        {
            return BadRequest(new { message = "Veuillez confirmer votre compte par le lien envoyé par email." });
        }

        if (string.IsNullOrEmpty(user.ROLE))
        {
            return StatusCode(500, new { message = "Le rôle de l'utilisateur n'est pas défini." });
        }

        // Determine role value
        int roleValue = user.ROLE == "Utilisateur" ? 1 : user.ROLE == "Admin" ? 2 : 0;

        // Generate the token
        var token = GenerateJwtToken(user);

        // Extract user ID from the generated token
        var userId = GetUserIdFromToken(token);
        if (userId == null)
        {
            return Unauthorized(new { message = "User ID not found in token" });
        }

        // Retrieve the demande and associated candidature
        var demande = await _context.Demandes
            .AsNoTracking()
            .Where(d => d.USERID == userId && d.ETAT == 1)
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
                d.VALIDATION
            })
            .FirstOrDefaultAsync();

        if (demande != null)
        {
            var candidature = await _context.Candidatures
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.ID_CANDIDATURE == demande.ID_CANDIDATURE);

            if (candidature == null)
            {
                return NotFound(new { message = "La candidature associée à cette demande n'a pas été trouvée." });
            }

            return Ok(new {token, demande, candidature, role = roleValue });
        }

        return Ok(new { token, role = roleValue });
    }
    catch (Exception ex)
    {
        // Log the exception (not shown here)
        return StatusCode(500, new { message = "Une erreur inattendue est survenue. Veuillez réessayer plus tard." });
    }
}


private int? GetUserIdFromToken(string token)
{
    var handler = new JwtSecurityTokenHandler();
    var jwtToken = handler.ReadJwtToken(token);

    var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "UserId");
    if (userIdClaim == null)
    {
        return null;
    }

    if (!int.TryParse(userIdClaim.Value, out int userId))
    {
        return null;
    }

    return userId;
}
// private int? GetUserIdFromToken2()
// {
//     var claims = User.Claims;
//     var userIdClaim = claims.FirstOrDefault(c => c.Type == "UserId");
//     if (userIdClaim == null)
//     {
//         return null;
//     }

//     Console.WriteLine($"User ID Claim: {userIdClaim.Value}");

//     if (!int.TryParse(userIdClaim.Value, out int userId))
//     {
//         return null;
//     }

//     return userId;
// }

    // [HttpPost("login")]
    // public IActionResult Login([FromBody] LoginRequest loginRequest)
    // {
    //     if (string.IsNullOrEmpty(loginRequest.Email) || string.IsNullOrEmpty(loginRequest.Password))
    //     {
    //         return BadRequest(new { message = "L'email et le mot de passe sont requis." });
    //     }

    //     try
    //     {
    //         var user = _context.Utilisateurs.FirstOrDefault(u => u.EMAIL == loginRequest.Email);

    //         if (user == null)
    //         {
    //             return NotFound(new { message = "Ce compte n’est pas enregistré. Veuillez vous inscrire." });
    //         }

    //         if (!VerifyPassword(loginRequest.Password, user.PASSWORDHASH))
    //         {
    //             return Unauthorized(new { message = "Le mot de passe saisi est incorrect. Veuillez réessayer." });
    //         }

    //         if (!user.IsEmailVerified)
    //         {
    //             return BadRequest(new { message = "Veuillez confirmer votre compte par le lien envoyé par email." });
    //         }

    //         if (string.IsNullOrEmpty(user.ROLE))
    //         {
    //             return StatusCode(500, new { message = "Le rôle de l'utilisateur n'est pas défini." });
    //         }

    //         var token = GenerateJwtToken(user);
    //         return Ok(new { token });
    //     }
    //     catch (Exception ex)
    //     {
    //         // Log the exception (not shown here)
    //         return StatusCode(500, new { message = "Une erreur inattendue est survenue. Veuillez réessayer plus tard." });
    //     }
    // }

    private bool VerifyPassword(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }

    private string GenerateJwtToken(Utilisateur user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.EMAIL),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("UserId", user.USERID.ToString()) 

        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Issuer"],
            claims: claims,
            expires: DateTime.Now.AddMinutes(120),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

//     public string GenerateJwtToken(Utilisateur user)
// {
//     var claims = new[]
//     {
//         new Claim(JwtRegisteredClaimNames.Sub, user.EMAIL),
//         new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
//         new Claim("UserId", user.USERID.ToString())  
//         };

//     var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
//     var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//     var token = new JwtSecurityToken(
//         issuer: _configuration["Jwt:Issuer"],
//         audience: _configuration["Jwt:Issuer"],
//         claims: claims,
//         expires: DateTime.Now.AddDays(1),
//         signingCredentials: creds);

//     return new JwtSecurityTokenHandler().WriteToken(token);
// }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
