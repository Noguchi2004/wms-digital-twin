'use client';
import { useState, useEffect } from 'react';
import Scene from './components/Scene';
import {
  COMPLEX_BLOCKS,
  COMPLEX_METRICS,
  ComplexBlock,
  STATUS_COLORS,
  BlockStatus,
} from './data/complex-data';

export default function Home() {
  const [selectedBlock, setSelectedBlock] = useState<ComplexBlock | null>(null);
  const [selectedPallet, setSelectedPallet] = useState<any>(null);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Modos de Visão da Câmera
  const [viewMode, setViewMode] = useState<'Campus' | '2D' | 'Rodovia' | 'Patio' | 'Interno'>('Campus');
  const [isOpenRoof, setIsOpenRoof] = useState(false);
  const [isHeatmap, setIsHeatmap] = useState(false);
  const [isLightBlueprint, setIsLightBlueprint] = useState(false);
  const [filterStatus, setFilterStatus] = useState<BlockStatus | null>(null);

  // Responsividade Mobile
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectBlock = (block: ComplexBlock | null) => {
    setSelectedBlock(block);
    setSelectedPallet(null);
  };

  return (
    <main
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isLightBlueprint ? '#e2e8f0' : '#060a14',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. CAMADA 3D (CANVAS THREE.JS COM PERFORMANCE OTIMIZADA PARA MOBILE) */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Scene
          selectedBlock={selectedBlock}
          onSelectBlock={handleSelectBlock}
          selectedPallet={selectedPallet}
          onSelectPallet={setSelectedPallet}
          resetTrigger={resetTrigger}
          viewMode={viewMode}
          isOpenRoof={isOpenRoof}
          filterStatus={filterStatus}
          isHeatmap={isHeatmap}
          isLightBlueprint={isLightBlueprint}
        />
      </div>

      {/* 2. BARRA SUPERIOR INTEGRADA E RESPONSIVA (HEADER + CONTROLES) */}
      <div
        style={{
          position: 'absolute',
          top: isMobile ? '10px' : '16px',
          left: isMobile ? '10px' : '16px',
          right: isMobile ? '10px' : 'auto',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          maxWidth: isMobile ? 'none' : 'calc(100vw - 420px)',
        }}
      >
        {/* LINHA 1: IDENTIFICAÇÃO + BOTÕES DE AÇÃO RÁPIDA */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            background: 'rgba(15, 23, 42, 0.88)',
            padding: isMobile ? '8px 12px' : '10px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.65)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px #22c55e',
                flexShrink: 0,
              }}
            />
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: isMobile ? '13px' : '15px',
                  fontWeight: 800,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                C.L.R.C • Grupo MNGT
              </h1>
              {!isMobile && (
                <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
                  Centro Logístico Industrial Rio Claro (SP)
                </p>
              )}
            </div>
          </div>

          {/* BOTÕES DE UTILIDADES (COMPACTOS NO MOBILE) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Raio-X */}
            <button
              onClick={() => setIsOpenRoof(!isOpenRoof)}
              title="Abrir/Fechar Telhados (Raio-X)"
              style={{
                padding: isMobile ? '6px 10px' : '6px 12px',
                background: isOpenRoof ? '#8b5cf6' : 'rgba(30, 41, 59, 0.8)',
                color: isOpenRoof ? '#ffffff' : '#cbd5e1',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                cursor: 'pointer',
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: 700,
              }}
            >
              🏢 {isMobile ? (isOpenRoof ? 'Teto ON' : 'Teto') : `Raio-X ${isOpenRoof ? 'ON' : 'OFF'}`}
            </button>

            {/* Heatmap */}
            <button
              onClick={() => setIsHeatmap(!isHeatmap)}
              title="Mapa de Calor (Ocupação)"
              style={{
                padding: isMobile ? '6px 10px' : '6px 12px',
                background: isHeatmap ? '#f97316' : 'rgba(30, 41, 59, 0.8)',
                color: isHeatmap ? '#ffffff' : '#cbd5e1',
                borderRadius: '8px',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                cursor: 'pointer',
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: 700,
              }}
            >
              🔥 {isMobile ? (isHeatmap ? 'Heat ON' : 'Heat') : `Heatmap ${isHeatmap ? 'ON' : 'OFF'}`}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={() => setIsLightBlueprint(!isLightBlueprint)}
              title="Alternar Tema da Prancha (Escuro / Claro)"
              style={{
                padding: isMobile ? '6px 8px' : '6px 10px',
                background: isLightBlueprint ? '#0284c7' : 'rgba(30, 41, 59, 0.8)',
                color: isLightBlueprint ? '#ffffff' : '#cbd5e1',
                borderRadius: '8px',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                cursor: 'pointer',
                fontSize: isMobile ? '11px' : '12px',
                fontWeight: 700,
              }}
            >
              {isLightBlueprint ? '☀️' : '🌙'}
            </button>

            {/* No Mobile: Botão para abrir filtros */}
            {isMobile && (
              <button
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                style={{
                  padding: '6px 9px',
                  background: isMobileFilterOpen ? '#3b82f6' : 'rgba(30, 41, 59, 0.8)',
                  color: isMobileFilterOpen ? '#ffffff' : '#cbd5e1',
                  borderRadius: '8px',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                🏷️
              </button>
            )}
          </div>
        </div>

        {/* LINHA 2: CARROSSEL DE CÂMARAS (HORIZONTAL COM TOUCH FLUIDO) */}
        <div
          className="no-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(15, 23, 42, 0.88)',
            padding: '6px',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.65)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.5)',
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {/* Campus 3D */}
          <button
            onClick={() => {
              setViewMode('Campus');
              setSelectedBlock(null);
              setSelectedPallet(null);
              setResetTrigger((prev) => prev + 1);
            }}
            style={{
              padding: isMobile ? '6px 12px' : '8px 14px',
              background: viewMode === 'Campus' ? '#3b82f6' : 'transparent',
              color: viewMode === 'Campus' ? '#ffffff' : '#cbd5e1',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            🌐 Campus 3D
          </button>

          {/* Planta 2D */}
          <button
            onClick={() => {
              setViewMode('2D');
              setSelectedBlock(null);
              setSelectedPallet(null);
            }}
            style={{
              padding: isMobile ? '6px 12px' : '8px 14px',
              background: viewMode === '2D' ? '#3b82f6' : 'transparent',
              color: viewMode === '2D' ? '#ffffff' : '#cbd5e1',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            📐 Planta 2D
          </button>

          {/* Rodovia */}
          <button
            onClick={() => {
              setViewMode('Rodovia');
              setSelectedBlock(null);
              setSelectedPallet(null);
            }}
            style={{
              padding: isMobile ? '6px 12px' : '8px 14px',
              background: viewMode === 'Rodovia' ? '#3b82f6' : 'transparent',
              color: viewMode === 'Rodovia' ? '#ffffff' : '#cbd5e1',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            🛣️ Rodovia
          </button>

          {/* Pátio */}
          <button
            onClick={() => {
              setViewMode('Patio');
              setSelectedBlock(null);
              setSelectedPallet(null);
            }}
            style={{
              padding: isMobile ? '6px 12px' : '8px 14px',
              background: viewMode === 'Patio' ? '#3b82f6' : 'transparent',
              color: viewMode === 'Patio' ? '#ffffff' : '#cbd5e1',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            🚛 Pátio
          </button>

          {/* WMS Interno */}
          <button
            onClick={() => {
              setViewMode('Interno');
              setIsOpenRoof(true);
              const blocoE = COMPLEX_BLOCKS.find((b) => b.id === 'bloco-e');
              if (blocoE) setSelectedBlock(blocoE);
              setSelectedPallet(null);
              setResetTrigger((prev) => prev + 1);
            }}
            style={{
              padding: isMobile ? '6px 12px' : '8px 14px',
              background: viewMode === 'Interno' ? '#3b82f6' : 'transparent',
              color: viewMode === 'Interno' ? '#ffffff' : '#cbd5e1',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            📦 WMS Interno
          </button>
        </div>
      </div>

      {/* 3. FILTROS DA PLANTA OFICIAL (DESKTOP: CANTO INFERIOR ESQUERDO / MOBILE: MODAL COLAPSÁVEL) */}
      {(!isMobile || isMobileFilterOpen) && (
        <div
          style={{
            position: 'absolute',
            bottom: isMobile ? '16px' : '20px',
            left: isMobile ? '10px' : '20px',
            right: isMobile ? '10px' : 'auto',
            zIndex: 45,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.94)',
            padding: isMobile ? '10px 14px' : '12px 16px',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.7)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.6)',
            maxWidth: isMobile ? 'none' : '320px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              Filtrar Galpões por Status
            </span>
            {isMobile && (
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '14px', cursor: 'pointer' }}
              >
                ✕
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {/* Todos */}
            <button
              onClick={() => {
                setFilterStatus(null);
                if (isMobile) setIsMobileFilterOpen(false);
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                background: filterStatus === null ? '#3b82f6' : '#1e293b',
                color: filterStatus === null ? '#ffffff' : '#94a3b8',
              }}
            >
              Todos ({COMPLEX_BLOCKS.length})
            </button>

            {/* Locado */}
            <button
              onClick={() => {
                setFilterStatus(filterStatus === 'locado' ? null : 'locado');
                if (isMobile) setIsMobileFilterOpen(false);
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '6px',
                border: `1px solid ${STATUS_COLORS.locado.border}`,
                cursor: 'pointer',
                background: filterStatus === 'locado' ? STATUS_COLORS.locado.hex : '#1e293b',
                color: filterStatus === 'locado' ? '#ffffff' : STATUS_COLORS.locado.text,
              }}
            >
              ● Locado
            </button>

            {/* Disponível */}
            <button
              onClick={() => {
                setFilterStatus(filterStatus === 'disponivel' ? null : 'disponivel');
                if (isMobile) setIsMobileFilterOpen(false);
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '6px',
                border: `1px solid ${STATUS_COLORS.disponivel.border}`,
                cursor: 'pointer',
                background: filterStatus === 'disponivel' ? STATUS_COLORS.disponivel.hex : '#1e293b',
                color: filterStatus === 'disponivel' ? '#ffffff' : STATUS_COLORS.disponivel.text,
              }}
            >
              ● Disponível
            </button>

            {/* Expansão */}
            <button
              onClick={() => {
                setFilterStatus(filterStatus === 'expansao' ? null : 'expansao');
                if (isMobile) setIsMobileFilterOpen(false);
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '6px',
                border: `1px solid ${STATUS_COLORS.expansao.border}`,
                cursor: 'pointer',
                background: filterStatus === 'expansao' ? STATUS_COLORS.expansao.hex : '#1e293b',
                color: filterStatus === 'expansao' ? '#ffffff' : STATUS_COLORS.expansao.text,
              }}
            >
              ● Expansão
            </button>

            {/* Mamprin */}
            <button
              onClick={() => {
                setFilterStatus(filterStatus === 'mamprin' ? null : 'mamprin');
                if (isMobile) setIsMobileFilterOpen(false);
              }}
              style={{
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '6px',
                border: `1px solid ${STATUS_COLORS.mamprin.border}`,
                cursor: 'pointer',
                background: filterStatus === 'mamprin' ? STATUS_COLORS.mamprin.hex : '#1e293b',
                color: filterStatus === 'mamprin' ? '#ffffff' : STATUS_COLORS.mamprin.text,
              }}
            >
              ● BTS
            </button>
          </div>
        </div>
      )}

      {/* 4. PAINEL DE DETALHES DO GALPÃO (DESKTOP: LATERAL / MOBILE: BOTTOM SHEET MODAL COM SCROLL) */}
      {selectedBlock && !selectedPallet && (
        <aside
          className={isMobile ? 'animate-slide-up' : ''}
          style={{
            position: 'absolute',
            top: isMobile ? 'auto' : '16px',
            bottom: isMobile ? '0' : 'auto',
            left: isMobile ? '0' : 'auto',
            right: isMobile ? '0' : '16px',
            width: isMobile ? '100%' : '360px',
            maxHeight: isMobile ? '55dvh' : 'calc(100dvh - 32px)',
            overflowY: 'auto',
            background: 'rgba(15, 23, 42, 0.96)',
            padding: isMobile ? '14px 20px 24px' : '24px',
            borderRadius: isMobile ? '24px 24px 0 0' : '16px',
            border: `1px solid ${STATUS_COLORS[selectedBlock.status].border}`,
            borderBottom: isMobile ? 'none' : undefined,
            color: 'white',
            zIndex: 60,
            boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Drag Handle para Mobile */}
          {isMobile && (
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                background: '#64748b',
                margin: '0 auto 12px auto',
              }}
            />
          )}

          {/* Cabeçalho do Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <div>
              <span
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 800,
                  background: STATUS_COLORS[selectedBlock.status].bg,
                  color: STATUS_COLORS[selectedBlock.status].text,
                  border: `1px solid ${STATUS_COLORS[selectedBlock.status].border}`,
                  marginBottom: '6px',
                }}
              >
                {selectedBlock.statusLabel}
              </span>
              <h2 style={{ margin: 0, fontSize: isMobile ? '20px' : '22px', fontWeight: 800 }}>{selectedBlock.name}</h2>
            </div>
            <button
              onClick={() => setSelectedBlock(null)}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: 'none',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4', margin: '0 0 14px 0' }}>
            {selectedBlock.description}
          </p>

          {/* Métricas do Galpão */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8' }}>Área Construída:</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                {selectedBlock.totalAreaM2.toLocaleString('pt-BR')} m²
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8' }}>Bateria de Docas:</span>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>{selectedBlock.docksCount} docas niveladoras</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8' }}>Pé-direito Livre:</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{selectedBlock.clearHeightM} metros</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8' }}>Capacidade do Piso:</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{selectedBlock.details.pisoCapacidade}</span>
            </div>

            {selectedBlock.details.inquilino && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '6px', borderBottom: '1px solid #1e293b' }}>
                <span style={{ color: '#94a3b8' }}>Inquilino / Operação:</span>
                <span style={{ fontWeight: 700, color: '#22c55e' }}>{selectedBlock.details.inquilino}</span>
              </div>
            )}

            {/* Lista dos Módulos */}
            <div style={{ marginTop: '4px' }}>
              <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Módulos Integrados ({selectedBlock.modules.length})
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
                {selectedBlock.modules.map((mod) => (
                  <span
                    key={mod}
                    style={{
                      background: '#1e293b',
                      padding: '3px 7px',
                      borderRadius: '5px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#cbd5e1',
                    }}
                  >
                    {mod}
                  </span>
                ))}
              </div>
            </div>

            {/* Botão de Estoque Interno 3D */}
            <button
              onClick={() => {
                setIsOpenRoof(true);
                setViewMode('Interno');
                setResetTrigger((prev) => prev + 1);
              }}
              style={{
                marginTop: '12px',
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                border: 'none',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
              }}
            >
              📦 Abrir Gêmeo Digital Interno (WMS 3D)
            </button>
          </div>
        </aside>
      )}

      {/* 5. PAINEL DE INSPEÇÃO DO PALETE INDIVIDUAL (RESPONSIVO BOTTOM SHEET) */}
      {selectedPallet && (
        <aside
          className={isMobile ? 'animate-slide-up' : ''}
          style={{
            position: 'absolute',
            top: isMobile ? 'auto' : '16px',
            bottom: isMobile ? '0' : 'auto',
            left: isMobile ? '0' : 'auto',
            right: isMobile ? '0' : '16px',
            width: isMobile ? '100%' : '340px',
            maxHeight: isMobile ? '50dvh' : 'auto',
            overflowY: 'auto',
            background: 'rgba(15, 23, 42, 0.96)',
            padding: isMobile ? '14px 20px 24px' : '24px',
            borderRadius: isMobile ? '24px 24px 0 0' : '16px',
            border: '1px solid #38bdf8',
            borderBottom: isMobile ? 'none' : undefined,
            color: 'white',
            zIndex: 60,
            boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {isMobile && (
            <div
              style={{
                width: '40px',
                height: '4px',
                borderRadius: '2px',
                background: '#64748b',
                margin: '0 auto 12px auto',
              }}
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Posição de Palete</h2>
            <button
              onClick={() => setSelectedPallet(null)}
              style={{
                background: 'rgba(30, 41, 59, 0.7)',
                border: 'none',
                color: '#cbd5e1',
                cursor: 'pointer',
                fontSize: '16px',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Endereço WMS:</span>
              <span style={{ fontWeight: 900, color: '#38bdf8' }}>{selectedPallet.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Rua / Lado:</span>
              <span style={{ fontWeight: 600 }}>{selectedPallet.aisle}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Coluna / Nível:</span>
              <span style={{ fontWeight: 600 }}>Prédio {selectedPallet.bay} • Nível {selectedPallet.level}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Status:</span>
              <span
                style={{
                  fontWeight: 900,
                  color: selectedPallet.status === 'livre' ? '#22c55e' : '#f97316',
                }}
              >
                {selectedPallet.status.toUpperCase()}
              </span>
            </div>
            {selectedPallet.cliente && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Cliente:</span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>{selectedPallet.cliente}</span>
              </div>
            )}
            {selectedPallet.lote && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Lote / NF:</span>
                <span style={{ fontWeight: 600, color: '#ffffff' }}>{selectedPallet.lote}</span>
              </div>
            )}
            {selectedPallet.dataEntrada && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Data Entrada:</span>
                <span style={{ fontWeight: 600, color: '#cbd5e1' }}>{selectedPallet.dataEntrada}</span>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* 6. RESUMO EXECUTIVO DO COMPLEXO (DESKTOP: CANTO INFERIOR DIREITO) */}
      {!isMobile && !selectedBlock && !selectedPallet && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 40,
            background: 'rgba(15, 23, 42, 0.88)',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.65)',
            backdropFilter: 'blur(12px)',
            color: 'white',
            display: 'flex',
            gap: '20px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Área do Terreno
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#38bdf8' }}>
              {(COMPLEX_METRICS.areaTotalTerrenoM2 / 1000).toFixed(0)}k m²
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Área Construída
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#22c55e' }}>
              {(COMPLEX_METRICS.areaConstruidaM2 / 1000).toFixed(0)}k m²
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Docas Totais
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#facc15' }}>
              {COMPLEX_METRICS.totalDocas}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              Ocupação
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fb7185' }}>
              {COMPLEX_METRICS.taxaOcupacaoAtual}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
