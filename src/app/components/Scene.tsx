'use client';
import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid } from '@react-three/drei';
import { useRef, useEffect, Suspense } from 'react';
import ComplexModel from './ComplexModel';
import { ComplexBlock } from '../data/complex-data';

interface SceneProps {
  selectedBlock: ComplexBlock | null;
  onSelectBlock: (block: ComplexBlock | null) => void;
  resetTrigger: number;
  viewMode: 'Campus' | '2D' | 'Rodovia' | 'Patio';
  isOpenRoof: boolean;
  isLightBlueprint?: boolean;
}

function CameraRig({
  selectedBlock,
  resetTrigger,
  viewMode,
}: {
  selectedBlock: ComplexBlock | null;
  resetTrigger: number;
  viewMode: string;
}) {
  const controlsRef = useRef<any>(null);

  // FOCO NO BLOCO SELECIONADO
  useEffect(() => {
    if (!controlsRef.current) return;

    if (selectedBlock) {
      const [bx, by, bz] = selectedBlock.position;
      const [bw, , bd] = selectedBlock.size;
      const maxDim = Math.max(bw, bd);

      controlsRef.current.setLookAt(
        bx + maxDim * 0.35,
        by + maxDim * 0.85,
        bz + maxDim * 0.95,
        bx,
        by,
        bz,
        true
      );
    }
  }, [selectedBlock]);

  // CONTROLE DOS MODOS DE VISÃO DO COMPLEXO
  useEffect(() => {
    if (!controlsRef.current) return;

    // Bloqueia o horizonte estritamente para não permitir girar como um globo e ver por baixo do chão
    controlsRef.current.maxPolarAngle = Math.PI / 2 - 0.05;
    controlsRef.current.minPolarAngle = 0;

    if (viewMode === '2D') {
      // PLANTA BAIXA OFICIAL (VISTA ORTOGONAL SUPERIOR DA PRANCHA A1)
      controlsRef.current.setLookAt(-4, 118, 0.01, -4, 0, 0, true);
    } else if (viewMode === 'Rodovia') {
      // ACESSO RODOVIA FAUSTO SANTO MAURO (LESTE)
      controlsRef.current.setLookAt(68, 22, 32, 10, 2, 2, true);
    } else if (viewMode === 'Patio') {
      // PÁTIO CENTRAL E ESTACIONAMENTO DE CARRETAS
      controlsRef.current.setLookAt(38, 14, 20, -6, 2, -4, true);
    } else {
      // VISÃO PANORÂMICA 3D DO COMPLEXO LOGÍSTICO
      controlsRef.current.setLookAt(-4, 65, 72, -4, 0, 2, true);
    }
  }, [resetTrigger, viewMode]);

  return (
    <CameraControls
      ref={controlsRef}
      makeDefault
      dollySpeed={1.4}
      truckSpeed={1.4}
      minDistance={1.5}
      maxDistance={260}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2 - 0.05}
      mouseButtons={{ left: 1, right: 2, wheel: 4, middle: 0 }}
    />
  );
}

export default function Scene({
  selectedBlock,
  onSelectBlock,
  resetTrigger,
  viewMode,
  isOpenRoof,
  isLightBlueprint = false,
}: SceneProps) {
  const bgColor = isLightBlueprint ? '#e2e8f0' : '#060a14';

  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ powerPreference: 'high-performance', antialias: true }}
      camera={{ position: [-4, 65, 72], fov: 42 }}
      shadows
      style={{ width: '100%', height: '100%', touchAction: 'none', background: bgColor }}
    >
      <fog attach="fog" args={[bgColor, 130, 320]} />

      <ambientLight intensity={0.85} />
      <directionalLight
        position={[60, 100, 50]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={300}
        shadow-camera-left={-140}
        shadow-camera-right={140}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />
      <directionalLight position={[-60, 40, -40]} intensity={0.4} color="#93c5fd" />

      <Suspense fallback={null}>
        <ComplexModel
          selectedBlockId={selectedBlock?.id || null}
          onSelectBlock={onSelectBlock}
          isOpenRoof={isOpenRoof}
          isLightBlueprint={isLightBlueprint}
        />
      </Suspense>

      <CameraRig
        selectedBlock={selectedBlock}
        resetTrigger={resetTrigger}
        viewMode={viewMode}
      />

      <Grid
        position={[0, -0.1, 0]}
        infiniteGrid
        fadeDistance={220}
        sectionColor={isLightBlueprint ? '#94a3b8' : '#1e293b'}
        cellColor={isLightBlueprint ? '#cbd5e1' : '#0f172a'}
        sectionSize={20}
        cellSize={5}
      />
    </Canvas>
  );
}
