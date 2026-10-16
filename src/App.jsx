import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  DoorOpen, 
  AppWindow, 
  Flame, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle2,
  Navigation,
  Save,
  Download,
  Plus,
  Trash2,
  Eye,
  Edit3,
  ShieldAlert,
  PhoneCall,
  Clock,
  Printer,
  Compass,
  ArrowRight,
  School,
  Building2,
  Trees,
  Check,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  HelpCircle,
  Crosshair,
  Footprints,
  Car,
  Church,
  Activity,
  Maximize2
} from 'lucide-react';

// Coordenadas geográficas reais em Bateias, Campo Largo - PR
// Colégio Estadual Otalípio Pereira de Andrade: Estrada do Cerne (PR-090), Km 29
const COORD_ESCOLA = [-25.3282, -49.5164];
const COORD_QUADRA_ESCOLA = [-25.3285, -49.5160];
const COORD_IGREJA_MATRIZ = [-25.3345, -49.5195];
const COORD_UBS_BATEIAS = [-25.3340, -49.5188];
const COORD_PONTO_ALTO_SILVESTRE = [-25.3150, -49.5380];
const COORD_VILA_GLORIA = [-25.3410, -49.4980];
const COORD_BOMBEIROS_CAMPO_LARGO = [-25.4450, -49.5310];

// Definição das Ruas e Traçados das Rotas de Fuga em Bateias
const RUAS_ROTAS_FUGA = [
  {
    id: 'rota_escola_centro',
    nome: 'Rota 1: Saída da Escola para o Centro de Bateias (A Pé)',
    tipo: 'Pedestre / Evacuação Imediata',
    cor: '#10b981', // Verde esmeralda
    distancia: '850 metros',
    tempo: '9 min de caminhada segura',
    descricaoRuas: 'Portão do Colégio Otalípio (PR-090 Km 29) ➔ Calçada da Estrada do Cerne ➔ Rua São Sebastião ➔ Pátio da Igreja Matriz & UBS Bateias',
    pontos: [
      COORD_ESCOLA,
      [-25.3295, -49.5158],
      [-25.3315, -49.5148], // Esquina PR-090 com Rua São Sebastião
      [-25.3325, -49.5170], // Rua São Sebastião
      [-25.3338, -49.5185],
      COORD_IGREJA_MATRIZ  // Ponto de Encontro Comunitário
    ],
    recomendações: 'Permanecer em fila única pelo lado da calçada com guia. Não atravessar a PR-090 sem sinalizador.',
    status: 'Rota Prioritária da Turma'
  },
  {
    id: 'rota_sao_silvestre',
    nome: 'Rota 2: Estrada de São Silvestre (Refúgio em Área Elevada)',
    tipo: 'Área Alta / Enchentes e Alagamentos',
    cor: '#f59e0b', // Âmbar
    distancia: '3,8 km',
    tempo: '35 min a pé / 8 min em van escolar',
    descricaoRuas: 'Centro de Bateias ➔ Rua Emílio Zanin ➔ Estrada Rural de São Silvestre ➔ Bateias de Cima (Cumeada)',
    pontos: [
      COORD_IGREJA_MATRIZ,
      [-25.3325, -49.5170],
      [-25.3300, -49.5190],
      [-25.3280, -49.5240], // Subida da serra
      [-25.3220, -49.5310],
      COORD_PONTO_ALTO_SILVESTRE
    ],
    recomendações: 'Usar em caso de alagamento das pontes e cursos d’água baixos de Bateias.',
    status: 'Rota de Segurança Geológica'
  },
  {
    id: 'rota_pr090_sul',
    nome: 'Rota 3: Estrada do Cerne (PR-090 Sul) ➔ Campo Largo & Hospitais',
    tipo: 'Veicular / Resgate Médico',
    cor: '#ef4444', // Vermelho
    distancia: '22 km até o Centro de Campo Largo',
    tempo: '25 min para ambulâncias SAMU / Bombeiros',
    descricaoRuas: 'Estrada do Cerne (PR-090 Sul) ➔ Passagem por Itaboa ➔ Acesso ao Hospital do Rocio e 10º Grupamento de Bombeiros',
    pontos: [
      COORD_ESCOLA,
      [-25.3315, -49.5148],
      [-25.3370, -49.5125],
      [-25.3450, -49.5090],
      [-25.3650, -49.5050],
      [-25.3950, -49.5120],
      [-25.4300, -49.5250]
    ],
    recomendações: 'Corredor exclusivo para viaturas de resgate (Bombeiros 193 e ambulâncias 192).',
    status: 'Corredor Hospitalar'
  },
  {
    id: 'rota_vila_gloria',
    nome: 'Rota 4: Estrada de Vila Glória / Setor de Minérios',
    tipo: 'Alternativa Industrial & Vicinal',
    cor: '#8b5cf6', // Roxo
    distancia: '2,9 km',
    tempo: '12 min de veículo / 30 min a pé',
    descricaoRuas: 'PR-090 Km 29 ➔ Estrada Municipal da Vila Glória ➔ Acesso ao Campo Comunitário',
    pontos: [
      [-25.3315, -49.5148],
      [-25.3350, -49.5110],
      [-25.3380, -49.5050],
      COORD_VILA_GLORIA
    ],
    recomendações: 'Atenção aos caminhões pesados de transporte de calcário e pedreiras.',
    status: 'Alternativa Leste'
  },
  {
    id: 'rota_pr090_norte',
    nome: 'Rota 5: Estrada do Cerne (PR-090 Norte) ➔ Três Córregos',
    tipo: 'Regional / Interior do Paraná',
    cor: '#06b6d4', // Ciano
    distancia: '18 km rumo ao Norte',
    tempo: '22 min de deslocamento veicular',
    descricaoRuas: 'Colégio Otalípio (Km 29) ➔ Sentido Norte pela PR-090 ➔ Distrito de Três Córregos',
    pontos: [
      COORD_ESCOLA,
      [-25.3260, -49.5175],
      [-25.3230, -49.5190],
      [-25.3190, -49.5210],
      [-25.3100, -49.5250]
    ],
    recomendações: 'Trecho sinuoso com frequente neblina na serra nas primeiras horas da manhã.',
    status: 'Regional Norte'
  }
];

