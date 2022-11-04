# Comandos
  Criar arquivo tsconfig.json => npx tsc --init
  Converter ts para js => npx tsc
  Converter automaticamente, compila o código e executa => tsx src/server.ts
  Atualiza altomaticamente ao salvar => tsx watch src/server.ts
  Iniciando setup prisma com SQLite => npx prisma init --datasource-provider sqlite
  detecta que uma tabela foi criada e pede o nome para a migration => npx prisma migrate dev
  visualizar o banco pelo navegador => npx prisma studio
  criar a seed => npx prisma db seed


# Banco de Dados
  - SEED: arquivo que pré-popula o banco com alguns dados "fictícios" para ambiente de desenvolvimento
        EX: para testar a funcionalidade de paltipite, é necessario ter, o jogo cadastrado o usuário cadastrado, participant cadastrado, bolão cadastrado...  

  - TIMESTAMP: salvar datas no bamco de dados com timestamp 
             EX: salvar a data nessa formato '2022-11-02 18:00:00' é 18Hrs, porém em qual time zone? Brasil? UTC? não fica explicito.  
             - salvar no formato '2022-11-04T12:44:31.121Z' -> Date().toISOString(). dessa forma pega seu time zone local 

## Prisma
  Cada Tabela no prisma é chamada de model
  @id => indica que o campo vai ser a primary key
  @defaul(cuid()) => gera o valor altomaticamente
  log: ['query'], => prisma pinta um log de todas as querys que foram executados
  **Tabela pivô:** tabela que persiste um relacionamentos de *muitos para muitos*
                   Na aplicação a tabela pivo será a de *participantes*: como cada *bolão pode ter muitos Usuários* e o mesmo *usuario pode participar de varios boloes*, a tabela pivo fica no meio gernciando esse relacionamento
  - Prisma permite fazer incersões encadeadas:  
    EX: pode ser criado um Participante ao mesmo tempo que se está criando uma Pool

## Relaconamentos
  Guess -> Game => **Guess** sempre vai estar relacionado a algum **Game**  
  Guess -> Participante => um **Guess** sempre vai ser feito por um **Participant**  
  User - Paricipante - Pool => o **User** vai poder fazer parte de _vários_ **Pools** atraves da tabela pivo **Participant**
  Pool -> User => **Pool** sempre vai ter um dono/criador que será um **User**. OBS: o owner vai poder ser null pois na versão web não é feito o login então o bolão pode ser criado sem um owner, mas a 1° pessoa que acessar o bolão será altomaticamente trnasformada em owner
  
  @@unique([userId, poolId]) => O mesmo usuário só vai está participando uma vez no mesmo bolão, ele não pode aparecer varias vezes no mesmo bolão.