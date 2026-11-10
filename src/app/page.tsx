'use client';
import { useState } from 'react';
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

  // Função para voar diretamente para um bloco
  const handleSelectBlock = (block: ComplexBlock | null) => {
    setSelectedBlock(block);
    setSelectedPallet(null);
  };

  return (
    <main
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0a0f1d',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      {/* 1. CAMADA 3D (CANVAS THREE.JS) */}
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

      {/* 2. BARRA DE CABEÇALHO CORPORATIVO (GRUPO MNGT / C.L.R.C) */}
      <header
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '10px 18px',
          borderRadius: '12px',
          border: '1px solid rgba(51, 65, 85, 0.6)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 10px #22c55e',
          }}
        />
        <div>
          <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px' }}>
            C.L.R.C • Grupo MNGT
          </h1>
          <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
            Centro Logístico Industrial Rio Claro (SP)
          </p>
        </div>
      </header>

      {/* 3. MENU SUPERIOR DE NAVEGAÇÃO DE CÂMARAS */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '6px 8px',
          borderRadius: '12px',
          border: '1px solid rgba(51, 65, 85, 0.6)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          maxWidth: '92vw',
          overflowX: 'auto',
        }}
      >
        {/* Campus Panorâmico */}
        <button
          onClick={() => {
            setViewMode('Campus');
            setSelectedBlock(null);
            setSelectedPallet(null);
            setResetTrigger((prev) => prev + 1);
          }}
          style={{
            padding: '8px 14px',
            background: viewMode === 'Campus' ? '#3b82f6' : 'transparent',
            color: viewMode === 'Campus' ? '#ffffff' : '#94a3b8',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
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
            padding: '8px 14px',
            background: viewMode === '2D' ? '#3b82f6' : 'transparent',
            color: viewMode === '2D' ? '#ffffff' : '#94a3b8',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          📐 Planta 2D
        </button>

        {/* Rodovia Acesso */}
        <button
          onClick={() => {
            setViewMode('Rodovia');
            setSelectedBlock(null);
            setSelectedPallet(null);
          }}
          style={{
            padding: '8px 14px',
            background: viewMode === 'Rodovia' ? '#3b82f6' : 'transparent',
            color: viewMode === 'Rodovia' ? '#ffffff' : '#94a3b8',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          🛣️ Rodovia
        </button>

        {/* Pátio Carretas */}
        <button
          onClick={() => {
            setViewMode('Patio');
            setSelectedBlock(null);
            setSelectedPallet(null);
          }}
          style={{
            padding: '8px 14px',
            background: viewMode === 'Patio' ? '#3b82f6' : 'transparent',
            color: viewMode === 'Patio' ? '#ffffff' : '#94a3b8',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          🚛 Pátio
        </button>

        {/* Interno WMS */}
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
            padding: '8px 14px',
            background: viewMode === 'Interno' ? '#3b82f6' : 'transparent',
            color: viewMode === 'Interno' ? '#ffffff' : '#94a3b8',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          📦 WMS Interno
        </button>

        <div style={{ width: '1px', height: '22px', background: '#334155', margin: '0 4px' }} />

        {/* Botão Raio-X / Teto Aberto */}
        <button
          onClick={() => setIsOpenRoof(!isOpenRoof)}
          style={{
            padding: '8px 12px',
            background: isOpenRoof ? '#8b5cf6' : 'transparent',
            color: isOpenRoof ? '#ffffff' : '#94a3b8',
            borderRadius: '8px',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          🏢 Raio-X {isOpenRoof ? 'ON' : 'OFF'}
        </button>

        {/* Botão Heatmap */}
        <button
          onClick={() => setIsHeatmap(!isHeatmap)}
          style={{
            padding: '8px 12px',
            background: isHeatmap ? '#f97316' : 'transparent',
            color: isHeatmap ? '#ffffff' : '#94a3b8',
            borderRadius: '8px',
            border: '1px solid rgba(249, 115, 22, 0.4)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          🔥 Heatmap {isHeatmap ? 'ON' : 'OFF'}
        </button>

        {/* Botão Alternar Fundo da Planta Oficial */}
        <button
          onClick={() => setIsLightBlueprint(!isLightBlueprint)}
          style={{
            padding: '8px 12px',
            background: isLightBlueprint ? '#0284c7' : 'transparent',
            color: isLightBlueprint ? '#ffffff' : '#94a3b8',
            borderRadius: '8px',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
          }}
        >
          🗺️ {isLightBlueprint ? 'Prancha Original' : 'Modo Dark'}
        </button>
      </div>

      {/* 4. FILTROS DA PLANTA OFICIAL (STATUS DE DISPONIBILIDADE) */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          background: 'rgba(15, 23, 42, 0.9)',
          padding: '12px 16px',
          borderRadius: '12px',
          border: '1px solid rgba(51, 65, 85, 0.6)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          maxWidth: '320px',
        }}
      >
        <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
          Legenda da Planta (Filtrar Galpões)
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {/* Todos */}
          <button
            onClick={() => setFilterStatus(null)}
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
            onClick={() => setFilterStatus(filterStatus === 'locado' ? null : 'locado')}
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
            onClick={() => setFilterStatus(filterStatus === 'disponivel' ? null : 'disponivel')}
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
            onClick={() => setFilterStatus(filterStatus === 'expansao' ? null : 'expansao')}
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
            onClick={() => setFilterStatus(filterStatus === 'mamprin' ? null : 'mamprin')}
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
            ● Built to Suit
          </button>
        </div>
      </div>

      {/* 5. PAINEL LATERAL DE DETALHES (DRILL-DOWN POR GALPÃO OU PALETE) */}
      {selectedBlock && !selectedPallet && (
        <aside
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '360px',
            maxHeight: 'calc(100vh - 32px)',
            overflowY: 'auto',
            background: 'rgba(15, 23, 42, 0.92)',
            padding: '24px',
            borderRadius: '16px',
            border: `1px solid ${STATUS_COLORS[selectedBlock.status].border}`,
            color: 'white',
            zIndex: 50,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Header do Card */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
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
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>{selectedBlock.name}</h2>
            </div>
            <button
              onClick={() => setSelectedBlock(null)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#64748b',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              ✕
            </button>
          </div>

          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', margin: '0 0 18px 0' }}>
            {selectedBlock.description}
          </p>

          {/* Dados e Métricas da Planta */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8' }}>Área Construída:</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>
                {selectedBlock.totalAreaM2.toLocaleString('pt-BR')} m²
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8' }}>Bateria de Docas:</span>
              <span style={{ fontWeight: 700, color: '#38bdf8' }}>{selectedBlock.docksCount} docas niveladoras</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8' }}>Pé-direito Livre:</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{selectedBlock.clearHeightM} metros</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #1e293b' }}>
              <span style={{ color: '#94a3b8' }}>Capacidade do Piso:</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{selectedBlock.details.pisoCapacidade}</span>
            </div>

            {selectedBlock.details.inquilino && (
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #1e293b' }}>
                <span style={{ color: '#94a3b8' }}>Ocupante / Inquilino:</span>
                <span style={{ fontWeight: 700, color: '#22c55e' }}>{selectedBlock.details.inquilino}</span>
              </div>
            )}

            {/* Lista de Módulos */}
            <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
                Módulos Integrados ({selectedBlock.modules.length})
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                {selectedBlock.modules.map((mod) => (
                  <span
                    key={mod}
                    style={{
                      background: '#1e293b',
                      padding: '4px 8px',
                      borderRadius: '6px',
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

            {/* Ação para ver estoque interno em qualquer galpão selecionado */}
            <button
              onClick={() => {
                setIsOpenRoof(true);
                setViewMode('Interno');
                setResetTrigger((prev) => prev + 1);
              }}
              style={{
                marginTop: '16px',
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

      {/* 6. PAINEL DE INSPEÇÃO DE PALETE INDIVIDUAL (QUANDO NAVEGANDO NO WMS) */}
      {selectedPallet && (
        <aside
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '340px',
            background: 'rgba(15, 23, 42, 0.92)',
            padding: '24px',
            borderRadius: '16px',
            border: '1px solid #38bdf8',
            color: 'white',
            zIndex: 50,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(16px)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Posição de Palete</h2>
            <button
              onClick={() => setSelectedPallet(null)}
              style={{ background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '18px' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
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
              <span style={{ fontWeight: 600 }}>Prédio {selectedPallet.bay} • Andar {selectedPallet.level}</span>
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
          </div>
        </aside>
      )}

      {/* 7. RESUMO EXECUTIVO DO COMPLEXO (QUANDO NADA ESTÁ SELECIONADO) */}
      {!selectedBlock && !selectedPallet && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            zIndex: 40,
            background: 'rgba(15, 23, 42, 0.85)',
            padding: '14px 18px',
            borderRadius: '12px',
            border: '1px solid rgba(51, 65, 85, 0.6)',
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
