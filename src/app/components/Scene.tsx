'use client';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import wmsData from '../data/wms-mock.json';

// Adicionada a propriedade isHeatmap
function WarehouseMap({ onSelectBlock, isHeatmap }: { onSelectBlock: any, isHeatmap: boolean }) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  return (
    <>
      {wmsData.map((item) => {
        // LÓGICA DO HEATMAP: Se ligado, fica verde/vermelho. Se desligado, usa a cor normal.
        let blockColor = item.color;
        if (isHeatmap) {
          blockColor = item.status === 'livre' ? '#22c55e' : '#ef4444'; 
        }

        return (
          <mesh 
            key={item.id} 
            position={[item.position[0], item.position[1], item.position[2]]}
            onClick={(e) => { e.stopPropagation(); onSelectBlock(item); }}
            onPointerOver={(e) => { e.stopPropagation(); setHoveredBlock(item.id); document.body.style.cursor = 'pointer'; }}
            onPointerOut={(e) => { setHoveredBlock(null); document.body.style.cursor = 'auto'; }}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial 
              color={hoveredBlock === item.id ? '#ffffff' : blockColor} 
              wireframe={item.status === 'livre'}
              opacity={item.status === 'livre' ? 0.2 : 1}
              transparent={true}
            />
          </mesh>
        );
      })}
    </>
  );
}

// Adicionada a propriedade viewMode
function CameraRig({ selectedBlock, resetTrigger, viewMode }: { selectedBlock: any, resetTrigger: number, viewMode: string }) {
  const controlsRef = useRef<any>(null);

  // Efeito para quando clicamos num bloco (Foco Detalhado)
  useEffect(() => {
    if (!controlsRef.current) return;
    if (selectedBlock) {
      const [x, y, z] = selectedBlock.position;
      
      // Coloca a câmara exatamente de frente para a caixa (Z + 3) e ligeiramente acima (Y + 1.5)
      // e aponta o centro da lente exatamente para a posição da caixa (x, y, z)
      controlsRef.current.setLookAt(
        x, y + 1.5, z + 3, // Onde a câmera fica (Lente)
        x, y, z,           // Para onde ela olha (Alvo)
        true               // Animação suave ativada
      );
    }
  }, [selectedBlock]);

  // LÓGICA DO 2D MAP, AISLE VIEW e 3D VIEW
  // LÓGICA DAS CÂMARAS
  useEffect(() => {
    if (!controlsRef.current) return;
    
    if (viewMode === '2D') {
      // Planta baixa (Teto)
      controlsRef.current.setLookAt(0, 40, 0.1, 0, 0, 0, true);
      
    } else if (viewMode === 'Frontal') {
      // Nível do chão, de fora do armazém, a olhar de frente para as estruturas
      controlsRef.current.setLookAt(0, 2, 25, 0, 2, 0, true);
      
    } else if (viewMode === 'Aisle') {
      // Mergulho para DENTRO da rua (Entre os corredores)
      // O eixo X=12 coloca a câmara numa ponta da rua, e o X=-12 faz ela olhar para a outra ponta.
      // O eixo Z=2.5 posiciona a câmara exatamente no "vazio" entre a fila da esquerda e a fila da direita.
      controlsRef.current.setLookAt(12, 1.7, 2.5, -12, 1.7, 2.5, true);
      
    } else {
      // Posição 3D normal panorâmica
      controlsRef.current.setLookAt(10, 15, 25, 0, 0, 0, true);
    }
  }, [resetTrigger, viewMode]);
  return <CameraControls ref={controlsRef} makeDefault dollySpeed={2} minDistance={2} maxDistance={100} mouseButtons={{ left: 2, right: 1, wheel: 4, middle: 0 }} />;
}

// Exportação principal recebendo tudo
export default function Scene({ onSelectBlock, selectedBlock, resetTrigger, viewMode, isHeatmap }: { onSelectBlock: any, selectedBlock: any, resetTrigger: number, viewMode: string, isHeatmap: boolean }) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <WarehouseMap onSelectBlock={onSelectBlock} isHeatmap={isHeatmap} />
      <CameraRig selectedBlock={selectedBlock} resetTrigger={resetTrigger} viewMode={viewMode} />
      
      <Grid infiniteGrid fadeDistance={40} sectionColor="#475569" cellColor="#1e293b" />
    </Canvas>
  );
}