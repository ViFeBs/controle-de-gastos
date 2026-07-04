import { useState } from "react";
import type { Pessoa, TransacaoCreateDto } from "../types";
import { createTransacao } from "../services/api";

interface TransacaoFormProps {
  pessoas: Pessoa[];
  onTransacaoCriada: () => void;
}

interface Erros {
  pessoaId?: string;
  descricao?: string;
  valor?: string;
}

export function TransacaoForm({ pessoas, onTransacaoCriada }: TransacaoFormProps) {
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState<"Receita" | "Despesa">("Receita");
  const [pessoaId, setPessoaId] = useState("");
  const [erros, setErros] = useState<Erros>({});


  const validar = (): boolean => {
    const novosErros: Erros = {};

    if (!pessoaId) {
      novosErros.pessoaId = "Selecione uma pessoa.";
    }

    if (!descricao.trim()) {
      novosErros.descricao = "Informe a descrição.";
    }

    const valorNumero = Number(valor);
    if (!valor) {
      novosErros.valor = "Informe o valor.";
    } else if (isNaN(valorNumero) || valorNumero <= 0) {
      novosErros.valor = "Valor deve ser maior que zero.";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault();

    if (!validar()) return;

    const dto: TransacaoCreateDto = {
      descricao,
      valor: Number(valor),
      tipo,
      pessoa: Number(pessoaId),
    };

    await createTransacao(dto);

    setDescricao("");
    setValor("");
    setTipo("Receita");
    setPessoaId("");

    onTransacaoCriada();
  };

  return (
    <div className="form-card">
        <h2>Nova Transação</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-field">
            <label>Pessoa</label>
            <select value={pessoaId} onChange={(e) => setPessoaId(e.target.value)} required>
            <option value="">Selecione...</option>
            {pessoas.map((p) => (
                <option key={p.idPessoa} value={p.idPessoa}>{p.nome}</option>
            ))}
            </select>
        </div>
        <div className="form-field">
            <label>Descrição</label>
            <input type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        </div>
        <div className="form-field">
            <label>Valor</label>
            <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required />
        </div>
        <div className="form-field">
            <label>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as "Receita" | "Despesa")}>
            <option value="receita">Receita</option>
            <option value="despesa">Despesa</option>
            </select>
        </div>
        <button type="submit" className="form-submit">Cadastrar Transação</button>
        </form>
    </div>
  );
}