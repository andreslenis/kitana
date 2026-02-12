import React, { useState } from 'react';
import { LogOut, LayoutDashboard, Key, Users, ShieldCheck, Plus, CheckCircle, Copy, DollarSign, TrendingUp, Ban, Trash2, Lock, Calculator, BarChart3, Activity, PieChart, ArrowUpRight, ArrowDownRight, Filter, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LineChart, Line, AreaChart, Area, PieChart as RePieChart, Pie } from 'recharts';
import { CODES, USERS, EVENTS, TICKETS } from '../data';
import { ProfileType, InvitationCode, User } from '../types';

interface SuperAdminPanelProps {
  onLogout: () => void;
}

const SuperAdminPanel: React.FC<SuperAdminPanelProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('analytics');

  return (
    <div className="min-h-screen bg-black text-slate-200 font-sans">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-red-900/30 p-2 rounded-lg border border-red-900/50">
             <ShieldCheck className="text-red-500 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-white font-bold leading-tight">Panel SuperAdmin</h1>
            <p className="text-xs text-slate-500">Control total de Kitana</p>
          </div>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-red-500 hover:text-red-400 text-sm font-medium">
          <LogOut size={16} /> Salir
        </button>
      </header>

      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 sticky top-16 z-40 backdrop-blur-md">
        <div className="flex px-6 gap-8 overflow-x-auto">
          {[
            { id: 'analytics', label: 'Analytics & KPIs', icon: BarChart3 },
            { id: 'finance', label: 'Revenue', icon: DollarSign },
            { id: 'users', label: 'Usuarios', icon: Users },
            { id: 'codes', label: 'Growth', icon: Key },
            { id: 'verifiers', label: 'Seguridad', icon: ShieldCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'finance' && <AdminFinance />}
        {activeTab === 'codes' && <AdminCodes />}
        {activeTab === 'users' && <AdminUsersList />}
        {activeTab === 'verifiers' && <AdminVerifiers />}
      </main>
    </div>
  );
};

// --- NEW COMPONENT: ANALYTICS DASHBOARD ---
const AdminAnalytics: React.FC = () => {
    // Mock Data for Charts
    const retentionData = [
        { day: 'D1', rate: 45 },
        { day: 'D7', rate: 28 },
        { day: 'D14', rate: 22 },
        { day: 'D30', rate: 18 },
    ];

    const growthData = [
        { name: 'Sem 1', organic: 40, referral: 24, paid: 10 },
        { name: 'Sem 2', organic: 55, referral: 38, paid: 15 },
        { name: 'Sem 3', organic: 80, referral: 60, paid: 20 },
        { name: 'Sem 4', organic: 120, referral: 95, paid: 25 },
    ];

    const funnelData = [
        { stage: 'Visitas', count: 5000 },
        { stage: 'Registro', count: 1200 },
        { stage: 'Verificado', count: 800 },
        { stage: '1er Evento', count: 350 },
    ];

    const kpiCards = [
        { title: 'CAC Blended', value: '$4.20', trend: '-12%', status: 'good' },
        { title: 'LTV (Lifetime Value)', value: '$145', trend: '+5%', status: 'good' },
        { title: 'Churn Mensual', value: '4.8%', trend: '+0.2%', status: 'warning' },
        { title: 'Stickiness (DAU/MAU)', value: '22%', trend: '+2%', status: 'good' },
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi, idx) => (
                    <div key={idx} className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{kpi.title}</p>
                        <div className="flex justify-between items-end">
                            <h3 className="text-2xl font-black text-white">{kpi.value}</h3>
                            <span className={`text-xs font-bold px-2 py-1 rounded flex items-center gap-1 ${kpi.status === 'good' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'}`}>
                                {kpi.status === 'good' ? <ArrowUpRight size={12}/> : <ArrowDownRight size={12}/>}
                                {kpi.trend}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Acquisition Mix */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-white flex items-center gap-2"><Activity size={18} className="text-blue-500"/> Crecimiento por Canal</h3>
                        <div className="flex gap-2 text-xs">
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Orgánico</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Referidos</span>
                            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-500"></div> Paid</span>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorOrg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorRef" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#475569" fontSize={12}/>
                                <YAxis stroke="#475569" fontSize={12}/>
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: '12px'}}/>
                                <Area type="monotone" dataKey="organic" stackId="1" stroke="#3b82f6" fill="url(#colorOrg)" />
                                <Area type="monotone" dataKey="referral" stackId="1" stroke="#a855f7" fill="url(#colorRef)" />
                                <Area type="monotone" dataKey="paid" stackId="1" stroke="#64748b" fill="#64748b" fillOpacity={0.2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Activation Funnel */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-6 flex items-center gap-2"><Filter size={18} className="text-amber-500"/> Embudo de Activación</h3>
                    <div className="space-y-4">
                        {funnelData.map((stage, idx) => {
                            const prev = idx > 0 ? funnelData[idx-1].count : stage.count;
                            const percent = Math.round((stage.count / funnelData[0].count) * 100);
                            const dropoff = idx > 0 ? Math.round(((prev - stage.count) / prev) * 100) : 0;
                            
                            return (
                                <div key={idx} className="relative">
                                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                                        <span className="font-bold">{stage.stage}</span>
                                        <span>{stage.count} ({percent}%)</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full rounded-full ${idx === 0 ? 'bg-slate-500' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-purple-500' : 'bg-amber-500'}`} 
                                            style={{width: `${percent}%`}}
                                        ></div>
                                    </div>
                                    {idx > 0 && (
                                        <div className="text-[10px] text-red-400 text-right mt-0.5">Caída: {dropoff}%</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 bg-amber-900/20 border border-amber-900/50 p-3 rounded-lg">
                        <div className="flex gap-2 items-center text-amber-500 text-xs font-bold mb-1"><AlertTriangle size={12}/> Insight</div>
                        <p className="text-[10px] text-amber-200">La mayor caída (33%) ocurre en Verificación. Se sugiere test A/B de Onboarding de 3 pasos.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Retention Cohorts (Simplified) */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-6">Curva de Retención</h3>
                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={retentionData}>
                                <XAxis dataKey="day" stroke="#475569" />
                                <YAxis stroke="#475569" />
                                <Tooltip contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b'}} />
                                <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{r: 4}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Experiments Tracking */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h3 className="font-bold text-white mb-4">Experimentos A/B Activos</h3>
                    <div className="space-y-4">
                        
                        <div className="bg-black/40 p-4 rounded-lg border border-slate-800">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-[10px] font-bold bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/20">TEST #1</span>
                                    <h4 className="text-white text-sm font-bold mt-1">Onboarding 3 Pasos</h4>
                                </div>
                                <span className="text-green-400 text-xs font-bold">+15% Conv.</span>
                            </div>
                            <div className="flex gap-2 items-center text-xs text-slate-500 mb-1">
                                <span>Variante A (Control): 42%</span>
                                <div className="h-1 w-px bg-slate-700"></div>
                                <span className="text-blue-400 font-bold">Variante B (Express): 57%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full w-[70%]"></div>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-2 text-right">Confianza estadística: 92%</p>
                        </div>

                        <div className="bg-black/40 p-4 rounded-lg border border-slate-800 opacity-60">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-[10px] font-bold bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">TEST #2</span>
                                    <h4 className="text-white text-sm font-bold mt-1">Precio Verified $14.99</h4>
                                </div>
                                <span className="text-slate-400 text-xs font-bold">Pendiente</span>
                            </div>
                            <p className="text-[10px] text-slate-500">Programado para el 01 Feb</p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

const AdminGeneral: React.FC = () => {
  const data = [
    { name: 'Lun', users: 12 },
    { name: 'Mar', users: 19 },
    { name: 'Mié', users: 3 },
    { name: 'Jue', users: 25 },
    { name: 'Vie', users: 45 },
    { name: 'Sáb', users: 80 },
    { name: 'Dom', users: 55 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total usuarios', value: '1,284', icon: Users },
          { label: 'Activos hoy', value: '342', icon: CheckCircle, color: 'text-green-500' },
          { label: 'Verificaciones', value: '23', icon: ShieldCheck, color: 'text-amber-500' },
          { label: 'Premium', value: '156', icon: CrownIcon, color: 'text-yellow-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-900 rounded-xl p-5 border border-slate-800">
            <div className="flex justify-between items-start mb-4">
              <span className="text-slate-400 text-sm">{stat.label}</span>
              <stat.icon className={`w-5 h-5 ${stat.color || 'text-slate-500'}`} />
            </div>
            <div className="text-3xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 h-80">
        <h3 className="text-white font-semibold mb-6">Actividad de la semana</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#475569" tick={{fill: '#94a3b8'}} />
            <YAxis stroke="#475569" tick={{fill: '#94a3b8'}} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
              itemStyle={{ color: '#fbbf24' }}
            />
            <Bar dataKey="users" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill="#fbbf24" fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AdminFinance: React.FC = () => {
    // Calculate simple stats from mock data
    const totalSales = EVENTS.reduce((acc, curr) => acc + (curr.soldCount * curr.price), 0);
    const totalCommission = totalSales * 0.08;
    const totalTickets = EVENTS.reduce((acc, curr) => acc + curr.soldCount, 0);

    const format = (val: number) => new Intl.NumberFormat('es-CO', {style:'currency', currency: 'COP', maximumFractionDigits: 0}).format(val);

    // Calculator State
    const [projectedUsers, setProjectedUsers] = useState(1000);
    
    // Projections
    const tierDistribution = { free: 0.70, verified: 0.25, vip: 0.05 };
    const tierPrices = { free: 0, verified: 40000, vip: 120000 };
    
    const verifiedUsers = Math.floor(projectedUsers * tierDistribution.verified);
    const vipUsers = Math.floor(projectedUsers * tierDistribution.vip);
    
    const mrrVerified = verifiedUsers * tierPrices.verified;
    const mrrVip = vipUsers * tierPrices.vip;
    const boostRevenue = (projectedUsers * 0.05) * 20000; // 5% buying a boost
    const totalProjected = mrrVerified + mrrVip + boostRevenue;

    return (
        <div className="space-y-6 animate-fade-in">
             {/* Actual Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-400 text-sm">Ventas Totales (Bruto)</span>
                        <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">{format(totalSales)}</div>
                </div>
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-10 bg-amber-500/10 rounded-full blur-2xl"></div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-amber-400 text-sm font-bold uppercase">Comisiones (Actual)</span>
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                    </div>
                    <div className="text-3xl font-bold text-amber-500 relative z-10">{format(totalCommission)}</div>
                    <div className="text-xs text-slate-500 mt-1">Revenue Eventos</div>
                </div>
                <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-slate-400 text-sm">Entradas Vendidas</span>
                        <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">{totalTickets}</div>
                </div>
             </div>

             {/* Projection Calculator */}
             <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                 <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                     <h3 className="font-bold text-white flex items-center gap-2"><Calculator size={18}/> Calculadora de Proyección (MRR)</h3>
                     <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">Modelo 6 Meses</span>
                 </div>
                 <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                         <label className="text-sm font-bold text-slate-400 block mb-2">Usuarios Proyectados</label>
                         <div className="flex gap-4 items-center mb-6">
                             <input 
                                type="range" 
                                min="100" max="10000" step="100" 
                                value={projectedUsers} 
                                onChange={(e) => setProjectedUsers(parseInt(e.target.value))}
                                className="flex-1 accent-amber-500 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                             />
                             <span className="text-xl font-bold text-white w-20 text-right">{projectedUsers}</span>
                         </div>

                         <div className="space-y-3">
                             <div className="flex justify-between text-sm">
                                 <span className="text-slate-400">Standard (70%)</span>
                                 <span className="text-white">{Math.floor(projectedUsers * tierDistribution.free)} usuarios</span>
                             </div>
                             <div className="flex justify-between text-sm">
                                 <span className="text-blue-400 font-bold">Verified (25%) @ $40k</span>
                                 <span className="text-white">{verifiedUsers} usuarios</span>
                             </div>
                             <div className="flex justify-between text-sm">
                                 <span className="text-amber-500 font-bold">VIP (5%) @ $120k</span>
                                 <span className="text-white">{vipUsers} usuarios</span>
                             </div>
                         </div>
                     </div>

                     <div className="bg-black rounded-xl p-6 border border-slate-800 flex flex-col justify-center relative overflow-hidden">
                         <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 to-transparent"></div>
                         <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 relative z-10">Ingreso Mensual Estimado</h4>
                         <div className="text-4xl font-black text-white relative z-10 mb-2">{format(totalProjected)}</div>
                         <div className="space-y-1 relative z-10 text-[10px] text-slate-500">
                             <div className="flex justify-between"><span>Suscripciones:</span> <span>{format(mrrVerified + mrrVip)}</span></div>
                             <div className="flex justify-between"><span>Micro-pagos (Boost 5%):</span> <span>{format(boostRevenue)}</span></div>
                         </div>
                     </div>
                 </div>
             </div>

             <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                 <div className="p-4 border-b border-slate-800 bg-slate-950">
                     <h3 className="font-bold text-white">Últimas Transacciones (Mock)</h3>
                 </div>
                 <div className="p-0">
                     <table className="w-full text-sm text-left">
                         <thead className="bg-slate-950 text-slate-500 uppercase text-xs">
                             <tr>
                                 <th className="px-4 py-3">ID Ticket</th>
                                 <th className="px-4 py-3">Evento</th>
                                 <th className="px-4 py-3">Monto</th>
                                 <th className="px-4 py-3 text-amber-500">Comisión (8%)</th>
                                 <th className="px-4 py-3">Fecha</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-800">
                             {TICKETS.map(t => (
                                 <tr key={t.id} className="hover:bg-slate-800/50">
                                     <td className="px-4 py-3 font-mono text-slate-400">{t.id}</td>
                                     <td className="px-4 py-3 text-white">{t.eventName}</td>
                                     <td className="px-4 py-3 text-white">{format(t.pricePaid)}</td>
                                     <td className="px-4 py-3 text-amber-500 font-bold">+{format(t.commission)}</td>
                                     <td className="px-4 py-3 text-slate-500">{t.purchaseDate}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
             </div>
        </div>
    )
}

const AdminCodes: React.FC = () => {
  const [selectedType, setSelectedType] = useState<ProfileType>(ProfileType.SINGLE);
  const [amount, setAmount] = useState(1);
  const [generatedCodesList, setGeneratedCodesList] = useState<InvitationCode[]>(CODES);

  // Combine system codes with user codes for visualization
  const allUserCodes = USERS.flatMap(u => u.myInviteCodes || []);
  const displayCodes = [...generatedCodesList, ...allUserCodes];

  const handleGenerateCodes = () => {
      const newCodes: InvitationCode[] = [];
      for(let i = 0; i < amount; i++) {
          const prefix = selectedType === ProfileType.BUSINESS ? 'BIZ' : selectedType === ProfileType.COUPLE ? 'CPL' : 'IND';
          const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
          
          newCodes.push({
              code: `K-${prefix}-${randomStr}`,
              type: selectedType,
              generatedBy: 'SuperAdmin',
              expiresAt: '2025-12-31',
              isUsed: false
          });
      }
      setGeneratedCodesList([...newCodes, ...generatedCodesList]);
      alert(`${amount} códigos generados para perfil ${selectedType}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
        <h3 className="text-white font-semibold mb-4">Generar códigos de invitación</h3>
        <p className="text-slate-500 text-xs mb-4">
            Selecciona el tipo de perfil para el cual se generará el código. Este código solo permitirá crear cuentas de ese tipo específico.
        </p>
        <div className="flex gap-4">
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
            min={1}
            max={50}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white w-24" 
          />
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ProfileType)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white flex-1"
          >
            <option value={ProfileType.SINGLE}>{ProfileType.SINGLE}</option>
            <option value={ProfileType.COUPLE}>{ProfileType.COUPLE}</option>
            <option value={ProfileType.BUSINESS}>{ProfileType.BUSINESS}</option>
          </select>
        </div>
        <button 
          onClick={handleGenerateCodes}
          className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Generar códigos
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-white font-semibold">Rastreo de Códigos</h3>
        <p className="text-slate-500 text-sm">Visualización de códigos generados por el sistema y por usuarios/establecimientos.</p>
        
        <div className="grid gap-2">
        {displayCodes.map((code, idx) => (
          <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2 mb-1">
                  <div className="text-xl font-mono font-bold text-white">{code.code}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                        code.generatedBy === 'SuperAdmin' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-500'
                  }`}>
                      {code.generatedBy === 'SuperAdmin' ? 'SYSTEM' : `USER: ${code.generatedBy}`}
                  </span>
              </div>
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                    code.type === ProfileType.BUSINESS ? 'bg-blue-900/30 text-blue-400' :
                    code.type === ProfileType.COUPLE ? 'bg-purple-900/30 text-purple-400' :
                    'bg-slate-800 text-slate-400'
                }`}>{code.type}</span>
              </div>
            </div>
            <div>
              {code.isUsed ? (
                <div className="text-right">
                  <span className="bg-slate-800 text-slate-500 px-3 py-1 rounded-full text-xs font-medium">Usado</span>
                  <div className="text-xs text-slate-500 mt-1">por {code.usedBy}</div>
                </div>
              ) : (
                <>
                    {code.generatedBy === 'SuperAdmin' ? (
                        <button 
                        onClick={() => {navigator.clipboard.writeText(code.code); alert('Copiado');}}
                        className="text-slate-400 hover:text-white p-2"
                        title="Copiar código"
                        >
                        <Copy size={20} />
                        </button>
                    ) : (
                        <div className="flex items-center gap-1 text-slate-600 bg-slate-950 px-3 py-1 rounded border border-slate-800">
                            <Lock size={12} />
                            <span className="text-[10px] font-bold">RESERVADO</span>
                        </div>
                    )}
                </>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
};

const AdminUsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(USERS);

  const handleBan = (userId: string) => {
      if(confirm('¿Suspender usuario?')) {
        setUsers(users.map(u => u.id === userId ? {...u, status: 'Suspended'} : u));
      }
  };

  const handleDelete = (userId: string) => {
      if(confirm('¿ELIMINAR usuario permanentemente?')) {
          setUsers(users.filter(u => u.id !== userId));
      }
  };

  return (
    <div className="space-y-4">
      <input 
        placeholder="Buscar usuario..." 
        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
      />
      {users.map((user) => (
        <div key={user.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden">
               <img src={user.publicPhoto} alt={user.nickname} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold">{user.nickname}</span>
                {user.isPremium && <CrownIcon className="w-3 h-3 text-amber-500" />}
              </div>
              <div className="flex gap-2 mt-1">
                 <span className={`text-xs px-2 py-0.5 rounded ${
                   user.verificationLevel === 'Básico' ? 'bg-slate-800 text-slate-400' :
                   user.verificationLevel === 'Verificado' ? 'bg-green-900/30 text-green-400' :
                   'bg-amber-900/30 text-amber-400'
                 }`}>{user.verificationLevel}</span>
                 <span className={`text-xs px-2 py-0.5 rounded ${
                   user.status === 'Active' ? 'bg-green-900/30 text-green-400' : 
                   user.status === 'Suspended' ? 'bg-red-900/30 text-red-500' :
                   'bg-orange-900/30 text-orange-400'
                 }`}>{user.status}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 text-slate-400">
             {user.status !== 'Suspended' && (
                <button onClick={() => handleBan(user.id)} className="hover:text-amber-500 bg-slate-800 p-2 rounded-lg" title="Suspender">
                    <Ban size={18} />
                </button>
             )}
             <button onClick={() => handleDelete(user.id)} className="hover:text-red-500 bg-slate-800 p-2 rounded-lg" title="Eliminar">
                 <Trash2 size={18} />
             </button>
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminVerifiers: React.FC = () => {
  return (
    <div className="space-y-6">
       <button className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
          <Plus size={18} /> Agregar verificador
        </button>

        <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-500">
                    <ShieldCheck />
                </div>
                <div>
                    <h4 className="text-white font-medium">Verificador_01</h4>
                    <p className="text-slate-500 text-xs">Desde 2023-01-01</p>
                </div>
            </div>
            <div className="text-right">
                <div className="text-xl font-bold text-white">24</div>
                <div className="text-xs text-slate-500">verificaciones</div>
            </div>
        </div>
    </div>
  );
}

// Icons
const CrownIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

export default SuperAdminPanel;