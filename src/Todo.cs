#nullable enable

using System.Diagnostics.CodeAnalysis;

public class Todo
{
  public int Id { get; [ExcludeFromCodeCoverage] set; }
  public string? Name { get; set; }
  public bool IsComplete { get; set; }

  [ExcludeFromCodeCoverage]
  public string? Secret { get; set; }

  // Convert to DTO
  public TodoDTO ToDTO() => new TodoDTO
  { Id = this.Id, Name = this.Name, IsComplete = this.IsComplete };
}

public class TodoDTO
{
  public int Id { get; set; }
  public string? Name { get; set; }
  public bool IsComplete { get; set; }
}
