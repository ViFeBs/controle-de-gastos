namespace backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Models;
using backend.Repositories;

[ApiController]
[Route("api/[controller]")]
public class TransacaoController : ControllerBase{

    private readonly ITransacaoRepository _repository;

    public TransacaoController(ITransacaoRepository repository){
        _repository = repository;
    }

    // GET: api/transacao
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PessoaTransacao>>> GetAll()
    {
        var transacoes = await _repository.GetAllAsync();
        return Ok(transacoes);
    }

    // GET: api/api/transacao/pessoa/id
    [HttpGet("pessoa/{id}")]
    public async Task<ActionResult<Transacao>> GetByPersonId(int id)
    {
        var transacoes = await _repository.GetByPersonIdAsync(id);
        if (transacoes is null)
            return NotFound();

        return Ok(transacoes);
    }

    // GET: api/transacao/5(id)
    [HttpGet("{id}")]
    public async Task<ActionResult<Transacao>> GetById(int id)
    {
        var transacao = await _repository.GetByIdAsync(id);
        if (transacao is null)
            return NotFound();

        return Ok(transacao);
    }

    // POST: api/transacao
    [HttpPost]
    public async Task<ActionResult<Transacao>> Create(TransacaoCreateDto dto)
    {
        var transacao = new Transacao
        {
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            Pessoa = dto.Pessoa
        };

        var novoId = await _repository.CreateAsync(transacao);
        transacao.IdTransacao = novoId;

        return CreatedAtAction(nameof(GetById), new { id = novoId }, transacao);
    }

    // PUT: api/transacao/5(id)
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, TransacaoUpdateDto dto)
    {
        var transacao = new Transacao
        {
            IdTransacao = id,
            Descricao = dto.Descricao,
            Valor = dto.Valor,
            Tipo = dto.Tipo,
            Pessoa = dto.Pessoa
        };

        var atualizado = await _repository.UpdateAsync(transacao);
        if (!atualizado)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/transacao/5(id)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deletado = await _repository.DeleteAsync(id);
        if (!deletado)
            return NotFound();

        return NoContent();
    }
}