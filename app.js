'use strict';

function definirStatus(elemento, mensagem, tipo) {
  elemento.textContent = mensagem;
  elemento.className = tipo ? `status status--${tipo}` : 'status';
}

function mensagemDeErro(erro) {
  if (erro.name === 'TimeoutError') {
    return 'O servidor demorou demais para responder. Tente novamente.';
  }
  if (erro.message.startsWith('HTTP')) {
    return `Falha na conexão com o servidor (${erro.message}). Tente novamente.`;
  }
  return 'Falha na conexão. Verifique sua internet e tente novamente.';
}

const pedidos = [
  { cliente: 'Bia', valor: 120, status: 'pago' },
  { cliente: 'Carlos', valor: 75.5, status: 'pendente' },
  { cliente: '', valor: 50, status: 'pago' },
  { cliente: 'Duda', valor: 0, status: 'pago' },
  { cliente: 'Edu', valor: 89.9, status: 'pago' },
  { cliente: 'Fernanda', valor: '200', status: 'pago' },
  { cliente: '   ', valor: 30, status: 'pago' },
  { cliente: 'Gabi', valor: 45.25, status: 'cancelado' },
  { cliente: 'Hugo', valor: 310.4, status: 'pago' },
];

function pedidoValido(pedido) {
  const clienteOk = typeof pedido.cliente === 'string' && pedido.cliente.trim() !== '';
  const valorOk = typeof pedido.valor === 'number' && Number.isFinite(pedido.valor) && pedido.valor > 0;
  return clienteOk && valorOk;
}

const pedidosValidos = pedidos.filter(pedidoValido);
const pedidosPagos = pedidosValidos.filter((pedido) => pedido.status === 'pago');
const totalFaturado = pedidosPagos.reduce((soma, pedido) => soma + pedido.valor, 0);
const textosPagos = pedidosPagos.map(
  (pedido) => `${pedido.cliente.trim()} — R$ ${pedido.valor.toFixed(2)}`
);

console.log('Pedidos válidos:', pedidosValidos);
console.log('Pedidos pagos:', textosPagos);
console.log(`Total faturado: R$ ${totalFaturado.toFixed(2)}`);

function renderizarPedidos() {
  const itens = textosPagos.map((texto) => {
    const li = document.createElement('li');
    li.textContent = texto;
    return li;
  });
  document.querySelector('#lista-pedidos').replaceChildren(...itens);

  document.querySelector('#resumo-pedidos').textContent =
    `${pedidos.length} pedidos recebidos · ${pedidosValidos.length} válidos · ${pedidosPagos.length} pagos`;

  document.querySelector('#total-faturado').textContent =
    `Total faturado: R$ ${totalFaturado.toFixed(2)}`;
}

renderizarPedidos();

const formCep = document.querySelector('#form-cep');
const inputCep = document.querySelector('#cep');
const btnCep = document.querySelector('#btn-cep');
const statusCep = document.querySelector('#status-cep');
const resultadoCep = document.querySelector('#resultado-cep');
const listaHistorico = document.querySelector('#historico-cep');

const historicoCeps = [];

function limparCep(valor) {
  return valor.trim().replace(/[-.\s]/g, '');
}

function cepValido(cep) {
  return /^\d{8}$/.test(cep);
}

function formatarCep(cep) {
  return cep.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

async function buscarCep(cep) {
  const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
    signal: AbortSignal.timeout(5000),
  });

  if (!resposta.ok) {
    throw new Error(`HTTP ${resposta.status}`);
  }

  return resposta.json();
}

function criarLinha(termo, descricao) {
  const dt = document.createElement('dt');
  dt.textContent = termo;
  const dd = document.createElement('dd');
  dd.textContent = descricao || '—';
  return [dt, dd];
}

function exibirEndereco(dados) {
  resultadoCep.replaceChildren(
    ...criarLinha('Rua', dados.logradouro),
    ...criarLinha('Bairro', dados.bairro),
    ...criarLinha('Cidade', dados.localidade),
    ...criarLinha('UF', dados.uf)
  );
}

function adicionarAoHistorico(cep, dados) {
  const indice = historicoCeps.findIndex((item) => item.cep === cep);
  if (indice !== -1) {
    historicoCeps.splice(indice, 1);
  }

  historicoCeps.unshift({
    cep,
    rua: dados.logradouro,
    cidade: dados.localidade,
    uf: dados.uf,
    buscadoEm: new Date(),
  });

  renderizarHistorico();
}

