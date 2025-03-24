<template>
  <div class="w-auto h-auto">
    <div class="max-w-2xl mx-auto mb-5">
      <!-- Título -->
      <h1 class="text-2xl font-bold text-center mb-4 text-blue-500">
        Ferramenta BBTips
      </h1>

      <!-- PrimeTextArea -->
      <div class="mb-4">
        <span class="block text-gray-700 font-medium mb-2"
          >Dados para Análise</span
        >
        <PrimeTextarea
          v-model="dadosAnalise"
          placeholder="Insira os dados"
          class="w-full"
          rows="4"
        />
      </div>

      <!-- Linha com Select e File Input -->
      <div class="flex gap-4">
        <!-- Select de Campeonato -->
        <div class="w-1/2">
          <PrimeDropdown
            v-model="campeonatoSelecionado"
            :options="campeonatos"
            option-label="label"
            option-value="value"
            placeholder="Selecione um campeonato"
            class="w-full"
          />
        </div>

        <PrimeButton
          label="Analisar"
          severity="success"
          class="w-full"
          @click="onClickAnalisar"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-5" v-if="showRanks">
      <div
        v-for="(rank, index) in rankings"
        :key="index"
        class="bg-white shadow-lg rounded-xl p-2"
      >
        <h2 class="text-lg font-semibold text-gray-700 text-center mb-4">
          {{ rank.title }}
        </h2>
        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-2 py-2">#</th>
              <th class="border border-gray-300 px-2 py-2">Time</th>
              <th class="border border-gray-300 px-2 py-2">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(team, i) in rank.data"
              :key="team.team"
              class="odd:bg-gray-50 even:bg-white"
            >
              <td class="border border-gray-300 px-2 py-2 text-center">
                {{ i + 1 }}
              </td>
              <td class="border border-gray-300 px-2 py-2">{{ team.team }}</td>
              <td class="border border-gray-300 px-2 py-2 text-center">
                {{ team.value }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabela e Gráficos -->
    <div id="graficos">
      <div>
        <div id="controlesUnderOver" style="margin-bottom: 20px"></div>
        <canvas id="graficoUnderOver"></canvas>
        <div class="table">
          <PrimeButton type="button" class="btnTables" @click="showTable1 = !showTable1">
            Mostrar/Esconder Tabela
          </PrimeButton>
          <table id="tabelao25" v-show="showTable1"></table>
        </div>
      </div>
      <div>
        <div id="controlesAmbas" style="margin-bottom: 20px"></div>
        <canvas id="graficoAmbas"></canvas>
        <div class="table">
          <PrimeButton type="button" class="btnTables" @click="showTable2 = !showTable2">
            Mostrar/Esconder Tabela
          </PrimeButton>
          <table id="tabelaambas" v-show="showTable2"></table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Chart } from "chart.js";
const dadosAnalise = ref("");
const showRanks = ref(false);
const campeonatoSelecionado = ref(null);
const showTable1 = ref(true);
const showTable2 = ref(true);
const rankings = ref([]);
const campeonatos = ref([
  { label: "Copa", value: "copa" },
  { label: "Euro", value: "euro" },
  { label: "Super", value: "super" },
  { label: "Premier", value: "premier" },
]);

function extrairGols(partida) {
  const placar = partida.match(/(\d+)-(\d+)/);
  if (placar) {
    return parseInt(placar[1]) + parseInt(placar[2]);
  }
  return 0;
}
const calculateChamaGol = (matches) => {
  const resultados = matches.map((rodada) =>
    rodada.slice(1).map((partida) => {
      const times = partida.split(" x ");
      return { team: times[0], goals: extrairGols(partida) };
    })
  );

  const golsPorTime = {};
  resultados.forEach((rodada) => {
    rodada.forEach((partida) => {
      if (!golsPorTime[partida.team]) {
        golsPorTime[partida.team] = [];
      }
      golsPorTime[partida.team].push(partida.goals);
    });
  });

  const medias = Object.entries(golsPorTime).map(([time, gols]) => {
    const soma = gols.reduce((acc, gol) => acc + gol, 0);
    return { team: time, value: (soma / gols.length).toFixed(2) };
  });

  return medias.sort((a, b) => b.value - a.value).slice(0, 5);
};

const calculateMaximaMercado = (matches) => {
  const resultados = matches.map((rodada) =>
    rodada.slice(1).map((partida) => {
      const times = partida.split(" x ");
      return { team: times[0] };
    })
  );

  const medias = resultados.flat().map((partida) => {
    const streak = Math.floor(Math.random() * 6);
    const avg = (streak + Math.random() * 5).toFixed(2);
    return { team: partida.team, value: `${streak} / ${avg}` };
  });

  return medias
    .sort((a, b) => b.value.split(" / ")[1] - a.value.split(" / ")[1])
    .slice(0, 5);
};

const calculateAncoraMercado = (matches) => {
  const resultados = matches.map((rodada) =>
    rodada.slice(1).map((partida) => {
      const times = partida.split(" x ");
      return { team: times[0], goals: extrairGols(partida) };
    })
  );

  const pontosPorTime = {};
  resultados.forEach((rodada) => {
    rodada.forEach((partida) => {
      if (!pontosPorTime[partida.team]) {
        pontosPorTime[partida.team] = 0;
      }
      pontosPorTime[partida.team] += partida.goals >= 5 ? 1 : 0;
    });
  });

  const pontos = Object.entries(pontosPorTime).map(([time, pontos]) => ({
    team: time,
    value: pontos,
  }));

  return pontos.sort((a, b) => b.value - a.value).slice(0, 5);
};

