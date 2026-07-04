namespace backend.Data;

using Microsoft.Data.Sqlite;

//como estou usando o sqlite e não estou usando o entity framework vou precisar dessa classe para criar as tabelas do banco de dados 
// manualmente
public static class DatabaseInitializer{

    public static void Initialize(string connectionString)
    {
        //abrir conexao com o db
        using var connection = new SqliteConnection(connectionString);
        connection.Open();

        //criar tabelas "create if not exists" usado para evitar erros na hora da criação das tabelas
        var command = connection.CreateCommand();
        command.CommandText = """
            CREATE TABLE IF NOT EXISTS Pessoa (
                IdPessoa INTEGER PRIMARY KEY AUTOINCREMENT,
                Nome TEXT NOT NULL,
                Idade INTEGER NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Transacao (
                IdTransacao INTEGER PRIMARY KEY AUTOINCREMENT,
                Descricao TEXT NOT NULL,
                Valor REAL NOT NULL,
                Tipo TEXT NOT NULL,
                Pessoa INTEGER NOT NULL REFERENCES Pessoa(IdPessoa)
            );
        """;
        command.ExecuteNonQuery();
    }
}