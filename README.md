## TODO
- [x] Login
- [x] Proteger rotas de criar usuarios aluno
- [x] Proteter rota de criar usuarios personal
- [ ] implementar cache para salvar dados do usuario e utilizar na buscar do login e nos guards de autenticação


# CRUD
**Cadatros de recursos da aplicação**

## users
- [x] criar usuario aluno
- [x] criar usuario personal
- [ ] editar aluno
- [ ] editar personal
- [ ] excluir aluno
- [ ] excluir personal
- [ ] redefinir senha aluno
- [ ] redefinir senha personal

## exercises
- [ ] criar exercicio
- [ ] editar exercicio
- [ ] excluir exercicio
- [ ] listar exercicios

## trainings
- [ ] criar treino
- [ ] editar treino
- [ ] excluir treino
- [ ] listar treinos

## training sheet
- [ ] criar ficha de treino
- [ ] editar ficha de treino
- [ ] excluir ficha de treino
- [ ] listar ficha de treinos

# Casos de uso
## Criar usuario personal
- [x] Criar guard para somente usuarios admins

## Criar usuario aluno
- [x] Criar guard para somente usuarios personal

## Criar cadastro de exercicios
- [ ] Criar guard para somente usuarios personal

## Criar ficha de treino
- [ ] Criar guard para somente usuarios personal

## Atribuir uma ficha de treino a um aluno

## Ativar/Desativar aluno

## Iniciar um treino
- [ ] Criar guard para somente usuarios aluno
- [ ] Iniciar um treino cria uma copia do dia do treino
