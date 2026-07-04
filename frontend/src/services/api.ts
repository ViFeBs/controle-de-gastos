// estou usando axios ao invés de fetch para facilitar no consumo do json
import axios from "axios";
import type { Pessoa, PessoaCreateDto, PessoaUpdateDto, Transacao, TransacaoCreateDto, TransacaoUpdateDto, PessoaTransacao } from "../types";


// -------- Pessoa --------

//Busca as pessoas
export const getPessoas = async (): Promise<Pessoa[]> => {
  const response = await axios.get<Pessoa[]>("http://localhost:8080/api/pessoa/");
  console.log(response)
  return response.data;
};

//Cadastra uma pessoa
export const createPessoa = async (pessoa: PessoaCreateDto): Promise<Pessoa> => {
  const response = await axios.post<Pessoa>("http://localhost:8080/api/pessoa/", pessoa);
  return response.data;
};

//atualiza pessoa
export const updatePessoa = async (id: number, pessoa: PessoaUpdateDto): Promise<void> => {
  await axios.put(`http://localhost:8080/api/pessoa/${id}`, pessoa);
};

//exclui uma pessoa
export const deletePessoa = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:8080/api/pessoa/${id}`);
};

// -------- Transação --------

//Busca todas as transações junto as pessoas ligadas a essas transações
export const getTodasTransacoes = async (): Promise<PessoaTransacao[]> => {
  const response = await axios.get<PessoaTransacao[]>("http://localhost:8080/api/transacao");
  return response.data;
};

//Busca Todas as transações de uma pessoa
export const getTransacoesPorPessoa = async (idPessoa: number): Promise<PessoaTransacao[]> => {
  const response = await axios.get<PessoaTransacao[]>(`http://localhost:8080/api/transacao/pessoa/${idPessoa}`);
  return response.data;
};

//cadastra uma transação
export const createTransacao = async (transacao: TransacaoCreateDto): Promise<Transacao> => {
  const response = await axios.post<Transacao>("http://localhost:8080/api/transacao", transacao);
  return response.data;
};

//atualiza transação
export const updateTransacao = async (id: number, transacao: TransacaoUpdateDto): Promise<void> => {
  await axios.put(`http://localhost:8080/api/transacao/${id}`, transacao);
};

//exclui uma transação
export const deleteTransacao = async (id: number): Promise<void> => {
  await axios.delete(`http://localhost:8080/api/transacao/${id}`);
};