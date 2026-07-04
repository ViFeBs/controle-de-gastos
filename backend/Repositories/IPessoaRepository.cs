namespace backend.Repositories;

using backend.Models;

// não vai ser o caso dessa aplicação mas essa interface é criada para o caso de ser necessário fazer alguma alteração na implementação
// assim eu vou apenas precisar alterar a interface  e a classe de pessoarepository sem precisar alterar minha controller
// esse formato também é bom para fazer testes unitarios.
public interface IPessoaRepository
{
    //estou usando task pois são funções asyncronas.
    Task<IEnumerable<Pessoa>> GetAllAsync();
    Task<Pessoa?> GetByIdAsync(int id);
    Task<int> CreateAsync(Pessoa pessoa);
    Task<bool> UpdateAsync(Pessoa pessoa);
    Task<bool> DeleteAsync(int id);
}