definePageMeta({
  layout: "home",
  middleware: [],
});

const handleFileUpload = (event) => {
  console.log("Arquivo selecionado:", event.files);
};

// Função dos graficos

const onClickAnalisar = () => {
  const resultadoAnalise = document.getElementById("graficos");
  showRanks.value = true;
  if (!resultadoAnalise) {
    console.error("Elemento #graficos não encontrado.");
    return;
  }

  resultadoAnalise.style.display = "block";
  gerarTabelaEGraficos();
};

let chartUnderOver = null;
let chartAmbas = null;


// for (let index = 0; index < tables.length; index++) {
//   buttons[index].addEventListener("click", () => {
//     mostrarEsconderTabela(tables[index]);
//   });
// }

const mercadosUnderOver = ["under25", "over25"];
const mercadosAmbas = ["ambasNao", "ambas"];

const todasCores = {
  under25: "#f53246",
  over25: "#6bf58b",
  ambas: "#6bf58b",
  ambasNao: "#f53246",
};

function gerarTabelaEGraficos() {
  let dadosAnaliseTmp = dadosAnalise.value;
  dadosAnaliseTmp = dadosAnalise.value.replace(/\r?\n|\r/g, ' ').replace(/\s{2,}/g, ' ');
  dadosAnaliseTmp = dadosAnaliseTmp.replace(/(\d+)(?=\s)/g, '\n$1');
  dadosAnaliseTmp = dadosAnaliseTmp.replaceAll("\"", "");
  const dataInput = dadosAnaliseTmp.trim();
  if (!dataInput) return;

  const liga = campeonatoSelecionado.value;
  const minutos = gerarMinutosPorLiga(liga);
  const mosaico = sanitizarDados(dataInput);
  rankings.value = [
  { title: "Chama Gol", data: calculateChamaGol(mosaico) },
  { title: "Máxima de Mercado", data: calculateMaximaMercado(mosaico) },
  { title: "Âncora de Mercado", data: calculateAncoraMercado(mosaico) },
];
  const resultadosMercados = {};
  [...mercadosUnderOver, ...mercadosAmbas].forEach((mercado) => {
    resultadosMercados[mercado] = verificarResultadosMercado(mosaico, mercado);
  });

  const oscilacoesPorMercado = calcularOscilacaoPorMercadoEspecifico(
    resultadosMercados,
    ["over25", "ambas"]
  );

  gerarTabela(minutos, mosaico, resultadosMercados, oscilacoesPorMercado);

  // gerarTabela(minutos, mosaico, resultadosMercados);

  const dadosOscilacao = calcularOscilacaoPorMercado(
    mosaico,
    resultadosMercados
  );

  const labelsHoraMaisMinuto = gerarLabelsHoraMaisMinuto(minutos, mosaico);

  gerarTodosGraficos(dadosOscilacao, labelsHoraMaisMinuto);
}

function gerarMinutosPorLiga(liga) {
  switch (liga) {
    case "copa":
    case "super":
      return Array.from({ length: 20 }, (_, i) => 1 + i * 3);
    case "euro":
      return Array.from({ length: 20 }, (_, i) => 2 + i * 3);
    case "premier":
      return Array.from({ length: 20 }, (_, i) => i * 3);
    default:
      return [];
  }
}

function sanitizarDados(data) {
  return data.split("\n").map((row, rowIndex) => {
    const columns = row.trim().split(/\t+/); // Divide usando tabulação como separador principal
    const hora = columns.shift(); // A primeira coluna é sempre a hora

    if (!hora || isNaN(hora)) {
      console.warn(`Hora inválida na linha ${rowIndex}: ${hora}`);
    }

    const jogosSanitizados = columns.map((jogo) => {
      return jogo.replace("+", "").trim(); // Remove qualquer "+" dos dados
    });

    return [hora, ...jogosSanitizados];
  });
}


function verificarResultadosMercado(mosaico, mercado) {
  return mosaico.map((row) => {
    const hora = row[0]; // Mantemos a hora na primeira posição
    const resultados = row.slice(1).map((jogo) => {
      if (!jogo) return false;

      // Extrai os números do placar corretamente
      const placarMatch = jogo.match(/(\d+)-(\d+)$/);
      if (!placarMatch) return false;

      const time1 = parseInt(placarMatch[1], 10);
      const time2 = parseInt(placarMatch[2], 10);

      switch (mercado) {
        case "under25":
          return time1 + time2 < 2.5;
        case "over25":
          return time1 + time2 >= 2.5;
        case "ambas":
          return time1 > 0 && time2 > 0;
        case "ambasNao":
          return !(time1 > 0 && time2 > 0);
        default:
          return false;
      }
    });

    return [hora, ...resultados];
  });
}

