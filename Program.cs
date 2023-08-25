var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// Handle HEAD requests (needed for start-server-and-test)
app.MapMethods("/", new[] { "HEAD" }, () => "");

app.MapGet("/", () => "Hello World!");


app.Run();
