Requer servidor

- nodeJs

Instalando no Servidor

1. packages
   executar comando na pasta do projeto: yarn

2. banco de dados via docker

- PostgresSQL:
  docker run --name tireitu -e POSTGRES_PASSWORD='senha do banco' -p 5432:5432 -d postgres:11

- MongoDB:
  docker run --name mongotireitu -p 27017:27017 -d -t mongo

3. Migrations
   criar banco de dados usando algum gerenciador de banco: tireitu
   executar comando na pasta do projeto: yarn sequelize db:migrate
