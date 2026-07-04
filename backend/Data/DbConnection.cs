namespace backend.Data;

using Microsoft.Data.Sqlite;
using System.Data;

//classe de conexão feita para ser reutilizada no projeto todo
public class DbConnection
{
    //string de conexão 
    private readonly string _connectionString;

    //o metodo principal dessa classe vai ler a stringconnection do appsetings.json
    public DbConnection(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection")!;
    }

    //e aqui será devolvida uma nova conexao
    public IDbConnection CreateConnection()
        => new SqliteConnection(_connectionString);
}