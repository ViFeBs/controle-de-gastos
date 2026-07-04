# controle-de-gastos
Uma api e interface para gerir gastos residenciais.

# Este projeto é dividido em duas partes:
API (.NET / C#, com SQLite + Dapper) — pasta backend/
Front-end (React + TypeScript, via Vite) — pasta frontend/ 

Intruções para inicialização
1. Iniciar o backend
   
1.1 Restaurar as dependências usando o comando na pasta backend

dotnet restore

1.2 Confiar no certificado HTTPS de desenvolvimento (só na primeira vez, por máquina)

bashdotnet dev-certs https --trust

1.3 Rodar a API

bashdotnet run

2. Iniciar o frontend
   
2.1 Instalar as dependências

npm install

2.2 Conferir a porta configurada da API

Abra o arquivo src/services/api.ts e confirme se a porta em qualquer uma das funções bate com a porta que a API mostrou no terminal (passo 1.3):

export const getPessoas = async (): Promise<Pessoa[]> => {
  const response = await axios.get<Pessoa[]>("http://localhost:8080/api/pessoa/");
  console.log(response)
  return response.data;
};

2.3 Conferir a porta liberada no CORS da API

Ao rodar npm run dev (próximo passo), o React normalmente sobe em http://localhost:5173. Confirme que essa porta está liberada no Program.cs da API:

policy.WithOrigins("http://localhost:5173")

2.4 Rodar o front-end

npm run dev
