import { useState } from "react";
import type { PessoaCreateDto } from "../types";
import { createPessoa } from "../services/api";

interface PessoaFormProps {
  onPessoaCriada: () => void; // callback pra avisar o App que precisa recarregar a lista
}

interface Erros {
  nome?: string;
  idade?: string;
}


export function PessoaForm({ onPessoaCriada }: PessoaFormProps) {
    const [nome, setNome] = useState("");
    const [idade, setIdade] = useState("");
    const [erros, setErros] = useState<Erros>({});

    const validar = (): boolean => {
        const novosErros: Erros = {};

        if (!nome.trim()) {
        novosErros.nome = "Informe o nome.";
        } else if (nome.trim().length < 2) {
        novosErros.nome = "Nome muito curto.";
        }

        const idadeNumero = Number(idade);
        if (!idade) {
        novosErros.idade = "Informe a idade.";
        } else if (isNaN(idadeNumero) || idadeNumero <= 0) {
        novosErros.idade = "Idade deve ser um número maior que zero.";
        } else if (idadeNumero > 120) {
        novosErros.idade = "Idade inválida.";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };


  const handleSubmit = async (event: React.SubmitEvent) => {
    event.preventDefault(); // impede o comportamento padrão do form (recarregar a página)

    if (!validar()) return;
    
    const dto: PessoaCreateDto = {
      nome,
      idade: Number(idade),
    };

    await createPessoa(dto);

    // limpa o formulário
    setNome("");
    setIdade("");

    onPessoaCriada(); // avisa o componente pai que uma pessoa nova foi criada
  };

  return (
    <div className="form-card">
        <h2>Nova Pessoa</h2>
        <form onSubmit={handleSubmit}>
        <div className="form-field">
            <label>Nome</label>
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
        </div>
        <div className="form-field">
            <label>Idade</label>
            <input type="number" value={idade} onChange={(e) => setIdade(e.target.value)} required />
        </div>
        <button type="submit" className="form-submit">Cadastrar Pessoa</button>
        </form>
    </div>
  );
}