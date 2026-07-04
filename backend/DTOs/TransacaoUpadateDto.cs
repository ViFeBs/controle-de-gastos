namespace backend.DTOs;

//essa classe representa o que deve ser enviado para a atualização do registro de uma transacao
public class TransacaoUpdateDto
{
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public int Pessoa { get; set; }
}