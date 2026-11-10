export type BlockStatus = 'locado' | 'disponivel' | 'expansao' | 'mamprin';

export const BLUEPRINT_WIDTH_PX = 5120;
export const BLUEPRINT_HEIGHT_PX = 1980;

// Escala do mundo 3D mantendo a proporção exata da prancha A1 (5120 / 20 = 256, 1980 / 20 = 99)
export const WORLD_WIDTH = 256;
export const WORLD_DEPTH = 99;

export function pxToWorld(px: number, py: number): [number, number] {
  const x = (px / BLUEPRINT_WIDTH_PX - 0.5) * WORLD_WIDTH;
  const z = (py / BLUEPRINT_HEIGHT_PX - 0.5) * WORLD_DEPTH;
  return [x, z];
}

export interface ComplexBlock {
  id: string;
  name: string;
  code: string;
  status: BlockStatus;
  statusLabel: string;
  fillColor: string;
  borderColor: string;
  wallColor: string;
  textColor: string;
  modules: string[];
  totalAreaM2: number;
  docksCount: number;
  clearHeightM: number;
  height3D: number;
  pixelPolygon: [number, number][]; // Coordenadas exatas [px, py] na planta 5120x1980
  position: [number, number, number]; // Centro calculado no mundo 3D [X, Y, Z]
  size: [number, number, number]; // Bounding box no mundo 3D [width, height, depth]
  rotationY?: number;
  description: string;
  details: {
    inquilino?: string;
    pisoCapacidade: string;
    rampaAcesso: boolean;
    marquise: boolean;
  };
}

export const STATUS_COLORS: Record<
  BlockStatus,
  { fill: string; border: string; wall: string; text: string; hex: string; bg: string }
> = {
  locado: {
    fill: '#fca5a5',
    border: '#f43f5e',
    wall: '#881337',
    text: '#fda4af',
    hex: '#f43f5e',
    bg: 'rgba(244, 63, 94, 0.2)',
  },
  disponivel: {
    fill: '#86efac',
    border: '#22c55e',
    wall: '#14532d',
    text: '#4ade80',
    hex: '#22c55e',
    bg: 'rgba(34, 197, 94, 0.2)',
  },
  expansao: {
    fill: '#bae6fd',
    border: '#38bdf8',
    wall: '#0c4a6e',
    text: '#38bdf8',
    hex: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.2)',
  },
  mamprin: {
    fill: '#e9d5ff',
    border: '#a855f7',
    wall: '#4c1d95',
    text: '#c084fc',
    hex: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.2)',
  },
};

interface RawBlockConfig {
  id: string;
  name: string;
  code: string;
  status: BlockStatus;
  statusLabel: string;
  modules: string[];
  totalAreaM2: number;
  docksCount: number;
  clearHeightM: number;
  height3D: number;
  pixelPolygon: [number, number][];
  rotationY?: number;
  description: string;
  details: {
    inquilino?: string;
    pisoCapacidade: string;
    rampaAcesso: boolean;
    marquise: boolean;
  };
}

