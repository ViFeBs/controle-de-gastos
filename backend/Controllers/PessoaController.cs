namespace backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Models;
using backend.Repositories;

[ApiController]
[Route("api/[controller]")]
public class PessoaController : ControllerBase{
    private readonly IPessoaRepository _repository;

    public PessoaController(IPessoaRepository repository){
        _repository = repository;
    }

    // GET: api/pessoa
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Pessoa>>> GetAll()
    {
        var pessoa = await _repository.GetAllAsync();
        return Ok(pessoa);
    }

    // GET: api/pessoa/5(id)
    [HttpGet("{id}")]
    public async Task<ActionResult<Pessoa>> GetById(int id)
    {
        var pessoa = await _repository.GetByIdAsync(id);
        if (pessoa is null)
            return NotFound();

        return Ok(pessoa);
    }

    // POST: api/pessoa
    [HttpPost]
    public async Task<ActionResult<Pessoa>> Create(PessoaCreateDto dto)
    {
        var pessoa = new Pessoa
        {
            Nome = dto.Nome,
            Idade = dto.Idade
        };

        var novoId = await _repository.CreateAsync(pessoa);
        pessoa.IdPessoa = novoId;

        return CreatedAtAction(nameof(GetById), new { id = novoId }, pessoa);
    }

    // PUT: api/pessoa/5(id)
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, PessoaUpdateDto dto)
    {
        var pessoa = new Pessoa
        {
            IdPessoa = id,
            Nome = dto.Nome,
            Idade = dto.Idade
        };

        var atualizado = await _repository.UpdateAsync(pessoa);
        if (!atualizado)
            return NotFound();

        return NoContent();
    }

    // DELETE: api/pessoa/5(id)
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deletado = await _repository.DeleteAsync(id);
        if (!deletado)
            return NotFound();

        return NoContent();
    }
}