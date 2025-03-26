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
    <div class="flex items justify-center mt-6" v-if="rankings.length">
      <PrimeButton
        type="button"
        class="btnTables font-bold"
        @click="showRanksAcc = !showRanksAcc"
      >
        Mostrar/Esconder Ranking Gráfico
      </PrimeButton>
    </div>
    <div v-if="showRanksAcc" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="(rank, rankName) in rankingsGraficoAcc"
        :key="rankName"
        class="bg-white rounded shadow p-4"
      >
        <h2 class="text-lg font-semibold mb-4">
          {{ formatarNomeRank(rankName) }}
        </h2>
        <PrimeDataTable :value="formatarDadosRank(rank)">
          <PrimeColumn
            field="oscilacao"
            header="P (Oscilação)"
            class="text-center"
          />
          <PrimeColumn
            field="quantidade"
            header="Quantidade"
            class="text-center"
          />
        </PrimeDataTable>
      </div>
    </div>
    <div class="flex items justify-center mt-6" v-if="rankings.length">
      <PrimeButton
        type="button"
        class="btnTables font-bold"
        @click="showRanks = !showRanks"
      >
        Mostrar/Esconder Ranking de Mercado
      </PrimeButton>
    </div>
    <div v-if="showRanks" class="grid grid-cols-1 md:grid-cols-4 gap-6 p-5">
      <div
        v-for="(rank, index) in rankings"
        :key="index"
        class="bg-white shadow-lg rounded-xl p-2 transition-all duration-300"
        :class="{
          'max-h-auto overflow-auto': rank.show_all,
          'max-h-80': !rank.show_all,
        }"
      >
        <h2 class="text-lg font-semibold text-gray-700 text-center mb-4">
          {{ rank.title }}
        </h2>
        <PrimeButton
          :label="rank.show_all ? 'Mostrar Menos' : 'Mostrar Mais'"
          class="w-full mb-2"
          outlined
          :icon="rank.show_all ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
          @click="rank.show_all = !rank.show_all"
        />

        <table class="w-full border-collapse border border-gray-300">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-2 py-2">#</th>
              <th class="border border-gray-300 px-2 py-2">Time</th>
              <th
                class="border border-gray-300 px-2 py-2"
                v-if="
                  rank.title === 'Máxima de Mercado 2,5' ||
                  rank.title === 'Máxima de Mercado 3,5'
                "
              >
                Atual
              </th>
              <th
                class="border border-gray-300 px-2 py-2"
                v-if="
                  rank.title === 'Máxima de Mercado 2,5' ||
                  rank.title === 'Máxima de Mercado 3,5'
                "
              >
                Máxima
              </th>
              <th class="border border-gray-300 px-2 py-2" v-else>Média</th>
              <th class="border border-gray-300 px-2 py-2">Total de Jogos</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(team, i) in rank.show_all
                ? rank.data
                : rank.data.slice(0, 5)"
              :key="team.team"
              class="odd:bg-gray-50 even:bg-white"
            >
              <td class="border border-gray-300 px-2 py-2 text-center">
                {{ i + 1 }}
              </td>
              <td class="border border-gray-300 px-2 py-2">{{ team.team }}</td>
              <td
                class="border border-gray-300 px-2 py-2 text-center"
                v-if="
                  rank.title === 'Máxima de Mercado 2,5' ||
                  rank.title === 'Máxima de Mercado 3,5'
                "
              >
                {{ team.currentUnder2_5 || team.currentUnder3_5 }}
              </td>
              <td
                class="border border-gray-300 px-2 py-2 text-center"
                v-if="
                  rank.title === 'Máxima de Mercado 2,5' ||
                  rank.title === 'Máxima de Mercado 3,5'
                "
              >
                {{ team.maxUnder2_5 || team.maxUnder3_5 }}
              </td>
              <td class="border border-gray-300 px-2 py-2 text-center" v-else>
                {{ team.value }}
              </td>
              <td class="border border-gray-300 px-2 py-2 text-center">
                {{ team.totalGames }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Tabela e Gráficos -->
    <div id="graficos" class="flex flex-col gap-4">
      <div>
        <div id="controlesUnderOver" class="mb-5"></div>
        <canvas id="graficoUnderOver"></canvas>
        <div class="table flex flex-col gap-4">
          <PrimeButton
            type="button"
            class="btnTables"
            @click="showTable1 = !showTable1"
          >
            Mostrar/Esconder Tabela
          </PrimeButton>

          <div
            id="tabelasGolsCalculos"
            class="flex flex-wrap justify-between overflow-x-auto w-full px-12"
          >
            <!-- Tabelas geradas a partir de somaDeGolsPorBloco -->
            <div class="flex flex-wrap gap-32">
              <div
                v-for="(bloco, index) in somaDeGolsPorBloco"
                :key="'bloco-' + index"
              >
                <table
                  class="min-w-[200px] border border-gray-300 text-sm text-gray-700"
                >
                  <thead class="bg-gray-100">
                    <tr>
                      <th class="border px-2 py-1 text-left">
                        Bloco {{ index + 1 }}
                      </th>
                      <th class="border px-2 py-1 text-left">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(soma, i) in bloco.somaPorLinha" :key="i">
                      <td class="border px-2 py-1">Soma Linha</td>
                      <td
                        class="border px-2 py-1"
                        :class="
                          soma > bloco.mediaGolColunas
                            ? 'red'
                            : 'green'
                        "
                      >
                        {{ soma }}
                      </td>
                    </tr>
                    <tr>
                      <td class="border px-2 py-1">Média Gols Linhas</td>
                      <td class="border px-2 py-1" :class="
                          soma > bloco.mediaGolColunas
                            ? 'red'
                            : 'green'
                        ">
                        {{ bloco.media.toFixed(2) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="border px-2 py-1">Média Gols Colunas</td>
                      <td class="border px-2 py-1">
                        {{ bloco.mediaGolColunas.toFixed(2) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Tabela de Médias Totais alinhada à direita -->
            <div class="ml-auto">
              <table
                class="min-w-[200px] border border-gray-300 text-sm text-gray-700"
              >
                <thead class="bg-gray-100">
                  <tr>
                    <th class="border px-2 py-1 text-left">Média</th>
                    <th class="border px-2 py-1 text-left">Soma</th>
                    <th class="border px-2 py-1 text-left">Mult 3</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, key) in mediasTotais"
                    :key="key"
                    class="odd:bg-white even:bg-gray-50"
                  >
                    <td class="border px-2 py-1 font-medium">
                      {{ formatarNome(key) }}
                    </td>
                    <td class="border px-2 py-1" :class="item.class">
                      {{ item.ultimasTresSoma }}
                    </td>
                    <td class="border px-2 py-1">{{ item.mult3 || "-" }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <table id="tabelao25" v-show="showTable1"></table>
        </div>
      </div>

      <div>
        <div id="controlesAmbas" class="mb-5"></div>
        <canvas id="graficoAmbas"></canvas>
        <div class="table">
          <PrimeButton
            type="button"
            class="btnTables"
            @click="showTable2 = !showTable2"
          >
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
const rankingsGraficoAcc = ref([]);
const blocosJogos = ref([]);
const somaDeGolsPorBloco = ref([]);
const dadosFormatados = ref([]);
const showRanksAcc = ref(false);
const porcentagensMedias = ref([]);
const somaDeGolsPorColuna = ref([]);
const mediasTotais = ref({
  subida: {
    media: 0,
    ultimasTresSoma: 0,
    mult3: 0,
    class: "",
  },
  descida: {
    media: 0,
    ultimasTresSoma: 0,
    mult3: 0,
    class: "",
  },
  lateralizacoesOver: {
    media: 0,
    ultimasTresSoma: 0,
    mult3: 0,
    class: "",
  },
  lateralizacoesUnder: {
    media: 0,
    ultimasTresSoma: 0,
    mult3: 0,
    class: "",
  },
  gols: {
    media: 0,
    ultimasTresSoma: 0,
    mult3: 0,
    class: "",
  },
});
const campeonatos = ref([
  { label: "Copa", value: "copa" },
  { label: "Euro", value: "euro" },
  { label: "Super", value: "super" },
  { label: "Premier", value: "premier" },
]);

definePageMeta({
  layout: "home",
  middleware: [],
});

function formatarNome(key) {
  const mapeamentoNomes = {
    subida: "Subida",
    descida: "Descida",
    lateralizacoesOver: "Lat. Over",
    lateralizacoesUnder: "Lat. Under",
    gols: "Gols",
  };
  return mapeamentoNomes[key] || key;
}
const calculateChamaGol = (matches) => {
  const teamStats = {};

  matches.forEach((rodada) => {
    rodada.slice(1).forEach((partida) => {
      const regex = /(.*?)\s+x\s+(.*?)\s+(\d+)-(\d+)/;
      const match = partida.match(regex);

      if (!match) return;

      const [, team1, team2, score1, score2] = match;
      const gols1 = Number(score1);
      const gols2 = Number(score2);

      // Inicializando estatísticas para os times, caso ainda não existam
      if (!teamStats[team1]) {
        teamStats[team1] = { totalGoals: 0, gamesPlayed: 0 };
      }
      if (!teamStats[team2]) {
        teamStats[team2] = { totalGoals: 0, gamesPlayed: 0 };
      }

      // Atualizando estatísticas
      teamStats[team1].totalGoals += gols1;
      teamStats[team1].gamesPlayed++;

      teamStats[team2].totalGoals += gols2;
      teamStats[team2].gamesPlayed++;
    });
  });

  // Calculando médias e formatando saída
  const medias = Object.entries(teamStats).map(([team, stats]) => ({
    team,
    value: (stats.totalGoals / stats.gamesPlayed).toFixed(2),
    totalGames: stats.gamesPlayed,
  }));

  // Ordenação pelo maior value primeiro
  return medias.sort((a, b) => b.value - a.value);
};

const calculateMaximaMercado = (matches) => {
  const teamStats = {};

  // Processar os jogos
  matches.forEach((rodada) => {
    rodada.slice(1).forEach((partida) => {
      const regex = /(.*?)\s+x\s+(.*?)\s+(\d+)-(\d+)/;
      const match = partida.match(regex);
      const [, team1, team2, score1, score2] = match;
      const totalGols = Number(score1) + Number(score2);
      // Inicializando estatísticas para os times, caso ainda não existam
      if (!teamStats[team1]) {
        teamStats[team1] = {
          currentUnder2_5: 0,
          maxUnder2_5: 0,
          currentUnder3_5: 0,
          maxUnder3_5: 0,
          gamesPlayed: 0,
        };
      }
      if (!teamStats[team2]) {
        teamStats[team2] = {
          currentUnder2_5: 0,
          maxUnder2_5: 0,
          currentUnder3_5: 0,
          maxUnder3_5: 0,
          gamesPlayed: 0,
        };
      }

      // Contabilizando as partidas jogadas
      teamStats[team1].gamesPlayed++;
      teamStats[team2].gamesPlayed++;

      // Atualizando estatísticas de Under 2.5
      if (totalGols < 2.5) {
        // Incrementa a quantidade de jogos consecutivos "under 2.5"
        teamStats[team1].currentUnder2_5++;
        teamStats[team2].currentUnder2_5++;

        // Atualiza o máximo de jogos consecutivos "under 2.5"
        teamStats[team1].maxUnder2_5 = Math.max(
          teamStats[team1].maxUnder2_5,
          teamStats[team1].currentUnder2_5
        );
        teamStats[team2].maxUnder2_5 = Math.max(
          teamStats[team2].maxUnder2_5,
          teamStats[team2].currentUnder2_5
        );
      } else {
        // Resetar os contadores de jogos consecutivos "under 2.5"
        teamStats[team1].currentUnder2_5 = 0;
        teamStats[team2].currentUnder2_5 = 0;
      }

      // Atualizando estatísticas de Under 3.5
      if (totalGols < 3.5) {
        // Incrementa a quantidade de jogos consecutivos "under 3.5"
        teamStats[team1].currentUnder3_5++;
        teamStats[team2].currentUnder3_5++;

        // Atualiza o máximo de jogos consecutivos "under 3.5"
        teamStats[team1].maxUnder3_5 = Math.max(
          teamStats[team1].maxUnder3_5,
          teamStats[team1].currentUnder3_5
        );
        teamStats[team2].maxUnder3_5 = Math.max(
          teamStats[team2].maxUnder3_5,
          teamStats[team2].currentUnder3_5
        );
      } else {
        // Resetar os contadores de jogos consecutivos "under 3.5"
        teamStats[team1].currentUnder3_5 = 0;
        teamStats[team2].currentUnder3_5 = 0;
      }
    });
  });

  const medias2_5 = Object.entries(teamStats).map(([team, stats]) => {
    return {
      team,
      currentUnder2_5: stats.currentUnder2_5,
      maxUnder2_5: stats.maxUnder2_5,
      totalGames: stats.gamesPlayed,
    };
  });

  const medias3_5 = Object.entries(teamStats).map(([team, stats]) => {
    return {
      team,
      currentUnder3_5: stats.currentUnder3_5,
      maxUnder3_5: stats.maxUnder3_5,
      totalGames: stats.gamesPlayed,
    };
  });
  return [
    medias2_5.sort((a, b) => b.currentUnder2_5 - a.currentUnder2_5),
    medias3_5.sort((a, b) => b.currentUnder3_5 - a.currentUnder3_5),
  ];
};

function gerarRankings(dados) {
  const rankingsGrafico = {
    over2_5: {},
    over3_5: {},
    subida2_5: {},
    lateralizacao2_5: {},
    subida3_5: {},
  };

  for (let i = 0; i < dados.length; i++) {
    const resultados = dados[i];

    for (let j = 0; j < resultados.length; j++) {
      const partida = resultados[j];
      const oscilacao = partida.oscilacao;
      const totalGols = partida.totalGols;

      // rankingsGrafico Over 2.5 e 3.5
      if (totalGols >= 2.5) {
        if (!rankingsGrafico.over2_5[oscilacao]) {
          rankingsGrafico.over2_5[oscilacao] = 0;
        }
        rankingsGrafico.over2_5[oscilacao]++;
      }
      if (totalGols >= 3.5) {
        if (!rankingsGrafico.over3_5[oscilacao]) {
          rankingsGrafico.over3_5[oscilacao] = 0;
        }
        rankingsGrafico.over3_5[oscilacao]++;
      }

      // rankingsGrafico Subida e Lateralização
      if (i < dados.length - 1) {
        const proximaLinha = dados[i + 1];
        if (j < proximaLinha.length) {
          const proximaPartida = proximaLinha[j];
          if (partida.tipo === "over" && proximaPartida.tipo === "under") {
            if (!rankingsGrafico.subida2_5[proximaPartida.oscilacao]) {
              rankingsGrafico.subida2_5[proximaPartida.oscilacao] = 0;
            }
            rankingsGrafico.subida2_5[proximaPartida.oscilacao]++;

            if (proximaPartida.totalGols >= 3.5) {
              if (!rankingsGrafico.subida3_5[proximaPartida.oscilacao]) {
                rankingsGrafico.subida3_5[proximaPartida.oscilacao] = 0;
              }
              rankingsGrafico.subida3_5[proximaPartida.oscilacao]++;
            }
          } else if (
            partida.tipo === "over" &&
            proximaPartida.tipo === "over"
          ) {
            if (!rankingsGrafico.lateralizacao2_5[proximaPartida.oscilacao]) {
              rankingsGrafico.lateralizacao2_5[proximaPartida.oscilacao] = 0;
            }
            rankingsGrafico.lateralizacao2_5[proximaPartida.oscilacao]++;
          }
        }
      }
    }
  }

  return rankingsGrafico;
}

const formatarDadosRank = (rank) => {
  const rankMapeado = Object.entries(rank)
    .sort(([oscilacaoA], [oscilacaoB]) => oscilacaoB - oscilacaoA)
    .map(([oscilacao, quantidade]) => ({ oscilacao, quantidade }))
    .filter((item) => item.oscilacao !== "undefined"); // Agora o filter realmente remove os itens inválidos
  return rankMapeado;
};
const formatarNomeRank = (nome) => {
  const mapeamentoNomes = {
    over2_5: "Ranking Over 2.5",
    over3_5: "Ranking Over 3.5",
    subida2_5: "Ranking Subida (2.5)",
    lateralizacao2_5: "Ranking Lateralização (2.5)",
    subida3_5: "Ranking Subida (3.5)",
  };
  return mapeamentoNomes[nome] || nome;
};
const calculateAncoraMercado = (matches) => {
  const teamStats = {};
  const rodadaGols = [];

  // 1. Calcular o total de gols de cada partida individualmente
  matches.forEach((rodada) => {
    rodada.slice(1).forEach((partida, index) => {
      const regex = /(.*?)\s+x\s+(.*?)\s+(\d+)-(\d+)/;
      const match = partida.match(regex);

      if (!match) return;

      const [, team1, team2, score1, score2] = match;
      const gols1 = Number(score1);
      const gols2 = Number(score2);

      // Se a soma de gols for maior que 5, marca as rodadas
      // Inicializar estatísticas dos times, caso ainda não existam
      if (!teamStats[team1]) {
        teamStats[team1] = {
          points: 0,
          gamesPlayed: 0,
        };
      }
      if (!teamStats[team2]) {
        teamStats[team2] = {
          points: 0,
          gamesPlayed: 0,
        };
      }

      // Contabilizando as partidas jogadas
      teamStats[team1].gamesPlayed++;
      teamStats[team2].gamesPlayed++;

      // Armazenando os gols da partida e o total de gols dessa partida
      rodadaGols.push({
        team1,
        team2,
        gols1,
        gols2,
        totalGols: gols1 + gols2,
      });
    });
  });

  // 2. Atribuir pontos baseados nas rodadas
  rodadaGols.forEach(({ team1, team2, totalGols }, index) => {
    // Verificar rodada anterior e próxima com base no total de gols já calculado
    const rodadaAnterior = rodadaGols[index - 1] || {};
    const rodadaProxima = rodadaGols[index + 1] || {};

    // Se a rodada anterior, atual ou próxima tiverem gols > 5, todos os times pontuam
    if (totalGols >= 5) {
      teamStats[team1].points++;
      teamStats[team2].points++;
      teamStats[rodadaAnterior.team1].points++;
      teamStats[rodadaAnterior.team2].points++;
      teamStats[rodadaProxima.team1].points++;
      teamStats[rodadaProxima.team2].points++;
    }
  });

  // 3. Formatar o resultado
  const pontos = Object.entries(teamStats).map(([team]) => ({
    team,
    value: teamStats[team].points,
    totalGames: teamStats[team].gamesPlayed,
  }));

  return pontos.sort((a, b) => b.value - a.value);
};

// Função dos graficos

const onClickAnalisar = () => {
  const resultadoAnalise = document.getElementById("graficos");
  dadosFormatados.value = [];
  showRanks.value = true;
  showRanksAcc.value = true;
  if (!resultadoAnalise) {
    console.error("Elemento #graficos não encontrado.");
    return;
  }

  resultadoAnalise.style.display = "block";
  gerarTabelaEGraficos();
};

let chartUnderOver = null;
let chartAmbas = null;
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
  dadosAnaliseTmp = dadosAnalise.value
    .replace(/\r?\n|\r/g, " ")
    .replace(/\s{2,}/g, " ");
  dadosAnaliseTmp = dadosAnaliseTmp.replace(/(\d+)(?=\s)/g, "\n$1");
  dadosAnaliseTmp = dadosAnaliseTmp.replaceAll('"', "");
  const dataInput = dadosAnaliseTmp.trim();
  if (!dataInput) return;

  const liga = campeonatoSelecionado.value;
  const minutos = gerarMinutosPorLiga(liga);
  const mosaico = sanitizarDados(dataInput);
  const maximasDeMercado = calculateMaximaMercado(mosaico);
  rankings.value = [
    { title: "Chama Gol", data: calculateChamaGol(mosaico), show_all: false },
    {
      title: "Máxima de Mercado 2,5",
      data: maximasDeMercado[0],
      show_all: false,
    },
    {
      title: "Máxima de Mercado 3,5",
      data: maximasDeMercado[1],
      show_all: false,
    },
    {
      title: "Âncora de Mercado",
      data: calculateAncoraMercado(mosaico),
      show_all: false,
    },
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

function calcularOscilacaoPorMercadoEspecifico(
  resultadosMercados,
  mercadosAlvo
) {
  const oscilacoesMercado = {};

  mercadosAlvo.forEach((mercado) => {
    let acumulado = 0;
    const oscilacoes = [];

    for (
      let rowIndex = resultadosMercados[mercado].length - 2;
      rowIndex >= 0;
      rowIndex--
    ) {
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
function getPorcentagensMedias(porcentagens) {
  const porcentagensMedias = {};
  //duas medias, dos 10 primeiros, e dos outros 10 ultimos
  const primeiraMedia =
    porcentagens.slice(0, 10).reduce((a, b) => Number(a) + Number(b), 0) / 10;
  const segundaMedia =
    porcentagens.slice(-10).reduce((a, b) => Number(a) + Number(b), 0) / 10;
  porcentagensMedias.primeiraMedia = {
    media: primeiraMedia.toFixed(2),
    class: primeiraMedia.toFixed(2) >= 42 ? "green" : "red",
  };
  porcentagensMedias.segundaMedia = {
    media: segundaMedia.toFixed(2),
    class: segundaMedia.toFixed(2) >= 42 ? "green" : "red",
  };
  return porcentagensMedias;
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
  const mediasObj = getPorcentagensMedias(porcentagens);
  porcentagensMedias.value = mediasObj;
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
  let valores = [];
  linhas.forEach((linha, index) => {
    if (index > 0) {
      const celulaSubida = linha.innerText;
      if (celulaSubida) {
        const valor = parseInt(celulaSubida.trim(), 10);

        if (!isNaN(valor)) {
          valores.push(valor);
          soma += valor;
          contador++;
        }
      }
    }
  });

  const media =
    contador > 0 ? `${Math.ceil((soma / (contador - 1)).toFixed(2))}` : 0;
  if (tabelaId === "tabelao25") {
    mediasTotais.value.subida.media = media;
    mediasTotais.value.subida.ultimasTresSoma = valores
      .slice(-3)
      .reduce((acc, val) => acc + val, 0);
    mediasTotais.value.subida.mult3 = media * 3;
    mediasTotais.value.subida.class =
      mediasTotais.value.subida.mult3 >
      mediasTotais.value.subida.ultimasTresSoma
        ? "green"
        : "red";
  }
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
  let valores = [];
  linhas.forEach((linha, index) => {
    if (index > 0) {
      const celulaSubida = linha.innerText;
      if (celulaSubida) {
        const valor = parseInt(celulaSubida.trim(), 10);

        if (!isNaN(valor)) {
          valores.push(valor);
          soma += valor;
          contador++;
        }
      }
    }
  });

  const media =
    contador > 0 ? `${Math.ceil((soma / (contador - 1)).toFixed(2))}` : 0;
  if (tabelaId === "tabelao25") {
    mediasTotais.value.lateralizacoesOver.media = media;
    mediasTotais.value.lateralizacoesOver.ultimasTresSoma = valores
      .slice(-3)
      .reduce((acc, val) => acc + val, 0);
    mediasTotais.value.lateralizacoesOver.mult3 = media * 3;
    mediasTotais.value.lateralizacoesOver.class =
      mediasTotais.value.lateralizacoesOver.mult3 >
      mediasTotais.value.lateralizacoesOver.ultimasTresSoma
        ? "green"
        : "red";
  }
  const mediaColunaSubidas = document.getElementById(
    `${tabelaId}mediaColunaLateralizacoesOver`
  );
  mediaColunaSubidas.innerText = media;
}
//volta
function calcularMediaDescidas(tabelaId) {
  const tabela = document.getElementById(tabelaId);
  const linhas = Array.from(tabela.getElementsByClassName("descidasCell"));
  let soma = 0;
  let contador = 0;
  let valores = [];
  linhas.forEach((linha, index) => {
    if (index > 0) {
      const celulaSubida = linha.innerText;
      if (celulaSubida) {
        const valor = parseInt(celulaSubida.trim(), 10);

        if (!isNaN(valor)) {
          valores.push(valor);
          soma += valor;
          contador++;
        }
      }
    }
  });

  const media =
    contador > 0 ? `${Math.ceil((soma / (contador - 1)).toFixed(2))}` : 0;

  if (tabelaId === "tabelao25") {
    mediasTotais.value.descida.media = media;
    mediasTotais.value.descida.ultimasTresSoma = valores
      .slice(-3)
      .reduce((acc, val) => acc + val, 0);
    mediasTotais.value.descida.mult3 = media * 3;
    mediasTotais.value.descida.class =
      mediasTotais.value.descida.mult3 >
      mediasTotais.value.descida.ultimasTresSoma
        ? "green"
        : "red";
  }
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
  let valores = [];

  linhas.forEach((linha, index) => {
    if (index > 0) {
      const celulaSubida = linha.innerText;
      if (celulaSubida) {
        const valor = parseInt(celulaSubida.trim(), 10);

        if (!isNaN(valor)) {
          valores.push(valor);
          soma += valor;
          contador++;
        }
      }
    }
  });

  const media =
    contador > 0 ? `${Math.ceil((soma / (contador - 1)).toFixed(2))}` : 0;
  if (tabelaId === "tabelao25") {
    mediasTotais.value.lateralizacoesUnder.media = media;
    mediasTotais.value.lateralizacoesUnder.ultimasTresSoma = valores
      .slice(-3)
      .reduce((acc, val) => acc + val, 0);
    mediasTotais.value.lateralizacoesUnder.mult3 = media * 3;
    mediasTotais.value.lateralizacoesUnder.class =
      mediasTotais.value.lateralizacoesUnder.mult3 >
      mediasTotais.value.lateralizacoesUnder.ultimasTresSoma
        ? "green"
        : "red";
  }
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
  let valores = [];

  // Itera sobre as linhas, pulando o cabeçalho e a soma de gols
  for (let i = 1; i < linhas.length; i++) {
    const celulaGols = linhas[i].querySelector(".golsCell"); // Pega a célula de gols da linha

    if (celulaGols) {
      const valor = parseInt(celulaGols.innerText.trim(), 10);

      if (!isNaN(valor)) {
        valores.push(valor);
        soma += valor;
        contador++;
      }
    }
  }
  const media = contador > 0 ? `${Math.ceil(soma / contador)}` : 0;
  if (tabelaId === "tabelao25") {
    mediasTotais.value.gols.media = media;
    mediasTotais.value.gols.ultimasTresSoma = valores
      .slice(-3)
      .reduce((acc, val) => acc + val, 0);
    mediasTotais.value.gols.mult3 = media * 3;
    mediasTotais.value.gols.class =
      mediasTotais.value.gols.mult3 > mediasTotais.value.gols.ultimasTresSoma
        ? "green"
        : "red";
  }
  const mediaColunaGols = document.getElementById(`${tabelaId}mediaColunaGols`);
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
  somaDeGolsPorColuna.value = somaGolsPorColuna;
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

function dividirRodadasEmBlocos(dados) {
  let blocos = [];
  let totalColunas = dados[0].length;
  let totalLinhas = dados.length;

  for (let colStart = 0; colStart < totalColunas; colStart += 5) {
    for (let linhaStart = 0; linhaStart < totalLinhas; linhaStart += 3) {
      let bloco = [];

      for (let i = 0; i < 3 && linhaStart + i < totalLinhas; i++) {
        let linha = [];
        for (let j = colStart; j < colStart + 5 && j < totalColunas; j++) {
          linha.push(dados[linhaStart + i][j]);
        }
        bloco.push(linha);
      }

      blocos.push(bloco);
    }
  }

  return blocos;
}

function calcularSomaDeGolsBlocos(blocosJogos, somaGolsPorColuna) {
  return blocosJogos.map((bloco, index) => {
    // Soma dos gols por linha dentro do bloco
    const somaPorLinha = bloco.map((linha) =>
      linha.reduce((soma, jogo) => soma + jogo.totalGols, 0)
    );

    // Média da soma das linhas dentro do bloco
    const media =
      somaPorLinha.length > 0
        ? somaPorLinha.reduce((a, b) => a + b, 0) / somaPorLinha.length
        : 0;

    // Cálculo da média dos gols por colunas para esse bloco
    const startIndex = index * 5; // Índice inicial do bloco no array de colunas
    const colunasBloco = somaGolsPorColuna.slice(startIndex, startIndex + 5);

    const mediaGolColunas =
      colunasBloco.length > 0
        ? colunasBloco.reduce((a, b) => a + b, 0) / 5 / 2.5
        : 0;

    return { somaPorLinha, media, mediaGolColunas };
  });
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

        const regex = /(.*?)\s+x\s+(.*?)\s+(\d+)-(\d+)/;
        const match = value.match(regex);
        const [, team1, team2, score1, score2] = match;

        if (!dadosFormatados.value[rowIndex]) {
          dadosFormatados.value[rowIndex] = [];
        }

        dadosFormatados.value[rowIndex][colIndex] = {
          time1: team1,
          time2: team2,
          score1: Number(score1),
          score2: Number(score2),
          totalGols: Number(score1) + Number(score2),
        };

        const spanTeam1 = document.createElement("span");
        spanTeam1.innerText = team1;
        spanTeam1.classList.add("timesSpan");
        cell.appendChild(spanTeam1);

        const br = document.createElement("br");
        cell.appendChild(br);

        const spanX = document.createElement("span");
        spanX.innerText = "x";
        spanX.classList.add("spanX");
        cell.appendChild(spanX);

        const br2 = document.createElement("br");
        cell.appendChild(br2);

        const spanTeam2 = document.createElement("span");
        spanTeam2.innerText = team2;
        spanTeam2.classList.add("timesSpan");
        cell.appendChild(spanTeam2);

        const br3 = document.createElement("br");
        cell.appendChild(br3);

        const matchPlacar = `${score1}-${score2}`;
        const spanPlacar = document.createElement("span");
        spanPlacar.classList.add("placarJogos");
        spanPlacar.innerText = matchPlacar;
        cell.appendChild(spanPlacar);

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
            dadosFormatados.value[rowIndex][colIndex].tipo =
              rodadaClasse === "green" ? "over" : "under";
          }
        }
        if (
          oscilacoesPorMercado[mercado][rowIndex] &&
          oscilacoesPorMercado[mercado][rowIndex][colIndex] !== undefined
        ) {
          const oscilacao = oscilacoesPorMercado[mercado][rowIndex][colIndex];
          const spanOscilacao = document.createElement("span");
          dadosFormatados.value[rowIndex][colIndex].oscilacao = oscilacao;
          spanOscilacao.classList.add("pontosGraficos");
          spanOscilacao.innerText = `p: ${oscilacao}`;
          cell.appendChild(spanOscilacao);
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
    mercadoTabela, mosaico;
  });
  ativarDestaquePontos();
  rankingsGraficoAcc.value = gerarRankings(dadosFormatados.value);
  blocosJogos.value = dividirRodadasEmBlocos(dadosFormatados.value);
  somaDeGolsPorBloco.value = calcularSomaDeGolsBlocos(
    blocosJogos.value,
    somaDeGolsPorColuna.value
  );
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
          text: "Horários",
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
