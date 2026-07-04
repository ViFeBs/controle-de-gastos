
//modelo para o get que é um inner join da tabela pessoa e transação
export interface PessoaTransacao {
  idTransacao: number;
  descricao: string;
  valor: number;
  tipo: "Receita" | "Despesa";
  pessoa: number;   // FK: IdPessoa
  nome: string;     // Nome da Pessoa
  idade: number;    // Idade da Pessoa
}

//todos os campos devem ficar em minusculo
export interface Pessoa {
  idPessoa: number;
  nome: string;
  idade: number;
}

export interface Transacao {
  idTransacao: number;
  descricao: string;
  valor: number;
  tipo: "Receita" | "Despesa";
  pessoa: number; // FK: IdPessoa
}

// Formatos de envio
export interface PessoaCreateDto {
  nome: string;
  idade: number;
}

export interface TransacaoCreateDto {
  descricao: string;
  valor: number;
  tipo: "Receita" | "Despesa";
  pessoa: number;
}

export interface PessoaUpdateDto {
  nome: string;
  idade: number;
}

export interface TransacaoUpdateDto {
  descricao: string;
  valor: number;
  tipo: "Receita" | "Despesa";
  pessoa: number;
}