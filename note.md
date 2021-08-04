## Exemplo de Arquetura de um Soft.

1. Pasta Core e Features(Raiz do Projeto)
   - Pastas internas como Domain,Infra e Presentation
   - Pastas tera o arquivo index para facilitar chamar os arquivos internos
   - Nas pastas Features os Arquivos terão nome da "Aplicação.serviço" "project.controller"
2. Pasta Core (Raiz do Projeto)
   1. Domain
      - Interfaces
   2. Infra
      - Adapter
      - Data
        - connections (config para conexão como database)
        - database
          - entities (typeorm: config as entidades para chamar as tabelas e colunas)
          - migration (criação das colunas e tabelas)
   3. Presentation
      - Modelos Bases para as Features como Middleware e Tratamento de Erros como Status(Abstract?)
3. Pasta Features
   1. Pasta com Nome da Aplicação (Ex: login)
      1. domain
         - Models com as Interfaces da App
      2. infra
         - repositories , função com parametros necessarios para request e response
      3. presentation
         - controllers: funções para controlar repositories e request
         - middlewares: intercptadores q intervem para fazer o tratamento de dados
         - routes: recebe o o nome da rota e middleware para tratar e enviar para os controllers.
4. Criação
   1. Fazer Migration
   2. Fazer Entities
   3. Fazer os Repositories
   4. Fazer os Controllers
   5. Fazer as Rotas
   6. Fazer as Requisições(Teste - REST)
   7. Fazer Middleware (Tratatamentos)
