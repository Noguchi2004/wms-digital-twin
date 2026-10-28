'use client';
import { useState } from 'react';
import Scene from './components/Scene';

export default function Home() {
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  // NOVOS ESTADOS PARA OS BOTÕES
  const [viewMode, setViewMode] = useState<'3D' | '2D' | 'Frontal' | 'Aisle'>('3D');
  const [isHeatmap, setIsHeatmap] = useState(false);

  return (
    <main style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#0f172a' }}>
      
      {/* Camada 3D - Passamos os novos estados para o Scene */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Scene 
          onSelectBlock={setSelectedBlock} 
          selectedBlock={selectedBlock} 
          resetTrigger={resetTrigger}
          viewMode={viewMode}
          isHeatmap={isHeatmap}
        />
      </div>

      {/* Menu Superior Atualizado */}
      <div style={{ 
        position: 'absolute', top: '16px', left: '50%', transform: 'translateX(-50%)', 
        zIndex: 50, display: 'flex', gap: '8px', 
        backgroundColor: '#1e293b', padding: '8px', borderRadius: '12px',
        border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Botão 3D */}
        <button 
          onClick={() => { setViewMode('3D'); setResetTrigger(prev => prev + 1); setSelectedBlock(null); }} 
          style={{ padding: '8px 16px', backgroundColor: viewMode === '3D' ? '#3b82f6' : '#1e293b', color: viewMode === '3D' ? 'white' : '#cbd5e1', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          3D View
        </button>
        
        {/* Botão 2D */}
        <button 
          onClick={() => { setViewMode('2D'); setSelectedBlock(null); }} 
          style={{ padding: '8px 16px', backgroundColor: viewMode === '2D' ? '#3b82f6' : '#1e293b', color: viewMode === '2D' ? 'white' : '#cbd5e1', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          2D Map
        </button>

        {/* Botão Visão Frontal */}
        <button 
          onClick={() => { setViewMode('Frontal'); setSelectedBlock(null); }} 
          style={{ padding: '8px 16px', backgroundColor: viewMode === 'Frontal' ? '#3b82f6' : '#1e293b', color: viewMode === 'Frontal' ? 'white' : '#cbd5e1', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Frontal
        </button>
        
        {/* Botão Entre Corredores */}
        <button 
          onClick={() => { setViewMode('Aisle'); setSelectedBlock(null); }} 
          style={{ padding: '8px 16px', backgroundColor: viewMode === 'Aisle' ? '#3b82f6' : '#1e293b', color: viewMode === 'Aisle' ? 'white' : '#cbd5e1', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Entre Corredores
        </button>
        
        {/* Botão Heatmap */}
        <button 
          onClick={() => setIsHeatmap(!isHeatmap)} 
          style={{ padding: '8px 16px', backgroundColor: isHeatmap ? '#f97316' : '#1e293b', color: isHeatmap ? 'white' : '#cbd5e1', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
          Heatmap {isHeatmap ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Painel Lateral Direito (Mantido igual) */}
      {selectedBlock && (
        <div style={{
          position: 'absolute', top: '16px', right: '16px', width: '340px',
          backgroundColor: '#1e2532', padding: '20px 24px', borderRadius: '6px',
          border: '1px solid #2e3c51', color: 'white', zIndex: 50,
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)', fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#ffffff' }}>Detalhes da Posição</h2>
            <button onClick={() => setSelectedBlock(null)} style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px', padding: '0' }}>✕</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Endereço (ID):</span>
              <span style={{ fontWeight: '900', color: '#ffffff', letterSpacing: '0.5px' }}>{selectedBlock.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Zona/Rua:</span>
              <span style={{ color: '#ffffff' }}>Aisle A</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Status WMS:</span>
              <span style={{ fontWeight: '900', color: selectedBlock.status === 'livre' ? '#22c55e' : '#f97316' }}>{selectedBlock.status.toUpperCase()}</span>
            </div>
            <div style={{ borderBottom: '1px solid #2e3c51', margin: '4px 0' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Lote / Cliente:</span>
              <span style={{ fontWeight: '600', color: '#ffffff' }}>{selectedBlock.status === 'ocupado' ? 'MNGT-Log' : '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Data Entrada:</span>
              <span style={{ fontWeight: '600', color: '#ffffff' }}>{selectedBlock.status === 'ocupado' ? '27/10/2026' : '-'}</span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}