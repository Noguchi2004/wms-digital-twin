'use client';

import { Canvas } from '@react-three/fiber';
import { CameraControls, Grid } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import wmsData from '../data/wms-mock.json';

function WarehouseMap({ onSelectBlock }: { onSelectBlock: any }) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);

  return (
    <>
      {wmsData.map((item) => (
        <mesh 
          key={item.id} 
          position={[item.position[0], item.position[1], item.position[2]]}
          onClick={(e) => {
            e.stopPropagation(); 
            onSelectBlock(item); 
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredBlock(item.id);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={(e) => {
            setHoveredBlock(null);
            document.body.style.cursor = 'auto';
          }}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial 
            color={hoveredBlock === item.id ? '#ffffff' : item.color} 
            wireframe={item.status === 'livre'}
            opacity={item.status === 'livre' ? 0.2 : 1}
            transparent={true}
          />
        </mesh>
      ))}
    </>
  );
}

function CameraRig({ selectedBlock }: { selectedBlock: any }) {
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (!controlsRef.current) return;

    if (selectedBlock) {
      const [x, y, z] = selectedBlock.position;
      controlsRef.current.setLookAt(
        x + 4, y + 3, z + 5, 
        x, y, z,             
        true                 
      );
    } else {
      controlsRef.current.setLookAt(
        10, 15, 25, 
        0, 0, 0,    
        true
      );
    }
  }, [selectedBlock]);

  return (
    <CameraControls 
      ref={controlsRef} 
      makeDefault 
      dollySpeed={2}     
      minDistance={2}    
      maxDistance={100}  
      mouseButtons={{
        left: 2,   // Arrastar mapa (Pan)
        right: 1,  // Rodar câmera (Rotate)
        wheel: 4,  // Zoom correto (Dolly)
        middle: 0  
      }} 
    />
  );
}

export default function Scene({ onSelectBlock, selectedBlock }: { onSelectBlock: any, selectedBlock: any }) {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      
      <WarehouseMap onSelectBlock={onSelectBlock} />
      <CameraRig selectedBlock={selectedBlock} />

      <Grid infiniteGrid fadeDistance={40} sectionColor="#475569" cellColor="#1e293b" />
    </Canvas>
  );
}