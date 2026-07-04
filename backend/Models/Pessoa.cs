namespace backend.Models;

public class Pessoa{
    public int IdPessoa { get; set; }
    //o = string.Empty evita um aviso "Non-nullable property 'Nome' must contain a non-null value when exiting constructor"
    public string Nome { get; set; } = string.Empty;
    public int Idade { get; set; }
}