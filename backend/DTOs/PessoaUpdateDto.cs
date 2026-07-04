namespace backend.DTOs;

//essa classe representa o que deve ser enviado para a atualização do registro de uma pessoa
public class PessoaUpdateDto
{
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}