function renderizarHistorico() {
  if (historicoCeps.length === 0) {
    const li = document.createElement('li');
    li.className = 'vazio-lista';
    li.textContent = 'Nenhum CEP pesquisado ainda.';
    listaHistorico.replaceChildren(li);
    return;
  }

  const itens = historicoCeps.map((item) => {
    const li = document.createElement('li');
    const hora = item.buscadoEm.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const rua = item.rua ? `${item.rua}, ` : '';
    li.textContent = `${formatarCep(item.cep)} — ${rua}${item.cidade}/${item.uf} (${hora})`;
    return li;
  });
  listaHistorico.replaceChildren(...itens);
}

formCep.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const cep = limparCep(inputCep.value);

  if (!cepValido(cep)) {
    resultadoCep.replaceChildren();
    definirStatus(statusCep, 'CEP inválido: digite exatamente 8 números (ex: 01001000 ou 01001-000).', 'erro');
    inputCep.focus();
    return;
  }

  definirStatus(statusCep, 'Buscando...', 'carregando');
  btnCep.disabled = true;
  resultadoCep.replaceChildren();

  try {
    const dados = await buscarCep(cep);

    if (dados.erro) {
      definirStatus(statusCep, 'CEP não encontrado.', 'vazio');
      return;
    }

    exibirEndereco(dados);
    definirStatus(statusCep, '', null);
    adicionarAoHistorico(cep, dados);
  } catch (erro) {
    console.error('Erro ao buscar CEP:', erro);
    definirStatus(statusCep, mensagemDeErro(erro), 'erro');
  } finally {
    btnCep.disabled = false;
  }
});

renderizarHistorico();

const formPokemon = document.querySelector('#form-pokemon');
const inputPokemon = document.querySelector('#pokemon');
const btnPokemon = document.querySelector('#btn-pokemon');
const statusPokemon = document.querySelector('#status-pokemon');
const resultadoPokemon = document.querySelector('#resultado-pokemon');

async function buscarPokemon(nome) {
  const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(nome)}`, {
    signal: AbortSignal.timeout(5000),
  });

  if (resposta.status === 404) {
    return null;
  }

  if (!resposta.ok) {
    throw new Error(`HTTP ${resposta.status}`);
  }

  return resposta.json();
}

function exibirPokemon(dados) {
  const imagem = dados.sprites.front_default;
  let figura;

  if (imagem) {
    figura = document.createElement('img');
    figura.src = imagem;
    figura.alt = `Imagem de ${dados.name}`;
  } else {
    figura = document.createElement('p');
    figura.className = 'vazio-lista';
    figura.textContent = 'Sem imagem disponível';
  }

  const info = document.createElement('div');

  const titulo = document.createElement('h3');
  titulo.textContent = `${dados.name} #${String(dados.id).padStart(3, '0')}`;

  const tipos = document.createElement('div');
  tipos.className = 'tipos';
  const etiquetas = dados.types.map((item) => {
    const span = document.createElement('span');
    span.className = 'tipo';
    span.textContent = item.type.name;
    return span;
  });
  tipos.replaceChildren(...etiquetas);

  info.replaceChildren(titulo, tipos);
  resultadoPokemon.replaceChildren(figura, info);
}

formPokemon.addEventListener('submit', async (evento) => {
  evento.preventDefault();

  const nome = inputPokemon.value.trim().toLowerCase().replace(/\./g, '').replace(/\s+/g, '-');

  if (nome === '') {
    resultadoPokemon.replaceChildren();
    definirStatus(statusPokemon, 'Digite o nome de um Pokémon.', 'erro');
    inputPokemon.focus();
    return;
  }

  definirStatus(statusPokemon, 'Buscando...', 'carregando');
  btnPokemon.disabled = true;
  resultadoPokemon.replaceChildren();

  try {
    const dados = await buscarPokemon(nome);

    if (dados === null) {
      definirStatus(statusPokemon, 'Pokémon não encontrado.', 'vazio');
      return;
    }

    exibirPokemon(dados);
    definirStatus(statusPokemon, '', null);
  } catch (erro) {
    console.error('Erro ao buscar Pokémon:', erro);
    definirStatus(statusPokemon, mensagemDeErro(erro), 'erro');
  } finally {
    btnPokemon.disabled = false;
  }
});
