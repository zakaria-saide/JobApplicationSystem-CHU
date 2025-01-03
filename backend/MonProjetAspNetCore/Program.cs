// using Microsoft.AspNetCore.Builder;
// using Microsoft.AspNetCore.Hosting;
// using Microsoft.Extensions.Configuration;
// using Microsoft.Extensions.DependencyInjection;
// using Microsoft.Extensions.Hosting;
// using Microsoft.EntityFrameworkCore;
// using MonProjetAspNetCore.Data;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using System;
// using System.Text;
// using System.Linq;
// using Microsoft.IdentityModel.Tokens;
// using System.Net;
// using System.Net.Mail;

// var builder = WebApplication.CreateBuilder(args);
// var configuration = builder.Configuration; // Access the Configuration object

// // Inside the ConfigureServices method
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         // Configure token validation parameters
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true, // Validate the issuer of the token
//             ValidateAudience = true, // Validate the audience of the token
//             ValidateLifetime = true, // Validate the lifetime of the token
//             ValidateIssuerSigningKey = true, // Validate the signing key of the token
//             ValidIssuer = configuration["Jwt:Issuer"], // Set the valid issuer of the token
//             ValidAudience = configuration["Jwt:Issuer"], // Set the valid audience of the token
//             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])) // Set the symmetric security key used for token validation
//         };
//     });

// builder.Services.AddAuthorization(); // Add authorization services

// // Add CORS services
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowSpecificOrigin",
//         builder =>
//         {
//             builder.WithOrigins("http://localhost:5173") // Allow the frontend origin
//                    .AllowAnyHeader()
//                    .AllowAnyMethod();
//         });
// });




// // Add the service to connect to the Oracle database
// builder.Services.AddDbContext<OracleDbContext>(options =>
//     options.UseOracle(configuration.GetConnectionString("CHUDataBase"))); // Connect to the Oracle database

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAll",
//         builder =>
//         {
//             builder.AllowAnyOrigin()
//                    .AllowAnyMethod()
//                    .AllowAnyHeader();
//         });
// });

// // Add services to the container.
// builder.Services.AddControllers(); // Add controllers
// builder.Services.AddEndpointsApiExplorer(); // Add API explorer
// builder.Services.AddSwaggerGen(); // Add Swagger documentation generator

// // Add SMTP client as a singleton service
// builder.Services.AddSingleton<SmtpClient>(new SmtpClient
// {
//     Host = "smtp.gmail.com", // Use Gmail SMTP server
//     Port = 587, // Use port 587 for TLS/STARTTLS
//     EnableSsl = true,
//     DeliveryMethod = SmtpDeliveryMethod.Network,
//     UseDefaultCredentials = false,
//     Credentials = new NetworkCredential(" zakariasaide1377@gmail.com ", " dbrq ffvf hlnr evnm ")
// });

// var app = builder.Build();

// // Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger(); // Enable Swagger
//     app.UseSwaggerUI(); // Enable Swagger UI
// }

// app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS

// app.UseRouting(); // Enable routing

// // Use the CORS middleware
// app.UseCors("AllowSpecificOrigin");

// app.UseAuthorization(); // Enable authorization

// // Map controllers
// app.MapControllers(); 

// // Existing example of minimal API endpoint
// var summaries = new[]
// {
//     "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
// };

// app.MapGet("/weatherforecast", () =>
// {
//     var forecast =  Enumerable.Range(1, 5).Select(index =>
//         new WeatherForecast
//         (
//             DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
//             Random.Shared.Next(-20, 55),
//             summaries[Random.Shared.Next(summaries.Length)]
//         ))
//         .ToArray();
//     return forecast;
// })
// .WithName("GetWeatherForecast")
// .WithOpenApi();

// app.Run();

// record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
// {
//     public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
// }

using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using MonProjetAspNetCore.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System;
using System.Text;
using System.Linq;
using Microsoft.IdentityModel.Tokens;
using System.Net;
using System.Net.Mail;
using System.Text.Json.Serialization; // Add this using statement

var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration; // Access the Configuration object

// Inside the ConfigureServices method
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Configure token validation parameters
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true, // Validate the issuer of the token
            ValidateAudience = true, // Validate the audience of the token
            ValidateLifetime = true, // Validate the lifetime of the token
            ValidateIssuerSigningKey = true, // Validate the signing key of the token
            ValidIssuer = configuration["Jwt:Issuer"], // Set the valid issuer of the token
            ValidAudience = configuration["Jwt:Issuer"], // Set the valid audience of the token
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"])) // Set the symmetric security key used for token validation
        };
    });

builder.Services.AddAuthorization(); // Add authorization services

// Add CORS services
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        builder =>
        {
            builder.WithOrigins("http://localhost:5173") // Allow the frontend origin
                   .AllowAnyHeader()
                   .AllowAnyMethod();
        });
});

// Add the service to connect to the Oracle database
builder.Services.AddDbContext<OracleDbContext>(options =>
    options.UseOracle(configuration.GetConnectionString("CHUDataBase"))); // Connect to the Oracle database

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    }); // Add controllers with JSON options

builder.Services.AddEndpointsApiExplorer(); // Add API explorer
builder.Services.AddSwaggerGen(); // Add Swagger documentation generator

// Add SMTP client as a singleton service
builder.Services.AddSingleton<SmtpClient>(new SmtpClient
{
    Host = "smtp.gmail.com", // Use Gmail SMTP server
    Port = 587, // Use port 587 for TLS/STARTTLS
    EnableSsl = true,
    DeliveryMethod = SmtpDeliveryMethod.Network,
    UseDefaultCredentials = false,
    Credentials = new NetworkCredential("zakariasaide1377@gmail.com", "dbrq ffvf hlnr evnm") // Ensure sensitive information is securely stored
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Enable Swagger
    app.UseSwaggerUI(); // Enable Swagger UI
}

app.UseHttpsRedirection(); // Redirect HTTP requests to HTTPS

app.UseRouting(); // Enable routing

// Use the CORS middleware
app.UseCors("AllowSpecificOrigin");

app.UseAuthorization(); // Enable authorization

// Map controllers
app.MapControllers(); 

// Existing example of minimal API endpoint
var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
