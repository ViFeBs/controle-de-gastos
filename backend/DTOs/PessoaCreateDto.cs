namespace backend.DTOs;

//essa classe representa o que deve ser enviado para o cadastro da pessoa
public class PessoaCreateDto
{
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}