// Pontos de Referência nas Ruas de Bateias
const PONTOS_REFERENCIA_RUAS = [
  {
    nome: 'Colégio Estadual Otalípio Pereira de Andrade',
    tipo: 'escola',
    coord: COORD_ESCOLA,
    detalhes: 'Ponto de Partida Escolar • Estrada do Cerne (PR-090), Km 29, Bateias',
    icone: '🏫',
    cor: 'bg-red-600'
  },
  {
    nome: 'Ponto de Encontro Escolar: Quadra Poliesportiva Aberta',
    tipo: 'encontro_escola',
    coord: COORD_QUADRA_ESCOLA,
    detalhes: 'Área aberta no pátio dos fundos do Colégio Otalípio, longe de telhados e fiações',
    icone: '🚩',
    cor: 'bg-emerald-600'
  },
  {
    nome: 'Ponto de Encontro Comunitário: Igreja Matriz São Sebastião',
    tipo: 'igreja',
    coord: COORD_IGREJA_MATRIZ,
    detalhes: 'Pátio amplo pavimentado e salão comunitário central de Bateias',
    icone: '⛪',
    cor: 'bg-blue-600'
  },
  {
    nome: 'Unidade Básica de Saúde (UBS) de Bateias',
    tipo: 'saude',
    coord: COORD_UBS_BATEIAS,
    detalhes: 'Ponto de Primeiros Socorros e Triagem Médica Local',
    icone: '🏥',
    cor: 'bg-rose-500'
  },
  {
    nome: 'Ponto de Refúgio Elevado (São Silvestre / Bateias de Cima)',
    tipo: 'altitude',
    coord: COORD_PONTO_ALTO_SILVESTRE,
    detalhes: 'Cota de 980m de altitude • Seguro contra enchentes de ribeirões',
    icone: '⛰️',
    cor: 'bg-amber-600'
  },
  {
    nome: 'Ponto de Atenção: Curva e Travessia de Pedestres na PR-090',
    tipo: 'alerta',
    coord: [-25.3300, -49.5155],
    detalhes: 'Tráfego rápido na rodovia • Atravessar somente com apoio de monitores',
    icone: '⚠️',
    cor: 'bg-orange-500'
  }
];

