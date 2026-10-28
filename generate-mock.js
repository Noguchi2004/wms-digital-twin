const fs = require('fs');

const data = [];

// Configuração da dimensão do armazém (4 ruas x 15 colunas x 4 andares = 240 posições)
const ruas = 4;     // Eixo Z (Profundidade)
const predios = 15; // Eixo X (Largura do corredor)
const niveis = 4;   // Eixo Y (Altura da prateleira)

// Paleta de cores para cada rua (como nas Control Towers reais)
const zonas = {
  0: { nome: 'Aisle A', cor: '#3b82f6' }, // Azul
  1: { nome: 'Aisle B', cor: '#22c55e' }, // Verde
  2: { nome: 'Aisle C', cor: '#f97316' }, // Laranja
  3: { nome: 'Aisle D', cor: '#a855f7' }  // Roxo
};

for (let r = 0; r < ruas; r++) {
  for (let p = 0; p < predios; p++) {
    for (let n = 0; n < niveis; n++) {
      
      // Simulador de ocupação: 70% de chance de estar ocupado, 30% vazio
      const isOcupado = Math.random() > 0.3; 
      
      data.push({
        id: `RUA-${r+1}-PRED-${p+1}-NIV-${n+1}`,
        // Matemática do espaço: 
        // Eixo X: cada prédio fica a 1.2m de distância
        // Eixo Y: cada nível sobe 1.2m (o +0.5 é para não enterrar no chão)
        // Eixo Z: cada rua tem 4m de distância para a empilhadeira passar
        position: [p * 1.2, 0.5 + (n * 1.2), r * 4],
        zone: zonas[r].nome,
        status: isOcupado ? 'ocupado' : 'livre',
        color: zonas[r].cor
      });
    }
  }
}

// Escreve o resultado por cima do nosso ficheiro antigo
fs.writeFileSync('./src/app/data/wms-mock.json', JSON.stringify(data, null, 2));
console.log(`Sucesso! Armazém gerado com ${data.length} posições.`);