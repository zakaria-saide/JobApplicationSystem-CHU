using Microsoft.AspNetCore.Mvc;
using MonProjetAspNetCore.Data;
using MonProjetAspNetCore.Models;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Text;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace MonProjetAspNetCore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegistrationController : ControllerBase
    {
        private readonly OracleDbContext _context;
        private readonly SmtpClient _smtpClient;

        public RegistrationController(OracleDbContext context, SmtpClient smtpClient)
        {
            _context = context;
            _smtpClient = smtpClient;
        }
        
        [HttpPost]
        public async Task<IActionResult> RegisterUser([FromBody] RegisterModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if email exists
                var emailExists = await _context.Utilisateurs
                    .Where(u => u.EMAIL == model.Email)
                    .Select(u => 1)
                    .FirstOrDefaultAsync();

                if (emailExists == 1)
                {
                    return Conflict(new { message = "Email is already registered." });
                }

                // Generate a unique email token
                var emailToken = GenerateEmailToken();

                // Hash the password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(model.Password);

                // Email does not exist, proceed with registration
                var newUser = new Utilisateur
                {
                    EMAIL = model.Email,
                    PASSWORDHASH = passwordHash,
                    ROLE = "Utilisateur",
                    IsEmailVerified = false,
                    EmailToken = emailToken
                };

                _context.Utilisateurs.Add(newUser);
                await _context.SaveChangesAsync();

                // Send verification email
                var verificationLink = Url.Action("VerifyEmail", "Registration", new { token = emailToken }, Request.Scheme);
                await SendVerificationEmail(model.Email, verificationLink);

                return Ok(new { message = "User registered successfully. Please check your email to verify your account." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while registering the user: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                return StatusCode(500, new { message = "An error occurred while processing your registration request." });
            }
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Invalid email verification token." });
            }

            var user = await _context.Utilisateurs.FirstOrDefaultAsync(u => u.EmailToken == token);
            if (user == null)
            {
                return NotFound(new { message = "Invalid email verification token." });
            }

            user.IsEmailVerified = true;
            user.EmailToken = null;

            _context.Utilisateurs.Update(user);
            await _context.SaveChangesAsync();

            // Redirect to the React application with the new professional URL
            return Redirect("http://localhost:5173/LogIn");
        }


        private async Task SendVerificationEmail(string email, string link)
        {
            var fromAddress = new MailAddress("s1idetaha113@gmail.com", "CHU Candidature");
            var toAddress = new MailAddress(email);
            const string subject = "Vérification de votre adresse email";

            var body = $@"
            <html>
            <head>
                <style>
                    body {{
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                    }}
                    .container {{
                        width: 80%;
                        margin: 0 auto;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 10px;
                        background-color: #f9f9f9;
                    }}
                    .header {{
                        text-align: center;
                        border-bottom: 1px solid #ddd;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }}
                    .header h1 {{
                        font-size: 24px;
                        margin: 0;
                        color: #023F92;
                    }}
                    .content {{
                        padding: 20px;
                    }}
                    .content p {{
                        margin: 10px 0;
                    }}
                    .content a {{
                        color: #023F92;
                        text-decoration: none;
                    }}
                    .footer {{
                        text-align: center;
                        border-top: 1px solid #ddd;
                        padding-top: 10px;
                        margin-top: 20px;
                    }}
                    .footer p {{
                        font-size: 12px;
                        color: #666;
                    }}
                </style>
            </head>
            <body>
                <div class='container'>
                    <div class='header'>
                        <h1>Vérification de votre adresse email</h1>
                    </div>
                    <div class='content'>
                        <p>Bonjour,</p>
                        <p>Nous sommes enchantés de vous guider dans votre processus de candidature pour le concours du Centre Hospitalier Universitaire Hassan II de Fès.</p>
                        <p>Suite à la création de votre compte, merci de bien vouloir cliquer sur le lien de confirmation ci-dessous pour valider et activer votre compte :</p>
                        <p><a href='{link}'>Valider et activer mon compte</a></p>
                        <p>Si vous n'avez pas créé de compte, veuillez ignorer cet e-mail.</p>
                    </div>
                    <div class='footer'>
                        <p>Cordialement,</p>
                        <p>Centre Hospitalier Universitaire Hassan II de Fès</p>
                    </div>
                </div>
            </body>
            </html>";

            var message = new MailMessage(fromAddress, toAddress)
            {
                Subject = subject,
                Body = body,
                IsBodyHtml = true // Set this to true to enable HTML formatting
            };

            try
            {
                await _smtpClient.SendMailAsync(message);
                Console.WriteLine("Verification email sent successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"An error occurred while sending the verification email: {ex.Message}");
                Console.WriteLine(ex.StackTrace);
                throw; // Re-throw the exception to be handled by the calling method
            }
            finally
            {
                message.Dispose(); // Dispose the message object
            }
        }

        private string GenerateEmailToken()
        {
            return Guid.NewGuid().ToString();
        }
    }
}
