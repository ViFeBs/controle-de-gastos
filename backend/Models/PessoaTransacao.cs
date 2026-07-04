namespace backend.Models;

//tive que criar esse modelo para fazer uma busca com inner join
//o dapper usa a classe models como base para criar o json de resposta
//então para um inner join eu acabo precisando criar esse modelo misto
public class PessoaTransacao{
    public int IdTransacao { get; set; }
    public string Descricao { get; set; } = string.Empty;
    public decimal Valor { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public int Pessoa { get; set; }
    public string Nome { get; set; }
    public int Idade { get; set; }
}