## Deploy no Render com MongoDB Atlas

O arquivo `render.yaml` configura a API como um Web Service no plano gratuito,
com build, comando de inicialização e health check na rota `/`.

1. Crie um cluster no MongoDB Atlas e um usuário de banco.
2. Em **Connect > Drivers**, copie a connection string no formato
   `mongodb+srv://...`.
3. No Render, crie um **Blueprint** apontando para este repositório.
4. Informe `MONGODB_URI` e `FRONTEND_APP_URL` quando solicitado.
5. No Atlas, autorize as faixas de IP de saída mostradas em
   **Render > Service > Connect > Outbound**.

Para destravar somente o primeiro deploy, o Atlas pode ser configurado
temporariamente com `0.0.0.0/0`. Depois, substitua essa regra pelas faixas de
saída do Render. A variável `APP_KEY` é gerada automaticamente pelo Blueprint.

Em desenvolvimento local, as variáveis antigas `MONGODB_HOST`,
`MONGODB_PORT`, `MONGODB_USER` e `MONGODB_PWD` continuam compatíveis com o
Docker Compose.

## TODO
- [x] Login
- [x] Proteger rotas de criar usuarios aluno
- [x] Proteter rota de criar usuarios personal
- [x] implementar cache para salvar dados do usuario e utilizar na buscar do login e nos guards de autenticação

## ideias
- implementar chat com personal durante a execução de um treino
- implementar modulo de nutricionista
- implementar agenda do personal:
  - informar os dias e horarios que tem agendamento com os alunos
  - implemetar confirmação do aluno se irá comparecer ao treino no dia


# CRUD
**Cadatros de recursos da aplicação**

## users
- [x] criar usuario aluno
- [x] criar usuario personal
- [x] editar aluno
- [ ] editar personal
- [x] excluir aluno
- [ ] excluir personal
- [x] redefinir senha aluno
- [x] redefinir senha personal

## exercises
- [x] criar exercicio
- [x] editar exercicio
- [x] excluir exercicio
- [x] listar exercicios

## trainings
- [x] criar treino
- [x] editar treino
- [x] excluir treino
- [x] listar treinos

## training progress
- [x] iniciar treino
- [x] finalizar treino
- [x] cancelar treino

# Casos de uso
## Ator personal
- [x] fazer login
- [x] cadastro de alunos
- [ ] consultar dados de aluno
- [x] cadastro de exercicios
- [x] cadastro de treinos

## Ator aluno
- [x] fazer login
- [ ] atualizar o perfil
  - peso, altura, objetivo (perda de peso, ganho de massa magra)
- [x] listar os treinos disponiveis
- [x] iniciar um treino
- [x] cancelar treino
- [x] finalizar um treino
  - informar feedback do treino
  - informar comentario sobre o treino (opcional)
- [ ] consultar relatório de treinos finalizados

## Ator nutricionista
- [ ] fazer login
- [ ] criar plano para aluno
- [ ] consultar dados do aluno
