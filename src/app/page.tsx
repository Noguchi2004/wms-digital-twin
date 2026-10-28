'use client'; // Necessário no Next.js para usar o useState

import { useState } from 'react';
import Scene from './components/Scene'; // ou '@/components/Scene'

export default function Home() {
  // Estado que vai guardar os dados do bloco clicado
  const [selectedBlock, setSelectedBlock] = useState<any>(null);

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Camada 3D */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Scene 
          onSelectBlock={setSelectedBlock} 
          selectedBlock={selectedBlock} // <-- Adicionámos isto!
        />
      </div>

      {/* HUD Superior Esquerdo (Fixo) */}
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, padding: '24px', color: 'white', pointerEvents: 'none', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, letterSpacing: '-0.5px' }}>
          Warehouse Control Tower
        </h1>
        <p style={{ color: '#94a3b8', fontFamily: 'monospace', fontSize: '14px', marginTop: '4px' }}>
          Status: LIVE | Vercel Env
        </p>
      </div>

      {/* Painel Lateral Direito (Aparece apenas quando selectedBlock não é nulo) */}
      {selectedBlock && (
        <div style={{
          position: 'absolute', top: '24px', right: '24px', zIndex: 20,
          backgroundColor: '#1e293b', padding: '20px', borderRadius: '8px',
          color: 'white', fontFamily: 'sans-serif', width: '300px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
          border: '1px solid #334155'
        }}>
          {/* Cabeçalho do Painel */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>Detalhes da Posição</h2>
            <button 
              onClick={() => setSelectedBlock(null)}
              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '16px' }}
            >
              ✕
            </button>
          </div>
          
          {/* Dados do Ficheiro JSON */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Endereço (ID):</span>
              <span style={{ fontWeight: 'bold' }}>{selectedBlock.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Zona/Rua:</span>
              <span>{selectedBlock.zone}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Status WMS:</span>
              <span style={{ 
                color: selectedBlock.status === 'livre' ? '#22c55e' : '#f97316',
                textTransform: 'uppercase', fontWeight: 'bold'
              }}>
                {selectedBlock.status}
              </span>
            </div>
            
            {/* Informações extra simuladas caso esteja ocupado */}
            {selectedBlock.status === 'ocupado' && (
              <>
                <div style={{ borderTop: '1px solid #334155', margin: '8px 0' }}></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Lote / Cliente:</span>
                  <span>MNGT-Log</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Data Entrada:</span>
                  <span>27/10/2026</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}