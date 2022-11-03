# Comandos
  Criar arquivo tsconfig.json => npx tsc --init
  Converter ts para js => npx tsc
  Converter automaticamente, compila o código e executa => tsx src/server.ts
  Atualiza altomaticamente ao salvar => tsx watch src/server.ts
  Iniciando setup prisma com SQLite => npx prisma init --datasource-provider sqlite
  detecta que uma tabela foi criada e pede o nome para a migration => npx prisma migrate dev
  visualizar o banco pelo navegador => npx prisma studio


# Prisma
  Cada Tabela no prisma é chamada de model
  @id => indica que o campo vai ser a primary key
  @defaul(cuid()) => gera o valor altomaticamente
  log: ['query'], => prisma pinta um log de todas as querys que foram executados