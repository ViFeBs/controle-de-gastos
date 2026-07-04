namespace backend.DTOs;

//essa classe representa o que deve ser enviado para o cadastro da transacao
public class TransacaoCreateDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public int Pessoa { get; set; }
}