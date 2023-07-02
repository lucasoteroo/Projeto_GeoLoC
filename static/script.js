// Lista de localizações
const listaLocalizacoes = [
  {'name': 'Fórum', 'latitude': -8.337102229888044, 'longitude': -36.418989475786226},
  {'name': 'Praça da criança', 'latitude': -8.343648504423799, 'longitude': -36.41387802698492},
  {'name': 'Praça de eventos', 'latitude': -8.3282630931819, 'longitude': -36.420677011490824},
  {'name': 'Maria Cristina', 'latitude': -8.322165115376684, 'longitude': -36.4131265747507},
  {'name': 'Hotel Lux', 'latitude': -8.342648493218235, 'longitude': -36.417996839356334},
  {'name': 'Entrada da Cohab 1', 'latitude': -8.349024814316115, 'longitude': -36.40816293077253},
  {'name': 'Escola Dr. Sebatião Cabral', 'latitude': -8.342163205471854, 'longitude': -36.416830941150298},
  {'name': 'Colégio Éxito', 'latitude': -8.325263839326702, 'longitude': -36.4186024306167},
  {'name': 'Escola Prof. Donino', 'latitude': -8.333162206111101, 'longitude': -36.417373357004664},
  {'name': 'Placa do hospital Santa Fé', 'latitude': -8.331886028800131, 'longitude': -36.41350364631309},
  {'name': 'AEB', 'latitude': -8.31843851977889, 'longitude': -36.39572431265977},
  {'name': 'UABJ', 'latitude': -8.326820383046934, 'longitude': -36.40532517467536},
  {'name': 'Centro', 'latitude': -8.337516901966037, 'longitude': -36.42583225561581},
  {'name': 'Erem João Monteiro', 'latitude': -8.339019961440135, 'longitude': -36.43257982213477},
  {'name': 'Câmara municipal', 'latitude': -8.332738694916673, 'longitude': -36.41868088328961},
  {'name': 'Posto Petrovia', 'latitude': -8.337249932009748, 'longitude': -36.4303272889118},
  {'name': 'Trevo de acesso', 'latitude': -8.345068172150173, 'longitude': -36.43325160699831},
  {'name': 'Casa', 'latitude': -8.338991, 'longitude': -36.419332}
];

function calcularDistancia(latitude1, longitude1, latitude2, longitude2) {
  const raioTerra = 6371; // Raio médio da Terra em quilômetros
  const dLat = toRadians(latitude2 - latitude1);
  const dLon = toRadians(longitude2 - longitude1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(latitude1)) * Math.cos(toRadians(latitude2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = raioTerra * c;
  return distancia;
}

function toRadians(graus) {
  return graus * (Math.PI / 180);
}

function verificarProximidade(latitude, longitude) {
  const localizacoesProximas = [];

  listaLocalizacoes.forEach(localizacao => {
    const distancia = calcularDistancia(latitude, longitude, localizacao.latitude, localizacao.longitude);
    if (distancia > 0.1) { // 100 metros (0.1 km)
      localizacoesProximas.push({ name: localizacao.name, distancia: distancia.toFixed(2) });
    }
  });

  if (localizacoesProximas.length > 0) {
    let localizacoesHTML = "";
    localizacoesProximas.forEach(localizacao => {
      localizacoesHTML += `<p>Você está a ${localizacao.distancia} km de ${localizacao.name}</p>`;
    });
    document.getElementById("localizacoes").innerHTML = localizacoesHTML;
    enviarDistanciaTelegram(localizacoesProximas);
  } else {
    document.getElementById("localizacoes").textContent = "Você não está próximo de nenhuma localização.";
  }
}

function enviarDistanciaTelegram(localizacoes) {
  const url = '/enviar_distancia';
  const distancia = obterDistancia(); // Chame a função que retorna a distância desejada
  const chatId = 1110850646; // Substitua pelo valor do chat_id correto
  const data = { distancia: distancia, chat_id: chatId };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        console.log('Distância enviada com sucesso');
      } else {
        console.log('Erro ao enviar a distância');
      }
    })
    .catch(error => {
      console.error('Erro ao enviar a distância:', error);
    });
}

function obterDistancia() {
  // Implemente a lógica para obter a distância desejada e retorne o valor aqui
  const latitude1 = -8.284254; // Latitude da sua localização
  const longitude1 = -35.991428; // Longitude da sua localização

  let mensagem = `Sua localização: Latitude ${latitude1.toFixed(6)}, Longitude ${longitude1.toFixed(6)}<br><br>`;

  listaLocalizacoes.forEach(localizacao => {
    const distancia = calcularDistancia(latitude1, longitude1, localizacao.latitude, localizacao.longitude);
    mensagem += `Você está a ${distancia.toFixed(2)} km de ${localizacao.name}<br>`;
  });

  return mensagem;
}

function obterLocalizacao() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      document.getElementById("coordenadas").textContent = `Sua localização: Latitude ${latitude.toFixed(6)}, Longitude ${longitude.toFixed(6)}`;
      verificarProximidade(latitude, longitude);
    }, error => {
      console.log("Erro ao obter a localização: " + error.message);
    });
  } else {
    console.log("Geolocalização não suportada pelo navegador");
  }
}

setInterval(obterLocalizacao, 5000); // Chama a função a cada 5 segundos

const btnObterLocalizacao = document.getElementById("btnObterLocalizacao");
btnObterLocalizacao.addEventListener("click", obterLocalizacao);
