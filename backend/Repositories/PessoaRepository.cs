namespace backend.Repositories;

//estou usando o dapper para gerenciar a conexão com sqlite
using Dapper;
using backend.Data;
using backend.Models;

public class PessoaRepository : IPessoaRepository {
    
    //aqui eu vou pegar aquela conexão feita no dbconnection
    //assim não vou precisar ficar abrindo conexão em cada operação
    private readonly DbConnection _connectionFactory;

    public PessoaRepository(DbConnection connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }


    //função para buscar todas as pessoas do banco
    public async Task<IEnumerable<Pessoa>> GetAllAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        //esse é o formato padrão de executar querys do dapper.
        return await connection.QueryAsync<Pessoa>("SELECT * FROM Pessoa");
    }

    //função para buscar uma pessoa em específica do banco
    public async Task<Pessoa?> GetByIdAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Pessoa>(
            "SELECT * FROM Pessoa WHERE IdPessoa = @IdPessoa", new { IdPessoa = id });
    }

    //função para cadastrar uma pessoa no banco
    public async Task<int> CreateAsync(Pessoa pessoa)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            INSERT INTO Pessoa (Nome, Idade)
            VALUES (@Nome, @Idade);
            SELECT last_insert_rowid();
        """;
        var newId = await connection.ExecuteScalarAsync<int>(sql, pessoa);
        return newId;
    }

    //função para atualizar o cadastro de uma pessoa no banco
    public async Task<bool> UpdateAsync(Pessoa pessoa)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            UPDATE Pessoa
            SET Nome = @Nome, Idade = @Idade
            WHERE IdPessoa = @IdPessoa;
        """;
        var rowsAffected = await connection.ExecuteAsync(sql, pessoa);
        return rowsAffected > 0;
    }

    //deleta usuario e todas as funções atreladas a esse usuario
    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = "DELETE FROM Transacao WHERE Pessoa = @Id; DELETE FROM Pessoa WHERE IdPessoa = @Id;";
        var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
        return rowsAffected > 0;
    }
}