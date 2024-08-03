## TODO
- [x] Login
- [x] Proteger rotas de criar usuarios aluno
- [x] Proteter rota de criar usuarios personal
- [x] implementar cache para salvar dados do usuario e utilizar na buscar do login e nos guards de autenticação

## ideias
- implementar chat com personal durante a execução de um treino
- implementar modulo de nutricionista

# CRUD
**Cadatros de recursos da aplicação**

## users
- [x] criar usuario aluno
- [x] criar usuario personal
- [x] editar aluno
- [ ] editar personal
- [x] excluir aluno
- [ ] excluir personal
- [ ] redefinir senha aluno
- [ ] redefinir senha personal

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
