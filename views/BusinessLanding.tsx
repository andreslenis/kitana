import React, { useState } from 'react';
import { ArrowRight, Check, X, Star, Shield, Zap, TrendingUp, Users, DollarSign, Lock, BarChart3, LayoutDashboard, ChevronRight, ArrowLeft, Building, Play, ShieldCheck, Mail, Send, Home } from 'lucide-react';

interface BusinessLandingProps {
  onBack: () => void;
  onRegister: () => void;
}

const BusinessLanding: React.FC<BusinessLandingProps> = ({ onBack, onRegister }) => {
  const [isRequestingAccess, setIsRequestingAccess] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  
  // Form State
  const [formData, setFormData] = useState({
      businessName: '',
      contactName: '',
      email: '',
      city: '',
      category: 'Club/Bar'
  });

  // --- ROI CALCULATOR STATE ---
  const [eventsPerMonth, setEventsPerMonth] = useState(4);
  const [ticketsPerEvent, setTicketsPerEvent] = useState(80);
  const [ticketPrice, setTicketPrice] = useState(150000); // COP

  const formatCOP = (val: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  // Calculations
  const monthlyRevenue = eventsPerMonth * ticketsPerEvent * ticketPrice;
  const adsCost = 2000000; 
  const traditionalFeePercent = 0.15; 
  const traditionalFeeCost = monthlyRevenue * traditionalFeePercent;
  const totalCostTraditional = adsCost + traditionalFeeCost;
  const netTraditional = monthlyRevenue - totalCostTraditional;

  const kitanaSub = 300000; 
  const kitanaFeePercent = 0.12; 
  const kitanaFeeCost = monthlyRevenue * kitanaFeePercent;
  const totalCostKitana = kitanaSub + kitanaFeeCost;
  const netKitana = monthlyRevenue - totalCostKitana;

  const monthlySavings = netKitana - netTraditional;

  const handleRequestSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setRequestStatus('sending');
      // Simulate API call
      setTimeout(() => {
          setRequestStatus('sent');
      }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans relative overflow-x-hidden animate-fade-in">
      
      {/* HEADER NAV */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-black font-black">K</div>
            <span className="font-bold text-white tracking-widest text-xs md:text-sm hidden sm:block">KITANA <span className="text-amber-500">PARTNERS</span></span>
          </div>
          <div className="flex gap-3 items-center">
              <button onClick={onBack} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition">
                  <Home size={14} /> <span className="hidden sm:inline">Inicio</span>
              </button>
              <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
              <button onClick={onRegister} className="text-xs font-bold text-slate-400 hover:text-white hidden sm:block">Login</button>
              <button onClick={() => setIsRequestingAccess(true)} className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-amber-500 transition shadow-lg shadow-white/10">Solicitar Acceso</button>
          </div>
      </nav>

      {/* 1. HERO SECTION */}
      <header className="relative pt-32 pb-20 px-4 md:px-8 border-b border-slate-900 w-full overflow-hidden">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-slide-in-right relative z-10">
                  <div className="inline-flex items-center gap-2 bg-amber-900/20 border border-amber-500/30 px-3 py-1 rounded-full text-amber-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                      <Zap size={12} fill="currentColor" /> Nueva Plataforma B2B
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight">
                      Llena tus eventos <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">sin gastar en publicidad</span>
                  </h1>
                  <p className="text-sm md:text-lg text-slate-400 leading-relaxed max-w-md">
                      Únete a la red privada donde <strong>2,000+ personas verificadas</strong> y pre-calificadas buscan experiencias exclusivas como la tuya.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button onClick={() => setIsRequestingAccess(true)} className="bg-amber-500 hover:bg-amber-400 text-black px-8 py-4 rounded-xl font-bold text-base md:text-lg flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/20 group w-full sm:w-auto">
                          Empieza Aquí
                          <ArrowRight className="group-hover:translate-x-1 transition" size={20} />
                      </button>
                      <p className="text-xs text-slate-500 text-center sm:text-left mt-2 sm:mt-0 flex items-center gap-2 justify-center sm:justify-start">
                          <Check size={12} className="text-green-500"/> Verificación requerida
                      </p>
                  </div>
              </div>

              {/* VISUAL MOCKUP */}
              <div className="relative animate-fade-in-down delay-100 hidden lg:block">
                  <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full"></div>
                  <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 rotate-3 hover:rotate-0 transition duration-500 max-w-md mx-auto">
                      {/* Fake Dashboard UI */}
                      <div className="flex justify-between items-center mb-6">
                          <div className="flex items-center gap-2 text-white font-bold"><LayoutDashboard size={18} className="text-amber-500"/> Dashboard</div>
                          <div className="text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded border border-green-500/30 font-bold flex items-center gap-1"><TrendingUp size={12}/> +124% vs mes anterior</div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-black p-4 rounded-xl border border-slate-800">
                              <p className="text-slate-500 text-xs uppercase font-bold">Ventas Totales</p>
                              <p className="text-2xl font-black text-white mt-1">$12.4M</p>
                          </div>
                          <div className="bg-black p-4 rounded-xl border border-slate-800">
                              <p className="text-slate-500 text-xs uppercase font-bold">Asistentes</p>
                              <div className="flex -space-x-2 mt-2">
                                  {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-black"></div>)}
                                  <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-black flex items-center justify-center text-[10px] text-white font-bold">+140</div>
                              </div>
                          </div>
                      </div>
                      <div className="bg-slate-800 h-32 rounded-xl flex items-end p-2 gap-2">
                          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                              <div key={i} className="flex-1 bg-amber-500 rounded-t-sm opacity-80 hover:opacity-100 transition" style={{height: `${h}%`}}></div>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </header>

      {/* 2. AGITATE (PROBLEM) */}
      <section className="py-20 bg-slate-950 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">¿Te suena familiar esta historia?</h2>
              <p className="text-slate-400 text-sm md:text-base">Gestionar eventos nocturnos o exclusivos es agotador cuando las herramientas juegan en tu contra.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                  { icon: DollarSign, title: "Ads sin Retorno", desc: "Gastas millones en Meta/Google Ads y solo consigues likes, no ventas reales." },
                  { icon: Users, title: "Público Incorrecto", desc: "Tus eventos se llenan de gente que no consume ni aporta al ambiente que curaste." },
                  { icon: Lock, title: "Filtrado Manual", desc: "Pierdes horas validando perfiles en Instagram para evitar colados indeseados." },
                  { icon: TrendingUp, title: "Sin Retención", desc: "No tienes herramientas para fidelizar a tus mejores clientes (VIPs)." },
              ].map((item, idx) => (
                  <div key={idx} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 hover:border-red-500/30 transition group">
                      <div className="bg-slate-950 w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
                          <item.icon className="text-red-500" size={24} />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
              ))}
          </div>
      </section>

      {/* 3. SOLUTION */}
      <section className="py-20 px-4 md:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-slate-900"></div>
          <div className="max-w-5xl mx-auto relative z-10">
              <div className="text-center mb-16">
                  <span className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2 block">La Solución Kitana</span>
                  <h2 className="text-3xl md:text-4xl font-black text-white">Tu ecosistema todo-en-uno</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-8">
                      <div className="flex gap-4">
                          <div className="bg-green-500/10 p-3 rounded-xl h-fit border border-green-500/20"><ShieldCheck className="text-green-500" size={24}/></div>
                          <div>
                              <h3 className="text-xl font-bold text-white mb-2">Comunidad Pre-calificada</h3>
                              <p className="text-slate-400 text-sm">Solo usuarios con identidad verificada (ID + Selfie + IA). Adiós perfiles falsos, adiós problemas de seguridad.</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <div className="bg-amber-500/10 p-3 rounded-xl h-fit border border-amber-500/20"><Star className="text-amber-500" size={24}/></div>
                          <div>
                              <h3 className="text-xl font-bold text-white mb-2">Reputación (Trust Score)</h3>
                              <p className="text-slate-400 text-sm">Conoce el historial de comportamiento de tus asistentes antes de que crucen la puerta.</p>
                          </div>
                      </div>
                      <div className="flex gap-4">
                          <div className="bg-blue-500/10 p-3 rounded-xl h-fit border border-blue-500/20"><Zap className="text-blue-500" size={24}/></div>
                          <div>
                              <h3 className="text-xl font-bold text-white mb-2">Herramientas de Venta</h3>
                              <p className="text-slate-400 text-sm">Códigos VIP secretos, Early Birds automáticos y Listas de Espera inteligentes.</p>
                          </div>
                      </div>
                  </div>

                  {/* Feature Highlight Box */}
                  <div className="bg-gradient-to-br from-slate-800 to-black p-8 rounded-3xl border border-slate-700 relative overflow-hidden flex flex-col justify-center">
                       <div className="absolute top-0 right-0 p-12 bg-amber-500/10 blur-3xl rounded-full"></div>
                       <h3 className="text-2xl font-bold text-white mb-4 relative z-10">Modelo Justo</h3>
                       <p className="text-slate-300 mb-6 relative z-10">
                           Cobra directamente a tus usuarios. Nosotros solo tomamos una pequeña comisión por éxito.
                       </p>
                       <ul className="space-y-3 relative z-10">
                           <li className="flex items-center gap-2 text-white"><Check size={16} className="text-amber-500"/> <span>Sin costos de instalación</span></li>
                           <li className="flex items-center gap-2 text-white"><Check size={16} className="text-amber-500"/> <span>Sin contratos forzosos</span></li>
                           <li className="flex items-center gap-2 text-white"><Check size={16} className="text-amber-500"/> <span>Pagos semanales</span></li>
                       </ul>
                  </div>
              </div>
          </div>
      </section>

      {/* 4. SOCIAL PROOF */}
      <section className="py-20 bg-slate-950 border-y border-slate-900 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-8">Confían en nosotros</p>
              <div className="flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 mb-12">
                 {/* Fake Logos using Text for Demo */}
                 {['Velvet Lounge', 'The Mansion', 'Secret Rooftop', 'Eclipse Club', 'Oasis'].map(name => (
                     <span key={name} className="text-lg md:text-xl font-black text-white">{name}</span>
                 ))}
              </div>

              <div className="bg-slate-900 p-6 md:p-8 rounded-2xl border border-slate-800 relative max-w-2xl mx-auto">
                  <div className="text-amber-500 text-4xl font-serif absolute top-4 left-6">"</div>
                  <p className="text-base md:text-lg text-white font-medium italic mb-6 relative z-10">
                      En mi primer mes vendí 180 entradas. Con la comisión del 12% vs el 25% que gastaba entre ads y ticketeras, <strong>ahorré $2.5M COP</strong> y la calidad de la gente fue increíble.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white">V</div>
                      <div className="text-left">
                          <p className="text-sm font-bold text-white">Gerente General</p>
                          <p className="text-xs text-slate-500">Velvet Lounge, Bogotá</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. ROI CALCULATOR */}
      <section className="py-20 px-4 md:px-8 bg-black">
          <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Calcula tus ganancias</h2>
                  <p className="text-slate-400">Compara Kitana vs. el modelo tradicional (Ads + Ticketera)</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-800 shadow-2xl">
                  {/* Inputs */}
                  <div className="space-y-6">
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Eventos por mes</label>
                          <input type="range" min="1" max="12" value={eventsPerMonth} onChange={e => setEventsPerMonth(Number(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mb-2"/>
                          <div className="flex justify-between text-white font-bold"><span>1</span><span className="text-amber-500 text-xl">{eventsPerMonth}</span><span>12</span></div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Entradas por evento</label>
                          <input type="range" min="10" max="500" step="10" value={ticketsPerEvent} onChange={e => setTicketsPerEvent(Number(e.target.value))} className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer mb-2"/>
                          <div className="flex justify-between text-white font-bold"><span>10</span><span className="text-amber-500 text-xl">{ticketsPerEvent}</span><span>500</span></div>
                      </div>
                      <div>
                          <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Precio Ticket (COP)</label>
                          <div className="bg-black border border-slate-700 rounded-xl px-4 py-3 flex items-center gap-2">
                              <span className="text-slate-500">$</span>
                              <input type="number" value={ticketPrice} onChange={e => setTicketPrice(Number(e.target.value))} className="bg-transparent text-white font-bold w-full outline-none"/>
                          </div>
                      </div>
                  </div>

                  {/* Results */}
                  <div className="space-y-4">
                      <div className="bg-black/40 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                          <div>
                              <p className="text-slate-400 text-xs">Ingresos Brutos</p>
                              <p className="text-xl font-bold text-white">{formatCOP(monthlyRevenue)}</p>
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl border border-red-900/30 bg-red-900/10">
                              <p className="text-red-400 text-xs font-bold uppercase mb-1">Tradicional</p>
                              <p className="text-slate-400 text-[10px] mb-2">Ads ($2M) + Fee 15%</p>
                              <p className="text-lg font-bold text-white">{formatCOP(netTraditional)}</p>
                              <p className="text-[10px] text-red-400 mt-1">Costos: {formatCOP(totalCostTraditional)}</p>
                          </div>
                          
                          <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 relative overflow-hidden">
                              <div className="absolute top-0 right-0 bg-green-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-bl">WINNER</div>
                              <p className="text-green-400 text-xs font-bold uppercase mb-1">Kitana Pro</p>
                              <p className="text-slate-400 text-[10px] mb-2">Sub ($300k) + Fee 12%</p>
                              <p className="text-2xl font-black text-white">{formatCOP(netKitana)}</p>
                              <p className="text-[10px] text-green-400 mt-1">Costos: {formatCOP(totalCostKitana)}</p>
                          </div>
                      </div>

                      <div className="bg-amber-500 p-4 rounded-xl text-center shadow-lg shadow-amber-500/20 transform scale-105">
                          <p className="text-black text-xs font-bold uppercase mb-1">Tu ahorro mensual extra</p>
                          <p className="text-3xl font-black text-black">{formatCOP(monthlySavings)}</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 6. TRUST & SECURITY */}
      <section className="py-20 bg-slate-950 border-y border-slate-900 px-4 md:px-8">
           <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
               <div className="flex flex-col items-center gap-3">
                   <div className="bg-slate-900 p-4 rounded-full border border-slate-800"><Lock size={24} className="text-slate-300"/></div>
                   <h4 className="font-bold text-white">Privacidad Total</h4>
                   <p className="text-sm text-slate-500">Tus datos y lista de clientes están encriptados y protegidos.</p>
               </div>
               <div className="flex flex-col items-center gap-3">
                   <div className="bg-slate-900 p-4 rounded-full border border-slate-800"><BarChart3 size={24} className="text-slate-300"/></div>
                   <h4 className="font-bold text-white">Dueño de tu Data</h4>
                   <p className="text-sm text-slate-500">Exporta tu base de clientes (CSV) cuando quieras. Sin secuestros.</p>
               </div>
               <div className="flex flex-col items-center gap-3">
                   <div className="bg-slate-900 p-4 rounded-full border border-slate-800"><DollarSign size={24} className="text-slate-300"/></div>
                   <h4 className="font-bold text-white">Pagos Rápidos</h4>
                   <p className="text-sm text-slate-500">Dispersión de fondos en 3-7 días hábiles (vs 30 días en otros).</p>
               </div>
           </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-24 px-4 md:px-8 relative overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-black"></div>
           <div className="max-w-3xl mx-auto text-center relative z-10">
               <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Únete a los Founding Partners</h2>
               <p className="text-lg md:text-xl text-slate-300 mb-8">
                   Solo quedan <span className="text-amber-500 font-bold">43 lugares</span> para este trimestre. Asegura tu tarifa preferencial de por vida.
               </p>
               
               <button onClick={() => setIsRequestingAccess(true)} className="w-full md:w-auto bg-white text-black px-12 py-5 rounded-full font-black text-xl hover:scale-105 transition shadow-2xl shadow-white/10 mb-4">
                   Solicitar Acceso
               </button>
               
               <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-slate-500">
                   <span className="flex items-center gap-1"><Check size={14}/> Configuración en 5 min</span>
                   <span className="flex items-center gap-1"><Check size={14}/> Primer evento sin comisión</span>
               </div>
           </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black py-12 border-t border-slate-900 text-center px-4">
          <p className="text-slate-600 text-sm">© 2024 Kitana Partners. Todos los derechos reservados.</p>
      </footer>

      {/* --- REQUEST ACCESS MODAL --- */}
      {isRequestingAccess && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-slate-900 w-full max-w-md rounded-2xl border border-slate-800 shadow-2xl relative">
                  <button onClick={() => setIsRequestingAccess(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white"><X size={20}/></button>
                  
                  {requestStatus === 'sent' ? (
                      <div className="p-10 text-center animate-fade-in-down">
                          <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                              <Check size={32} strokeWidth={3} />
                          </div>
                          <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
                          <p className="text-slate-400 text-sm mb-6">
                              Hemos recibido tu interés. Nuestro equipo de onboarding revisará tu perfil y te enviaremos tu código de acceso único al correo <strong>{formData.email}</strong> en menos de 24 horas.
                          </p>
                          <button onClick={() => { setIsRequestingAccess(false); setRequestStatus('idle'); }} className="bg-slate-800 text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-slate-700">Entendido</button>
                      </div>
                  ) : (
                      <div className="p-8">
                          <div className="flex items-center gap-2 mb-6">
                              <Building className="text-amber-500" size={24} />
                              <h3 className="text-xl font-bold text-white">Aplica como Partner</h3>
                          </div>
                          <p className="text-sm text-slate-400 mb-6">Para mantener la calidad de la red, todos los establecimientos requieren aprobación previa. Recibirás tu código por email.</p>
                          
                          <form onSubmit={handleRequestSubmit} className="space-y-4">
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nombre del Establecimiento</label>
                                  <input required value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="Ej: Velvet Lounge"/>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                  <div>
                                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Tu Nombre</label>
                                      <input required value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white text-sm outline-none" placeholder="Nombre completo"/>
                                  </div>
                                  <div>
                                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Ciudad</label>
                                      <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-black border border-slate-700 rounded-lg p-3 text-white text-sm outline-none" placeholder="Ej: Bogotá"/>
                                  </div>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Correo Corporativo</label>
                                  <div className="relative">
                                      <Mail size={16} className="absolute left-3 top-3.5 text-slate-500" />
                                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-black border border-slate-700 rounded-lg pl-10 pr-3 py-3 text-white text-sm focus:border-amber-500 outline-none" placeholder="gerencia@tunegocio.com"/>
                                  </div>
                              </div>
                              
                              <button disabled={requestStatus === 'sending'} type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 transition disabled:opacity-50">
                                  {requestStatus === 'sending' ? 'Enviando...' : <><Send size={16}/> Solicitar Código</>}
                              </button>
                          </form>
                      </div>
                  )}
              </div>
          </div>
      )}

    </div>
  );
};

export default BusinessLanding;