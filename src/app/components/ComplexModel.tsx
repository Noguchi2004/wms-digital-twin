'use client';
import { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Html, useTexture } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import {
  COMPLEX_BLOCKS,
  ComplexBlock,
  WORLD_WIDTH,
  WORLD_DEPTH,
  pxToWorld,
} from '../data/complex-data';
import WarehouseRacks from './WarehouseRacks';

interface ComplexModelProps {
  selectedBlockId: string | null;
  onSelectBlock: (block: ComplexBlock) => void;
  onSelectPallet?: (pallet: any) => void;
  isOpenRoof: boolean;
  filterStatus: string | null;
  isHeatmap?: boolean;
  isLightBlueprint?: boolean;
}

function ExtrudedBlockMesh({
  block,
  isSelected,
  isHovered,
  isRackVisible,
  blueprintTexture,
  onSelectBlock,
  onHover,
  onSelectPallet,
  isHeatmap,
}: {
  block: ComplexBlock;
  isSelected: boolean;
  isHovered: boolean;
  isRackVisible: boolean;
  blueprintTexture: THREE.Texture;
  onSelectBlock: (block: ComplexBlock) => void;
  onHover: (id: string | null) => void;
  onSelectPallet?: (pallet: any) => void;
  isHeatmap: boolean;
}) {
  const extrudeHeight = isRackVisible ? 0.45 : block.height3D;

  // CRIA A GEOMETRIA POLIGONAL 3D EXATA A PARTIR DOS VÉRTICES DA PLANTA OFICIAL
  const { geometry, edgesGeometry } = useMemo(() => {
    const shape = new THREE.Shape();

    block.pixelPolygon.forEach(([px, py], idx) => {
      const [wx, wz] = pxToWorld(px, py);
      // Como o mesh será rotacionado em [-Math.PI / 2, 0, 0], y_shape corresponde a -Z_world
      const sx = wx;
      const sy = -wz;
      if (idx === 0) {
        shape.moveTo(sx, sy);
      } else {
        shape.lineTo(sx, sy);
      }
    });
    shape.closePath();

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: extrudeHeight,
      bevelEnabled: false,
    });

    // Projeta exatamente o UV da planta oficial na cobertura 3D do galpão
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      uv.setXY(i, x / WORLD_WIDTH + 0.5, y / WORLD_DEPTH + 0.5);
    }
    uv.needsUpdate = true;
    geo.computeVertexNormals();

    const edges = new THREE.EdgesGeometry(geo, 25);
    return { geometry: geo, edgesGeometry: edges };
  }, [block.pixelPolygon, extrudeHeight]);

  const [cx, , cz] = block.position;
  const [bw, bh, bd] = block.size;

  return (
    <group>
      {/* VOLUME POLIGONAL 3D EXTRUDADO EXATAMENTE SOBRE A PLANTA */}
      <mesh
        geometry={geometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        castShadow
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
          onSelectBlock(block);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(block.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
      >
        {/* Material 0: Cobertura com o desenho CAD exato da planta (módulos, cotas e textos) */}
        <meshBasicMaterial
          attach="material-0"
          map={blueprintTexture}
          color={
            isSelected
              ? '#ffffff'
              : isHovered
              ? '#fef08a'
              : '#ffffff'
          }
          toneMapped={false}
          transparent={isRackVisible}
          opacity={isRackVisible ? 0.15 : 1}
        />

        {/* Material 1: Paredes laterais 3D do galpão */}
        <meshStandardMaterial
          attach="material-1"
          color={
            isSelected
              ? '#38bdf8'
              : isHovered
              ? '#facc15'
              : block.wallColor
          }
          roughness={0.45}
          metalness={0.25}
        />
      </mesh>

      {/* CONTORNO TÉCNICO 3D DO POLÍGONO */}
      <lineSegments
        geometry={edgesGeometry}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.03, 0]}
      >
        <lineBasicMaterial
          color={isSelected ? '#38bdf8' : isHovered ? '#fde047' : block.borderColor}
        />
      </lineSegments>

      {/* ESTOQUE INTERNO WMS (INSTANCED MESH) QUANDO O BLOCO ESTÁ EM MODO RAIO-X */}
      {isRackVisible && (
        <group position={[cx, 0.05, cz]}>
          <WarehouseRacks
            blockWorldPos={[cx, 0.05, cz]}
            blockRotationY={block.rotationY || 0}
            buildingSize={[bw * 0.82, bh, bd * 0.78]}
            onSelectBlock={onSelectPallet}
            isHeatmap={isHeatmap}
          />
        </group>
      )}

      {/* BADGE FLUTUANTE 3D INTERATIVA */}
      <Html
        position={[cx, extrudeHeight + 2.2, cz]}
        center
        distanceFactor={65}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          transition: 'transform 0.2s ease',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: isSelected
              ? 'rgba(15, 23, 42, 0.96)'
              : 'rgba(15, 23, 42, 0.82)',
            border: `1.5px solid ${
              isSelected ? '#38bdf8' : isHovered ? '#facc15' : block.borderColor
            }`,
            borderRadius: '6px',
            padding: '3px 8px',
            color: 'white',
            fontSize: '10px',
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(6px)',
            whiteSpace: 'nowrap',
            transform: isHovered || isSelected ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: block.fillColor,
                boxShadow: `0 0 6px ${block.fillColor}`,
              }}
            />
            <span>{block.name}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function ComplexModel({
  selectedBlockId,
  onSelectBlock,
  onSelectPallet,
  isOpenRoof,
  filterStatus,
  isHeatmap = false,
  isLightBlueprint = false,
}: ComplexModelProps) {
  const [hoveredBlockId, setHoveredBlockId] = useState<string | null>(null);
  const { gl } = useThree();

  // Carrega as texturas de alta resolução (5120x1980) geradas diretamente do PDF oficial
  const [darkTex, lightTex] = useTexture([
    '/planta-clrc-dark.png',
    '/planta-clrc.png',
  ]);

  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy();
    [darkTex, lightTex].forEach((tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = maxAniso;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
    });
  }, [darkTex, lightTex, gl]);

  const activeTexture = isLightBlueprint ? lightTex : darkTex;

  return (
    <group>
      {/* 1. PRANCHA OFICIAL DO CENTRO LOGÍSTICO (ESCALA 1:1 FIEL AO PDF REV 05) */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <planeGeometry args={[WORLD_WIDTH, WORLD_DEPTH]} />
        <meshBasicMaterial
          map={activeTexture}
          toneMapped={false}
        />
      </mesh>

      {/* Moldura Arquitetônica Externa sob a Prancha */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]}>
        <planeGeometry args={[WORLD_WIDTH + 6, WORLD_DEPTH + 6]} />
        <meshStandardMaterial
          color={isLightBlueprint ? '#cbd5e1' : '#060a14'}
          roughness={0.9}
        />
      </mesh>

      {/* 2. EXTRUSÃO 3D POLIGONAL DE TODOS OS BLOCOS SOBRE SEUS CONTORNOS EXATOS NA PLANTA */}
      {COMPLEX_BLOCKS.map((block) => {
        if (filterStatus && block.status !== filterStatus) return null;

        const isSelected = selectedBlockId === block.id;
        const isHovered = hoveredBlockId === block.id;
        const isRackVisible =
          (isOpenRoof && (isSelected || block.id === 'bloco-e')) ||
          (isOpenRoof && !selectedBlockId && block.status === 'locado');

        return (
          <ExtrudedBlockMesh
            key={block.id}
            block={block}
            isSelected={isSelected}
            isHovered={isHovered}
            isRackVisible={isRackVisible}
            blueprintTexture={activeTexture}
            onSelectBlock={onSelectBlock}
            onHover={setHoveredBlockId}
            onSelectPallet={onSelectPallet}
            isHeatmap={isHeatmap}
          />
        );
      })}
    </group>
  );
}
