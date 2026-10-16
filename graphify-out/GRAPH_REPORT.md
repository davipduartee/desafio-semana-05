# Graph Report - desafio-semana-05  (2026-10-16)

## Corpus Check
- Corpus is ~1,813 words - fits in a single context window. You may not need a graph.

## Summary
- 69 nodes · 121 edges · 8 communities
- Extraction: 75% EXTRACTED · 25% INFERRED · 0% AMBIGUOUS · INFERRED: 30 edges (avg confidence: 0.9)
- Token cost: 73,358 input · 0 output

## Community Hubs (Navigation)
- Pedidos e Histórico de CEP
- Fetch e Estados de Tela
- Renderização Segura e Pokédex
- Elementos do Buscador de CEP
- Formulário de CEP
- Formulário de Pokémon
- Pedidos Pagos (Parte 1)
- Promises e Event Loop

## God Nodes (most connected - your core abstractions)
1. `Objetos, Dados e Assincronismo - Semana 05` - 8 edges
2. `Parte 2 - Buscador de CEP (ViaCEP)` - 8 edges
3. `Parte 1 - Manipulacao e Validacao de Dados` - 7 edges
4. `Parte 3 - Mini Pokedex (PokeAPI)` - 7 edges
5. `Quatro estados de tela (Carregando, Erro, Vazio, Sucesso)` - 7 edges
6. `Section #parte2 - Buscador de CEP` - 6 edges
7. `renderizarHistorico()` - 5 edges
8. `Parte 4 - Reflexao (Promise.all vs await sequencial)` - 5 edges
9. `Pagina Semana 05 - Objetos, Dados e Assincronismo` - 5 edges
10. `Section #parte1 - Pedidos pagos` - 5 edges

## Surprising Connections (you probably didn't know these)
- `mensagemDeErro()` --implements--> `Quatro estados de tela (Carregando, Erro, Vazio, Sucesso)`  [INFERRED]
  app.js → README.md
- `pedidoValido()` --implements--> `Parte 1 - Manipulacao e Validacao de Dados`  [INFERRED]
  app.js → README.md
- `pedidosPagos` --implements--> `Parte 1 - Manipulacao e Validacao de Dados`  [INFERRED]
  app.js → README.md
- `totalFaturado` --implements--> `Parte 1 - Manipulacao e Validacao de Dados`  [INFERRED]
  app.js → README.md
- `textosPagos` --implements--> `Parte 1 - Manipulacao e Validacao de Dados`  [INFERRED]
  app.js → README.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **CEP search flow (form submit -> validate -> ViaCEP fetch -> render + history)** — index_form_cep, app_limparcep, app_cepvalido, app_buscarcep, readme_viacep_api, app_exibirendereco, app_adicionaraohistorico, app_definirstatus [INFERRED 0.85]
- **Pokemon search flow (form submit -> PokeAPI fetch -> 404 handling -> render)** — index_form_pokemon, app_buscarpokemon, readme_pokeapi, readme_fetch_nao_rejeita_http, app_exibirpokemon, app_definirstatus [INFERRED 0.85]
- **Four UI states pattern (loading/error/empty/success)** — readme_quatro_estados_tela, app_definirstatus, app_mensagemdeerro, index_classes_status, index_status_cep, index_status_pokemon [INFERRED 0.85]

## Communities (8 total, 0 thin omitted)

### Community 0 - "Pedidos e Histórico de CEP"
Cohesion: 0.20
Nodes (15): adicionarAoHistorico(), cepValido(), formatarCep(), historicoCeps, limparCep(), pedidos, pedidosPagos, pedidosValidos (+7 more)

### Community 1 - "Fetch e Estados de Tela"
Cohesion: 0.23
Nodes (11): buscarCep(), buscarPokemon(), definirStatus(), mensagemDeErro(), CSS .status--carregando/--erro/--vazio, AbortSignal.timeout(5000), Fetch API com async/await, Parte 2 - Buscador de CEP (ViaCEP) (+3 more)

### Community 2 - "Renderização Segura e Pokédex"
Cohesion: 0.22
Nodes (10): criarLinha(), exibirEndereco(), exibirPokemon(), resultadoPokemon, statusPokemon, Pagina Semana 05 - Objetos, Dados e Assincronismo, Section #parte3 - Mini Pokedex, div #resultado-pokemon (+2 more)

### Community 3 - "Elementos do Buscador de CEP"
Cohesion: 0.29
Nodes (7): listaHistorico, resultadoCep, statusCep, ul #historico-cep, Section #parte2 - Buscador de CEP, dl #resultado-cep, #status-cep (role=status, aria-live)

### Community 4 - "Formulário de CEP"
Cohesion: 0.33
Nodes (6): btnCep, formCep, inputCep, Button #btn-cep, Form #form-cep, Input #cep

### Community 5 - "Formulário de Pokémon"
Cohesion: 0.33
Nodes (6): btnPokemon, formPokemon, inputPokemon, Button #btn-pokemon, Form #form-pokemon, Input #pokemon

### Community 6 - "Pedidos Pagos (Parte 1)"
Cohesion: 0.60
Nodes (5): renderizarPedidos(), #lista-pedidos, Section #parte1 - Pedidos pagos, #resumo-pedidos, #total-faturado

### Community 7 - "Promises e Event Loop"
Cohesion: 0.70
Nodes (5): await sequencial, Event Loop e microtarefas, Parte 4 - Reflexao (Promise.all vs await sequencial), Promise.all, Promise.allSettled

## Knowledge Gaps
- **2 isolated node(s):** `ViaCEP API`, `PokeAPI`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 3 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Objetos, Dados e Assincronismo - Semana 05` connect `Renderização Segura e Pokédex` to `Pedidos e Histórico de CEP`, `Fetch e Estados de Tela`, `Promises e Event Loop`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `Parte 1 - Manipulacao e Validacao de Dados` (e.g. with `pedidosPagos` and `pedidoValido()`) actually correct?**
  _`Parte 1 - Manipulacao e Validacao de Dados` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `ViaCEP API`, `PokeAPI` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Why does `Parte 4 - Reflexao (Promise.all vs await sequencial)` connect `Promises e Event Loop` to `Renderização Segura e Pokédex`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Parte 3 - Mini Pokedex (PokeAPI)` (e.g. with `exibirPokemon()` and `Section #parte3 - Mini Pokedex`) actually correct?**
  _`Parte 3 - Mini Pokedex (PokeAPI)` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Why does `Parte 2 - Buscador de CEP (ViaCEP)` connect `Fetch e Estados de Tela` to `Pedidos e Histórico de CEP`, `Renderização Segura e Pokédex`, `Elementos do Buscador de CEP`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `Quatro estados de tela (Carregando, Erro, Vazio, Sucesso)` (e.g. with `definirStatus()` and `mensagemDeErro()`) actually correct?**
  _`Quatro estados de tela (Carregando, Erro, Vazio, Sucesso)` has 4 INFERRED edges - model-reasoned connections that need verification._