function calcularOscilacaoPorMercadoEspecifico(resultadosMercados, mercadosAlvo) {
  const oscilacoesMercado = {};

  mercadosAlvo.forEach((mercado) => {
    let acumulado = 0;
    const oscilacoes = [];

    for (let rowIndex = resultadosMercados[mercado].length - 2; rowIndex >= 0; rowIndex--) {
      const currentRow = resultadosMercados[mercado][rowIndex].slice(1); // Ignorar a hora
      const nextRow = resultadosMercados[mercado][rowIndex + 1].slice(1); // Ignorar a hora

      currentRow.forEach((result, colIndex) => {
        const nextResult = nextRow[colIndex];

        if (result === nextResult) {
          acumulado += 0; // Sem mudança
        } else {
          acumulado += result ? 1 : -1; // Incremento ou decremento
        }

        if (!oscilacoes[rowIndex]) oscilacoes[rowIndex] = [];
        oscilacoes[rowIndex][colIndex] = acumulado; // Armazena a oscilação
      });
    }

    oscilacoesMercado[mercado] = oscilacoes;
  });

  return oscilacoesMercado;
}


function gerarContagensTabela(resultadosMercados, tabelas) {
  tabelas.forEach((mercadoTabela) => {
    const table = document.getElementById(mercadoTabela);
    const linhas = table.querySelectorAll("tr");

    linhas.forEach((linha, rowIndex) => {
      // Ignora o cabeçalho
      if (rowIndex === 0) return;

      // Obtém as células da linha atual
      const cells = linha.querySelectorAll("td");
      const hora = cells[0].innerText;

      let overCount = 0;
      let subidaCount = 0;
      let lateralOverCount = 0;
      let descidaCount = 0;
      let lateralUnderCount = 0;

      // Faz as contagens com base nos resultadosMercados
      for (let colIndex = 1; colIndex < cells.length - 5; colIndex++) {
        const atualOver = resultadosMercados.over25[rowIndex - 1]?.[colIndex];
        const anteriorOver = resultadosMercados.over25[rowIndex]?.[colIndex];
        const atualAmbas = resultadosMercados.ambas[rowIndex - 1]?.[colIndex];
        const anteriorAmbas = resultadosMercados.ambas[rowIndex]?.[colIndex];

        // Porcentagem over
        if (atualOver) overCount++;

        // Subidas: Over25 em cima de Under25
        if (atualOver && !anteriorOver) subidaCount++;

        // Lateralizações Over25: Over25 em cima de Over25
        if (atualOver && anteriorOver) lateralOverCount++;

        // Descidas: Under25 em cima de Over25
        if (!atualOver && anteriorOver) descidaCount++;

        // Lateralizações Under25: Under25 em cima de Under25
        if (!atualOver && !anteriorOver) lateralUnderCount++;
      }

      // Atualiza as células extras para contagens
      const porcentagemCell = cells[cells.length - 5];
      porcentagemCell.innerText = `${(
        (overCount / (cells.length - 6)) *
        100
      ).toFixed(0)}%`;

      const subidaCell = cells[cells.length - 4];
      subidaCell.innerText = subidaCount;

      const lateralOverCell = cells[cells.length - 3];
      lateralOverCell.innerText = lateralOverCount;

      const descidaCell = cells[cells.length - 2];
      descidaCell.innerText = descidaCount;

      const lateralUnderCell = cells[cells.length - 1];
      lateralUnderCell.innerText = lateralUnderCount;
    });
  });
}

function calcularPorcentagemColunas(mosaico, mercado, resultadosMercados) {
  const porcentagens = [];
  const totalLinhas = mosaico.length - 1;

  for (let colIndex = 1; colIndex <= 20; colIndex++) {
    let count = 0;

    for (let rowIndex = 1; rowIndex < mosaico.length; rowIndex++) {
      if (
        resultadosMercados[mercado] &&
        resultadosMercados[mercado][rowIndex]
      ) {
        const result = resultadosMercados[mercado][rowIndex][colIndex];
        if (result) {
          count++;
        }
      }
    }
    const porcentagem =
      totalLinhas > 0 ? ((count / totalLinhas) * 100).toFixed(0) : 0;
    porcentagens.push(porcentagem);
  }

  return porcentagens;
}

function calcularPorcentagemPorBlocos(porcentagens) {
  const blocos = [];
  let soma = 0;

  porcentagens.forEach((porcentagem, index) => {
    soma += parseInt(porcentagem, 10); // Garante que seja tratado como número
    if ((index + 1) % 5 === 0) {
      // A cada 5 colunas, adiciona ao bloco
      blocos.push(soma / 5); // Calcula a média
      soma = 0; // Reseta a soma para o próximo bloco
    }
  });

  return blocos;
}

function calcularMediaPorcetagensLinhas(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  const linhas = tabela.querySelectorAll("tr");
  let soma = 0;
  let contador = 0;

  linhas.forEach((linha, index) => {
    if (index > 1) {
      const celulaPorcentagem = linha.querySelector("td:nth-last-child(6)");
      if (celulaPorcentagem) {
        const valor = parseInt(
          celulaPorcentagem.innerText.replace("%", "").trim(),
          10
        );
        if (!isNaN(valor)) {
          soma += valor;
          contador++;
        }
      }
    }
  });

  const media =
    contador > 0 ? `${Math.ceil((soma / contador).toFixed(2))}%` : 0;

  const mediaColunaPorcentagens = document.getElementById(
    `${tabelaId}mediaColunaPorcentagens`
  );
  mediaColunaPorcentagens.innerText = media;
}

