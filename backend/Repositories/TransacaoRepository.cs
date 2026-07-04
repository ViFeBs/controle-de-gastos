namespace backend.Repositories;

using Dapper;
using backend.Data;
using backend.Models;

public class TransacaoRepository : ITransacaoRepository {
    
    private readonly DbConnection _connectionFactory;

    public TransacaoRepository(DbConnection connectionFactory)
    {
        _connectionFactory = connectionFactory;
    }


    //função para buscar todas as transações e pessoas do banco
    public async Task<IEnumerable<PessoaTransacao>> GetAllAsync()
    {
        using var connection = _connectionFactory.CreateConnection();
        //esse é o formato padrão de executar querys do dapper.
        return await connection.QueryAsync<PessoaTransacao>("SELECT Transacao.* , Pessoa.* FROM Transacao INNER JOIN Pessoa ON Transacao.Pessoa = Pessoa.IdPessoa");
    }

    //função para buscar todas as transações de uma pessoa
    public async Task<IEnumerable<PessoaTransacao>> GetByPersonIdAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QueryAsync<PessoaTransacao>(
            "SELECT Transacao.* , Pessoa.* FROM Transacao INNER JOIN Pessoa ON Transacao.Pessoa = Pessoa.IdPessoa " + 
            "WHERE IdPessoa = @IdPessoa", new { IdPessoa = id });
    }

    //função para buscar uma transação em específica do banco
    public async Task<Transacao?> GetByIdAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();
        return await connection.QuerySingleOrDefaultAsync<Transacao>(
            "SELECT * FROM Transacao WHERE IdTransacao = @IdTransacao", new { IdTransacao = id });
    }
    

    //função para cadastrar uma transação no banco
    public async Task<int> CreateAsync(Transacao transacao)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            INSERT INTO Transacao (Descricao, Valor, Tipo, Pessoa)
            VALUES (@Descricao, @Valor, @Tipo, @Pessoa);
            SELECT last_insert_rowid();
        """;
        var newId = await connection.ExecuteScalarAsync<int>(sql, transacao);
        return newId;
    }

    //função para atualizar o cadastro de uma transação no banco
    public async Task<bool> UpdateAsync(Transacao transacao)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = """
            UPDATE Transacao
            SET Descricao = @Descricao, Valor = @Valor, Tipo = @Tipo, Pessoa = @Pessoa
            WHERE IdTransacao = @IdTransacao;
        """;
        var rowsAffected = await connection.ExecuteAsync(sql, transacao);
        return rowsAffected > 0;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        using var connection = _connectionFactory.CreateConnection();
        const string sql = "DELETE FROM Transacao WHERE IdTransacao = @Id;";
        var rowsAffected = await connection.ExecuteAsync(sql, new { Id = id });
        return rowsAffected > 0;
    }
}