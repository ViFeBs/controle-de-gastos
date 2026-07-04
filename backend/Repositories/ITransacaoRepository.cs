namespace backend.Repositories;

using backend.Models;


public interface ITransacaoRepository
{
    Task<IEnumerable<PessoaTransacao>> GetAllAsync();
    Task<IEnumerable<PessoaTransacao>> GetByPersonIdAsync(int id);
    Task<Transacao?> GetByIdAsync(int id);
    Task<int> CreateAsync(Transacao transacao);
    Task<bool> UpdateAsync(Transacao transacao);
    Task<bool> DeleteAsync(int id);
}