const RAW_BLOCKS: RawBlockConfig[] = [
  // 1. BLOCO D (Ala Oeste Central - Trapezoidal acompanhando a Mata Nativa)
  {
    id: 'bloco-d',
    name: 'BLOCO D',
    code: 'D',
    status: 'locado',
    statusLabel: 'LOCADO',
    modules: ['D5', 'D4', 'D3', 'D2', 'D1'],
    totalAreaM2: 6800,
    docksCount: 10,
    clearHeightM: 12,
    height3D: 2.8,
    pixelPolygon: [
      [1495, 965],
      [1832, 945],
      [1835, 1135],
      [1365, 1150],
    ],
    description: 'Módulos D1 a D5 com docas voltadas ao pátio central e divisa oeste com a Mata Nativa.',
    details: {
      inquilino: 'Operação Logística Dedicada',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 2. BLOCO E (Espinha Dorsal Central - E11 até E1 com degrau em E2/E1)
  {
    id: 'bloco-e',
    name: 'BLOCO E',
    code: 'E',
    status: 'locado',
    statusLabel: 'LOCADO (WMS ATIVO)',
    modules: ['E11', 'E10', 'E9', 'E8', 'E7', 'E6', 'E5', 'E4', 'E3', 'E2', 'E1'],
    totalAreaM2: 17200,
    docksCount: 22,
    clearHeightM: 12,
    height3D: 3.0,
    pixelPolygon: [
      [1860, 912],
      [2572, 912],
      [2572, 852],
      [2658, 852],
      [2662, 1098],
      [1865, 1125],
    ],
    description: 'Pavilhão principal com 11 módulos (E1 a E11), bateria de docas com marquise e WMS 3D ativo.',
    details: {
      inquilino: 'Grupo MNGT Logística',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 3. BLOCO F (Norte Frontal - Polígono chanfrado F8 até F1)
  {
    id: 'bloco-f',
    name: 'BLOCO F',
    code: 'F',
    status: 'locado',
    statusLabel: 'LOCADO',
    modules: ['F8', 'F7', 'F6', 'F5', 'F4', 'F3', 'F2', 'F1'],
    totalAreaM2: 11200,
    docksCount: 16,
    clearHeightM: 12,
    height3D: 2.8,
    pixelPolygon: [
      [1830, 660],
      [1865, 628],
      [2135, 615],
      [2538, 745],
      [2538, 798],
      [1832, 825],
    ],
    description: 'Bloco com geometria chanfrada acompanhando a via interna norte e docas voltadas ao pátio.',
    details: {
      inquilino: 'Distribuição & Bens de Consumo',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 4. BLOCO G (Norte Leste - Módulos escalonados G1 a G7)
  {
    id: 'bloco-g',
    name: 'BLOCO G',
    code: 'G',
    status: 'disponivel',
    statusLabel: 'DISPONÍVEL',
    modules: ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7'],
    totalAreaM2: 9800,
    docksCount: 14,
    clearHeightM: 12,
    height3D: 2.8,
    pixelPolygon: [
      [2645, 580],
      [3245, 550],
      [3275, 792],
      [3098, 792],
      [3098, 760],
      [3018, 760],
      [2935, 730],
      [2865, 715],
      [2795, 685],
      [2720, 670],
      [2645, 642],
    ],
    description: 'Módulos escalonados G1 a G7 prontos para ocupação imediata com amplo pátio frontal.',
    details: {
      inquilino: 'DISPONÍVEL PARA LOCAÇÃO',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 5. BLOCO H (Leste junto à Rodovia - H1, H2, H3)
  {
    id: 'bloco-h',
    name: 'BLOCO H',
    code: 'H',
    status: 'disponivel',
    statusLabel: 'DISPONÍVEL',
    modules: ['H1', 'H2', 'H3'],
    totalAreaM2: 4200,
    docksCount: 6,
    clearHeightM: 12,
    height3D: 2.6,
    pixelPolygon: [
      [3260, 765],
      [3495, 755],
      [3512, 1015],
      [3362, 1015],
      [3340, 860],
      [3250, 845],
    ],
    description: 'Módulos H1, H2 e H3 estrategicamente posicionados junto à portaria e acesso da rodovia.',
    details: {
      inquilino: 'DISPONÍVEL PARA LOCAÇÃO',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 6. BLOCO C (Sul Oeste - C5, C4, C2, C1)
  {
    id: 'bloco-c',
    name: 'BLOCO C',
    code: 'C',
    status: 'locado',
    statusLabel: 'LOCADO',
    modules: ['C5', 'C4', 'C2', 'C1', 'Refeitório C3'],
    totalAreaM2: 6200,
    docksCount: 10,
    clearHeightM: 12,
    height3D: 2.8,
    pixelPolygon: [
      [2265, 1275],
      [2450, 1275],
      [2450, 1662],
      [2535, 1662],
      [2535, 1825],
      [2355, 1825],
      [2355, 1742],
      [2265, 1742],
    ],
    description: 'Bloco vertical sul composto pelos módulos C1, C2, C4 e C5, contíguo ao pátio do Bloco B.',
    details: {
      inquilino: 'Operação Industrial & Armazenagem',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 7. BLOCO B (Sul Central - B5, B4, B3, B2, B1)
  {
    id: 'bloco-b',
    name: 'BLOCO B',
    code: 'B',
    status: 'locado',
    statusLabel: 'LOCADO',
    modules: ['B5', 'B4', 'B3', 'B2', 'B1'],
    totalAreaM2: 5600,
    docksCount: 10,
    clearHeightM: 12,
    height3D: 2.8,
    pixelPolygon: [
      [2555, 1295],
      [2660, 1295],
      [2660, 1360],
      [2910, 1360],
      [2910, 1285],
      [3015, 1285],
      [3095, 1385],
      [3090, 1425],
      [2895, 1425],
      [2895, 1510],
      [2555, 1510],
    ],
    description: 'Módulos B1 a B5 com pátio de docas norte/leste e área de apoio operacional.',
    details: {
      inquilino: 'Indústria & Logística Integrada',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 8. BLOCO A (Sul Leste - A1 a A7 + Área Administrativa Galpão A)
  {
    id: 'bloco-a',
    name: 'BLOCO A',
    code: 'A',
    status: 'locado',
    statusLabel: 'LOCADO',
    modules: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'Área Admin'],
    totalAreaM2: 12800,
    docksCount: 18,
    clearHeightM: 12,
    height3D: 2.8,
    pixelPolygon: [
      [2555, 1580],
      [2720, 1580],
      [2720, 1628],
      [3208, 1605],
      [3208, 1490],
      [3325, 1490],
      [3385, 1625],
      [3380, 1775],
      [3335, 1835],
      [3208, 1835],
      [3208, 1745],
      [2855, 1745],
      [2855, 1825],
      [2555, 1825],
    ],
    description: 'Complexo A1 a A7 com recepção corporativa, área administrativa do Galpão A e pátio de docas.',
    details: {
      inquilino: 'Operador Logístico 3PL',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 9. BLOCO I (Expansão Noroeste - I3, I2, I1)
  {
    id: 'bloco-i',
    name: 'BLOCO I',
    code: 'I',
    status: 'expansao',
    statusLabel: 'PROJETO APROVADO / EXPANSÃO',
    modules: ['I3', 'I2', 'I1'],
    totalAreaM2: 4800,
    docksCount: 6,
    clearHeightM: 12,
    height3D: 1.4,
    pixelPolygon: [
      [1935, 195],
      [2260, 185],
      [2245, 515],
      [1860, 485],
    ],
    description: 'Área de expansão I1 a I3 com projeto aprovado e infraestrutura pronta.',
    details: {
      inquilino: 'Expansão Aprovada',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 10. BLOCO J (Expansão Norte Central - J1 a J10)
  {
    id: 'bloco-j',
    name: 'BLOCO J',
    code: 'J',
    status: 'expansao',
    statusLabel: 'PROJETO APROVADO / EXPANSÃO',
    modules: ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9', 'J10'],
    totalAreaM2: 12000,
    docksCount: 20,
    clearHeightM: 12,
    height3D: 1.4,
    pixelPolygon: [
      [2275, 135],
      [2775, 115],
      [2785, 500],
      [2285, 515],
    ],
    description: 'Condomínio modular norte (J1 a J10) com pátio central de docas.',
    details: {
      inquilino: 'Expansão Aprovada',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 11. BLOCO K (Expansão Nordeste - K1 a K10)
  {
    id: 'bloco-k',
    name: 'BLOCO K',
    code: 'K',
    status: 'expansao',
    statusLabel: 'PROJETO APROVADO / EXPANSÃO',
    modules: ['K1', 'K2', 'K3', 'K4', 'K5', 'K6', 'K7', 'K8', 'K9', 'K10'],
    totalAreaM2: 12000,
    docksCount: 20,
    clearHeightM: 12,
    height3D: 1.4,
    pixelPolygon: [
      [2800, 110],
      [3320, 85],
      [3355, 480],
      [2815, 500],
    ],
    description: 'Condomínio modular nordeste (K1 a K10) espelhado ao Bloco J.',
    details: {
      inquilino: 'Expansão Aprovada',
      pisoCapacidade: '6 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },

  // 12. ÁREA EXPANSÃO - MAMPRIN (Sudoeste - Built to Suit)
  {
    id: 'bloco-mamprin',
    name: 'EXPANSÃO - MAMPRIN',
    code: 'MAMPRIN',
    status: 'mamprin',
    statusLabel: 'BUILT TO SUIT',
    modules: ['Galpão BTS 1', 'Galpão BTS 2', 'Galpão BTS 3', 'Galpão BTS 4'],
    totalAreaM2: 18500,
    docksCount: 24,
    clearHeightM: 12,
    height3D: 1.2,
    pixelPolygon: [
      [1310, 1285],
      [2185, 1285],
      [2185, 1695],
      [1145, 1695],
    ],
    description: 'Área de expansão Mamprin dedicada a projetos Built to Suit de grande porte.',
    details: {
      inquilino: 'Disponível p/ Built to Suit',
      pisoCapacidade: 'Até 8 ton/m²',
      rampaAcesso: true,
      marquise: true,
    },
  },
];

// CONVERSÃO AUTOMÁTICA DOS POLÍGONOS DE PIXEL PARA GEOMETRIA 3D MUNDIAL
export const COMPLEX_BLOCKS: ComplexBlock[] = RAW_BLOCKS.map((raw) => {
  const worldPoints = raw.pixelPolygon.map(([px, py]) => pxToWorld(px, py));
  const xs = worldPoints.map((p) => p[0]);
  const zs = worldPoints.map((p) => p[1]);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  const centerX = (minX + maxX) / 2;
  const centerZ = (minZ + maxZ) / 2;
  const width = maxX - minX;
  const depth = maxZ - minZ;

  const colors = STATUS_COLORS[raw.status];

  return {
    ...raw,
    fillColor: colors.fill,
    borderColor: colors.border,
    wallColor: colors.wall,
    textColor: colors.text,
    position: [centerX, raw.height3D / 2, centerZ],
    size: [width, raw.height3D, depth],
  };
});

export const COMPLEX_METRICS = {
  nome: 'Centro Logístico Industrial Rio Claro (C.L.R.C)',
  proprietario: 'Grupo MNGT / Rio Claro Patrimonial',
  localizacao: 'Av. Cabo Basílio Zechin Júnior, 344 - Rio Claro / SP',
  acessoPrincipal: 'Rodovia Fausto Santo Mauro (SP-127)',
  areaTotalTerrenoM2: 240000,
  areaConstruidaM2: 83000,
  areaExpansaoM2: 45000,
  totalDocas: 164,
  capacidadePiso: '6 a 8 ton/m²',
  peDireitoLivre: '12 metros',
  taxaOcupacaoAtual: '78.5%',
};