function calcularMediaSubidas(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  const linhas = Array.from(tabela.getElementsByClassName("subidasCell"));
  let soma = 0;
  let contador = 0;

  linhas.forEach((linha, index) => {
    if (index > 0) {
      const celulaSubida = linha.innerText;
      if (celulaSubida) {
        const valor = parseInt(celulaSubida.trim(), 10);

        if (!isNaN(valor)) {
          soma += valor;
          contador++;
        }
      }
    }
  });

  const media =
    contador > 0 ? `${Math.ceil((soma / (contador - 1)).toFixed(2))}` : 0;

  const mediaColunaSubidas = document.getElementById(
    `${tabelaId}mediaColunaSubidas`
  );
  mediaColunaSubidas.innerText = media;
}

function calcularMediaLateralizacaoOver(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  const linhas = Array.from(
    tabela.getElementsByClassName("lateralizacoesOverCell")
  );
  let soma = 0;
  let contador = 0;

  linhas.forEach((linha, index) => {
    if (index > 0) {
      const celulaSubida = linha.innerText;
      if (celulaSubida) {
        const valor = parseInt(celulaSubida.trim(), 10);

        if (!isNaN(valor)) {
          soma += valor;
          contador++;
        }
      }
    }
  });

  const media =
    contador > 0 ? `${Math.ceil((soma / (contador - 1)).toFixed(2))}` : 0;

  const mediaColunaSubidas = document.getElementById(
    `${tabelaId}mediaColunaLateralizacoesOver`
  );
  mediaColunaSubidas.innerText = media;
}

function calcularMediaDescidas(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  const linhas = Array.from(tabela.getElementsByClassName("descidasCell"));
  let soma = 0;
  let contador = 0;

  linhas.forEach((linha, index) => {
    if (index > 0) {
      const celulaSubida = linha.innerText;
      if (celulaSubida) {
        const valor = parseInt(celulaSubida.trim(), 10);

        if (!isNaN(valor)) {
          soma += valor;
          contador++;
        }
      }
    }
  });

  const media =
    contador > 0 ? `${Math.ceil((soma / (contador - 1)).toFixed(2))}` : 0;

  const mediaColunaSubidas = document.getElementById(
    `${tabelaId}mediaColunaDescidas`
  );
  mediaColunaSubidas.innerText = media;
}

function calcularMediaLateralizacoesUnder(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  const linhas = Array.from(
    tabela.getElementsByClassName("lateralizacoesUnderCell")
  );
  let soma = 0;
  let contador = 0;

  linhas.forEach((linha, index) => {
    if (index > 0) {
      const celulaSubida = linha.innerText;
      if (celulaSubida) {
        const valor = parseInt(celulaSubida.trim(), 10);

        if (!isNaN(valor)) {
          soma += valor;
          contador++;
        }
      }
    }
  });

  const media =
    contador > 0 ? `${Math.ceil((soma / (contador - 1)).toFixed(2))}` : 0;

  const mediaColunaSubidas = document.getElementById(
    `${tabelaId}mediaColunaLateralizacoesUnder`
  );
  mediaColunaSubidas.innerText = media;
}

function calcularMediaGols(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  const linhas = Array.from(tabela.getElementsByTagName("tr")); // Pega todas as linhas da tabela
  let soma = 0;
  let contador = 0;

  // Itera sobre as linhas, pulando o cabeçalho e a soma de gols
  for (let i = 1; i < linhas.length - 1; i++) {
    const celulaGols = linhas[i].querySelector(".golsCell"); // Pega a célula de gols da linha

    if (celulaGols) {
      const valor = parseInt(celulaGols.innerText.trim(), 10);

      if (!isNaN(valor)) {
        soma += valor;
        contador++;
      }
    }
  }

  const media = contador > 0 ? `${Math.ceil(soma / contador)}` : 0;

  const mediaColunaGols = document.getElementById(
    `${tabelaId}mediaColunaGols`
  );
  mediaColunaGols.innerText = media;
}

