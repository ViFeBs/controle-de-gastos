namespace backend.Models;

public class Transacao{
    public int IdTransacao { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public int Pessoa { get; set; }
}