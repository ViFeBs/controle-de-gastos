import { useState } from "react";
import type { Pessoa, PessoaTransacao, Transacao } from "../types";
import { getTransacoesPorPessoa, updatePessoa, deletePessoa, updateTransacao, deleteTransacao, } from "../services/api";

interface TransacoesTableProps {
  pessoas: Pessoa[];
  transacoes: PessoaTransacao[];
  onDadosAlterados: () => void; // avisa o App.tsx pra recarregar tudo
}


interface PessoaErros {
  nome?: string;
  idade?: string;
}

interface TransacaoErros {
  descricao?: string;
  valor?: string;
}

export function TransacoesTable({ pessoas, transacoes, onDadosAlterados  }: TransacoesTableProps) {
    // guarda qual pessoa está com os detalhes abertos (null = nenhuma)
    const [pessoaExpandidaId, setPessoaExpandidaId] = useState<number | null>(null);
    const [transacoesDetalhe, setTransacoesDetalhe] = useState<Transacao[]>([]);

    // ---- Edição de pessoa ----
    const [pessoaEditandoId, setPessoaEditandoId] = useState<number | null>(null);
    const [pessoaDraft, setPessoaDraft] = useState({ nome: "", idade: "" });

    // ---- Edição de Transação ----
    const [transacaoEditandoId, setTransacaoEditandoId] = useState<number | null>(null);
    const [transacaoDraft, setTransacaoDraft] = useState({ descricao: "", valor: "", tipo: "Receita" as "Receita" | "Despesa" });

    // Validação
    const [pessoaEditErros, setPessoaEditErros] = useState<PessoaErros>({});
    const [transacaoEditErros, setTransacaoEditErros] = useState<TransacaoErros>({});

    const validarPessoaDraft = (): boolean => {
        const novosErros: PessoaErros = {};

        if (!pessoaDraft.nome.trim()) {
            novosErros.nome = "Informe o nome.";
        } else if (pessoaDraft.nome.trim().length < 2) {
            novosErros.nome = "Nome muito curto.";
        }

        const idadeNumero = Number(pessoaDraft.idade);
        if (!pessoaDraft.idade) {
            novosErros.idade = "Informe a idade.";
        } else if (isNaN(idadeNumero) || idadeNumero <= 0) {
            novosErros.idade = "Deve ser maior que zero.";
        } else if (idadeNumero > 120) {
            novosErros.idade = "Idade inválida.";
        }

        setPessoaEditErros(novosErros);
        return Object.keys(novosErros).length === 0;
        };

        const validarTransacaoDraft = (): boolean => {
        const novosErros: TransacaoErros = {};

        if (!transacaoDraft.descricao.trim()) {
            novosErros.descricao = "Informe a descrição.";
        }

        const valorNumero = Number(transacaoDraft.valor);
        if (!transacaoDraft.valor) {
            novosErros.valor = "Informe o valor.";
        } else if (isNaN(valorNumero) || valorNumero <= 0) {
            novosErros.valor = "Deve ser maior que zero.";
        }

        setTransacaoEditErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    //calcula a receita e desespesa de cada pessoa
    const calcularTotais = (idPessoa: number) => {
        const transacoesDaPessoa = transacoes.filter((t) => t.pessoa === idPessoa);

        const receita = transacoesDaPessoa
        .filter((t) => t.tipo === "Receita")
        .reduce((soma, t) => soma + t.valor, 0);

        const despesa = transacoesDaPessoa
        .filter((t) => t.tipo === "Despesa")
        .reduce((soma, t) => soma + t.valor, 0);

        const saldo = receita - despesa;

        return { receita, despesa, saldo };
    };

    // Totais gerais: soma os totais de cada pessoa
    const totalGeral = pessoas.reduce(
        (acumulado, pessoa) => {
        const { receita, despesa, saldo } = calcularTotais(pessoa.idPessoa);
        return {
            receita: acumulado.receita + receita,
            despesa: acumulado.despesa + despesa,
            saldo: acumulado.saldo + saldo,
        };
        },
        { receita: 0, despesa: 0, saldo: 0 }
    );

   //exibe todas transações feitas pela pessoa selecionada
   const handleToggleDetalhes = async (idPessoa: number) => {
    // se já está aberto, fecha
    if (pessoaExpandidaId === idPessoa) {
      setPessoaExpandidaId(null);
      return;
    }

    const transacoesDaPessoa = await getTransacoesPorPessoa(idPessoa);
    setTransacoesDetalhe(transacoesDaPessoa);
    setPessoaExpandidaId(idPessoa);
  };

  // Inicia o modo de edição da pessoa ao dar double - click
  const iniciarEdicaoPessoa = (pessoa: Pessoa) => {
    setPessoaEditandoId(pessoa.idPessoa);
    setPessoaDraft({ nome: pessoa.nome, idade: String(pessoa.idade) });
    setPessoaEditErros({}); // limpa erros de uma edição anterior
  };

  const cancelarEdicaoPessoa = () => {
    setPessoaEditandoId(null);
  };

  const salvarEdicaoPessoa = async (idPessoa: number) => {
    if (!validarPessoaDraft()) return; // bloqueia o salvamento se inválido
    await updatePessoa(idPessoa, {
      nome: pessoaDraft.nome,
      idade: Number(pessoaDraft.idade),
    });
    setPessoaEditandoId(null);
    onDadosAlterados(); // recarrega a lista no App.tsx
  };

  const handleExcluirPessoa = async (idPessoa: number, nome: string) => {
    const confirmado = window.confirm(`Excluir "${nome}" e todas as suas transações?`);
    if (!confirmado) return;

    await deletePessoa(idPessoa);
    onDadosAlterados();
  };

  // Inicia edição da transação
  const iniciarEdicaoTransacao = (t: Transacao) => {
    setTransacaoEditandoId(t.idTransacao);
    setTransacaoDraft({ descricao: t.descricao, valor: String(t.valor), tipo: t.tipo });
    setTransacaoEditErros({});
  };

  const cancelarEdicaoTransacao = () => {
    setTransacaoEditandoId(null);
  };

  const salvarEdicaoTransacao = async (t: Transacao) => {
    if (!validarTransacaoDraft()) return;
    await updateTransacao(t.idTransacao, {
      descricao: transacaoDraft.descricao,
      valor: Number(transacaoDraft.valor),
      tipo: transacaoDraft.tipo,
      pessoa: t.pessoa, // mantém a mesma pessoa, não estamos editando o vínculo
    });
    setTransacaoEditandoId(null);

    // recarrega o detalhe daquela pessoa específica, já que é uma lista separada
    if (pessoaExpandidaId !== null) {
      const atualizado = await getTransacoesPorPessoa(pessoaExpandidaId);
      setTransacoesDetalhe(atualizado);
    }
    onDadosAlterados(); // recarrega os totais da tabela principal também
  };

  const handleExcluirTransacao = async (idTransacao: number, descricao: string) => {
    const confirmado = window.confirm(`Excluir a transação "${descricao}"?`);
    if (!confirmado) return;

    await deleteTransacao(idTransacao);

    if (pessoaExpandidaId !== null) {
      const atualizado = await getTransacoesPorPessoa(pessoaExpandidaId);
      setTransacoesDetalhe(atualizado);
    }
    onDadosAlterados();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Idade</th>
          <th>Receita</th>
          <th>Despesa</th>
          <th>Saldo</th>
          <th>Detalhes</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {pessoas.map((pessoa) => {
          const { receita, despesa, saldo } = calcularTotais(pessoa.idPessoa);
          const estaExpandida = pessoaExpandidaId === pessoa.idPessoa;
          const estaEditando = pessoaEditandoId === pessoa.idPessoa;

          return (
            <>
              <tr key={pessoa.idPessoa}>
                {/* ---- Nome: double-click ativa edição ---- */}
                <td
                  onDoubleClick={() => iniciarEdicaoPessoa(pessoa)}
                  className={estaEditando ? "celula-editando" : ""}
                >
                  {estaEditando ? (
                    <input
                      autoFocus
                      value={pessoaDraft.nome}
                      onChange={(e) => setPessoaDraft({ ...pessoaDraft, nome: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && salvarEdicaoPessoa(pessoa.idPessoa)}
                    />
                  ) : (
                    pessoa.nome
                  )}
                </td>

                <td onDoubleClick={() => iniciarEdicaoPessoa(pessoa)}>
                  {estaEditando ? (
                    <input
                      type="number"
                      value={pessoaDraft.idade}
                      onChange={(e) => setPessoaDraft({ ...pessoaDraft, idade: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && salvarEdicaoPessoa(pessoa.idPessoa)}
                    />
                  ) : (
                    pessoa.idade
                  )}
                </td>

                <td className="valor-receita">R$ {receita.toFixed(2)}</td>
                <td className="valor-despesa">R$ {despesa.toFixed(2)}</td>
                <td className={saldo >= 0 ? "valor-saldo-positivo" : "valor-saldo-negativo"}>
                  R$ {saldo.toFixed(2)}
                </td>

                <td>
                  <button className="btn-detalhes" onClick={() => handleToggleDetalhes(pessoa.idPessoa)}>
                    {estaExpandida ? "▲" : "▼"}
                  </button>
                </td>

                {/* ---- Ações: Salvar/Descartar quando editando, Excluir quando não ---- */}
                <td>
                  {estaEditando ? (
                    <div className="acoes-linha">
                      <button className="btn-icone btn-salvar" onClick={() => salvarEdicaoPessoa(pessoa.idPessoa)}>
                        ✓
                      </button>
                      <button className="btn-icone btn-descartar" onClick={cancelarEdicaoPessoa}>
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="acoes-linha">
                        <button className="btn-icone btn-editar" onClick={() => iniciarEdicaoPessoa(pessoa)}>
                            ✎
                        </button>
                        <button
                            className="btn-icone btn-excluir"
                            onClick={() => handleExcluirPessoa(pessoa.idPessoa, pessoa.nome)}
                        >
                            🗑
                        </button>
                    </div>
                  )}
                </td>
              </tr>

              {estaExpandida && (
                <tr className="linha-detalhes">
                  <td colSpan={7}>
                    <ul>
                      {transacoesDetalhe.map((t) => {
                        const editandoEstaTransacao = transacaoEditandoId === t.idTransacao;

                        return (
                          <li key={t.idTransacao}>
                            {editandoEstaTransacao ? (
                              <>
                                <input
                                  autoFocus
                                  value={transacaoDraft.descricao}
                                  onChange={(e) => setTransacaoDraft({ ...transacaoDraft, descricao: e.target.value })}
                                  onKeyDown={(e) => e.key === "Enter" && salvarEdicaoTransacao(t)}
                                />
                                <select
                                  value={transacaoDraft.tipo}
                                  onChange={(e) =>
                                    setTransacaoDraft({ ...transacaoDraft, tipo: e.target.value as "Receita" | "Despesa" })
                                  }
                                >
                                  <option value="Receita">Receita</option>
                                  <option value="Despesa">Despesa</option>
                                </select>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={transacaoDraft.valor}
                                  onChange={(e) => setTransacaoDraft({ ...transacaoDraft, valor: e.target.value })}
                                  onKeyDown={(e) => e.key === "Enter" && salvarEdicaoTransacao(t)}
                                />
                                <div className="acoes-linha">
                                  <button className="btn-icone btn-salvar" onClick={() => salvarEdicaoTransacao(t)}>✓</button>
                                  <button className="btn-icone btn-descartar" onClick={cancelarEdicaoTransacao}>✕</button>
                                </div>
                              </>
                            ) : (
                              <>
                                <span onDoubleClick={() => iniciarEdicaoTransacao(t)}>{t.descricao}</span>
                                <span
                                className={`tag-tipo ${t.tipo === "Receita" ? "tag-receita" : "tag-despesa"}`}
                                onDoubleClick={() => iniciarEdicaoTransacao(t)}
                                >
                                {t.tipo}
                                </span>
                                <span onDoubleClick={() => iniciarEdicaoTransacao(t)}>
                                R$ {t.valor.toFixed(2)}
                                </span>
                                <div className="acoes-linha">
                                <button className="btn-icone btn-editar" onClick={() => iniciarEdicaoTransacao(t)}>
                                    ✎
                                </button>
                                <button
                                    className="btn-icone btn-excluir"
                                    onClick={() => handleExcluirTransacao(t.idTransacao, t.descricao)}
                                >
                                    🗑
                                </button>
                                </div>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </td>
                </tr>
              )}
            </>
          );
        })}
      </tbody>
      <tfoot>
        <tr className="linha-total-geral">
          <td colSpan={2}>Total Geral</td>
          <td className="valor-receita">R$ {totalGeral.receita.toFixed(2)}</td>
          <td className="valor-despesa">R$ {totalGeral.despesa.toFixed(2)}</td>
          <td className={totalGeral.saldo >= 0 ? "valor-saldo-positivo" : "valor-saldo-negativo"}>
            R$ {totalGeral.saldo.toFixed(2)}
          </td>
          <td></td>
          <td></td>
        </tr>
      </tfoot>
    </table>
  );
}