var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello World!");

// Handle HEAD requests (needed for start-server-and-test)
app.MapMethods("/", new[] { "HEAD" }, () => "");

app.Run();
