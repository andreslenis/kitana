import React, { useState } from 'react';
import { User, SubscriptionTier, ProfileType } from '../types';
import { Check, X, Crown, Shield, Star, Zap, Gift, Copy, ArrowLeft, Rocket, Briefcase, TrendingUp, BarChart2, Ticket, Video, Calculator, DollarSign, PieChart, Users, Building, Globe, Calendar, Package, Megaphone, Smartphone, LineChart, Palette, Search, Sparkles } from 'lucide-react';

interface MembershipViewProps {
  user: User;
  onBack: () => void;
}

const MembershipView: React.FC<MembershipViewProps> = ({ user, onBack }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const isBusiness = user.profileType === ProfileType.BUSINESS;

  // --- ROI CALCULATOR STATE (COP Defaults) ---
  const [roiEvents, setRoiEvents] = useState(4);
  const [roiTickets, setRoiTickets] = useState(50);
  const [roiPrice, setRoiPrice] = useState(150000); // Precio promedio ticket COP

  // --- MARKETPLACE STATE ---
  const [activeCategory, setActiveCategory] = useState('bundles');

  // Helper for COP formatting
  const formatCOP = (val: number) => {
      if (val === 0) return 'Gratis';
      return new Intl.NumberFormat('es-CO', {
          style: 'currency',
          currency: 'COP',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
      }).format(val);
  };

  // --- ASYMMETRIC BUSINESS MODEL CONFIGURATION ---

  // 1. BUSINESS PLANS (SaaS Model - 4 TIERS)
  const businessPlans = [
      {
          id: SubscriptionTier.BIZ_BASIC,
          name: 'Básico',
          price: 0,
          commission: '18%',
          features: [
              'Perfil Básico (1 foto, 200 caract.)',
              'Max 2 eventos al mes',
              'Analytics Básico (Ventas)',
              'Pagos Net-15 (Quincenal)'
          ],
          limitations: [
              'Sin códigos de invitación',
              'Sin base de datos de clientes'
          ],
          color: 'bg-slate-800',
          textColor: 'text-slate-400',
          button: 'Probar Gratis'
      },
      {
          id: SubscriptionTier.BIZ_PROFESSIONAL,
          name: 'Profesional',
          price: 300000,
          commission: '12%',
          features: [
              'Eventos Ilimitados',
              'Perfil Destacado (10 fotos + video)',
              '25 Códigos VIP mensuales',
              'Analytics Demográfico',
              'Pagos Net-7 (Semanal)'
          ],
          color: 'bg-gradient-to-b from-blue-900/40 to-slate-900 border-blue-500/50',
          textColor: 'text-blue-400',
          bestValue: true,
          button: 'Mejorar a Pro'
      },
      {
          id: SubscriptionTier.BIZ_ELITE,
          name: 'Elite',
          price: 900000,
          commission: '6%',
          features: [
              'Comisión Ultra-Baja (6%)',
              'Códigos VIP Ilimitados',
              'CRM Completo + Email Marketing',
              '2 Promociones Home al mes',
              'Pagos Net-3 (Rápido)'
          ],
          color: 'bg-gradient-to-b from-amber-900/40 to-black border-amber-500',
          textColor: 'text-amber-500',
          button: 'Escalar a Elite'
      },
      {
          id: SubscriptionTier.BIZ_ENTERPRISE,
          name: 'Enterprise',
          price: 3000000, // Starts at
          commission: '3-5%',
          features: [
              'Comisión Negociada',
              'Marca Blanca (White-label)',
              'Integración POS/API',
              'Dashboard Multi-Sede',
              'Pagos Net-1 (Día siguiente)'
          ],
          color: 'bg-gradient-to-b from-slate-800 to-black border-slate-600',
          textColor: 'text-white',
          button: 'Contactar Ventas'
      }
  ];

  // 2. USER POWER-UPS (A la carte)
  const userPowerUps = [
      { 
          title: 'Verificación Élite (L4)', 
          price: 50000, 
          icon: Video, 
          desc: 'Máxima credibilidad. Valida tu identidad vía video y transmite seguridad absoluta.',
          type: 'pago único' 
      },
      { 
          title: 'Spotlight Semanal', 
          price: 35000, 
          icon: Rocket, 
          desc: 'Hazte visible. Aparece en la portada de Explorar y atrae miradas durante 7 días.',
          type: 'semanal'
      },
      { 
          title: 'Círculo Interior (VIP)', 
          price: 180000, 
          icon: Crown, 
          desc: 'Trato preferente. Soporte prioritario, acceso anticipado y privilegios en eventos.',
          type: 'anual'
      },
  ];

  // 3. BUSINESS MARKETPLACE ITEMS
  const marketplaceCategories = [
      { id: 'bundles', label: 'Paquetes', icon: Package },
      { id: 'marketing', label: 'Marketing', icon: Megaphone },
      { id: 'sales', label: 'Ventas', icon: Ticket },
      { id: 'experience', label: 'Experiencia', icon: Smartphone },
      { id: 'data', label: 'Data & Insights', icon: LineChart },
      { id: 'services', label: 'Servicios', icon: Palette },
  ];

  const marketplaceItems = [
      // BUNDLES (Diseñados estratégicamente)
      {
          category: 'bundles',
          title: 'Pack Lanzamiento',
          price: 550000,
          originalPrice: 650000,
          desc: 'Todo lo necesario para arrancar con fuerza tu primer evento.',
          features: ['Diseño Flyer Pro ($450k)', 'Promo Instagram ($150k)', 'Early Bird Auto ($50k)'],
          isBestSeller: true
      },
      {
          category: 'bundles',
          title: 'Pack Growth',
          price: 500000,
          originalPrice: 630000,
          desc: 'Maximiza el alcance y asegura la asistencia.',
          features: ['Email Blast (5k users) ($300k)', 'Push Notif. ($80k)', 'Destacado Categoría ($250k)'],
      },
      {
          category: 'bundles',
          title: 'Pack Pro (Sold Out)',
          price: 750000,
          originalPrice: 990000,
          desc: 'Dominancia total en la plataforma y optimización.',
          features: ['Portada Home 24h ($600k)', 'Predicción IA ($300k)', 'Lista Espera Auto ($90k)'],
      },

      // 1. VISIBILIDAD Y MARKETING
      { category: 'marketing', title: 'Promo Instagram', price: 150000, unit: '/evento', desc: 'Mención en historias y post de @KitanaApp.' },
      { category: 'marketing', title: 'Email Blast', price: 300000, unit: '/envío', desc: 'Directo a 5,000 usuarios segmentados por ciudad.' },
      { category: 'marketing', title: 'Push Notification', price: 80000, unit: '/envío', desc: 'Alerta instantánea "Cerca de ti" a móviles.' },
      { category: 'marketing', title: 'Portada Home 24h', price: 600000, unit: '/día', desc: 'Tu evento en la cabecera principal de la app.' },
      { category: 'marketing', title: 'Destacado Categoría', price: 250000, unit: '/semana', desc: 'Top 1 en búsquedas (Ej: BDSM, Swinger).' },

      // 2. HERRAMIENTAS DE VENTA
      { category: 'sales', title: 'Early Bird Auto', price: 50000, unit: '/evento', desc: 'Sube precios automáticamente según demanda.' },
      { category: 'sales', title: 'Cupones Personalizados', price: 0, unit: '/evento', desc: 'Códigos trackeables (Ej: AMIGOS10).' },
      { category: 'sales', title: 'Preventa VIP', price: 80000, unit: '/evento', desc: 'Acceso exclusivo 24h antes para usuarios L3/L4.' },
      { category: 'sales', title: 'Ventas Flash', price: 120000, unit: '/evento', desc: 'Notificación de urgencia a tus seguidores.' },

      // 3. EXPERIENCIA DEL EVENTO
      { category: 'experience', title: 'App Staff Check-in', price: 150000, unit: '/mes', desc: 'Escáner QR ilimitado para tu equipo de puerta.' },
      { category: 'experience', title: 'Encuestas Post-Evento', price: 60000, unit: '/evento', desc: 'Feedback automatizado de asistentes.' },
      { category: 'experience', title: 'Galería Privada', price: 180000, unit: '/evento', desc: 'Fotos seguras compartidas solo con asistentes.' },
      { category: 'experience', title: 'Lista de Espera Auto', price: 90000, unit: '/evento', desc: 'Gestión inteligente de cupos liberados.' },

      // 4. DATOS E INSIGHTS
      { category: 'data', title: 'Reporte Competencia', price: 250000, unit: '/mes', desc: 'Análisis de eventos similares y audiencias.' },
      { category: 'data', title: 'Benchmarking Precios', price: 150000, unit: '/mes', desc: 'Comparativa de precios de mercado.' },
      { category: 'data', title: 'Predicción Demanda IA', price: 300000, unit: '/mes', desc: 'Forecast de asistencia basado en histórico.' },
      { category: 'data', title: 'Exportar Data CRM', price: 0, unit: '/mes', desc: 'Descarga CSV/Excel de tus clientes (Solo Elite).' },

      // 5. SERVICIOS PREMIUM
      { category: 'services', title: 'Diseño Flyer Pro', price: 450000, unit: 'único', desc: 'Arte gráfico optimizado para conversión.' },
      { category: 'services', title: 'Fotografía Local', price: 900000, unit: 'sesión', desc: 'Shooting profesional de tu espacio.' },
      { category: 'services', title: 'Video Promo 30s', price: 1800000, unit: 'único', desc: 'Producción audiovisual de alto impacto.' },
      { category: 'services', title: 'Consultoría Mkt 1h', price: 600000, unit: 'hora', desc: 'Asesoría estratégica para llenar tu evento.' },
  ];

  // ROI CALCULATION LOGIC
  const calculateROI = () => {
      const grossRevenue = roiEvents * roiTickets * roiPrice;
      
      // Basic
      const costBasic = grossRevenue * 0.18;
      const profitBasic = grossRevenue - costBasic;

      // Professional
      const costPro = (grossRevenue * 0.12) + 300000;
      const profitPro = grossRevenue - costPro;

      // Elite
      const costElite = (grossRevenue * 0.06) + 900000;
      const profitElite = grossRevenue - costElite;

      return { grossRevenue, profitBasic, profitPro, profitElite };
  };

  const roiData = calculateROI();

  return (
    <div className="min-h-screen bg-black text-slate-200 pb-20 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-slate-800 p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-800 transition"><ArrowLeft size={20}/></button>
        <h1 className="font-bold text-white text-lg">
            {isBusiness ? 'Soluciones para Negocios' : 'Tu Experiencia'}
        </h1>
      </div>

      <div className="p-4 space-y-8 max-w-lg mx-auto">
        
        {/* --- USERS VIEW: ALWAYS FREE MANIFESTO --- */}
        {!isBusiness && (
            <>
                <div className="bg-gradient-to-br from-green-900/20 to-slate-900 rounded-3xl p-6 border border-green-500/30 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 bg-green-500/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold mb-4 border border-green-500/20">
                            <Check size={12} strokeWidth={4} /> TU PASAPORTE DIGITAL
                        </div>
                        <h2 className="text-2xl font-black text-white mb-2 leading-tight">Libertad para Explorar.</h2>
                        <p className="text-sm text-slate-300 mb-6">Creemos que las conexiones auténticas no deben tener barreras. Disfruta la esencia de Kitana sin costo.</p>
                        
                        <div className="grid grid-cols-1 gap-3">
                            {[
                                'Perfil completo y Galería sin límites',
                                'Verificación de Identidad Esencial',
                                'Chat Privado Seguro e Ilimitado',
                                'Acceso Global a la Comunidad',
                                'Tickets a Eventos (Sin tarifas ocultas)'
                            ].map((feat, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-white">
                                    <div className="bg-green-900/50 p-1 rounded-full"><Check size={12} className="text-green-400"/></div>
                                    {feat}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><Zap className="text-amber-500" size={20} /> Eleva tu Estatus (Opcional)</h3>
                    <p className="text-xs text-slate-500 mb-4">Herramientas exclusivas para quienes buscan destacar y generar confianza inmediata.</p>
                    
                    <div className="space-y-3">
                        {userPowerUps.map((item, idx) => (
                            <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center group hover:border-amber-500/50 transition cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-amber-500/20 group-hover:text-amber-500 transition text-slate-400">
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{item.title}</h4>
                                        <p className="text-[10px] text-slate-400 max-w-[180px] leading-tight mt-1">{item.desc}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-white text-sm">{formatCOP(item.price)}</span>
                                    <span className="text-[10px] text-slate-500 uppercase">{item.type}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}

        {/* --- BUSINESS VIEW: 4 TIERS & ROI CALCULATOR --- */}
        {isBusiness && (
            <>
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Escala tu Negocio</h2>
                    <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">Herramientas diseñadas para maximizar tus ingresos y fidelizar a tu audiencia.</p>
                </div>

                <div className="flex justify-center mb-8">
                    <div className="bg-slate-900 p-1 rounded-xl flex border border-slate-800">
                        <button className="px-6 py-2 rounded-lg text-sm font-bold bg-slate-700 text-white shadow">Mensual</button>
                    </div>
                </div>

                {/* --- BUSINESS PLANS GRID --- */}
                <div className="grid grid-cols-1 gap-6">
                    {businessPlans.map(plan => {
                        const isCurrent = user.subscriptionTier === plan.id || (plan.id === SubscriptionTier.BIZ_BASIC && !user.subscriptionTier);
                        
                        return (
                            <div key={plan.id} className={`rounded-2xl p-6 border relative overflow-hidden transition-all ${plan.color} ${isCurrent ? 'opacity-100 ring-2 ring-white/20' : 'opacity-90 hover:opacity-100'}`}>
                                {plan.bestValue && <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">POPULAR</div>}
                                
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className={`font-black text-xl flex items-center gap-2 ${plan.textColor}`}>
                                            {plan.name}
                                        </h3>
                                        <div className="flex items-baseline gap-1 mt-1">
                                            <span className="text-2xl font-bold text-white">{formatCOP(plan.price)}</span>
                                            {plan.price > 0 && <span className="text-xs text-slate-400">/mes</span>}
                                        </div>
                                    </div>
                                    <div className="text-right bg-black/20 p-2 rounded-lg backdrop-blur-sm">
                                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Comisión</span>
                                        <p className="text-lg font-black text-white">{plan.commission}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <ul className="space-y-2">
                                        {plan.features.map((feat, i) => (
                                            <li key={i} className="flex items-start gap-3 text-sm text-white">
                                                <Check size={14} className="text-green-400 mt-0.5 shrink-0" />
                                                <span>{feat}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {plan.limitations && (
                                        <ul className="space-y-2 pt-2 border-t border-white/10">
                                            {plan.limitations.map((lim, i) => (
                                                <li key={i} className="flex items-start gap-3 text-xs text-slate-400">
                                                    <X size={14} className="text-slate-500 mt-0.5 shrink-0" />
                                                    <span>{lim}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>

                                <button 
                                    disabled={isCurrent}
                                    className={`w-full py-3 rounded-xl font-bold text-sm transition ${isCurrent ? 'bg-slate-700 text-slate-400 cursor-default' : 'bg-white text-black hover:bg-slate-200 shadow-lg'}`}
                                >
                                    {isCurrent ? 'Tu Plan Actual' : plan.button}
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* --- ROI CALCULATOR --- */}
                <div className="mt-12 bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="bg-slate-950 p-6 border-b border-slate-800">
                        <h3 className="text-white font-bold text-lg flex items-center gap-2">
                            <Calculator className="text-amber-500" /> Calculadora de Ahorro
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Descubre cuánto dinero pierdes en comisiones con cada plan.</p>
                    </div>
                    
                    <div className="p-6">
                        {/* INPUTS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Eventos al mes</label>
                                <div className="flex items-center gap-3 bg-black border border-slate-700 rounded-xl px-3 py-2">
                                    <Calendar size={16} className="text-slate-400"/>
                                    <input type="number" value={roiEvents} onChange={e => setRoiEvents(Number(e.target.value))} className="bg-transparent text-white w-full outline-none font-bold" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Entradas / Evento</label>
                                <div className="flex items-center gap-3 bg-black border border-slate-700 rounded-xl px-3 py-2">
                                    <Users size={16} className="text-slate-400"/>
                                    <input type="number" value={roiTickets} onChange={e => setRoiTickets(Number(e.target.value))} className="bg-transparent text-white w-full outline-none font-bold" />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Precio Promedio</label>
                                <div className="flex items-center gap-3 bg-black border border-slate-700 rounded-xl px-3 py-2">
                                    <DollarSign size={16} className="text-slate-400"/>
                                    <input type="number" value={roiPrice} onChange={e => setRoiPrice(Number(e.target.value))} className="bg-transparent text-white w-full outline-none font-bold" />
                                </div>
                            </div>
                        </div>

                        {/* RESULTS */}
                        <div className="bg-black/50 rounded-xl p-4 mb-6 text-center border border-slate-800">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Ingresos Brutos Estimados</p>
                            <p className="text-3xl font-black text-white mt-1">{formatCOP(roiData.grossRevenue)} <span className="text-xs font-normal text-slate-500">/ mes</span></p>
                        </div>

                        <div className="space-y-3">
                            {/* Basic Result */}
                            <div className="flex justify-between items-center p-3 rounded-lg border border-slate-700/50 bg-slate-800/20 opacity-70">
                                <div className="text-sm font-bold text-slate-400">Plan Básico (Gratis)</div>
                                <div className="text-right">
                                    <div className="text-white font-mono">{formatCOP(roiData.profitBasic)}</div>
                                    <div className="text-[10px] text-red-400">Comisión: {formatCOP(roiData.grossRevenue - roiData.profitBasic)}</div>
                                </div>
                            </div>

                            {/* Pro Result */}
                            <div className={`flex justify-between items-center p-3 rounded-lg border ${roiData.profitPro > roiData.profitBasic ? 'border-blue-500/50 bg-blue-900/10' : 'border-slate-700'}`}>
                                <div>
                                    <div className="text-sm font-bold text-blue-400">Plan Profesional</div>
                                    {roiData.profitPro > roiData.profitBasic && <div className="text-[10px] text-green-400 font-bold">Ahorras {formatCOP(roiData.profitPro - roiData.profitBasic)}/mes</div>}
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-mono font-bold">{formatCOP(roiData.profitPro)}</div>
                                    <div className="text-[10px] text-slate-500">Neto (tras pagar suscripción)</div>
                                </div>
                            </div>

                            {/* Elite Result */}
                            <div className={`flex justify-between items-center p-3 rounded-lg border relative overflow-hidden ${roiData.profitElite > roiData.profitPro ? 'border-amber-500 bg-amber-900/20' : 'border-slate-700'}`}>
                                {roiData.profitElite > roiData.profitPro && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>}
                                <div>
                                    <div className="text-sm font-bold text-amber-500 flex items-center gap-2"><Crown size={14}/> Plan Elite</div>
                                    {roiData.profitElite > roiData.profitPro && <div className="text-[10px] text-amber-300 font-bold">Ganancia Máxima (+{formatCOP(roiData.profitElite - roiData.profitPro)})</div>}
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-white">{formatCOP(roiData.profitElite)}</div>
                                    <div className="text-[10px] text-slate-500">Neto (tras pagar suscripción)</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MARKETPLACE DE POTENCIADORES --- */}
                <div className="mt-12">
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="text-purple-500" />
                        <h2 className="text-2xl font-bold text-white">Marketplace</h2>
                    </div>
                    <p className="text-sm text-slate-400 mb-6">Herramientas a la carta para potenciar eventos específicos.</p>

                    {/* Category Filter */}
                    <div className="flex overflow-x-auto gap-3 pb-4 mb-2 scrollbar-hide">
                        {marketplaceCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                                    activeCategory === cat.id 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-600'
                                }`}
                            >
                                <cat.icon size={14} />
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {marketplaceItems.filter(item => item.category === activeCategory).map((item, idx) => (
                            <div key={idx} className={`bg-slate-900 border rounded-2xl p-5 relative overflow-hidden group ${item.category === 'bundles' ? 'border-purple-500/30' : 'border-slate-800'}`}>
                                {item.category === 'bundles' && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-transparent opacity-50"></div>
                                )}
                                {item.isBestSeller && (
                                    <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-1 rounded-bl-lg z-10">BEST SELLER</div>
                                )}
                                
                                <div className="relative z-10 flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-base ${item.category === 'bundles' ? 'text-purple-400' : 'text-white'}`}>{item.title}</h4>
                                        <p className="text-xs text-slate-400 mt-1 mb-3 pr-4 leading-relaxed">{item.desc}</p>
                                        
                                        {/* Bundle Features */}
                                        {item.features && (
                                            <ul className="space-y-1 mb-3">
                                                {item.features.map((feat, i) => (
                                                    <li key={i} className="flex items-center gap-2 text-[10px] text-slate-300">
                                                        <Check size={10} className="text-purple-500" /> {feat}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="text-right shrink-0">
                                        {item.originalPrice && (
                                            <span className="text-xs text-slate-500 line-through block">{formatCOP(item.originalPrice)}</span>
                                        )}
                                        <span className="text-lg font-black text-white block">{formatCOP(item.price)}</span>
                                        {item.unit && <span className="text-[10px] text-slate-500">{item.unit}</span>}
                                        
                                        <button className="mt-2 bg-slate-800 hover:bg-white hover:text-black text-white text-xs font-bold px-3 py-1.5 rounded-lg transition border border-slate-700">
                                            Adquirir
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default MembershipView;