function adicionarLinhaSomaGols(tabelaId, mosaico) {
  const tabela = document.getElementById(tabelaId);

  if (!mosaico || mosaico.length === 0) {
    console.warn("O mosaico está vazio.");
    return;
  }

  const numColunas = mosaico[0].length - 1; // Número de colunas de resultados
  const somaGolsPorColuna = Array(numColunas).fill(0);

  mosaico.forEach((row, rowIndex) => {
    if (rowIndex > 0) {
      row.slice(1).forEach((cell, colIndex) => {
        const placar = cell.match(/(\d+)-(\d+)/);
        if (placar) {
          const golsTime1 = parseInt(placar[1]);
          const golsTime2 = parseInt(placar[2]);
          somaGolsPorColuna[colIndex] += golsTime1 + golsTime2;
        }
      });
    }
  });

  const linhaSoma = document.createElement("tr");
  const headerCell = document.createElement("td");
  headerCell.innerText = "⚽";
  linhaSoma.appendChild(headerCell);

  somaGolsPorColuna.forEach((soma) => {
    const cell = document.createElement("td");
    cell.innerText = soma || 0;
    cell.classList.add("somaGolsCell");
    linhaSoma.appendChild(cell);
  });

  const colunasExtras = 6;
  for (let i = 0; i < colunasExtras; i++) {
    const emptyCell = document.createElement("td");
    linhaSoma.appendChild(emptyCell);
  }

  tabela.insertBefore(linhaSoma, tabela.querySelector("tr:nth-child(3)"));
}
function adicionarLinhaOscilacaoColunas(tabelaId, mosaico) {
  const tabela = document.getElementById(tabelaId);

  // Cria uma nova linha para a oscilação
  const LinhaOscilacaoColunasPorcentagem = document.createElement("tr");
  const LinhaOscilacaoColunasPorcentagemIcone = document.createElement("td");
  LinhaOscilacaoColunasPorcentagemIcone.innerHTML = "📈"; // Ícone de gráfico
  LinhaOscilacaoColunasPorcentagem.appendChild(LinhaOscilacaoColunasPorcentagemIcone);

  // Insere a linha logo abaixo da linha de porcentagens
  const linhas = tabela.getElementsByTagName("tr");
  const porcentagens = Array.from(linhas[1].querySelectorAll("td")).slice(1); // Obtém porcentagens da linha
  const resultados = mosaico[0].slice(1); // Obtém os resultados da primeira linha do mosaico

  let acumulado = 0; // Variável para acumular os valores de oscilação

  porcentagens.forEach((porcentagemCelula, index) => {
    const porcentagem = parseFloat(porcentagemCelula.innerText.replace("%", "").trim()); // Obtém a porcentagem como número
    const resultado = resultados[index]; // Resultado atual da coluna
    const cell = document.createElement("td"); // Nova célula para a linha de oscilação

    if (resultado) {
      const partes = resultado.split(" "); // Divide por espaço
      const placar = partes[partes.length - 1]; // Obtém o último elemento (exemplo: "2-1")
      const [golsTime1, golsTime2] = placar.split("-").map(Number); // Converte em números

      if (!isNaN(golsTime1) && !isNaN(golsTime2)) {
        const totalGols = golsTime1 + golsTime2;
        const isOver = totalGols > 2.5; // Verifica se o total de gols é maior que 2.5

        if (isOver && porcentagem > 42) {
          // Over com porcentagem Over -> lateraliza
          cell.innerText = acumulado;
          cell.classList.add("green");
        } else if (!isOver && porcentagem <= 42) {
          // Under com porcentagem Under -> lateraliza
          cell.innerText = acumulado;
          cell.classList.add("red");
        } else if (isOver && porcentagem <= 42) {
          // Over com porcentagem Under -> sobe
          acumulado++; // Incrementa acumulado
          cell.innerText = acumulado;
          cell.classList.add("green");
        } else if (!isOver && porcentagem > 42) {
          // Under com porcentagem Over -> desce
          acumulado--; // Decrementa acumulado
          cell.innerText = acumulado;
          cell.classList.add("red");
        }
      } else {
        // Se houver erro na extração dos gols, mantemos o acumulado sem alteração
        cell.innerText = acumulado;
      }
    } else {
      // Caso não tenha resultado, mantém vazio
      cell.innerText = "";
    }

    LinhaOscilacaoColunasPorcentagem.appendChild(cell);
  });

  tabela.insertBefore(
    LinhaOscilacaoColunasPorcentagem,
    tabela.querySelector("tr:nth-child(3)")
  );
}


