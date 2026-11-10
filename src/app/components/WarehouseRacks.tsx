'use client';
import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

export interface PalletData {
  id: string;
  localPos: [number, number, number];
  worldPos: [number, number, number];
  position: [number, number, number]; // World pos for camera rig compatibility
  aisle: string;
  bay: number;
  level: number;
  status: 'ocupado' | 'livre';
  cliente?: string;
  lote?: string;
  dataEntrada?: string;
}

interface WarehouseRacksProps {
  blockWorldPos: [number, number, number];
  blockRotationY?: number;
  buildingSize: [number, number, number]; // [width, height, depth]
  onSelectBlock?: (data: PalletData) => void;
  isHeatmap?: boolean;
}

export default function WarehouseRacks({
  blockWorldPos,
  blockRotationY = 0,
  buildingSize,
  onSelectBlock,
  isHeatmap = false,
}: WarehouseRacksProps) {
  const palletsMeshRef = useRef<THREE.InstancedMesh>(null);
  const rackUprightsMeshRef = useRef<THREE.InstancedMesh>(null);
  const rackBeamsMeshRef = useRef<THREE.InstancedMesh>(null);

  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const [bw, , bd] = buildingSize;

  // CONFIGURAÇÃO DOS PORTA-PALETES DO ARMAZÉM
  const aislesCount = 5; // 5 Ruas duplas de porta-paletes
  const baysCount = 24; // 24 Módulos/Prédios de comprimento
  const levelsCount = 4; // 4 Níveis verticais de armazenagem
  const levelHeight = 1.1; // Altura entre níveis

  // CÁLCULO DAS POSIÇÕES COM COORDENADAS LOCAIS E MUNDIAIS PRECISAS
  const { pallets, uprights, beams } = useMemo(() => {
    const palletList: PalletData[] = [];
    const uprightList: [number, number, number][] = [];
    const beamList: [number, number, number, number][] = []; // [x, y, z, width]

    const startX = -bw / 2 + 4;
    const bayPitchX = (bw - 8) / baysCount;
    const aislePitchZ = (bd - 4) / aislesCount;
    const startZ = -bd / 2 + 2;

    const cosRot = Math.cos(blockRotationY);
    const sinRot = Math.sin(blockRotationY);

    for (let a = 0; a < aislesCount; a++) {
      const zAisleCenter = startZ + a * aislePitchZ + aislePitchZ / 2;

      // Cada rua possui duas estantes paralelas (Lado Esquerdo e Lado Direito)
      [-0.8, 0.8].forEach((sideOffset, sideIdx) => {
        const sideLetter = sideIdx === 0 ? 'E' : 'D';
        const zRack = zAisleCenter + sideOffset;

        // Montantes metálicos verticais (colunas de sustentação azul industrial)
        for (let b = 0; b <= baysCount; b++) {
          const xCol = startX + b * bayPitchX - bayPitchX / 2;
          uprightList.push([xCol, (levelsCount * levelHeight) / 2, zRack - 0.45]);
          uprightList.push([xCol, (levelsCount * levelHeight) / 2, zRack + 0.45]);
        }

        // Longarinas horizontais (vigas metálicas laranja industrial)
        for (let lvl = 1; lvl <= levelsCount; lvl++) {
          const yBeam = lvl * levelHeight;
          beamList.push([0, yBeam, zRack - 0.45, bw - 8]);
          beamList.push([0, yBeam, zRack + 0.45, bw - 8]);
        }

        // Posicionamento de cada palete nas prateleiras
        for (let b = 0; b < baysCount; b++) {
          const xPos = startX + b * bayPitchX;

          for (let lvl = 0; lvl < levelsCount; lvl++) {
            const yPos = 0.4 + lvl * levelHeight;

            // Converter coordenada local para mundial (considerando rotação e translação do bloco)
            const worldX = blockWorldPos[0] + (xPos * cosRot - zRack * sinRot);
            const worldY = blockWorldPos[1] + yPos;
            const worldZ = blockWorldPos[2] + (xPos * sinRot + zRack * cosRot);

            // Simulação de ocupação (~75% ocupado)
            const isOcupado = (a * 19 + b * 11 + lvl * 7) % 10 > 2;

            palletList.push({
              id: `RUA-${String.fromCharCode(65 + a)}${sideLetter}-COL-${b + 1}-NIV-${lvl + 1}`,
              localPos: [xPos, yPos, zRack],
              worldPos: [worldX, worldY, worldZ],
              position: [worldX, worldY, worldZ], // Compatibilidade com CameraRig
              aisle: `Rua ${String.fromCharCode(65 + a)} (${sideLetter === 'E' ? 'Esquerda' : 'Direita'})`,
              bay: b + 1,
              level: lvl + 1,
              status: isOcupado ? 'ocupado' : 'livre',
              cliente: isOcupado ? (b % 3 === 0 ? 'Grupo MNGT' : 'Logística Express') : undefined,
              lote: isOcupado ? `LT-2026-${a}${b}${lvl}` : undefined,
              dataEntrada: isOcupado ? `${10 + (b % 18)}/11/2026` : undefined,
            });
          }
        }
      });
    }

    return { pallets: palletList, uprights: uprightList, beams: beamList };
  }, [blockWorldPos, blockRotationY, bw, bd, aislesCount, baysCount, levelsCount, levelHeight]);

  // ATUALIZAÇÃO DOS PALETES NA GPU
  useEffect(() => {
    if (!palletsMeshRef.current) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    pallets.forEach((pallet, i) => {
      dummy.position.set(pallet.localPos[0], pallet.localPos[1], pallet.localPos[2]);
      dummy.scale.set(0.9, 0.75, 0.85); // Tamanho padrão do pallet PBR
      dummy.updateMatrix();
      palletsMeshRef.current!.setMatrixAt(i, dummy.matrix);

      if (hoveredId === i) {
        color.set('#ffffff'); // Foco em branco
      } else if (isHeatmap) {
        color.set(pallet.status === 'livre' ? '#22c55e' : '#ef4444');
      } else {
        color.set(pallet.status === 'livre' ? '#475569' : '#38bdf8');
      }

      palletsMeshRef.current!.setColorAt(i, color);
    });

    palletsMeshRef.current.instanceMatrix.needsUpdate = true;
    if (palletsMeshRef.current.instanceColor) {
      palletsMeshRef.current.instanceColor.needsUpdate = true;
    }
  }, [pallets, isHeatmap, hoveredId]);

  // ATUALIZAÇÃO DOS MONTANTES METÁLICOS (COLUNAS AZUIS)
  useEffect(() => {
    if (!rackUprightsMeshRef.current) return;
    const dummy = new THREE.Object3D();

    uprights.forEach((pos, i) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      dummy.scale.set(0.1, levelsCount * levelHeight, 0.1);
      dummy.updateMatrix();
      rackUprightsMeshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    rackUprightsMeshRef.current.instanceMatrix.needsUpdate = true;
  }, [uprights, levelsCount, levelHeight]);

  return (
    <group>
      {/* 1. INSTANCED MESH DOS PALETES (ALTA PERFORMANCE - 1 DRAW CALL) */}
      <instancedMesh
        ref={palletsMeshRef}
        args={[undefined, undefined, pallets.length]}
        onClick={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined && pallets[e.instanceId]) {
            onSelectBlock?.(pallets[e.instanceId]);
          }
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined) {
            setHoveredId(e.instanceId);
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          setHoveredId(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.4} metalness={0.2} />
      </instancedMesh>

      {/* 2. ESTRUTURA METÁLICA: MONTANTES VERTICAIS (AZUL INDUSTRIAL) */}
      <instancedMesh
        ref={rackUprightsMeshRef}
        args={[undefined, undefined, uprights.length]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#1d4ed8" metalness={0.8} roughness={0.3} />
      </instancedMesh>

      {/* 3. PISO DE CONCRETO POLIDO DO GALPÃO COM DEMARCAÇÃO DOS CORREDORES */}
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[bw - 1, bd - 1]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 4. FAIXAS AMARELAS DE SEGURANÇA E CIRCULAÇÃO DE EMPILHADEIRAS */}
      {Array.from({ length: aislesCount }).map((_, a) => {
        const startZ = -bd / 2 + 2;
        const aislePitchZ = (bd - 4) / aislesCount;
        const zPos = startZ + a * aislePitchZ + aislePitchZ / 2;
        return (
          <mesh key={`aisle-line-${a}`} position={[0, 0.05, zPos]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[bw - 6, 0.4]} />
            <meshBasicMaterial color="#eab308" opacity={0.6} transparent />
          </mesh>
        );
      })}
    </group>
  );
}