// Elementos de Emergência na Planta
const ELEMENTOS_EMERGENCIA = {
  porta: { 
    icon: DoorOpen, 
    cor: 'bg-emerald-500 text-white border-emerald-600', 
    badge: 'bg-emerald-100 text-emerald-800', 
    label: 'Porta de Saída',
    dica: 'Deve permanecer destrancada e abrir para fora durante as aulas.' 
  },
  janela: { 
    icon: AppWindow, 
    cor: 'bg-cyan-500 text-white border-cyan-600', 
    badge: 'bg-cyan-100 text-cyan-800', 
    label: 'Janela de Emergência',
    dica: 'Janelas baixas ou amplas que podem servir de saída alternativa de ventilação.' 
  },
  extintor: { 
    icon: Flame, 
    cor: 'bg-rose-600 text-white border-rose-700', 
    badge: 'bg-rose-100 text-rose-800', 
    label: 'Extintor de Incêndio',
    dica: 'Verificar se o manômetro está no verde e sem obstáculos à frente.' 
  },
  luminaria: { 
    icon: Lightbulb, 
    cor: 'bg-amber-500 text-white border-amber-600', 
    badge: 'bg-amber-100 text-amber-800', 
    label: 'Luz de Emergência',
    dica: 'Ilumina o trajeto caso falte energia na escola.' 
  },
  placa: { 
    icon: Navigation, 
    cor: 'bg-emerald-600 text-white border-emerald-700', 
    badge: 'bg-emerald-100 text-emerald-800', 
    label: 'Placa Fotoluminescente',
    dica: 'Placas que brilham no escuro indicando a direção da saída.' 
  },
  pontoEncontro: { 
    icon: MapPin, 
    cor: 'bg-blue-600 text-white border-blue-700', 
    badge: 'bg-blue-100 text-blue-800', 
    label: 'Ponto de Encontro',
    dica: 'Local seguro ao ar livre onde todos devem se reunir para a chamada.' 
  },
  risco: { 
    icon: AlertTriangle, 
    cor: 'bg-amber-600 text-white border-amber-700', 
    badge: 'bg-amber-100 text-amber-800', 
    label: 'Ponto de Risco / Obstrução',
    dica: 'Mochilas no corredor, entulho, fios expostos ou desníveis sem sinalização.' 
  }
};

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState('mapa_ruas'); // 'mapa_ruas', 'planta', 'checklist', 'simulado', 'mural'
  const [rotaSelecionada, setRotaSelecionada] = useState(RUAS_ROTAS_FUGA[0]);
  const [filtroRota, setFiltroRota] = useState('todas'); // 'todas' ou id da rota
  const [mapaCamada, setMapaCamada] = useState('padrao'); // 'padrao' ou 'escuro'

  // Estado da Planta da Sala/Escola
  const [plantaVisao, setPlantaVisao] = useState('sala');
  const [modoEdicaoPlanta, setModoEdicaoPlanta] = useState(true);
  const [elementoAtivo, setElementoAtivo] = useState('porta');
  const [mostrarLinhasRota, setMostrarLinhasRota] = useState(true);

  // Alertas customizados adicionados nas ruas
  const [alertasRuas, setAlertasRuas] = useState(() => {
    const salvos = localStorage.getItem('alertasRuasBateias');
    if (salvos) {
      try { return JSON.parse(salvos); } catch(e) {}
    }
    return [
      { id: 1, nome: 'Desnível sem calçada na PR-090 Km 29', coord: [-25.3292, -49.5160], desc: 'Trecho estreito de 60 metros onde alunos precisam andar no acostamento.', tipo: 'Alerta' }
    ];
  });

  // Pontos de emergência na planta
  const [pontos, setPontos] = useState(() => {
    const salvos = localStorage.getItem('pontosEmergenciaEscola_v2');
    if (salvos) {
      try { return JSON.parse(salvos); } catch (e) { /* ignore */ }
    }
    return [
      { id: 1, tipo: 'porta', x: 88, y: 50, descricao: 'Porta de Saída Principal da Sala' },
      { id: 2, tipo: 'janela', x: 12, y: 30, descricao: 'Janela Lateral 1 (Arejada)' },
      { id: 3, tipo: 'janela', x: 12, y: 70, descricao: 'Janela Lateral 2' },
      { id: 4, tipo: 'extintor', x: 92, y: 38, descricao: 'Extintor ABC (Corredor Bloco A)' },
      { id: 5, tipo: 'luminaria', x: 85, y: 15, descricao: 'Luminária Autônoma LED' },
      { id: 6, tipo: 'placa', x: 88, y: 65, descricao: 'Placa "SAÍDA" com Seta Direita' },
      { id: 7, tipo: 'pontoEncontro', x: 50, y: 92, descricao: 'Ponto de Encontro: Quadra Aberta' },
    ];
  });

  // Riscos registrados
  const [riscos, setRiscos] = useState(() => {
    const salvos = localStorage.getItem('riscosEscola_v2');
    if (salvos) {
      try { return JSON.parse(salvos); } catch (e) { /* ignore */ }
    }
    return [
      { id: 101, local: 'Corredor das salas 3 e 4', descricao: 'Mochilas empilhadas no chão estreitando a passagem para menos de 80cm', gravidade: 'Média', resolvido: false },
      { id: 102, local: 'Porta de emergência lateral', descricao: 'Tranca emperrada que dificulta abertura rápida com uma só mão', gravidade: 'Alta', resolvido: false },
      { id: 103, local: 'Margem da Estrada do Cerne em frente ao Colégio', descricao: 'Falta de faixa de pedestres com pintura reflexiva e lombada', gravidade: 'Alta', resolvido: false }
    ];
  });

  // Checklist de Campo
  const [checklist, setChecklist] = useState({
    saidasLivres: true,
    portasDestrancadas: false,
    extintoresValidos: true,
    extintoresDesobstruidos: true,
    luminariasFuncionando: true,
    placasVisiveis5m: true,
    pisoAntiderrapante: false,
    rotaAcessivelCadeirante: true,
    pontoEncontroLivreFiacao: true,
    calcadaPR090Desobstruida: false
  });

  // Cronômetro do Simulado
  const [segundosSimulado, setSegundosSimulado] = useState(0);
  const [simuladoAtivo, setSimuladoAtivo] = useState(false);
  const timerRef = useRef(null);

  // Referência do elemento DOM do Mapa Leaflet
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersGroupRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('pontosEmergenciaEscola_v2', JSON.stringify(pontos));
  }, [pontos]);

  useEffect(() => {
    localStorage.setItem('riscosEscola_v2', JSON.stringify(riscos));
  }, [riscos]);

  useEffect(() => {
    localStorage.setItem('alertasRuasBateias', JSON.stringify(alertasRuas));
  }, [alertasRuas]);

  // Efeito Cronômetro
  useEffect(() => {
    if (simuladoAtivo) {
      timerRef.current = setInterval(() => setSegundosSimulado(s => s + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [simuladoAtivo]);

  // =========================================================================
  // INICIALIZAÇÃO E ATUALIZAÇÃO DO MAPA REAL DE RUAS (LEAFLET)
  // =========================================================================
  useEffect(() => {
    if (abaAtiva !== 'mapa_ruas') return;
    if (!mapContainerRef.current) return;

    // Se o mapa ainda não foi criado, inicializa
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: COORD_ESCOLA,
        zoom: 15,
        zoomControl: true
      });

      // Camada de Azulejos do OpenStreetMap com estilo nítido
      const tileUrl = mapaCamada === 'escuro'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

      const tileLayer = L.tileLayer(tileUrl, {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap | Colégio Otalípio Pereira de Andrade (Bateias)'
      }).addTo(map);

      // Grupo de camadas para facilitar limpeza ao filtrar
      const layersGroup = L.layerGroup().addTo(map);
      layersGroupRef.current = layersGroup;
      mapInstanceRef.current = map;

      // Evento de clique para adicionar alerta na rua
      map.on('click', (e) => {
        const desc = prompt('Deseja registrar um alerta ou ponto de atenção nesta rua/estrada de Bateias? Digite a descrição:');
        if (desc && desc.trim()) {
          const novoAlerta = {
            id: Date.now(),
            nome: 'Ponto de Atenção Registrado',
            coord: [e.latlng.lat, e.latlng.lng],
            desc: desc.trim(),
            tipo: 'Aviso Aluno'
          };
          setAlertasRuas(prev => [...prev, novoAlerta]);
        }
      });
    }

    // Atualizar camadas no mapa de acordo com filtros e rotas
    if (mapInstanceRef.current && layersGroupRef.current) {
      const map = mapInstanceRef.current;
      const group = layersGroupRef.current;
      group.clearLayers();

      // 1. Desenhar as Linhas das Ruas de Fuga
      const rotasParaDesenhar = filtroRota === 'todas' 
        ? RUAS_ROTAS_FUGA 
        : RUAS_ROTAS_FUGA.filter(r => r.id === filtroRota);

      rotasParaDesenhar.forEach(rota => {
        // Linha de contorno externa para brilho neon
        L.polyline(rota.pontos, {
          color: rota.cor,
          weight: 9,
          opacity: 0.35,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(group);

        // Linha principal da rota com pontilhado dinâmico
        const poly = L.polyline(rota.pontos, {
          color: rota.cor,
          weight: 5,
          opacity: 0.95,
          dashArray: '10, 8',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(group);

        // Popup detalhado com as ruas da rota
        poly.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 200px;">
            <div style="font-size: 11px; text-transform: uppercase; font-weight: bold; color: ${rota.cor}; margin-bottom: 2px;">
              ${rota.tipo}
            </div>
            <strong style="font-size: 14px; color: #ffffff; display: block; margin-bottom: 4px;">
              ${rota.nome}
            </strong>
            <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 6px;">
              <strong>Trajeto pelas Ruas:</strong> ${rota.descricaoRuas}
            </p>
            <div style="font-size: 11px; color: #38bdf8; display: flex; justify-content: space-between; border-top: 1px solid #334155; padding-top: 4px;">
              <span>📏 ${rota.distancia}</span>
              <span>⏱️ ${rota.tempo}</span>
            </div>
          </div>
        `);
      });

      // 2. Adicionar Marcadores das Instituições e Pontos de Encontro
      PONTOS_REFERENCIA_RUAS.forEach(ponto => {
        const iconHtml = `
          <div style="
            background: #0f172a;
            border: 2px solid #38bdf8;
            border-radius: 9999px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.7);
            cursor: pointer;
            transition: transform 0.2s;
          ">
            ${ponto.icone}
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-map-pin',
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        const marker = L.marker(ponto.coord, { icon: customIcon }).addTo(group);
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 200px;">
            <div style="font-size: 18px; margin-bottom: 4px;">${ponto.icone}</div>
            <strong style="font-size: 13px; color: #ffffff; display: block; margin-bottom: 2px;">
              ${ponto.nome}
            </strong>
            <p style="font-size: 11px; color: #94a3b8; margin: 0;">
              ${ponto.detalhes}
            </p>
          </div>
        `);
      });

      // 3. Adicionar Alertas registrados pelos alunos nas ruas
      alertasRuas.forEach(alerta => {
        const iconAlerta = L.divIcon({
          html: `
            <div style="
              background: #e11d48;
              border: 2px solid #ffffff;
              border-radius: 9999px;
              width: 30px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              box-shadow: 0 0 12px rgba(225, 29, 72, 0.8);
              animation: bounce 1.5s infinite;
            ">
              ⚠️
            </div>
          `,
          className: 'custom-alert-pin',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });

        const marker = L.marker(alerta.coord, { icon: iconAlerta }).addTo(group);
        marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; min-width: 180px;">
            <span style="font-size: 10px; font-weight: bold; color: #f43f5e; text-transform: uppercase;">Atenção na Via</span>
            <strong style="font-size: 12px; color: #ffffff; display: block; margin-bottom: 2px;">${alerta.nome}</strong>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0;">${alerta.desc}</p>
          </div>
        `);
      });
    }

    // Centralizar suavemente na rota selecionada se filtrada
    if (filtroRota !== 'todas' && mapInstanceRef.current) {
      const rota = RUAS_ROTAS_FUGA.find(r => r.id === filtroRota);
      if (rota && rota.pontos.length > 0) {
        mapInstanceRef.current.panTo(rota.pontos[0]);
      }
    }
  }, [abaAtiva, filtroRota, alertasRuas, mapaCamada]);

  // Função para centralizar no Colégio Otalípio
  const centralizarNoColegio = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(COORD_ESCOLA, 16);
    }
  };

  const handleMapClickPlanta = (e) => {
    if (!modoEdicaoPlanta) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    const elemento = ELEMENTOS_EMERGENCIA[elementoAtivo];
    const novoPonto = {
      id: Date.now(),
      tipo: elementoAtivo,
      x,
      y,
      descricao: `${elemento.label} (${x}%, ${y}%)`
    };

    setPontos([...pontos, novoPonto]);
  };

  const removerPontoPlanta = (id, e) => {
    e.stopPropagation();
    setPontos(pontos.filter(p => p.id !== id));
  };

  const formatarTempo = (totalSec) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Exportar Relatório Oficial com as Ruas
  const handleExportarTXT = () => {
    const texto = `===============================================================
RELATÓRIO DE ROTAS DE FUGA E MAPEAMENTO DE RUAS EM BATEIAS
Colégio Estadual Otalípio Pereira de Andrade
Localização: Estrada do Cerne (PR-090), Km 29 • Bateias, Campo Largo - PR
Atividade: A Resiliência Começa em Casa & na Escola | Outubro 2026
Emissão: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
===============================================================

1. RUAS E ROTAS DE FUGA OFICIAIS MAPEADAS EM BATEIAS:
${RUAS_ROTAS_FUGA.map((r, idx) => `
${idx + 1}. [${r.nome.toUpperCase()}]
   - Tipo de Rota: ${r.tipo}
   - Trajeto pelas Ruas: ${r.descricaoRuas}
   - Distância Total: ${r.distancia} | Tempo Estimado: ${r.tempo}
   - Recomendações de Segurança: ${r.recomendações}
`).join('')}

2. PONTOS DE ENCONTRO OFICIAIS:
- Ponto Escolar: Quadra Poliesportiva Descoberta do Colégio Otalípio (Pátio Central dos Fundos).
- Ponto Comunitário: Pátio da Igreja Matriz São Sebastião de Bateias e Unidade Básica de Saúde.
- Ponto Alto de Refúgio (Enchentes): Cumeada de São Silvestre / Bateias de Cima (Cota 980m).

3. ELEMENTOS DE EMERGÊNCIA NA PLANTA ESCOLAR (${pontos.length} itens):
${pontos.map((p, idx) => `  ${idx + 1}. [${ELEMENTOS_EMERGENCIA[p.tipo]?.label || p.tipo}] ${p.descricao} (Posição: X=${p.x}%, Y=${p.y}%)`).join('\n')}

4. RISCOS IDENTIFICADOS PARA COMUNICAR À DIREÇÃO ESCOLAR E DEFESA CIVIL:
${riscos.map((r, idx) => `  ${idx + 1}. [GRAVIDADE ${r.gravidade.toUpperCase()}] ${r.local}: ${r.descricao} (${r.resolvido ? 'RESOLVIDO' : 'PENDENTE DE AÇÃO'})`).join('\n')}

5. REGRAS DA ATIVIDADE:
"Por onde sair, para onde ir e onde se encontrar.
A atividade é para identificar e comunicar possíveis riscos, e não para que vocês façam qualquer intervenção ou movimentem equipamentos."
===============================================================`;

    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-rotas-de-fuga-ruas-bateias.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Header Institucional */}
      <header className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-700 text-white shadow-xl border-b border-red-500/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl shadow-inner border border-white/30 animate-pulse">
              <ShieldAlert className="w-8 h-8 text-amber-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/25 text-xs uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">
                  Defesa Civil & Educação 2026
                </span>
                <span className="text-xs bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Resiliência Começa em Casa
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                Rotas de Fuga • Colégio Estadual Otalípio Pereira de Andrade
              </h1>
              <p className="text-xs sm:text-sm text-red-100 flex items-center gap-1.5 font-medium">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                Estrada do Cerne (PR-090), Km 29 • Bateias, Campo Largo - PR
              </p>
            </div>
          </div>

          {/* Telefones de Emergência Rápida */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-slate-300 block text-[10px] uppercase">Bombeiros</span>
                <strong className="text-white text-sm">193</strong>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
              <PhoneCall className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-slate-300 block text-[10px] uppercase">SAMU</span>
                <strong className="text-white text-sm">192</strong>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs">
              <PhoneCall className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-slate-300 block text-[10px] uppercase">Defesa Civil</span>
                <strong className="text-white text-sm">199</strong>
              </div>
            </div>
            <button
              onClick={handleExportarTXT}
              className="bg-white text-red-700 hover:bg-red-50 font-bold text-xs px-3.5 py-2 rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Relatório</span>
            </button>
            <button
              onClick={() => window.print()}
              className="bg-red-950/60 hover:bg-red-950 text-white font-bold text-xs px-3 py-2 rounded-lg border border-red-400/40 transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Imprimir</span>
            </button>
          </div>
        </div>

        {/* Abas de Navegação */}
        <div className="bg-red-950/80 border-t border-red-500/20 px-4">
          <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2 text-sm scrollbar-none">
            <button
              onClick={() => setAbaAtiva('mapa_ruas')}
              className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                abaAtiva === 'mapa_ruas'
                  ? 'bg-white text-red-950 shadow-lg scale-102 ring-2 ring-amber-400'
                  : 'text-red-100 hover:bg-white/10'
              }`}
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              🗺️ 1. Mapa Real das Ruas de Fuga (Bateias)
            </button>
            <button
              onClick={() => setAbaAtiva('planta')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                abaAtiva === 'planta'
                  ? 'bg-white text-red-950 shadow-lg scale-102'
                  : 'text-red-100 hover:bg-white/10'
              }`}
            >
              <School className="w-4 h-4" />
              2. Planta da Sala & Escola
            </button>
            <button
              onClick={() => setAbaAtiva('checklist')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                abaAtiva === 'checklist'
                  ? 'bg-white text-red-950 shadow-lg scale-102'
                  : 'text-red-100 hover:bg-white/10'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              3. Investigação em Campo ({riscos.length} Riscos)
            </button>
            <button
              onClick={() => setAbaAtiva('simulado')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                abaAtiva === 'simulado'
                  ? 'bg-white text-red-950 shadow-lg scale-102'
                  : 'text-red-100 hover:bg-white/10'
              }`}
            >
              <Clock className="w-4 h-4" />
              4. Simulado de Abandono
            </button>
            <button
              onClick={() => setAbaAtiva('mural')}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all whitespace-nowrap ${
                abaAtiva === 'mural'
                  ? 'bg-white text-red-950 shadow-lg scale-102'
                  : 'text-red-100 hover:bg-white/10'
              }`}
            >
              <Building2 className="w-4 h-4" />
              5. Mural da Turma
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">

        {/* ========================================================================= */}
        {/* ABA 1: MAPA REAL DAS RUAS DE ROTAS DE FUGA EM BATEIAS (LEAFLET / OSM) */}
        {/* ========================================================================= */}
        {abaAtiva === 'mapa_ruas' && (
          <div className="space-y-6">
            {/* Banner Informativo das Ruas */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/30 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5" /> Mapa Oficial de Ruas e Rodovias
                  </span>
                  <span className="text-xs text-slate-400">Distrito de Bateias, Campo Largo - PR</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Ruas e Estradas de Evacuação • Bateias e Região
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
                  Visualização geográfica em mapa das vias de escape ao redor do <strong>Colégio Estadual Otalípio Pereira de Andrade (PR-090 Km 29)</strong>, detalhando os trajetos pelas calçadas até a Igreja Matriz, estradas rurais para pontos elevados e corredores rodoviários de resgate.
                </p>
              </div>

              {/* Botões de Ação Rápida no Mapa */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={centralizarNoColegio}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  title="Centralizar no Colégio Otalípio"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Centralizar na Escola</span>
                </button>
                <button
                  onClick={() => setMapaCamada(mapaCamada === 'padrao' ? 'escuro' : 'padrao')}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                >
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <span>{mapaCamada === 'padrao' ? 'Modo Alto Contraste' : 'Modo Padrão'}</span>
                </button>
              </div>
            </div>

            {/* Filtros de Ruas no Topo do Mapa */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[11px] whitespace-nowrap flex items-center gap-1">
                <FilterIcon className="w-3.5 h-3.5 text-amber-400" />
                Filtrar Rota:
              </span>
              <button
                onClick={() => setFiltroRota('todas')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                  filtroRota === 'todas'
                    ? 'bg-amber-400 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
                }`}
              >
                Todas as Ruas de Fuga
              </button>
              {RUAS_ROTAS_FUGA.map(r => (
                <button
                  key={r.id}
                  onClick={() => {
                    setFiltroRota(r.id);
                    setRotaSelecionada(r);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    filtroRota === r.id
                      ? 'bg-white text-slate-950 shadow ring-2 ring-emerald-500'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750 border border-slate-700'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: r.cor }} />
                  <span>{r.nome.split(':')[0]}</span>
                </button>
              ))}
            </div>

            {/* Grid Principal: Mapa e Painel Lateral de Instruções de Rua */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* O Container do Mapa Leaflet */}
              <div className="lg:col-span-2 space-y-3">
                <div className="bg-slate-900 border-2 border-slate-700 rounded-2xl overflow-hidden shadow-2xl relative">
                  {/* Top Bar do Mapa */}
                  <div className="bg-slate-900/90 backdrop-blur-md px-4 py-2.5 border-b border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <strong className="text-white">
                        Mapa Interativo de Bateias (Campo Largo - PR)
                      </strong>
                    </div>
                    <span className="text-slate-400 text-[11px] hidden sm:inline">
                      💡 Dica: Clique no mapa para marcar um alerta ou risco na via
                    </span>
                  </div>

                  {/* DOM onde o Leaflet renderiza */}
                  <div 
                    ref={mapContainerRef} 
                    className="w-full h-[520px] bg-slate-950 z-10"
                    style={{ minHeight: '520px' }}
                  />

                  {/* Legenda Flutuante sobre o Mapa */}
                  <div className="absolute bottom-4 left-4 z-20 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-2xl text-[11px] text-slate-200 max-w-xs space-y-1.5 pointer-events-auto">
                    <strong className="text-xs text-white block border-b border-slate-700 pb-1">
                      Legenda do Mapa de Ruas:
                    </strong>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🏫</span>
                      <span>Colégio Otalípio (Km 29 PR-090)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">🚩</span>
                      <span>Ponto de Encontro da Escola (Quadra Aberta)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">⛪</span>
                      <span>Ponto de Encontro Comunitário (Igreja Matriz)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-1 bg-emerald-500 rounded inline-block" />
                      <span>Rota de Fuga a Pé (Calçadas da PR-090)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-1 bg-amber-500 rounded inline-block" />
                      <span>Estrada São Silvestre (Área Elevada)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-1 bg-rose-500 rounded inline-block" />
                      <span>Corredor Médico PR-090 (Hospital do Rocio)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Painel Lateral: Guia Passo a Passo das Ruas */}
              <div className="lg:col-span-1 space-y-4">
                {/* Cartão de Detalhes da Rota Ativa */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                  <div className="border-b border-slate-800 pb-3">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-400 block mb-1">
                      {rotaSelecionada.tipo}
                    </span>
                    <h3 className="text-lg font-black text-white leading-snug">
                      {rotaSelecionada.nome}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Distância:</span>
                      <strong className="text-base text-cyan-400">{rotaSelecionada.distancia}</strong>
                    </div>
                    <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      <span className="text-slate-400 text-[10px] block uppercase font-bold">Tempo Estimado:</span>
                      <strong className="text-base text-emerald-400">{rotaSelecionada.tempo}</strong>
                    </div>
                  </div>

                  {/* Passo a Passo pelas Ruas */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-300 block">
                      Guia Passo a Passo pelas Ruas:
                    </span>
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 bg-slate-950/80 rounded-xl border-l-4 border-emerald-500 border-slate-800 space-y-0.5">
                        <strong className="text-white block">1. Saída do Portão Escolar</strong>
                        <p className="text-slate-300 text-[11px]">
                          Evacuar pelo portão principal do Colégio Otalípio na Estrada do Cerne (PR-090 Km 29). Mantenha a turma organizada em fila.
                        </p>
                      </div>

                      <div className="p-2.5 bg-slate-950/80 rounded-xl border-l-4 border-cyan-500 border-slate-800 space-y-0.5">
                        <strong className="text-white block">2. Seguir pela Calçada da PR-090</strong>
                        <p className="text-slate-300 text-[11px]">
                          Caminhar pela calçada sinalizada da lateral leste da rodovia por aproximadamente 350 metros. Evitar o leito asfáltico devido aos caminhões de calcário.
                        </p>
                      </div>

                      <div className="p-2.5 bg-slate-950/80 rounded-xl border-l-4 border-blue-500 border-slate-800 space-y-0.5">
                        <strong className="text-white block">3. Conversão na Rua São Sebastião</strong>
                        <p className="text-slate-300 text-[11px]">
                          Virar à direita na Rua São Sebastião, via urbana asfaltada e de tráfego calmo que dá acesso ao miolo central de Bateias.
                        </p>
                      </div>

                      <div className="p-2.5 bg-slate-950/80 rounded-xl border-l-4 border-amber-500 border-slate-800 space-y-0.5">
                        <strong className="text-white block">4. Chegada ao Ponto de Encontro</strong>
                        <p className="text-slate-300 text-[11px]">
                          Reunir toda a turma no pátio aberto da Igreja Matriz São Sebastião e Posto de Saúde (UBS Bateias) para contagem de alunos.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recomendações Críticas */}
                  <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-xl text-xs space-y-1">
                    <strong className="text-amber-300 flex items-center gap-1 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" /> Atenção na Estrada do Cerne:
                    </strong>
                    <p className="text-slate-300 text-[11px]">
                      {rotaSelecionada.recomendações}
                    </p>
                  </div>
                </div>

                {/* Lista de Alertas Cadastrados nas Vias */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Alertas nas Vias ({alertasRuas.length})
                    </h4>
                    <span className="text-[10px] text-rose-400 font-bold">Colaborativo</span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {alertasRuas.map(a => (
                      <div key={a.id} className="p-2 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                        <strong className="text-rose-400 block">{a.nome}</strong>
                        <span className="text-slate-300">{a.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 2: PLANTA DA SALA & ESCOLA COM MAPEAMENTO TÁTICO INTERATIVO */}
        {/* ========================================================================= */}
        {abaAtiva === 'planta' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 font-bold text-xs uppercase px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Passo 1 e 2 da Atividade
                  </span>
                  <span className="text-xs text-slate-400">Localize onde vocês estão e trace a rota de fuga</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  Mapeamento da Sala de Aula & Conexão com a Quadra Aberta
                </h2>
                <p className="text-sm text-slate-300 max-w-3xl">
                  Cada grupo identifica no desenho: a porta de saída, janelas, extintores e luminárias. Em seguida, trace o trajeto pelos corredores até o <strong>Ponto de Encontro no Pátio Aberto do Colégio Otalípio Pereira de Andrade</strong>.
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setPlantaVisao(plantaVisao === 'sala' ? 'escola' : 'sala')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-600 transition-all flex items-center gap-2 shadow"
                >
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Ver: {plantaVisao === 'sala' ? 'Planta da Sala de Aula' : 'Visão Geral do Colégio'}</span>
                </button>
                <button
                  onClick={() => setMostrarLinhasRota(!mostrarLinhasRota)}
                  className={`px-4 py-2 font-medium text-xs rounded-xl border transition-all flex items-center gap-2 shadow ${
                    mostrarLinhasRota 
                      ? 'bg-emerald-600 text-white border-emerald-500' 
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <Navigation className="w-4 h-4" />
                  <span>{mostrarLinhasRota ? 'Rota Visual: Ativa' : 'Rota Visual: Oculta'}</span>
                </button>
                <button
                  onClick={() => setModoEdicaoPlanta(!modoEdicaoPlanta)}
                  className={`px-4 py-2 font-bold text-xs rounded-xl border transition-all flex items-center gap-2 shadow ${
                    modoEdicaoPlanta 
                      ? 'bg-amber-500 text-slate-950 border-amber-400' 
                      : 'bg-slate-700 text-white border-slate-600'
                  }`}
                >
                  {modoEdicaoPlanta ? <Edit3 className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span>{modoEdicaoPlanta ? 'Modo: Mapeando' : 'Modo: Visualização'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Barra Lateral de Elementos */}
              <div className="lg:col-span-1 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                    <span>Elementos para Inserir</span>
                    <span className="text-[11px] text-amber-400 font-semibold">Clique e marque</span>
                  </h3>

                  <div className="space-y-2">
                    {Object.entries(ELEMENTOS_EMERGENCIA).map(([chave, elem]) => {
                      const Icone = elem.icon;
                      const selecionado = elementoAtivo === chave;
                      return (
                        <button
                          key={chave}
                          onClick={() => {
                            setElementoAtivo(chave);
                            setModoEdicaoPlanta(true);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                            selecionado
                              ? 'bg-slate-800 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                              : 'bg-slate-950 border-slate-800 hover:bg-slate-800 text-slate-300'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shadow ${elem.cor}`}>
                            <Icone className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white flex items-center justify-between">
                              <span>{elem.label}</span>
                              {selecionado && <span className="text-[10px] text-emerald-400">Ativo</span>}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">{elem.dica}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-2 text-xs">
                  <strong className="text-slate-300 block uppercase font-bold text-[11px]">
                    Instrução da Atividade:
                  </strong>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Identifiquem onde estão as saídas e extintores da sala de vocês. Quando o alarme tocar, ninguém corre, ninguém grita. A turma sai em fila única até o Ponto de Encontro.
                  </p>
                </div>
              </div>

              {/* Canvas da Planta */}
              <div className="lg:col-span-3 space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl relative">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-200">
                      {plantaVisao === 'sala' 
                        ? 'Planta da Sala de Aula (Mesa do Professor, Carteiras e Saída)' 
                        : 'Planta Geral do Colégio Otalípio: Corredores, Blocos e Pátio'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {modoEdicaoPlanta ? '👉 Clique na planta para fixar o elemento selecionado' : '🔒 Modo de visualização'}
                    </span>
                  </div>

                  <div
                    onClick={handleMapClickPlanta}
                    className={`relative w-full h-[440px] bg-slate-950 rounded-xl border-2 overflow-hidden select-none transition-colors ${
                      modoEdicaoPlanta 
                        ? 'cursor-crosshair border-emerald-500/40 hover:border-emerald-500/80' 
                        : 'cursor-default border-slate-800'
                    }`}
                  >
                    {/* SVG da Planta */}
                    {plantaVisao === 'sala' ? (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
                        <rect x="50" y="50" width="900" height="500" rx="12" fill="#0f172a" stroke="#475569" strokeWidth="6" />
                        <line x1="50" y1="120" x2="50" y2="240" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" />
                        <text x="65" y="180" fill="#38bdf8" fontSize="16" fontWeight="bold">Janela 1 (Arejada)</text>
                        <line x1="50" y1="360" x2="50" y2="480" stroke="#38bdf8" strokeWidth="12" strokeLinecap="round" />
                        <text x="65" y="420" fill="#38bdf8" fontSize="16" fontWeight="bold">Janela 2 (Arejada)</text>
                        <line x1="950" y1="240" x2="950" y2="360" stroke="#10b981" strokeWidth="12" strokeLinecap="round" />
                        <path d="M 950 240 A 120 120 0 0 0 830 360" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="6 4" />
                        <text x="760" y="300" fill="#10b981" fontSize="18" fontWeight="bold">PORTA DE SAÍDA (78cm)</text>

                        <rect x="750" y="100" width="140" height="70" rx="6" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
                        <text x="765" y="140" fill="#94a3b8" fontSize="14" fontWeight="bold">Mesa Professor</text>
                        <rect x="680" y="55" width="220" height="12" rx="3" fill="#047857" stroke="#10b981" strokeWidth="2" />
                        <text x="740" y="45" fill="#a7f3d0" fontSize="12" fontWeight="bold">Lousa / Quadro</text>

                        {[200, 360, 520].map((xPos, colIdx) => (
                          <g key={colIdx}>
                            {[120, 220, 320, 420].map((yPos, rowIdx) => (
                              <g key={rowIdx}>
                                <rect x={xPos} y={yPos} width="60" height="45" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                                <circle cx={xPos + 30} cy={yPos + 55} r="8" fill="#475569" />
                              </g>
                            ))}
                          </g>
                        ))}
                        <text x="350" y="90" fill="#64748b" fontSize="14" fontWeight="bold">Carteiras da Turma</text>

                        {mostrarLinhasRota && (
                          <g>
                            <defs>
                              <marker id="arrowS" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                              </marker>
                            </defs>
                            <path 
                              d="M 280 270 L 440 270 L 600 270 L 880 270 L 970 300" 
                              fill="none" 
                              stroke="#10b981" 
                              strokeWidth="5" 
                              strokeDasharray="10 8" 
                              markerEnd="url(#arrowS)"
                              className="animate-pulse"
                            />
                            <text x="450" y="250" fill="#34d399" fontSize="16" fontWeight="bold">
                              ➡ FLUXO DE EVACUAÇÃO (Fila Única)
                            </text>
                          </g>
                        )}
                      </svg>
                    ) : (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
                        <rect x="40" y="40" width="920" height="520" rx="16" fill="#0f172a" stroke="#334155" strokeWidth="4" />
                        <rect x="80" y="80" width="300" height="180" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="3" />
                        <text x="120" y="170" fill="#94a3b8" fontSize="18" fontWeight="bold">Bloco A (Salas de Aula)</text>
                        <rect x="80" y="320" width="300" height="180" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="3" />
                        <text x="110" y="410" fill="#94a3b8" fontSize="18" fontWeight="bold">Bloco B (Secretaria / Direção)</text>

                        <rect x="620" y="100" width="300" height="380" rx="12" fill="#065f46" opacity="0.3" stroke="#10b981" strokeWidth="4" />
                        <circle cx="770" cy="290" r="45" fill="none" stroke="#10b981" strokeWidth="2" />
                        <text x="660" y="270" fill="#34d399" fontSize="20" fontWeight="black">PONTO DE ENCONTRO</text>
                        <text x="680" y="320" fill="#a7f3d0" fontSize="14">Quadra Poliesportiva Aberta</text>

                        {mostrarLinhasRota && (
                          <path 
                            d="M 380 170 L 480 170 L 500 280 L 620 280 L 740 280" 
                            fill="none" 
                            stroke="#10b981" 
                            strokeWidth="6" 
                            strokeDasharray="8 6" 
                            className="animate-pulse"
                          />
                        )}
                      </svg>
                    )}

                    {/* Marcadores */}
                    {pontos.map((ponto) => {
                      const elem = ELEMENTOS_EMERGENCIA[ponto.tipo] || ELEMENTOS_EMERGENCIA.porta;
                      const Icone = elem.icon;
                      return (
                        <div
                          key={ponto.id}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-30"
                          style={{ left: `${ponto.x}%`, top: `${ponto.y}%` }}
                        >
                          <div className={`p-2 rounded-xl shadow-2xl border-2 flex items-center justify-center cursor-pointer transition-transform group-hover:scale-125 ${elem.cor}`}>
                            <Icone className="w-5 h-5" />
                          </div>
                          {modoEdicaoPlanta && (
                            <button
                              onClick={(e) => removerPontoPlanta(ponto.id, e)}
                              className="absolute -top-2 -right-2 bg-rose-600 hover:bg-rose-700 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 3: INVESTIGAÇÃO EM CAMPO & RISCOS */}
        {/* ========================================================================= */}
        {abaAtiva === 'checklist' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Checklist de Segurança & Comunicação de Riscos à Escola
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
                <em>"A atividade é para identificar e comunicar possíveis riscos, e não para que façam qualquer intervenção ou movimentem equipamentos."</em> Percorra a rota e audite cada detalhe.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Checklist */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Itens de Auditoria no Percurso
                </h3>

                <div className="space-y-2">
                  {[
                    { key: 'saidasLivres', titulo: 'Rotas e saídas livres e desobstruídas', desc: 'Sem caixas, materiais de limpeza ou carteiras bloqueando a passagem.' },
                    { key: 'portasDestrancadas', titulo: 'Portas de emergência destrancadas e funcionais', desc: 'Abertura fácil para o sentido de fuga.' },
                    { key: 'extintoresValidos', titulo: 'Extintores no prazo de validade', desc: 'Ponteiro indicador no verde e lacre intacto.' },
                    { key: 'extintoresDesobstruidos', titulo: 'Extintores totalmente acessíveis', desc: 'Sem obstáculos na frente dos suportes.' },
                    { key: 'luminariasFuncionando', titulo: 'Luminárias de emergência funcionando', desc: 'Baterias autônomas em caso de queda de luz.' },
                    { key: 'placasVisiveis5m', titulo: 'Placas fotoluminescentes visíveis a 5m', desc: 'Indicação clara do rumo do Ponto de Encontro.' },
                    { key: 'calcadaPR090Desobstruida', titulo: 'Calçadas da Estrada do Cerne (PR-090)', desc: 'Espaço seguro para passagem de pedestres sem risco de atropelamento.' }
                  ].map(item => (
                    <label 
                      key={item.key}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        checklist[item.key]
                          ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-300'
                      }`}
                    >
                      <input 
                        type="checkbox"
                        checked={checklist[item.key]}
                        onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-600 bg-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <strong className="text-xs font-bold block">{item.titulo}</strong>
                        <span className="text-[11px] text-slate-400 block">{item.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Riscos Registrados */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Riscos para Comunicar à Direção da Escola ({riscos.length})
                </h3>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {riscos.map(r => (
                    <div 
                      key={r.id}
                      className={`p-3 rounded-xl border flex items-start justify-between gap-3 ${
                        r.resolvido 
                          ? 'bg-slate-950/40 border-slate-800 opacity-60' 
                          : r.gravidade === 'Alta' 
                          ? 'bg-rose-950/40 border-rose-500/50' 
                          : 'bg-amber-950/30 border-amber-500/40'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.gravidade === 'Alta' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-950'
                          }`}>
                            {r.gravidade}
                          </span>
                          <strong className="text-xs text-white truncate">{r.local}</strong>
                        </div>
                        <p className="text-xs text-slate-300">{r.descricao}</p>
                      </div>

                      <button
                        onClick={() => setRiscos(riscos.map(item => item.id === r.id ? { ...item, resolvido: !item.resolvido } : item))}
                        className={`p-1.5 rounded-lg border text-xs transition-all ${
                          r.resolvido ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 4: SIMULADO DE ABANDONO COM CRONÔMETRO */}
        {/* ========================================================================= */}
        {abaAtiva === 'simulado' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-rose-950/70 via-slate-900 to-slate-900 border border-rose-500/30 rounded-2xl p-5 shadow-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Simulado de Abandono da Escola & Cronômetro da Turma
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
                <em>"Em uma emergência, não é hora de descobrir o caminho. É hora de colocar em prática aquilo que já aprendemos e treinamos!"</em>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cronômetro */}
              <div className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Tempo de Evasão da Turma
                </span>
                
                <div className="text-6xl font-black font-mono tracking-tight text-white bg-slate-950 px-8 py-5 rounded-2xl border-2 border-slate-800 shadow-inner">
                  {formatarTempo(segundosSimulado)}
                </div>

                <div className="flex items-center gap-2 w-full">
                  {!simuladoAtivo ? (
                    <button
                      onClick={() => setSimuladoAtivo(true)}
                      className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4" /> Iniciar Alarme & Saída
                    </button>
                  ) : (
                    <button
                      onClick={() => setSimuladoAtivo(false)}
                      className="flex-1 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Parar no Ponto de Encontro
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSimuladoAtivo(false);
                      setSegundosSimulado(0);
                    }}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl border border-slate-700 transition-all"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 w-full text-left space-y-1">
                  <span className="font-bold text-emerald-400 block">Tempo Meta Recomendado:</span>
                  <p>Abaixo de <strong>2 minutos e 30 segundos</strong> para todos chegarem em segurança à Quadra Aberta.</p>
                </div>
              </div>

              {/* As 4 Etapas */}
              <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Protocolo Oficial de Evacuação da Escola
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/20 space-y-1">
                    <strong className="text-white text-sm block">1. Sinal de Alerta</strong>
                    <p className="text-slate-300">Interromper a aula imediatamente. Manter calma. Deixar mochilas pesadas nas carteiras.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 space-y-1">
                    <strong className="text-white text-sm block">2. Fila Única</strong>
                    <p className="text-slate-300">Formar fila única com calma. O último a sair fecha a porta (sem trancar) para conter fumaça.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-blue-500/40 bg-blue-950/20 space-y-1">
                    <strong className="text-white text-sm block">3. Deslocamento</strong>
                    <p className="text-slate-300">Caminhar pelo lado direito dos corredores até a quadra aberta. Nunca voltar atrás.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-1">
                    <strong className="text-white text-sm block">4. Ponto de Encontro</strong>
                    <p className="text-slate-300">Reunião na Quadra Poliesportiva Aberta. O professor realiza a contagem e chamada da turma.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ABA 5: MURAL DA TURMA */}
        {/* ========================================================================= */}
        {abaAtiva === 'mural' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Cartaz Oficial: "Por Onde Sair, Para Onde Ir e Onde se Encontrar"
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
                  Exponha na sala de aula para que todos lembrem da rota antes de qualquer emergência acontecer.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir Mural da Turma</span>
              </button>
            </div>

            {/* Cartaz para Impressão */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border-4 border-red-600 space-y-6 print:m-0 print:border-none print:shadow-none">
              <div className="border-b-4 border-red-600 pb-4 text-center space-y-1">
                <div className="inline-block bg-red-600 text-white font-black text-xs uppercase px-3 py-1 rounded-full mb-1">
                  PLANO ESCOLAR DE RESILIÊNCIA E ROTAS DE FUGA
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight uppercase">
                  Colégio Estadual Otalípio Pereira de Andrade
                </h1>
                <p className="text-sm font-semibold text-slate-700">
                  Estrada do Cerne (PR-090), Km 29 • Bateias, Campo Largo - PR
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-red-600 text-white flex items-center justify-center font-black text-lg">
                    1
                  </div>
                  <h3 className="font-black text-red-900 text-lg uppercase">POR ONDE SAIR</h3>
                  <p className="text-xs text-slate-700 mt-1 font-medium">
                    Pela <strong>Porta Principal da Sala</strong>, virando à direita no corredor central do Bloco Pedagógico.
                  </p>
                </div>

                <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-amber-600 text-white flex items-center justify-center font-black text-lg">
                    2
                  </div>
                  <h3 className="font-black text-amber-900 text-lg uppercase">PARA ONDE IR</h3>
                  <p className="text-xs text-slate-700 mt-1 font-medium">
                    Seguir pelo <strong>Corredor Desobstruído</strong> em fila única até o pátio central dos fundos.
                  </p>
                </div>

                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4">
                  <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
                    3
                  </div>
                  <h3 className="font-black text-emerald-900 text-lg uppercase">ONDE SE ENCONTRAR</h3>
                  <p className="text-xs text-slate-700 mt-1 font-medium">
                    No <strong>Ponto de Encontro: Quadra Poliesportiva Aberta</strong>, longe de postes e telhas.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900 text-white p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <strong className="text-sm font-bold text-amber-400 block uppercase">
                    Telefones Rápidos de Emergência:
                  </strong>
                  <div className="flex gap-4 mt-1">
                    <span>Bombeiros: <strong className="text-red-400">193</strong></span>
                    <span>SAMU: <strong className="text-cyan-400">192</strong></span>
                    <span>Defesa Civil: <strong className="text-amber-400">199</strong></span>
                  </div>
                </div>
                <div className="text-slate-400 text-right text-[11px]">
                  Bateias, Campo Largo - PR • Outubro 2026
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-red-500" />
            <span>Colégio Estadual Otalípio Pereira de Andrade • Bateias, Campo Largo - PR</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Sistema de Rotas de Fuga, Gestão de Riscos & Evacuação Regional • 2026
          </div>
        </div>
      </footer>
    </div>
  );
}

function FilterIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
}
