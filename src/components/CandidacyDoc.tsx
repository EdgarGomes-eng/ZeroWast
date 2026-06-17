import { motion } from 'motion/react';
import { 
  Award, ShieldCheck, Heart, Sparkles, TrendingUp, AlertCircle, 
  Database, Globe, Compass, ArrowRight, CheckCircle2, Cpu, 
  Layers, Lightbulb, Users, BarChart3, Radio
} from 'lucide-react';
import { Language } from '../types';

interface CandidacyDocProps {
  currentLanguage: Language;
}

const DOC_TRANSLATIONS = {
  pt: {
    title: 'Documentação da Candidatura',
    subtitle: 'ZeroWaste Connect — Concurso Nacional de Impacto Sustentável',
    nav1: 'Sumário Executivo',
    nav2: 'Problema & Impacto',
    nav3: 'Stack Tecnológico',
    nav4: 'Arquitetura',
    nav5: 'Futuro do Projeto',
    
    // Summary
    summaryTitle: 'Resumo da Inovação',
    summaryText1: 'O ZeroWaste Connect é uma plataforma de logística social inteligente que combate o desperdício alimentar de forma georreferenciada e em tempo real. A nossa missão é simples: fazer uma ponte imediata e transparente entre o excedente alimentar comercializável de restaurantes ou padarias e as organizações de acolhimento social que nutrem milhares de pessoas vulneráveis.',
    summaryText2: 'Através de um mapa interativo e interações baseadas em perfis (Doador/Receptor), o sistema converte o que seria desperdiçado em dignidade humana sob o lema dos ODS 2 (Fome Zero) e ODS 12 (Consumo e Produção Responsáveis).',
    valuePropLabel: 'Inovação do Projeto',
    valueProp1: 'Interação Georreferenciada Imediata',
    valueProp1Desc: 'Doadores registam novos excedentes com geolocalização exata pelo mapa, permitindo rotas de recolha otimizadas.',
    valueProp2: 'Transição e Prontidão Tecnológica',
    valueProp2Desc: 'Uma arquitetura baseada em LocalStorage local robusto com chave rápida para conexão fidedigna ao Supabase/PostgreSQL real para produção.',
    valueProp3: 'Design Humano e Fluido',
    valueProp3Desc: 'Motion design focado no bem-estar com feedback visual, micro-interações táteis e acessibilidade refinada.',

    // Problem
    problemTitle: 'O Desafio Global do Desperdício',
    problemNarrative: 'Cerca de um terço de toda a comida produzida no mundo é perdida ou desperdiçada anualmente. Enquanto toneladas de refeições perfeitamente nutritivas e frescas são deitadas ao lixo diariamente por restaurantes devido a oscilações normais de procura, milhares de famílias enfrentam insegurança alimentar nas mesmas ruas comerciais.',
    problemNarrative2: 'O principal obstáculo não é a escassez de alimentos ou boa vontade, mas a barreira de comunicação e tempo logístico entre quem tem o excedente no fim do turno e quem sabe quem precisa dele para o jantar do próprio dia.',
    stat1Val: '33%',
    stat1Lbl: 'Dos Alimentos Desperdiçados',
    stat2Val: '17 Metros',
    stat2Lbl: 'Distância Média de Coleta',
    stat3Val: 'Zero Fome',
    stat3Lbl: 'Impacto ODS Almejado',

    // Tech stack
    techTitle: 'Ecossistema Tecnológico Moderno',
    techRationale: 'Escolhemos uma stack focada no utilizador, visando performance instantânea, escalabilidade fluida e extrema portabilidade com baixo custo operacional.',
    techReactDesc: 'Interfaces reativas com renderização virtual de alto desempenho e componentização modular reutilizável.',
    techTailwindDesc: 'Estilização utilitária precisa que garante leveza extrema e total responsividade móvel nativa de alta fidelidade.',
    techSupabaseDesc: 'Bypass seguro com PostgreSQL relacional, RLS ativo para confidencialidade e subscrições real-time.',
    techLeafletDesc: 'Biblioteca de cartografia leve para georreferenciação em tempo real sem custos abusivos de licenciamento.',

    // Futures
    futureTitle: 'Visão de Futuro & Próximos Passos',
    futureRoadmap: 'O ZeroWaste Connect foi desenhado para escalabilidade incremental. O nosso roadmap técnico para o pós-MVP foca-se em inteligência artificial e incentivo orgânico:',
    stepAI: '1. Inteligência Artificial Preditiva (IA)',
    stepAIDesc: 'Modelagem preditiva com IA (usando modelos Gemini) analisando dados meteorológicos e históricos do comércio para antecipar excesso de stock, incentivando doações prévias.',
    stepGamify: '2. Gamificação Sustentável',
    stepGamifyDesc: 'Um sistema de selos ecológicos ("Eco-Selo Verde") para restaurantes doadores, dedutível no IRS ambiental local e que serve como chancela de responsabilidade social no Google Maps.',
    stepCold: '3. Monitorização da Cadeia de Frio',
    stepColdDesc: 'Integração com sensores de temperatura inteligentes (IoT) nas carrinhas de transporte e abrigos para total garantia de segurança alimentar bacteriológica.',

    // Diagrams
    archTitle: 'Fluxo Arquitetural da Informação',
    archDesc: 'O ecossistema opera de forma as síncrona garantindo persistência híbrida e transição de servidores simplificada.'
  },
  en: {
    title: 'Candidacy Documentation',
    subtitle: 'ZeroWaste Connect — National Competition for Sustainable Impact',
    nav1: 'Executive Summary',
    nav2: 'Problem & Impact',
    nav3: 'Tech Stack',
    nav4: 'Architecture',
    nav5: 'Project Future',

    summaryTitle: 'Innovation Summary',
    summaryText1: 'ZeroWaste Connect is an intelligent social logistics platform that fights food waste in a georeferenced and real-time manner. Our mission is simple: to build an immediate and transparent bridge between commercially viable surplus food from restaurants or bakeries and the social shelters nourishing vulnerable individuals.',
    summaryText2: 'Through an interactive map and profile-based roles (Donor/Recipient), the system converts what would change to trash into human dignity under the guide of UN SDG 2 (Zero Hunger) and SDG 12 (Responsible Consumption and Production).',
    valuePropLabel: 'Project Breakthroughs',
    valueProp1: 'Immediate Georeferenced Interaction',
    valueProp1Desc: 'Donors register surplus items with exact locations, empowering optimal volunteer collection routes.',
    valueProp2: 'Technological Readiness & Transition',
    valueProp2Desc: 'A robust dual database layer with instant hot-swap between fast localStorage and actual live Supabase/PostgreSQL.',
    valueProp3: 'Humane & Fluid Design',
    valueProp3Desc: 'Thoughtful motion design with tactile feedback, smooth micro-interactions, and high responsiveness.',

    problemTitle: 'Global Waste Challenge',
    problemNarrative: 'Roughly an estimated third of all food produced globally goes to waste every year. While tons of perfectly healthy meals are discarded daily due to fluctuating restaurant demand, vulnerable families face food insecurity in those exact same commercial locations.',
    problemNarrative2: 'The main barrier is not scarcity or goodwill, but communication gaps and logistical timing between those with end-of-day surplus and those managing dinner demands at shelters.',
    stat1Val: '33%',
    stat1Lbl: 'All Food is Wasted',
    stat2Val: '17 Meters',
    stat2Lbl: 'Avg Proximity Match',
    stat3Val: 'Zero Hunger',
    stat3Lbl: 'UN SDG Primary Target',

    techTitle: 'Modern Tech Ecosystem',
    techRationale: 'Our carefully chosen stack prioritizes high performance, extreme modularity, cost efficiency, and fast local-to-cloud transition.',
    techReactDesc: 'Modular virtual-DOM performance rendering and extremely robust reusable hook paradigms.',
    techTailwindDesc: 'Precise utility styling ensuring zero layout weight, custom grid flexibility, and native styling.',
    techSupabaseDesc: 'Instant cloud PostgreSQL database with RLS parameters and real-time active listeners.',
    techLeafletDesc: 'Ultra-light map engine providing fluid custom geolocations without expensive licensing traps.',

    futureTitle: 'Future Vision & Next Steps',
    futureRoadmap: 'ZeroWaste Connect is engineered for modular expansion. Our strategic roadmap focuses on predictive capabilities and organic user gamification:',
    stepAI: '1. AI Predictive Demands',
    stepAIDesc: 'Using Gemini models to analyze local weather patterns and historical sales data to warn restaurants of potential surpluses before they occur.',
    stepGamify: '2. Sustainable Gamification',
    stepGamifyDesc: 'An eco-badge rewards system ("Green Eco-Badge") with social prestige that connects to localized public green incentives.',
    stepCold: '3. Smart Cold-Chain Tracking',
    stepColdDesc: 'Integration with smart hardware logs (IoT) to oversee strict bacteriological temperature safety parameters during collection.',

    archTitle: 'Data & Architectural Flow',
    archDesc: 'The ecosystem maintains sync across hybrid layers. Below is the simplified representation of operational flows.',
  }
};

