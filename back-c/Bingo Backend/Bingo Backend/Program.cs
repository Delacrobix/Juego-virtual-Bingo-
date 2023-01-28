using Bingo_Backend.Controllers;
using NETCoreAPIMySQL.Data;
using NETCoreAPIMySQL.Data.Respositories;
using NETCoreAPIMySQL.Data.service;

var builder = WebApplication.CreateBuilder(args);
var firstPolicy = "firstPolicy";

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSignalR();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var mySQLConfiguration = new MySQLConfiguration(builder.Configuration.GetConnectionString("MySQLConnection"));
builder.Services.AddSingleton(mySQLConfiguration);

builder.Services.AddScoped<IBallotsObtainedRepository, BallotsObtainedRepository>();
builder.Services.AddScoped<IBingoRepository, BingoRepository>();
builder.Services.AddScoped<ICardRepository, CardRepository>();
builder.Services.AddScoped<IColumnLetterRepository, ColumnLetterRepository>();
builder.Services.AddScoped<IGamerRepository, GamerRepository>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(firstPolicy, 
        policy =>
        {
            policy.WithOrigins("http://localhost:8081")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();
app.MapHub<BingoHub>("/wss");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(firstPolicy);

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();