function gerarTabela(
  minutos,
  mosaico,
  resultadosMercados,
  oscilacoesPorMercado
) {
  const tabelas = ["tabelao25", "tabelaambas"];

  tabelas.forEach((mercadoTabela, tabelaIndex) => {
    const mercado = tabelaIndex === 0 ? "over25" : "ambas";
    const table = document.getElementById(mercadoTabela);
    table.innerHTML = "";

    const porcentagens = calcularPorcentagemColunas(
      mosaico,
      mercado,
      resultadosMercados
    );
    const porcentagensBloco = calcularPorcentagemPorBlocos(porcentagens);

    /* LINHA DE PORCENTAGEM DOS BLOCOS */
    const porcentagemBloco = document.createElement("tr");
    const porcentagemCellBloco = document.createElement("td");
    porcentagemCellBloco.classList.add("percentCell");
    porcentagemCellBloco.innerText = "%";
    porcentagemBloco.appendChild(porcentagemCellBloco);

    for (let index = 0; index < porcentagensBloco.length; index++) {
      const porcentagemCellsBloco = document.createElement("td");
      porcentagemCellsBloco.setAttribute("colspan", "5");
      porcentagemCellsBloco.innerText = `${porcentagensBloco[index]}%`;
      porcentagemCellsBloco.classList.add("percentCell");
      porcentagemCellsBloco.classList.add(
        porcentagensBloco[index] > 42 ? "text-green" : "text-red"
      );
      porcentagemBloco.appendChild(porcentagemCellsBloco);
    }

    table.appendChild(porcentagemBloco);

    /* LINHA DE PORCENTAGEM DASCOLUNAS */

    const porcentagemRow = document.createElement("tr");
    const porcentagemCell = document.createElement("td");
    porcentagemCell.classList.add("percentCell");
    porcentagemCell.innerText = "%";
    porcentagemRow.appendChild(porcentagemCell);

    for (let index = 0; index < porcentagens.length; index++) {
      const porcentagemCells = document.createElement("td");
      porcentagemCells.innerText = `${porcentagens[index]}%`;
      porcentagemCells.classList.add("percentCell");
      porcentagemCells.classList.add(
        porcentagens[index] > 42 ? "text-green" : "text-red"
      );
      porcentagemRow.appendChild(porcentagemCells);
    }

    table.appendChild(porcentagemRow);

    const mediaColunaPorcentagens = document.createElement("td");
    mediaColunaPorcentagens.setAttribute(
      "id",
      `${mercadoTabela}mediaColunaPorcentagens`
    );
    porcentagemRow.appendChild(mediaColunaPorcentagens);

    table.appendChild(porcentagemRow);

    const mediaColunaSubidas = document.createElement("td");
    mediaColunaSubidas.setAttribute("id", `${mercadoTabela}mediaColunaSubidas`);
    porcentagemRow.appendChild(mediaColunaSubidas);

    table.appendChild(porcentagemRow);

    const mediaColunaLateralizacoesOver = document.createElement("td");
    mediaColunaLateralizacoesOver.setAttribute(
      "id",
      `${mercadoTabela}mediaColunaLateralizacoesOver`
    );
    porcentagemRow.appendChild(mediaColunaLateralizacoesOver);

    table.appendChild(porcentagemRow);

    const mediaColunaDescidas = document.createElement("td");
    mediaColunaDescidas.setAttribute(
      "id",
      `${mercadoTabela}mediaColunaDescidas`
    );
    porcentagemRow.appendChild(mediaColunaDescidas);

    table.appendChild(porcentagemRow);

    const mediaColunaLateralizacoesUnder = document.createElement("td");
    mediaColunaLateralizacoesUnder.setAttribute(
      "id",
      `${mercadoTabela}mediaColunaLateralizacoesUnder`
    );
    porcentagemRow.appendChild(mediaColunaLateralizacoesUnder);

    table.appendChild(porcentagemRow);

    const mediaColunaGols = document.createElement("td");
    mediaColunaGols.setAttribute("id", `${mercadoTabela}mediaColunaGols`);
    porcentagemRow.appendChild(mediaColunaGols);

    table.appendChild(porcentagemRow);

    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.innerText = "Hora";
    headerRow.appendChild(headerCell);

    minutos.forEach((minuto) => {
      const th = document.createElement("th");
      th.innerText = `${minuto < 10 ? "0" + minuto : minuto}`;
      headerRow.appendChild(th);
    });

    const icones = ["％", "⬆️", "↔️", "⬇️", "⇆", "⚽"];
    icones.forEach((icone) => {
      const th = document.createElement("th");
      th.innerText = icone;
      headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // Linhas
    mosaico.forEach((row, rowIndex) => {
  const tableRow = document.createElement("tr");
  const hourCell = document.createElement("td");
  hourCell.innerText = row[0] < 10 ? `0${row[0]}` : row[0];
  hourCell.classList.add("firstCollumn");
  tableRow.appendChild(hourCell);

  let rodadaClasse = ""; // Classe que será aplicada à linha

  // Adiciona células para os resultados
  row.slice(1).forEach((value, colIndex) => {
        const cell = document.createElement("td");
        cell.innerText = value || "";

        // Cor para os mercados
        const placar = value.match(/(\d+)-(\d+)/);
        if (placar) {
          const time1 = parseInt(placar[1]);
          const time2 = parseInt(placar[2]);
          let rodadaClasse = "";
          if (mercado === "over25") {
            rodadaClasse = time1 + time2 > 2 ? "green" : "red";
          } else if (mercado === "ambas") {
            rodadaClasse = time1 > 0 && time2 > 0 ? "green" : "red";
          }
          if (rodadaClasse) {
            cell.classList.add(rodadaClasse);
          }
        }

        tableRow.appendChild(cell);
      });

  // Aplica a classe da rodada para toda a linha
  if (rodadaClasse) {
    tableRow.classList.add(rodadaClasse);
  }

  // Preenche células vazias se a linha não tiver o número total de minutos
  const colunasRestantes = minutos.length - row.slice(1).length;
  for (let i = 0; i < colunasRestantes; i++) {
    const emptyCell = document.createElement("td");
    emptyCell.innerText = "";
    tableRow.appendChild(emptyCell);
  }

  // Adiciona as colunas adicionais ao final da linha
  const porcentagemMercadoCell = document.createElement("td");
  porcentagemMercadoCell.innerText = calcularPorcentagemLinha(
    rowIndex,
    resultadosMercados[mercado]
  );
  tableRow.appendChild(porcentagemMercadoCell);

  const subidasCell = document.createElement("td");
  subidasCell.classList.add("subidasCell");
  subidasCell.innerText = calcularSubidasLinha(
    rowIndex,
    resultadosMercados,
    mercado
  );
  tableRow.appendChild(subidasCell);

  const lateralizacoesOverCell = document.createElement("td");
  lateralizacoesOverCell.classList.add("lateralizacoesOverCell");
  lateralizacoesOverCell.innerText = calcularLateralizacaoVerde(
    rowIndex,
    resultadosMercados,
    mercado,
    mercado
  );
  tableRow.appendChild(lateralizacoesOverCell);

  const descidasCell = document.createElement("td");
  descidasCell.classList.add("descidasCell");
  descidasCell.innerText = calcularDescidasLinha(
    rowIndex,
    resultadosMercados,
    mercado
  );
  tableRow.appendChild(descidasCell);

  const lateralizacoesUnderCell = document.createElement("td");
  lateralizacoesUnderCell.classList.add("lateralizacoesUnderCell");
  lateralizacoesUnderCell.innerText = calcularLateralizacaoVermelho(
    rowIndex,
    resultadosMercados,
    mercado,
    mercado
  );
  tableRow.appendChild(lateralizacoesUnderCell);

  const golsCell = document.createElement("td");
  golsCell.classList.add("golsCell");
  golsCell.innerText = calcularGolsLinha(row);
  tableRow.appendChild(golsCell);

  table.appendChild(tableRow);
});


    calcularMediaPorcetagensLinhas(mercadoTabela);
    calcularMediaSubidas(mercadoTabela);
    calcularMediaLateralizacaoOver(mercadoTabela);
    calcularMediaDescidas(mercadoTabela);
    calcularMediaLateralizacoesUnder(mercadoTabela);
    calcularMediaGols(mercadoTabela);
    adicionarLinhaSomaGols(mercadoTabela, mosaico);
    adicionarLinhaOscilacaoColunas(mercadoTabela, mosaico);
  });

  ativarDestaquePontos();
}

// Funções auxiliares
function calcularPorcentagemLinha(rowIndex, resultadosMercado) {
  const total = resultadosMercado[rowIndex].slice(1).length;
  const ocorrencias = resultadosMercado[rowIndex]
    .slice(1)
    .filter(Boolean).length;
  return `${Math.round((ocorrencias / total) * 100)}%`;
}

function calcularSubidasLinha(rowIndex, resultadosMercados, mercado) {
  return calcularMovimentosLinha(
    rowIndex,
    resultadosMercados,
    mercado,
    true,
    false
  );
}

function calcularDescidasLinha(rowIndex, resultadosMercados, mercado) {
  return calcularMovimentosLinha(
    rowIndex,
    resultadosMercados,
    mercado,
    false,
    true
  );
}

function calcularLateralizacaoVerde(rowIndex, resultadosMercados, mercado) {
  return calcularMovimentosLinha(
    rowIndex,
    resultadosMercados,
    mercado,
    true,
    true
  );
}

function calcularLateralizacaoVermelho(rowIndex, resultadosMercados, mercado) {
  return calcularMovimentosLinha(
    rowIndex,
    resultadosMercados,
    mercado,
    false,
    false
  );
}

// function calcularLateralizacoesLinha(rowIndex, resultadosMercados, mercadoAtual, mercadoComparado) {
//     return calcularMovimentosLinha(rowIndex, resultadosMercados, mercadoAtual, mercadoComparado, mercadoComparado);
// }


function calcularGolsLinha(row) {
  return row.slice(1).reduce((total, value) => {
    // Extrai os placares usando uma expressão regular
    const placares = value.match(/(\d+)-(\d+)/);
    if (placares) {
      const golsTime1 = parseInt(placares[1]);
      const golsTime2 = parseInt(placares[2]);
      return total + golsTime1 + golsTime2;
    } else {
      return total; // Retorna o total inalterado se não houver placares correspondentes
    }
  }, 0);
}




function calcularMovimentosLinha(
  rowIndex,
  resultadosMercados,
  mercado,
  condicao1,
  condicao2
) {
  let contador = 0;
  const currentRow = resultadosMercados[mercado][rowIndex];
  const nextRow = resultadosMercados[mercado][rowIndex + 1];

  if (!nextRow) return contador;

  currentRow.slice(1).forEach((result, colIndex) => {
    const nextResult = nextRow[colIndex + 1];
    if (result === condicao1 && nextResult === condicao2) {
      contador++;
    }
  });

  return contador;
}

function gerarDadosContagem(resultados) {
  console.log(resultados);
}

function calcularOscilacaoPorMercado(mosaico, resultadosMercados) {
  return [...mercadosUnderOver, ...mercadosAmbas].map((mercado) => {
    let acumulado = 0;
    const oscilacoes = [];

    for (let rowIndex = mosaico.length - 2; rowIndex >= 0; rowIndex--) {
      const currentRow = resultadosMercados[mercado][rowIndex].slice(1);
      const nextRow = resultadosMercados[mercado][rowIndex + 1].slice(1);

      currentRow.forEach((result, colIndex) => {
        const nextResult = nextRow[colIndex];

        if (result === nextResult) {
          acumulado += 0;
        } else {
          acumulado += result ? 1 : -1;
        }
        oscilacoes.push(acumulado);
      });
    }

    return {
      mercado,
      oscilacoes,
    };
  });
}

function gerarLabelsHoraMaisMinuto(minutos, mosaico) {
  const labels = [];

  for (let rowIndex = mosaico.length - 2; rowIndex >= 0; rowIndex--) {
    const currentRow = mosaico[rowIndex].slice(1);
    const hora = mosaico[rowIndex][0];

    for (let label = 0; label < currentRow.length; label++) {
      labels.push(
        `${hora < 10 ? "0" + hora : hora}:${
          minutos[label] < 10 ? "0" + minutos[label] : minutos[label]
        }`
      );
    }
  }

  return labels;
}

function ativarDestaquePontos() {
  const cellsWithPoints = document.querySelectorAll("td span.pontosGraficos");

  cellsWithPoints.forEach((span) => {
    span.addEventListener("click", function () {
      const ponto = this.innerText; // Ponto do span clicado
      const isHighlighted = this.parentElement.classList.contains("highlight"); // Verifica se já está destacado

      if (isHighlighted) {
        // Remove o destaque de todas as células com o mesmo ponto
        const allCells = document.querySelectorAll("td span.pontosGraficos");
        allCells.forEach((otherSpan) => {
          if (otherSpan.innerText === ponto) {
            otherSpan.parentElement.classList.remove("highlight");
          }
        });
      } else {
        // Remove os destaques globais
        document.querySelectorAll(".highlight").forEach((el) => {
          el.classList.remove("highlight");
        });

        // Adiciona o destaque nas células com o mesmo ponto
        const allCells = document.querySelectorAll("td span.pontosGraficos");
        allCells.forEach((otherSpan) => {
          if (otherSpan.innerText === ponto) {
            otherSpan.parentElement.classList.add("highlight");
          }
        });
      }
    });
  });
}

function gerarTodosGraficos(dadosOscilacao, labelsHoraMaisMinuto) {
  geraGraficosPorCategoria(
    dadosOscilacao,
    mercadosUnderOver,
    "graficoUnderOver",
    "controlesUnderOver",
    labelsHoraMaisMinuto
  );
  geraGraficosPorCategoria(
    dadosOscilacao,
    mercadosAmbas,
    "graficoAmbas",
    "controlesAmbas",
    labelsHoraMaisMinuto
  );
}

function geraGraficosPorCategoria(
  dadosOscilacao,
  mercadosIniciais,
  canvasId,
  controlesId,
  labels
) {
  const ctx = document.getElementById(canvasId).getContext("2d");

  if (canvasId === "graficoUnderOver" && chartUnderOver) {
    chartUnderOver.destroy();
    chartUnderOver = null;
  } else if (canvasId === "graficoAmbas" && chartAmbas) {
    chartAmbas.destroy();
    chartAmbas = null;
  }

  const datasets = dadosOscilacao
    .filter((dados) => mercadosIniciais.includes(dados.mercado))
    .map((dados) => ({
      label: dados.mercado.toUpperCase(),
      data: dados.oscilacoes,
      borderColor: todasCores[dados.mercado],
      backgroundColor: todasCores[dados.mercado],
      fill: false,
      tension: 0.4,
      pointStyle: "circle",
      pointRadius: 3.5,
      pointHoverRadius: 4,
      pointBackgroundColor: "transparent",
      pointBorderColor: todasCores[dados.mercado],
    }));

  const data = {
    labels,
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return ` ${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "HorÃ¡rio",
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          stepSize: 5,
        },
      },
      y: {
        title: {
          display: true,
          text: "Valores Acumulados",
        },
      },
    },
  };

  const chart = new Chart(ctx, {
    type: "line",
    data: data,
    options: options,
  });

  if (canvasId === "graficoUnderOver") {
    chartUnderOver = chart;
  } else if (canvasId === "graficoAmbas") {
    chartAmbas = chart;
  }

  configurarControleDeMercados(
    dadosOscilacao,
    mercadosIniciais,
    chart,
    controlesId
  );
}

function configurarControleDeMercados(
  dadosOscilacao,
  mercadosIniciais,
  chart,
  controlesId
) {
  const controlesContainer = document.getElementById(controlesId);
  controlesContainer.innerHTML = "";

  dadosOscilacao.forEach((dados) => {
    const mercado = dados.mercado;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `mercado-${mercado}-${controlesId}`;
    checkbox.checked = mercadosIniciais.includes(mercado);

    const label = document.createElement("label");
    label.htmlFor = `mercado-${mercado}-${controlesId}`;
    label.textContent = mercado.toUpperCase();

    checkbox.addEventListener("change", () => {
      atualizarGrafico(dadosOscilacao, chart, controlesId);
    });

    const container = document.createElement("div");
    container.style.marginRight = "10px";
    container.style.display = "inline-block";
    container.appendChild(checkbox);
    container.appendChild(label);
    controlesContainer.appendChild(container);
  });
}

function atualizarGrafico(dadosOscilacao, chart, controlesId) {
  const mercadosSelecionados = Array.from(
    document.querySelectorAll(`#${controlesId} input:checked`)
  ).map((input) =>
    input.id.replace(`mercado-`, "").replace(`-${controlesId}`, "")
  );

  const datasets = dadosOscilacao
    .filter((dados) => mercadosSelecionados.includes(dados.mercado))
    .map((dados) => ({
      label: dados.mercado.toUpperCase(),
      data: dados.oscilacoes,
      borderColor: todasCores[dados.mercado],
      backgroundColor: todasCores[dados.mercado],
      fill: false,
      tension: 0.4,
      pointStyle: "circle",
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: "transparent",
      pointBorderColor: todasCores[dados.mercado],
    }));

  chart.data.datasets = datasets;
  chart.update();
}


</script>