export default function CandidacyDoc({ currentLanguage }: CandidacyDocProps) {
  const lang = DOC_TRANSLATIONS[currentLanguage] ? currentLanguage : 'pt';
  const t = DOC_TRANSLATIONS[lang];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Header Card */}
      <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-emerald-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
            <Award className="h-3 w-3 text-emerald-400" />
            <span>{t.subtitle}</span>
          </span>
          <h1 className="font-display font-bold text-3xl tracking-tight text-white mt-1">
            {t.title}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm font-light max-w-2xl leading-relaxed">
            {t.summaryText2}
          </p>
        </div>
      </div>

      {/* Grid Layout of Document Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Main Details (8 of 12 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section 1: Sumário Executivo */}
          <motion.section 
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Compass className="h-5 w-5 text-emerald-600" />
              <h2 className="font-display font-bold text-base text-slate-800">
                1. {t.nav1}
              </h2>
            </div>
            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <p>{t.summaryText1}</p>
              <p>{t.summaryText2}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
                {t.valuePropLabel}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="h-6 w-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
                    <Radio className="h-3.5 w-3.5" />
                  </div>
                  <h5 className="font-semibold text-slate-800 text-[11px] font-display mt-2">{t.valueProp1}</h5>
                  <p className="text-[10px] text-slate-500 leading-normal">{t.valueProp1Desc}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="h-6 w-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
                    <Database className="h-3.5 w-3.5" />
                  </div>
                  <h5 className="font-semibold text-slate-800 text-[11px] font-display mt-2">{t.valueProp2}</h5>
                  <p className="text-[10px] text-slate-500 leading-normal">{t.valueProp2Desc}</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <div className="h-6 w-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <h5 className="font-semibold text-slate-800 text-[11px] font-display mt-2">{t.valueProp3}</h5>
                  <p className="text-[10px] text-slate-500 leading-normal">{t.valueProp3Desc}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Problema & Impacto */}
          <motion.section 
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <AlertCircle className="h-5 w-5 text-emerald-600" />
              <h2 className="font-display font-bold text-base text-slate-800">
                2. {t.nav2}
              </h2>
            </div>
            <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
              <p>{t.problemNarrative}</p>
              <p>{t.problemNarrative2}</p>
            </div>

            {/* Impact stats dynamic board */}
            <div className="bg-slate-55 rounded-2xl border border-slate-150 p-4 font-mono font-bold leading-none text-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50">
              <div className="text-center p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <p className="text-2xl text-rose-500 font-display font-bold">{t.stat1Val}</p>
                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wide leading-tight">{t.stat1Lbl}</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <p className="text-2xl text-emerald-600 font-display font-bold">{t.stat2Val}</p>
                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wide leading-tight">{t.stat2Lbl}</p>
              </div>
              <div className="text-center p-2 rounded-xl bg-white border border-slate-100 shadow-2xs">
                <p className="text-2xl text-blue-600 font-display font-bold">{t.stat3Val}</p>
                <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-wide leading-tight">{t.stat3Lbl}</p>
              </div>
            </div>
          </motion.section>

          {/* Section 4: Arquitetura */}
          <motion.section 
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Layers className="h-5 w-5 text-emerald-600" />
              <h2 className="font-display font-bold text-base text-slate-800">
                4. {t.nav4}
              </h2>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.archDesc}
            </p>

            {/* Micro Flowchart Container */}
            <div className="bg-slate-50 border border-slate-150 rounded-2xl p-4 overflow-x-auto">
              <div className="min-w-[420px] py-4 flex items-center justify-around font-mono text-[9px] text-slate-600 text-center leading-none">
                
                {/* Client / User Node */}
                <div className="flex flex-col items-center max-w-[120px] group">
                  <div className="h-10 w-10 bg-white border border-slate-250 rounded-xl flex items-center justify-center text-slate-700 shadow-xs mb-2 group-hover:border-emerald-500 transition-colors">
                    <Users className="h-5 w-5 text-slate-500" />
                  </div>
                  <span className="font-bold text-slate-800 text-[10px]">Utilizador / Front-End</span>
                  <span className="text-slate-400 text-[8px] mt-1">Navegador (React/Vite)</span>
                </div>

                <div className="text-slate-300 flex items-center">
                  <div className="w-10 border-b border-dashed border-slate-350 relative text-[8px] text-slate-400 flex flex-col items-center">
                    <span className="-top-3 text-[7px] text-center">Ações</span>
                    <ArrowRight className="h-3 w-3 mt-1 text-slate-300" />
                  </div>
                </div>

                {/* Local API / Storage Node */}
                <div className="flex flex-col items-center max-w-[140px] group">
                  <div className="h-10 w-10 bg-white border border-slate-250 rounded-xl flex items-center justify-center text-slate-700 shadow-xs mb-2 group-hover:border-emerald-500 transition-colors">
                    <Compass className="h-5 w-5 text-emerald-500" />
                  </div>
                  <span className="font-bold text-slate-800 text-[10px]">Dual Sync Cache</span>
                  <span className="text-slate-400 text-[8px] mt-1">LocalStorage / State Engine</span>
                </div>

                <div className="text-slate-300 flex items-center">
                  <div className="w-10 border-b border-dashed border-slate-350 relative text-[8px] text-slate-400 flex flex-col items-center">
                    <span className="-top-3 text-[7px] text-center">Bypass</span>
                    <ArrowRight className="h-3 w-3 mt-1 text-slate-300" />
                  </div>
                </div>

                {/* Cloud Database Node */}
                <div className="flex flex-col items-center max-w-[120px] group">
                  <div className="h-10 w-10 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-white shadow-xs mb-2">
                    <Database className="h-5 w-5 text-emerald-400 animate-pulse" />
                  </div>
                  <span className="font-bold text-slate-100 text-[10px]">Real Supabase</span>
                  <span className="text-slate-500 text-[8px] mt-1">PostgreSQL + RLS Rules</span>
                </div>

              </div>
            </div>

            {/* Full High-Quality ASCII Diagram for pure visual precision */}
            <div className="bg-slate-900 text-emerald-400/90 rounded-2xl p-4 font-mono text-[9.5px] leading-relaxed shadow-inner overflow-hidden select-all whitespace-pre">
{`+-------------------------------------------------------------+
|                  ZERO_WASTE_CONNECT DATA FLOW               |
+-------------------------------------------------------------+
|                                                             |
|  [Donor Profile]  ===> Post Surplus ===> [Cache Engine]     |
|                                                  ||         |
|                                       (Auto Checks State)    |
|                                                  ||         |
|                                                  v          |
|  [Recipient Role] ===> Reserves     ===> [LocalStorage]     |
|                                           (Standard Fallback)|
|                                                  ||         |
|                                           (Real-Time Sync)  |
|                                                  ||         |
|                                                  v          |
|  [Production Cloud Engine] ========> [Supabase PostgreDB]    |
|                                      (RLS & Audit Logs)     |
+-------------------------------------------------------------+`}
            </div>
          </motion.section>

        </div>

        {/* Sidebar details (4 of 12 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 3: Stack Tecnológico */}
          <motion.section 
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Database className="h-4 w-4 text-emerald-600" />
              <h2 className="font-display font-bold text-sm text-slate-800">
                3. {t.nav3}
              </h2>
            </div>
            
            <p className="text-[11px] text-slate-500 leading-normal">
              {t.techRationale}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start space-x-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-bold uppercase font-mono text-[10px]">
                  R
                </div>
                <div className="text-[11px]">
                  <p className="font-bold text-slate-800">React 18 + Vite</p>
                  <p className="text-slate-500 leading-normal mt-0.5">{t.techReactDesc}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-bold uppercase font-mono text-[10px]">
                  T
                </div>
                <div className="text-[11px]">
                  <p className="font-bold text-slate-800">Tailwind CSS v4</p>
                  <p className="text-slate-500 leading-normal mt-0.5">{t.techTailwindDesc}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-bold uppercase font-mono text-[10px]">
                  S
                </div>
                <div className="text-[11px]">
                  <p className="font-bold text-slate-800">Supabase + PostgreSQL</p>
                  <p className="text-slate-500 leading-normal mt-0.5">{t.techSupabaseDesc}</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 font-bold uppercase font-mono text-[10px]">
                  L
                </div>
                <div className="text-[11px]">
                  <p className="font-bold text-slate-800">Leaflet + Maps</p>
                  <p className="text-slate-500 leading-normal mt-0.5">{t.techLeafletDesc}</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 5: Futuro do Projeto */}
          <motion.section 
            whileHover={{ y: -2 }}
            className="bg-white rounded-2xl border border-slate-200/70 p-5 shadow-xs space-y-4"
          >
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-100">
              <Lightbulb className="h-4 w-4 text-emerald-600" />
              <h2 className="font-display font-bold text-sm text-slate-800">
                5. {t.nav5}
              </h2>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal">
              {t.futureRoadmap}
            </p>

            <div className="space-y-3 pt-1">
              <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-emerald-800 font-display flex items-center gap-1">
                  <Cpu className="h-3 w-3 inline" />
                  <span>{t.stepAI}</span>
                </p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{t.stepAIDesc}</p>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-emerald-800 font-display flex items-center gap-1">
                  <Award className="h-3 w-3 inline" />
                  <span>{t.stepGamify}</span>
                </p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{t.stepGamifyDesc}</p>
              </div>

              <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl space-y-1">
                <p className="text-[11px] font-bold text-emerald-800 font-display flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 inline" />
                  <span>{t.stepCold}</span>
                </p>
                <p className="text-[10px] text-slate-600 leading-relaxed">{t.stepColdDesc}</p>
              </div>
            </div>
          </motion.section>

        </div>

      </div>
    </motion.div>
  );
}
