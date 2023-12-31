using Microsoft.EntityFrameworkCore;
using Serilog;

string POSTGRES_CONNECTION_STRING = Environment.GetEnvironmentVariable("POSTGRES_CONNECTION_STRING")
  ?? "Host=localhost;Port=5432;Database=todo;Username=postgres;Password=password;";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TodoDb>(opt => opt.UseNpgsql(POSTGRES_CONNECTION_STRING));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();
Log.Logger = new LoggerConfiguration().WriteTo.Console().CreateLogger();
builder.Host.UseSerilog();

var app = builder.Build();
app.MapMethods("/", new[] { "HEAD" }, () => "");    // For testing

var todoItems = app.MapGroup("/todoitems");
todoItems.MapGet("/", GetAllTodos);
todoItems.MapGet("/complete", GetCompleteTodos);
todoItems.MapGet("/{id}", GetTodo);
todoItems.MapPost("/", CreateTodo);
todoItems.MapPut("/{id}", UpdateTodo);
todoItems.MapDelete("/{id}", DeleteTodo);

app.Run();

static async Task<IResult> GetAllTodos(TodoDb db)
{
  return TypedResults.Ok(await db.Todos.Select(t => t.ToDTO()).ToListAsync());
}

static async Task<IResult> GetCompleteTodos(TodoDb db)
{
  return TypedResults.Ok(await db.Todos.Where(t => t.IsComplete).Select(t => t.ToDTO()).ToListAsync());
}

static async Task<IResult> GetTodo(int id, TodoDb db)
{
  return await db.Todos.FindAsync(id)
      is Todo todo
          ? TypedResults.Ok(todo.ToDTO())
          : TypedResults.NotFound();
}

static async Task<IResult> CreateTodo(Todo todo, TodoDb db)
{
  db.Todos.Add(todo);
  await db.SaveChangesAsync();

  return TypedResults.Created($"/todoitems/{todo.Id}", todo.ToDTO());
}

static async Task<IResult> UpdateTodo(int id, Todo inputTodo, TodoDb db)
{
  var todo = await db.Todos.FindAsync(id);

  if (todo is null) return TypedResults.NotFound();

  todo.Name = inputTodo.Name;
  todo.IsComplete = inputTodo.IsComplete;

  await db.SaveChangesAsync();

  return TypedResults.NoContent();
}

static async Task<IResult> DeleteTodo(int id, TodoDb db)
{
  if (await db.Todos.FindAsync(id) is Todo todo)
  {
    db.Todos.Remove(todo);
    await db.SaveChangesAsync();
    return TypedResults.NoContent();
  }

  return TypedResults.NotFound();
}
