# Objetos, Dados e Assincronismo – Semana 05

Mini projeto de consumo de APIs e manipulação dinâmica do DOM com JavaScript puro, aplicando objetos, arrays, `Promises`, `async/await`, Fetch API e os quatro estados de uma tela (**Carregando, Erro, Vazio, Sucesso**).

## Como executar

Basta abrir o arquivo `index.html` no navegador (ou usar a extensão *Live Server* do VS Code). Não há dependências.

## Estrutura

```
├── index.html   # Estrutura da página e estilos
├── app.js       # Toda a lógica (partes 1, 2 e 3)
└── README.md    # Este arquivo (inclui a reflexão da parte 4)
```

## O que foi feito

### Parte 1 – Manipulação e Validação de Dados
- Array de objetos `pedidos` com casos válidos e inválidos.
- Validação: cliente não vazio (`trim()`) e valor numérico maior que 0.
- Filtro dos pedidos com status `"pago"`.
- Total faturado calculado com `reduce`.
- Textos no formato `"Bia — R$ 120.00"` com `toFixed(2)`, exibidos na página e no console.

### Parte 2 – Buscador de CEP (API ViaCEP)
- Formulário com `e.preventDefault()` no evento `submit`.
- Validação com `.trim()` e expressões regulares: aceita `01001000` ou `01001-000`, exige exatamente 8 dígitos.
- `fetch` com `async/await` em `https://viacep.com.br/ws/{cep}/json/`, com `AbortSignal.timeout(5000)`.
- Quatro estados:
  - **Carregando:** aviso "Buscando..." e botão desabilitado.
  - **Erro:** falhas de rede, timeout e erros HTTP (`!response.ok`).
  - **Vazio:** quando a API retorna a chave `erro` → "CEP não encontrado".
  - **Sucesso:** `replaceChildren()` limpa o resultado anterior e os pares `<dt>`/`<dd>` (Rua, Bairro, Cidade, UF) são criados com `createElement` + `textContent`.
- **Bônus:** histórico de CEPs pesquisados guardado em um array de objetos e listado na tela.

### Parte 3 – Mini Pokédex (PokéAPI)
- Campo de busca validado (não vazio) e convertido para minúsculo.
- `fetch` com `async/await` em `https://pokeapi.co/api/v2/pokemon/{nome}`.
- Exibe nome, imagem (`sprites.front_default`) e tipos.
- Quatro estados, com o **404 tratado como "Pokémon não encontrado"** — o `fetch` não rejeita em erros HTTP, por isso o `response.status`/`response.ok` é verificado.

### Segurança
Nenhum dado vindo das APIs é inserido com `innerHTML`; todo o conteúdo é criado com `createElement` e `textContent`, evitando XSS.

## Parte 4 – Reflexão

**Por que `Promise.all` pode ser mais rápido que vários `await` seguidos?**

Quando usamos vários `await` em sequência, cada requisição só **começa** depois que a anterior **termina**. O tempo total é a soma dos tempos de cada uma:

```js
const a = await fetch(url1);
const b = await fetch(url2);
const c = await fetch(url3);
```

Já o `Promise.all` recebe as promises **já disparadas** e espera todas terminarem juntas. As requisições correm em paralelo enquanto o navegador aguarda a rede, então o tempo total fica próximo ao da requisição **mais lenta**:

```js
const [a, b, c] = await Promise.all([fetch(url1), fetch(url2), fetch(url3)]);
```

Isso funciona porque o JavaScript não fica "parado" esperando a rede: a espera acontece fora da thread principal, e o Event Loop só retoma o código (como microtarefa) quando as respostas chegam. Ao disparar tudo de uma vez, aproveitamos melhor esse tempo de rede.

O `await` sequencial continua sendo a escolha certa quando uma requisição **depende** do resultado da anterior. Vale lembrar também que o `Promise.all` rejeita assim que **qualquer** promise falhar; se for preciso o resultado de todas mesmo com falhas, usa-se `Promise.allSettled`.
