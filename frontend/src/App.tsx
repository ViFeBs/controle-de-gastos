import { useEffect, useState } from "react";
import type { Pessoa, PessoaTransacao } from "./types";
import { getPessoas, getTodasTransacoes } from "./services/api";
import { PessoaForm } from "./components/PessoaForm";
import { TransacaoForm } from "./components/TransacaoForm";
import { TransacoesTable } from "./components/TransacoesTable";
import "./styles/app.css"

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [transacoes, setTransacoes] = useState<PessoaTransacao[]>([]);
  const [mostrarFormPessoa, setMostrarFormPessoa] = useState(false);
  const [mostrarFormTransacao, setMostrarFormTransacao] = useState(false);

  const carregarDados = async () => {
    const [pessoasData, transacoesData] = await Promise.all([
      getPessoas(),
      getTodasTransacoes(),
    ]);
    setPessoas(pessoasData);
    setTransacoes(transacoesData);
  };

  // roda uma vez, quando o componente monta na tela
  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Controle de Gastos</h1>
      </header>
      
      <div className="actions">
        <button className="btn btn-secondary" onClick={() => setMostrarFormPessoa(!mostrarFormPessoa)}>
          Cadastrar Pessoa
        </button>
        <button className="btn btn-primary" onClick={() => setMostrarFormTransacao(!mostrarFormTransacao)}>
          Cadastrar Transação
        </button>
      </div>
      

      {mostrarFormPessoa && (
        <PessoaForm
          onPessoaCriada={() => {
            carregarDados();
            setMostrarFormPessoa(false);
          }}
        />
      )}

      {mostrarFormTransacao && (
        <TransacaoForm
          pessoas={pessoas}
          onTransacaoCriada={() => {
            carregarDados();
            setMostrarFormTransacao(false);
          }}
        />
      )}
      <div className="table-wrapper">
        <TransacoesTable pessoas={pessoas} transacoes={transacoes} onDadosAlterados={carregarDados} />
      </div>
    </div>
  );
}

export default App;
